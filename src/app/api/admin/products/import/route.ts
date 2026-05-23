import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { saveProduct } from '@/lib/admin/product-save';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
}

function getImportItems(body: unknown) {
  if (Array.isArray(body)) return body;

  if (body && typeof body === 'object') {
    const products = (body as { products?: unknown }).products;
    if (Array.isArray(products)) return products;
  }

  return [body];
}

function formatError(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? 'Invalid product data';
  }

  return error instanceof Error ? error.message : 'Unknown error';
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const items = getImportItems(body);

    if (!items.length) {
      return NextResponse.json({ error: 'No products found in JSON file.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const results: Array<{ index: number; id: string; slug: string }> = [];
    const errors: Array<{ index: number; error: string }> = [];

    for (const [index, item] of items.entries()) {
      try {
        const product = await saveProduct(admin, item);
        results.push({ index, ...product });
      } catch (error) {
        errors.push({ index, error: formatError(error) });
      }
    }

    const status = errors.length ? 400 : 200;

    return NextResponse.json({
      success: errors.length === 0,
      imported: results.length,
      failed: errors.length,
      results,
      errors
    }, { status });
  } catch (error) {
    return NextResponse.json({ error: formatError(error) }, { status: 400 });
  }
}

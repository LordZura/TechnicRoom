import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { saveProduct } from '@/lib/admin/product-save';
import { getProductJsonById } from '@/lib/admin/product-json';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
}

function getEditItems(body: unknown) {
  if (Array.isArray(body)) return body;

  if (body && typeof body === 'object') {
    const products = (body as { products?: unknown }).products;
    if (Array.isArray(products)) return products;
    return [body];
  }

  return [];
}

function formatError(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? 'Invalid product data';
  }

  return error instanceof Error ? error.message : 'Unknown error';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeProductPatch(base: Record<string, unknown>, patch: Record<string, unknown>) {
  const merged = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    if (key === 'current_slug') continue;
    if (value === undefined) continue;

    if (isRecord(value) && isRecord(merged[key])) {
      merged[key] = mergeProductPatch(merged[key] as Record<string, unknown>, value);
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

async function resolveProductId(admin: ReturnType<typeof createSupabaseAdminClient>, item: unknown) {
  if (!item || typeof item !== 'object') {
    throw new Error('Each edit item must be a product object.');
  }

  const body = item as Record<string, unknown>;
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const lookupSlug = typeof body.current_slug === 'string'
    ? body.current_slug.trim()
    : typeof body.slug === 'string'
      ? body.slug.trim()
      : '';

  if (id) {
    const { data, error } = await admin.from('products').select('id').eq('id', id).single();
    if (error || !data) throw new Error(`No existing product found for id "${id}".`);
    return data.id as string;
  }

  if (lookupSlug) {
    const { data, error } = await admin.from('products').select('id').eq('slug', lookupSlug).single();
    if (error || !data) throw new Error(`No existing product found for slug "${lookupSlug}".`);
    return data.id as string;
  }

  throw new Error('Edit JSON must include an existing product id, slug, or current_slug.');
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const items = getEditItems(body);

    if (!items.length) {
      return NextResponse.json({ error: 'No products found in JSON file.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const results: Array<{ index: number; id: string; slug: string }> = [];
    const errors: Array<{ index: number; error: string }> = [];

    for (const [index, item] of items.entries()) {
      try {
        const id = await resolveProductId(admin, item);
        const currentProduct = await getProductJsonById(admin, id) as Record<string, unknown>;
        const mergedProduct = mergeProductPatch(currentProduct, item as Record<string, unknown>);
        const product = await saveProduct(admin, { ...mergedProduct, id });
        results.push({ index, ...product });
      } catch (error) {
        errors.push({ index, error: formatError(error) });
      }
    }

    const status = errors.length && results.length ? 207 : errors.length ? 400 : 200;

    return NextResponse.json({
      success: errors.length === 0,
      partial: errors.length > 0 && results.length > 0,
      total: items.length,
      edited: results.length,
      failed: errors.length,
      results,
      errors
    }, { status });
  } catch (error) {
    return NextResponse.json({ error: formatError(error) }, { status: 400 });
  }
}

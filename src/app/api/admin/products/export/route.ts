import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAllProductsJson, getProductJsonById } from '@/lib/admin/product-json';

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const admin = createSupabaseAdminClient();
    const id = request.nextUrl.searchParams.get('id');

    if (id) {
      const product = await getProductJsonById(admin, id);
      return NextResponse.json(product);
    }

    const products = await getAllProductsJson(admin);
    return NextResponse.json({ products });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

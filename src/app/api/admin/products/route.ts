import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { productSchema } from '@/lib/validation/product';

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const payload = productSchema.parse(await request.json());
    const admin = createSupabaseAdminClient();

    const { data: product, error: productError } = await admin
      .from('products')
      .upsert({
        id: payload.id,
        slug: payload.slug,
        model: payload.model,
        brand: payload.brand,
        category: payload.category || null,
        price: payload.price,
        recommended_area: payload.recommended_area || null,
        cooling_power: payload.cooling_power || null,
        heating_power: payload.heating_power || null,
        cooling_consumption: payload.cooling_consumption || null,
        heating_consumption: payload.heating_consumption || null,
        eer_cop: payload.eer_cop || null,
        freon_type_amount: payload.freon_type_amount || null,
        operating_temperature: payload.operating_temperature || null,
        indoor_unit_size: payload.indoor_unit_size || null,
        indoor_unit_weight: payload.indoor_unit_weight || null,
        outdoor_unit_size: payload.outdoor_unit_size || null,
        outdoor_unit_weight: payload.outdoor_unit_weight || null,
        noise_level: payload.noise_level || null,
        pipe_size: payload.pipe_size || null,
        is_active: payload.is_active
      })
      .select('id')
      .single();

    if (productError) throw productError;

    await admin.from('product_translations').delete().eq('product_id', product.id);
    const { error: translationsError } = await admin.from('product_translations').insert(
      payload.translations.map((item) => ({ ...item, product_id: product.id }))
    );

    if (translationsError) throw translationsError;

    return NextResponse.json({ success: true, id: product.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });

    const admin = createSupabaseAdminClient();
    await admin.from('products').delete().eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { productSchema } from '@/lib/validation/product';

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
}

function extractStorageKey(publicUrl: string) {
  const marker = '/storage/v1/object/public/product-images/';
  const idx = publicUrl.indexOf(marker);
  return idx === -1 ? null : publicUrl.slice(idx + marker.length);
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
      .select('id,slug,model,brand')
      .single();

    if (productError) throw productError;

    const { error: clearTranslationsError } = await admin.from('product_translations').delete().eq('product_id', product.id);
    if (clearTranslationsError) throw clearTranslationsError;

    const { error: translationsError } = await admin
      .from('product_translations')
      .insert(payload.translations.map((item) => ({ ...item, product_id: product.id })));

    if (translationsError) throw translationsError;

    return NextResponse.json({ success: true, product });
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

    const { data: images, error: imagesError } = await admin
      .from('product_images')
      .select('id,storage_path')
      .eq('product_id', id);
    if (imagesError) throw imagesError;

    const storageKeys = (images || []).map((img) => extractStorageKey(img.storage_path)).filter(Boolean) as string[];
    if (storageKeys.length > 0) {
      const { error: storageDeleteError } = await admin.storage.from('product-images').remove(storageKeys);
      if (storageDeleteError) throw storageDeleteError;
    }

    const { error: imageRowsError } = await admin.from('product_images').delete().eq('product_id', id);
    if (imageRowsError) throw imageRowsError;

    const { error: translationRowsError } = await admin.from('product_translations').delete().eq('product_id', id);
    if (translationRowsError) throw translationRowsError;

    const { error: productDeleteError } = await admin.from('products').delete().eq('id', id);
    if (productDeleteError) throw productDeleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const code = message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ error: message }, { status: code });
  }
}

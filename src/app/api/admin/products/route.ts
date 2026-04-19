import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { buildProductSlug, slugify } from '@/lib/slug';
import { productSchema } from '@/lib/validation/product';

const BUCKET = 'product-images';

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
}

async function ensureUniqueSlug(admin: ReturnType<typeof createSupabaseAdminClient>, slug: string, productId?: string) {
  const { data, error } = await admin.from('products').select('id, slug').ilike('slug', `${slug}%`);
  if (error) throw error;

  const used = new Set((data || []).filter((row) => row.id !== productId).map((row) => row.slug));
  if (!used.has(slug)) return slug;

  let suffix = 2;
  while (used.has(`${slug}-${suffix}`)) {
    suffix += 1;
  }
  return `${slug}-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as Record<string, unknown>;
    const baseSlug = slugify(String(body.slug || '')) || buildProductSlug({
      model: String(body.model || ''),
      englishName: String((body.translations as Array<{ locale?: string; name?: string }> | undefined)?.find((item) => item.locale === 'en')?.name || ''),
      georgianName: String((body.translations as Array<{ locale?: string; name?: string }> | undefined)?.find((item) => item.locale === 'ka')?.name || '')
    });

    if (!baseSlug) {
      return NextResponse.json({ error: 'Slug could not be generated. Please provide model or product name.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const uniqueSlug = await ensureUniqueSlug(admin, baseSlug, typeof body.id === 'string' ? body.id : undefined);
    const payload = productSchema.parse({ ...body, slug: uniqueSlug });

    const { data: product, error: productError } = await admin
      .from('products')
      .upsert({
        id: payload.id,
        slug: payload.slug,
        model: payload.model,
        brand: payload.brand,
        category: payload.category,
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
      .select('id, slug')
      .single();

    if (productError) throw productError;

    await admin.from('product_translations').delete().eq('product_id', product.id);
    const { error: translationsError } = await admin.from('product_translations').insert(payload.translations.map((item) => ({ ...item, product_id: product.id })));

    if (translationsError) throw translationsError;

    return NextResponse.json({ success: true, id: product.id, slug: product.slug });
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
      .select('storage_path')
      .eq('product_id', id);

    if (imagesError) throw imagesError;

    const storagePaths = (images ?? [])
      .map((item) => item.storage_path.split(`/${BUCKET}/`)[1])
      .filter(Boolean) as string[];

    const { error: imageRowDeleteError } = await admin.from('product_images').delete().eq('product_id', id);
    if (imageRowDeleteError) throw imageRowDeleteError;

    const { error: translationDeleteError } = await admin.from('product_translations').delete().eq('product_id', id);
    if (translationDeleteError) throw translationDeleteError;

    const { error: productDeleteError } = await admin.from('products').delete().eq('id', id);
    if (productDeleteError) throw productDeleteError;

    if (storagePaths.length) {
      const { error: storageDeleteError } = await admin.storage.from(BUCKET).remove(storagePaths);
      if (storageDeleteError) {
        return NextResponse.json({
          success: true,
          warning: `Product deleted, but failed to remove some files: ${storageDeleteError.message}`
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

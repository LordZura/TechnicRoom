import { buildProductSlug, slugify } from '@/lib/slug';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { ProductFormInput, productSchema } from '@/lib/validation/product';

type ProductSaveInput = Record<string, unknown>;
type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

function getTranslationName(translations: unknown, locale: 'en' | 'ka') {
  if (Array.isArray(translations)) {
    const translation = translations.find((item) => item && typeof item === 'object' && (item as { locale?: unknown }).locale === locale);
    return typeof translation?.name === 'string' ? translation.name : '';
  }

  if (translations && typeof translations === 'object') {
    const translation = (translations as Record<string, unknown>)[locale];
    if (typeof translation === 'string') return translation;
    if (translation && typeof translation === 'object') {
      const name = (translation as { name?: unknown }).name;
      return typeof name === 'string' ? name : '';
    }
  }

  return '';
}

function normalizeTranslations(body: ProductSaveInput) {
  if (Array.isArray(body.translations)) return body.translations;

  if (body.translations && typeof body.translations === 'object') {
    const translations = body.translations as Record<string, unknown>;

    return (['en', 'ka'] as const).map((locale) => {
      const value = translations[locale];

      if (typeof value === 'string') {
        return { locale, name: value, description: '', features: '' };
      }

      if (value && typeof value === 'object') {
        return {
          locale,
          name: (value as { name?: unknown }).name ?? '',
          description: (value as { description?: unknown }).description ?? '',
          features: (value as { features?: unknown }).features ?? ''
        };
      }

      return { locale, name: '', description: '', features: '' };
    });
  }

  return [
    { locale: 'en', name: body.name_en ?? body.name ?? '', description: body.description_en ?? '', features: body.features_en ?? '' },
    { locale: 'ka', name: body.name_ka ?? '', description: body.description_ka ?? '', features: body.features_ka ?? '' }
  ];
}

function normalizeCustomSpecs(customSpecs: unknown) {
  if (!Array.isArray(customSpecs)) return [];

  return customSpecs.map((item) => {
    if (!item || typeof item !== 'object') return { name: '', value: '', name_ka: '', value_ka: '' };

    const spec = item as Record<string, unknown>;
    const translations = spec.translations && typeof spec.translations === 'object'
      ? spec.translations as Record<string, unknown>
      : {};
    const kaTranslation = translations.ka && typeof translations.ka === 'object'
      ? translations.ka as Record<string, unknown>
      : {};
    const name = spec.name ?? spec.label ?? spec.title ?? (translations.en as { name?: unknown } | undefined)?.name;
    const value = spec.value ?? spec.text ?? (translations.en as { value?: unknown } | undefined)?.value;
    const nameKa = spec.name_ka ?? spec.label_ka ?? kaTranslation.name;
    const valueKa = spec.value_ka ?? spec.text_ka ?? kaTranslation.value;

    return {
      name: name === null || name === undefined ? '' : String(name),
      value: value === null || value === undefined ? '' : String(value),
      name_ka: nameKa === null || nameKa === undefined ? '' : String(nameKa),
      value_ka: valueKa === null || valueKa === undefined ? '' : String(valueKa)
    };
  });
}

function normalizeProductPayload(input: unknown) {
  const body = input && typeof input === 'object' ? ({ ...(input as ProductSaveInput) } as ProductSaveInput) : {};
  body.translations = normalizeTranslations(body);
  body.custom_specs = normalizeCustomSpecs(body.custom_specs);
  return body;
}

async function ensureUniqueSlug(admin: AdminClient, slug: string, productId?: string) {
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

export async function saveProduct(admin: AdminClient, input: unknown) {
  const body = normalizeProductPayload(input);
  const baseSlug = slugify(String(body.slug || '')) || buildProductSlug({
    model: String(body.model || ''),
    englishName: getTranslationName(body.translations, 'en'),
    georgianName: getTranslationName(body.translations, 'ka')
  });

  if (!baseSlug) {
    throw new Error('Slug could not be generated. Please provide model or product name.');
  }

  const productId = typeof body.id === 'string' ? body.id : undefined;
  const uniqueSlug = await ensureUniqueSlug(admin, baseSlug, productId);
  const payload: ProductFormInput = productSchema.parse({ ...body, slug: uniqueSlug });

  const { data: product, error: productError } = await admin
    .from('products')
    .upsert({
      id: payload.id,
      slug: payload.slug,
      model: payload.model,
      brand: payload.brand,
      category: payload.category,
      price: payload.price,
      color: payload.color || null,
      has_fresh_air_intake: payload.has_fresh_air_intake,
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
      custom_specs: payload.custom_specs,
      is_active: payload.is_active
    })
    .select('id, slug')
    .single();

  if (productError) throw productError;

  await admin.from('product_translations').delete().eq('product_id', product.id);
  const { error: translationsError } = await admin.from('product_translations').insert(
    payload.translations.map((item) => ({
      locale: item.locale,
      name: item.name || '',
      description: item.description || '',
      features: item.features || '',
      product_id: product.id
    }))
  );

  if (translationsError) throw translationsError;

  return { id: product.id as string, slug: product.slug as string };
}

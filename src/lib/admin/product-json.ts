import { createSupabaseAdminClient } from '@/lib/supabase/admin';

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

type ProductRow = {
  id: string;
  slug: string;
  model: string;
  brand: string;
  category: string | null;
  price: number | string | null;
  color: string | null;
  has_fresh_air_intake: boolean;
  recommended_area: string | null;
  cooling_power: string | null;
  heating_power: string | null;
  cooling_consumption: string | null;
  heating_consumption: string | null;
  eer_cop: string | null;
  freon_type_amount: string | null;
  operating_temperature: string | null;
  indoor_unit_size: string | null;
  indoor_unit_weight: string | null;
  outdoor_unit_size: string | null;
  outdoor_unit_weight: string | null;
  noise_level: string | null;
  pipe_size: string | null;
  custom_specs: unknown;
  is_active: boolean;
  translations?: Array<{
    locale: string;
    name: string | null;
    description: string | null;
    features: string | null;
  }>;
};

const nullableSpecFields = [
  'color',
  'recommended_area',
  'cooling_power',
  'heating_power',
  'cooling_consumption',
  'heating_consumption',
  'eer_cop',
  'freon_type_amount',
  'operating_temperature',
  'indoor_unit_size',
  'indoor_unit_weight',
  'outdoor_unit_size',
  'outdoor_unit_weight',
  'noise_level',
  'pipe_size'
] as const;

export function serializeProductForJson(product: ProductRow) {
  const translations = Object.fromEntries(
    (['en', 'ka'] as const).map((locale) => {
      const translation = product.translations?.find((item) => item.locale === locale);

      return [
        locale,
        {
          name: translation?.name ?? '',
          description: translation?.description ?? '',
          features: translation?.features ?? ''
        }
      ];
    })
  );
  const output: Record<string, unknown> = {
    id: product.id,
    slug: product.slug,
    model: product.model,
    brand: product.brand,
    category: product.category ?? '',
    price: product.price === null ? null : Number(product.price),
    has_fresh_air_intake: product.has_fresh_air_intake,
    custom_specs: Array.isArray(product.custom_specs) ? product.custom_specs : [],
    is_active: product.is_active,
    translations
  };

  for (const field of nullableSpecFields) {
    output[field] = product[field] ?? '';
  }

  return output;
}

export async function getProductJsonById(admin: AdminClient, id: string) {
  const { data, error } = await admin
    .from('products')
    .select('*, translations:product_translations(locale, name, description, features)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return serializeProductForJson(data as ProductRow);
}

export async function getAllProductsJson(admin: AdminClient) {
  const { data, error } = await admin
    .from('products')
    .select('*, translations:product_translations(locale, name, description, features)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((item) => serializeProductForJson(item as ProductRow));
}

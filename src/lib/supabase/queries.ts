import { Locale, ProductImage, ProductWithRelations } from '@/types';
import { createSupabaseServerClient } from './server';

type ProductSearchRow = {
  id: string;
  slug: string;
  model: string;
  brand: string;
  category: string | null;
  is_active: boolean;
  name: string | null;
  features_en: string | null;
  features_ka: string | null;
  created_at: string;
};

export type CatalogProduct = ProductSearchRow & {
  cover_image: string | null;
  cover_alt: string | null;
};

export async function getProducts(search?: string): Promise<CatalogProduct[]> {
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from('products_search')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (search?.trim()) {
    query = query.or(
      `slug.ilike.%${search}%,model.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%,features_en.ilike.%${search}%,features_ka.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as ProductSearchRow[];
  if (!rows.length) return [];

  const { data: imageRows, error: imageError } = await supabase
    .from('product_images')
    .select('product_id, storage_path, alt, is_primary, sort_order, created_at')
    .in('product_id', rows.map((item) => item.id))
    .order('is_primary', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (imageError) throw imageError;

  const coverByProduct = new Map<string, { cover_image: string; cover_alt: string | null }>();
  for (const image of imageRows ?? []) {
    if (!coverByProduct.has(image.product_id)) {
      coverByProduct.set(image.product_id, {
        cover_image: image.storage_path,
        cover_alt: image.alt
      });
    }
  }

  return rows.map((item) => ({
    ...item,
    cover_image: coverByProduct.get(item.id)?.cover_image ?? null,
    cover_alt: coverByProduct.get(item.id)?.cover_alt ?? null
  }));
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, translations:product_translations(*), images:product_images(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) return null;

  const images = [...(data.images as ProductImage[])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.id.localeCompare(b.id);
  });

  return { ...data, images } as ProductWithRelations;
}

export function pickTranslation(product: ProductWithRelations, locale: Locale) {
  const translated = product.translations.find((item) => item.locale === locale);
  const fallback = product.translations.find((item) => item.locale === 'en');
  return translated || fallback;
}

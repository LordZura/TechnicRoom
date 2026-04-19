import { Locale, ProductWithRelations } from '@/types';
import { createSupabaseServerClient } from './server';

export async function getProducts(search?: string) {
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
  return data;
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
  return data;
}

export function pickTranslation(product: ProductWithRelations, locale: Locale) {
  const translated = product.translations.find((item) => item.locale === locale);
  const fallback = product.translations.find((item) => item.locale === 'en');
  return translated || fallback;
}

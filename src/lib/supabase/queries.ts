import { Locale, ProductImage, ProductWithRelations } from '@/types';
import { createSupabaseAdminClient } from './admin';
import { createSupabaseServerClient } from './server';

type ProductSearchRow = {
  id: string;
  slug: string;
  model: string;
  brand: string;
  category: string | null;
  price: number | null;
  color: string | null;
  has_fresh_air_intake: boolean;
  recommended_area: string | null;
  is_active: boolean;
  name: string | null;
  features_en: string | null;
  features_ka: string | null;
  created_at: string;
};

export type CatalogProduct = ProductSearchRow & {
  cover_image: string | null;
  cover_alt: string | null;
  images: {
    url: string;
    alt: string | null;
  }[];
};

export type ProductFilters = {
  q?: string;
  brand?: string[];
  category?: string[];
  recommendedArea?: string[];
  color?: string[];
  freshAir?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export type ProductFilterOptions = {
  brands: string[];
  categories: string[];
  recommendedAreas: string[];
  colors: string[];
  hasFreshAirIntake: boolean;
  minPrice: number | null;
  maxPrice: number | null;
};

export type AdminProductSummary = {
  id: string;
  model: string;
  slug: string;
  brand: string;
  is_active: boolean;
};

function normalizePriceRange(minPrice?: number, maxPrice?: number) {
  const min = Number.isFinite(minPrice) ? minPrice : undefined;
  const max = Number.isFinite(maxPrice) ? maxPrice : undefined;

  if (min !== undefined && max !== undefined && min > max) {
    return { minPrice: max, maxPrice: min };
  }

  return { minPrice: min, maxPrice: max };
}

export async function getProducts(filters: ProductFilters | string = {}): Promise<CatalogProduct[]> {
  const supabase = createSupabaseServerClient();
  const normalizedFilters: ProductFilters = typeof filters === 'string' ? { q: filters } : filters;
  const search = normalizedFilters.q?.trim();
  const brands = normalizedFilters.brand?.map((item) => item.trim()).filter(Boolean) ?? [];
  const categories = normalizedFilters.category?.map((item) => item.trim()).filter(Boolean) ?? [];
  const recommendedAreas = normalizedFilters.recommendedArea?.map((item) => item.trim()).filter(Boolean) ?? [];
  const colors = normalizedFilters.color?.map((item) => item.trim()).filter(Boolean) ?? [];
  const range = normalizePriceRange(normalizedFilters.minPrice, normalizedFilters.maxPrice);

  const buildQuery = (includeNewAttributes: boolean) => {
    let query = supabase
      .from('products_search')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (search) {
      const searchColumns = [
        `slug.ilike.%${search}%`,
        `model.ilike.%${search}%`,
        `brand.ilike.%${search}%`,
        `category.ilike.%${search}%`,
        ...(includeNewAttributes ? [`color.ilike.%${search}%`] : []),
        `features_en.ilike.%${search}%`,
        `features_ka.ilike.%${search}%`
      ];

      query = query.or(searchColumns.join(','));
    }

    if (brands.length) {
      query = query.in('brand', brands);
    }

    if (categories.length) {
      query = query.in('category', categories);
    }

    if (recommendedAreas.length) {
      query = query.in('recommended_area', recommendedAreas);
    }

    if (includeNewAttributes && colors.length) {
      query = query.in('color', colors);
    }

    if (includeNewAttributes && normalizedFilters.freshAir) {
      query = query.eq('has_fresh_air_intake', true);
    }

    if (range.minPrice !== undefined) {
      query = query.gte('price', range.minPrice);
    }

    if (range.maxPrice !== undefined) {
      query = query.lte('price', range.maxPrice);
    }

    return query;
  };

  let { data, error } = await buildQuery(true);

  if (error?.code === '42703') {
    if (colors.length || normalizedFilters.freshAir) return [];
    const fallback = await buildQuery(false);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;

  const rows = (data ?? []) as ProductSearchRow[];
  if (!rows.length) return [];

  const { data: imageRows, error: imageError } = await supabase
    .from('product_images')
    .select('product_id, storage_path, alt, is_primary, sort_order, created_at')
    .in('product_id', rows.map((item) => item.id))
    .order('product_id')
    .order('is_primary', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (imageError) throw imageError;

  const coverByProduct = new Map<
    string,
    { cover_image: string; cover_alt: string | null }
  >();

  const imagesByProduct = new Map<
    string,
    { url: string; alt: string | null }[]
  >();

  for (const image of imageRows ?? []) {
    const id = image.product_id;

    if (!imagesByProduct.has(id)) imagesByProduct.set(id, []);

    imagesByProduct.get(id)!.push({
      url: image.storage_path,
      alt: image.alt
    });

    if (!coverByProduct.has(id)) {
      coverByProduct.set(id, {
        cover_image: image.storage_path,
        cover_alt: image.alt
      });
    }
  }

  return rows.map((item) => ({
    ...item,
    cover_image: coverByProduct.get(item.id)?.cover_image ?? null,
    cover_alt: coverByProduct.get(item.id)?.cover_alt ?? null,
    images: imagesByProduct.get(item.id) ?? []
  }));
}

export async function getProductFilterOptions(): Promise<ProductFilterOptions> {
  const supabase = createSupabaseServerClient();

  const filterOptionsResult = await supabase
    .from('products')
    .select('brand, category, recommended_area, color, has_fresh_air_intake, price')
    .eq('is_active', true)
    .order('brand', { ascending: true });
  let data = filterOptionsResult.data as Array<{
    brand?: string | null;
    category?: string | null;
    recommended_area?: string | null;
    color?: string | null;
    has_fresh_air_intake?: boolean | null;
    price?: number | string | null;
  }> | null;
  let error = filterOptionsResult.error;

  if (error?.code === '42703') {
    const fallback = await supabase
      .from('products')
      .select('brand, category, recommended_area, price')
      .eq('is_active', true)
      .order('brand', { ascending: true });

    data = fallback.data as Array<{
      brand?: string | null;
      category?: string | null;
      recommended_area?: string | null;
      color?: string | null;
      has_fresh_air_intake?: boolean | null;
      price?: number | string | null;
    }> | null;
    error = fallback.error;
  }

  if (error) throw error;

  const brands = Array.from(
    new Set(
      (data ?? [])
        .map((item) => item.brand?.trim())
        .filter((brand): brand is string => Boolean(brand))
    )
  ).sort((a, b) => a.localeCompare(b));

  const prices = (data ?? [])
    .map((item) => Number(item.price))
    .filter((price) => Number.isFinite(price));

  const categories = Array.from(
    new Set(
      (data ?? [])
        .map((item) => item.category?.trim())
        .filter((category): category is string => Boolean(category))
    )
  ).sort((a, b) => a.localeCompare(b));

  const recommendedAreas = Array.from(
    new Set(
      (data ?? [])
        .map((item) => item.recommended_area?.trim())
        .filter((area): area is string => Boolean(area))
    )
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const colors = Array.from(
    new Set(
      (data ?? [])
        .map((item) => item.color?.trim())
        .filter((color): color is string => Boolean(color))
    )
  ).sort((a, b) => a.localeCompare(b));

  return {
    brands,
    categories,
    recommendedAreas,
    colors,
    hasFreshAirIntake: (data ?? []).some((item) => item.has_fresh_air_intake === true),
    minPrice: prices.length ? Math.floor(Math.min(...prices)) : null,
    maxPrice: prices.length ? Math.ceil(Math.max(...prices)) : null
  };
}

export async function getAdminProductSummaries(): Promise<AdminProductSummary[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from('products')
    .select('id, model, slug, brand, is_active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as AdminProductSummary[];
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithRelations | null> {
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

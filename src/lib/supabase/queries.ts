import { cookies } from 'next/headers';
import { Locale, ProductImage, ProductWithRelations } from '@/types';
import { createSupabaseAdminClient } from './admin';
import { createSupabaseServerClient } from './server';

export const PRODUCT_LIKE_VISITOR_COOKIE = 'tr_product_like_visitor';
export const PRODUCT_PAGE_SIZE = 20;

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
  name_en?: string | null;
  name_ka?: string | null;
  features_en: string | null;
  features_ka: string | null;
  likes_count?: number | null;
  view_count?: number | null;
  created_at: string;
  updated_at: string | null;
};

export type CatalogProduct = ProductSearchRow & {
  cover_image: string | null;
  cover_alt: string | null;
  images: {
    url: string;
    alt: string | null;
  }[];
  likes_count: number;
  view_count: number;
  viewer_has_liked: boolean;
};

export type ProductSort = 'newest' | 'price' | 'views' | 'likes';

export type ProductQueryOptions = {
  sort?: ProductSort;
  limit?: number;
  offset?: number;
};

export type ProductPageResult = {
  products: CatalogProduct[];
  hasMore: boolean;
  nextOffset: number;
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
  freshAirIntakeCount: number;
  minPrice: number | null;
  maxPrice: number | null;
};

export type AdminProductSummary = {
  id: string;
  model: string;
  slug: string;
  brand: string;
  is_active: boolean;
  translations?: Array<{
    locale: string;
    name: string | null;
  }>;
};

function normalizePriceRange(minPrice?: number, maxPrice?: number) {
  const min = Number.isFinite(minPrice) ? minPrice : undefined;
  const max = Number.isFinite(maxPrice) ? maxPrice : undefined;

  if (min !== undefined && max !== undefined && min > max) {
    return { minPrice: max, maxPrice: min };
  }

  return { minPrice: min, maxPrice: max };
}

export function normalizeProductSort(sort?: string | null): ProductSort {
  return sort === 'price' || sort === 'views' || sort === 'likes' ? sort : 'newest';
}

function applyProductSort<T extends { order: (column: string, options?: { ascending?: boolean; nullsFirst?: boolean }) => T }>(
  query: T,
  sort: ProductSort,
) {
  if (sort === 'price') {
    return query
      .order('price', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });
  }

  if (sort === 'views') {
    return query
      .order('view_count', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
  }

  if (sort === 'likes') {
    return query
      .order('likes_count', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
  }

  return query.order('created_at', { ascending: false });
}

function getLikeVisitorId() {
  try {
    return cookies().get(PRODUCT_LIKE_VISITOR_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

async function getViewerLikedProductIds(productIds: string[]) {
  const visitorId = getLikeVisitorId();
  const liked = new Set<string>();

  if (!visitorId || productIds.length === 0 || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return liked;
  }

  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from('product_likes')
      .select('product_id')
      .eq('visitor_id', visitorId)
      .in('product_id', productIds);

    if (error) return liked;

    for (const item of data ?? []) {
      if (typeof item.product_id === 'string') liked.add(item.product_id);
    }
  } catch {
    return liked;
  }

  return liked;
}

export async function getProducts(
  filters: ProductFilters | string = {},
  options: ProductQueryOptions = {},
): Promise<CatalogProduct[]> {
  const supabase = createSupabaseServerClient();
  const normalizedFilters: ProductFilters = typeof filters === 'string' ? { q: filters } : filters;
  const sort = normalizeProductSort(options.sort);
  const offset = Math.max(0, options.offset ?? 0);
  const limit = options.limit && options.limit > 0 ? Math.min(options.limit, 60) : undefined;
  const search = normalizedFilters.q?.trim();
  const brands = normalizedFilters.brand?.map((item) => item.trim()).filter(Boolean) ?? [];
  const categories = normalizedFilters.category?.map((item) => item.trim()).filter(Boolean) ?? [];
  const recommendedAreas = normalizedFilters.recommendedArea?.map((item) => item.trim()).filter(Boolean) ?? [];
  const colors = normalizedFilters.color?.map((item) => item.trim()).filter(Boolean) ?? [];
  const range = normalizePriceRange(normalizedFilters.minPrice, normalizedFilters.maxPrice);

  const buildQuery = (
    includeNewAttributes: boolean,
    includeLocalizedNames: boolean,
    querySort: ProductSort = sort,
  ) => {
    let query = supabase
      .from('products_search')
      .select('*')
      .eq('is_active', true);

    if (search) {
      const searchColumns = [
        `slug.ilike.%${search}%`,
        `model.ilike.%${search}%`,
        `brand.ilike.%${search}%`,
        `category.ilike.%${search}%`,
        ...(includeNewAttributes ? [`color.ilike.%${search}%`] : []),
        `name.ilike.%${search}%`,
        ...(includeLocalizedNames ? [`name_en.ilike.%${search}%`, `name_ka.ilike.%${search}%`] : []),
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

    query = applyProductSort(query, querySort);

    if (limit !== undefined) {
      query = query.range(offset, offset + limit - 1);
    }

    return query;
  };

  let { data, error } = await buildQuery(true, true);

  if (error?.code === '42703') {
    if (colors.length || normalizedFilters.freshAir) return [];
    const fallbackSort = sort === 'views' || sort === 'likes' ? 'newest' : sort;
    const fallback = await buildQuery(false, false, fallbackSort);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;

  const rows = (data ?? []) as ProductSearchRow[];
  if (!rows.length) return [];
  const likedProductIds = await getViewerLikedProductIds(rows.map((item) => item.id));

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
    likes_count: Number(item.likes_count ?? 0),
    view_count: Number(item.view_count ?? 0),
    viewer_has_liked: likedProductIds.has(item.id),
    cover_image: coverByProduct.get(item.id)?.cover_image ?? null,
    cover_alt: coverByProduct.get(item.id)?.cover_alt ?? null,
    images: imagesByProduct.get(item.id) ?? []
  }));
}

export async function getProductPage(
  filters: ProductFilters | string = {},
  options: ProductQueryOptions = {},
): Promise<ProductPageResult> {
  const limit = Math.min(Math.max(options.limit ?? PRODUCT_PAGE_SIZE, 1), 60);
  const offset = Math.max(options.offset ?? 0, 0);
  const products = await getProducts(filters, {
    ...options,
    limit: limit + 1,
    offset,
  });
  const page = products.slice(0, limit);

  return {
    products: page,
    hasMore: products.length > limit,
    nextOffset: offset + page.length,
  };
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

  const brands = (data ?? [])
    .map((item) => item.brand?.trim())
    .filter((brand): brand is string => Boolean(brand))
    .sort((a, b) => a.localeCompare(b));

  const prices = (data ?? [])
    .map((item) => Number(item.price))
    .filter((price) => Number.isFinite(price));

  const categories = (data ?? [])
    .map((item) => item.category?.trim())
    .filter((category): category is string => Boolean(category))
    .sort((a, b) => a.localeCompare(b));

  const recommendedAreas = (data ?? [])
    .map((item) => item.recommended_area?.trim())
    .filter((area): area is string => Boolean(area))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const colors = (data ?? [])
    .map((item) => item.color?.trim())
    .filter((color): color is string => Boolean(color))
    .sort((a, b) => a.localeCompare(b));
  const freshAirIntakeCount = (data ?? []).filter((item) => item.has_fresh_air_intake === true).length;

  return {
    brands,
    categories,
    recommendedAreas,
    colors,
    hasFreshAirIntake: freshAirIntakeCount > 0,
    freshAirIntakeCount,
    minPrice: prices.length ? Math.floor(Math.min(...prices)) : null,
    maxPrice: prices.length ? Math.ceil(Math.max(...prices)) : null
  };
}

export async function getAdminProductSummaries(): Promise<AdminProductSummary[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from('products')
    .select('id, model, slug, brand, is_active, translations:product_translations(locale, name)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as AdminProductSummary[];
}

export async function getAdminEditShortcutEnabled(): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('admin_product_edit_shortcut_enabled')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    if (error.code === '42703' || error.code === '42P01') return false;
    throw error;
  }

  return Boolean(data?.admin_product_edit_shortcut_enabled);
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

export async function incrementProductView(productId: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  try {
    const admin = createSupabaseAdminClient();
    await admin.rpc('increment_product_view', { p_product_id: productId });
  } catch {
    // View counts should never block product detail rendering.
  }
}

export function pickTranslation(product: ProductWithRelations, locale: Locale) {
  const translated = product.translations.find((item) => item.locale === locale);
  const fallback = product.translations.find((item) => item.locale === 'en');
  return translated || fallback;
}

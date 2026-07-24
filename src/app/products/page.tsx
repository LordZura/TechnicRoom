import type { Metadata } from 'next';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import {
  getProductFilterOptions,
  getProductPage,
  normalizeProductSort,
  PRODUCT_PAGE_SIZE,
} from '@/lib/supabase/queries';
import { CatalogSearch } from '@/components/products/catalog-search';
import { ProductsGrid } from '@/components/products/products-grid';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';

const productsDescription =
  'Browse air conditioners and HVAC systems with professional support and installation across Georgia.';

function hasIndexableSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  return Object.values(searchParams).some((value) => {
    if (Array.isArray(value)) return value.some((item) => item.trim());
    return Boolean(value?.trim());
  });
}

export function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}): Metadata {
  const filtered = hasIndexableSearchParams(searchParams);

  return {
    title: filtered ? 'Filtered Air Conditioner Results' : 'Buy Air Conditioners in Georgia',
    description: productsDescription,
    alternates: { canonical: '/products' },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: 'Buy Air Conditioners in Georgia | Technic Room',
      description: productsDescription,
      url: '/products',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Buy Air Conditioners in Georgia | Technic Room',
      description: productsDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

function parsePrice(value?: string) {
  if (!value) return undefined;

  const price = Number(value);
  return Number.isFinite(price) ? price : undefined;
}

function parseListParam(value?: string | string[]) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => item.trim()).filter(Boolean);
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    brand?: string | string[];
    category?: string | string[];
    recommendedArea?: string | string[];
    color?: string | string[];
    freshAir?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
}) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const sort = normalizeProductSort(searchParams.sort);

  const filters = {
    q: searchParams.q,
    brand: parseListParam(searchParams.brand),
    category: parseListParam(searchParams.category),
    recommendedArea: parseListParam(searchParams.recommendedArea),
    color: parseListParam(searchParams.color),
    freshAir: searchParams.freshAir === '1',
    minPrice: parsePrice(searchParams.minPrice),
    maxPrice: parsePrice(searchParams.maxPrice),
  };

  const [productPage, filterOptions] = await Promise.all([
    getProductPage(filters, { sort, limit: PRODUCT_PAGE_SIZE }),
    getProductFilterOptions(),
  ]);

  const searchLabels = {
    searchPlaceholder: t.products.searchPlaceholder,
    brand: t.products.brandFilter,
    allBrands: t.products.allBrands,
    type: t.products.typeFilter,
    allTypes: t.products.allTypes,
    recommendedArea: t.products.recommendedAreaFilter,
    allAreas: t.products.allAreas,
    color: t.products.colorFilter,
    function: t.products.functionFilter,
    freshAir: t.products.freshAirFunction,
    minPrice: t.products.minPrice,
    maxPrice: t.products.maxPrice,
    priceRange: t.products.priceRange,
    btuCalculator: t.products.btuCalculator,
    btuArea: t.products.btuArea,
    btuPeople: t.products.btuPeople,
    btuHeatLoad: t.products.btuHeatLoad,
    btuLowLoad: t.products.btuLowLoad,
    btuNormalLoad: t.products.btuNormalLoad,
    btuHighLoad: t.products.btuHighLoad,
    calculateBtu: t.products.calculateBtu,
    apply: t.products.applyFilters,
    reset: t.products.resetFilters,
    showFilters: t.products.showFilters,
    hideFilters: t.products.hideFilters,
    showAdvanced: t.products.showAdvancedFilters,
    hideAdvanced: t.products.hideAdvancedFilters,
    activeFilters: t.products.activeFilters,
  };

  const gridLabels = {
    empty: t.products.empty,
    sortBy: t.products.sortBy,
    sortNewest: t.products.sortNewest,
    sortPrice: t.products.sortPrice,
    sortViews: t.products.sortViews,
    sortLikes: t.products.sortLikes,
    more: t.products.more,
  };

  return (
    <div className="tr-shell pb-4 pt-8 sm:pt-10">
      <header className="max-w-3xl">
        <p className="tr-eyebrow">Technic Room</p>
        <h1 className="tr-section-title mt-2 text-[1.7rem] sm:text-[2.1rem] md:text-[2.4rem]">
          {t.products.title}
        </h1>
        <p className="tr-muted mt-3 max-w-2xl">{t.products.intro}</p>
      </header>

      <div className="mt-7 lg:grid lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start lg:gap-7 xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="tr-filter-rail lg:sticky lg:top-[5.5rem] lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pb-2 lg:pr-1.5">
          <CatalogSearch
            locale={locale}
            filters={filters}
            options={filterOptions}
            labels={searchLabels}
          />
        </aside>

        <section className="mt-6 min-w-0 lg:mt-0">
          <ProductsGrid
            initialProducts={productPage.products}
            initialHasMore={productPage.hasMore}
            initialNextOffset={productPage.nextOffset}
            filters={filters}
            sort={sort}
            locale={locale}
            labels={gridLabels}
            resetKey={JSON.stringify({ filters, sort })}
          />
        </section>
      </div>
    </div>
  );
}

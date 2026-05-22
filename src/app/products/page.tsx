import type { Metadata } from 'next';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProductFilterOptions, getProducts } from '@/lib/supabase/queries';
import { ProductCard } from '@/components/products/product-card';
import { CatalogSearch } from '@/components/products/catalog-search';


export const metadata: Metadata = {
  title: 'Buy Air Conditioners in Georgia',
  description: 'Browse air conditioners and HVAC systems with professional support and installation across Georgia.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Buy Air Conditioners in Georgia | Technic Room',
    description: 'Browse air conditioners and HVAC systems with professional support and installation across Georgia.',
    url: '/products',
    images: ['/og-image.png']
  }
};

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
  searchParams
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
  };
}) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const filters = {
    q: searchParams.q,
    brand: parseListParam(searchParams.brand),
    category: parseListParam(searchParams.category),
    recommendedArea: parseListParam(searchParams.recommendedArea),
    color: parseListParam(searchParams.color),
    freshAir: searchParams.freshAir === '1',
    minPrice: parsePrice(searchParams.minPrice),
    maxPrice: parsePrice(searchParams.maxPrice)
  };
  const [products, filterOptions] = await Promise.all([
    getProducts(filters),
    getProductFilterOptions()
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
    activeFilters: t.products.activeFilters
  };

  return (
    <div className="space-y-5 pt-3 sm:space-y-6 sm:pt-4 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-5 lg:space-y-0 lg:pt-5 xl:grid-cols-[310px_minmax(0,1fr)]">
      <aside className="tr-filter-rail lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
        <section className="tr-surface p-4 sm:p-6 lg:p-4 xl:p-5">
          <h1 className="tr-section-title text-pretty leading-tight lg:text-[1.45rem] xl:text-[1.55rem]">{t.products.title}</h1>
          <p className="tr-muted mt-2 max-w-2xl text-pretty lg:text-xs lg:leading-5 xl:text-[13px]">{t.products.intro}</p>
          <CatalogSearch
            locale={locale}
            filters={filters}
            options={filterOptions}
            labels={searchLabels}
          />
        </section>
      </aside>

      <section className="min-w-0">
        {products.length === 0 ? (
          <div className="tr-surface animate-fade-in p-7 text-center text-brand-700/80">{t.products.empty}</div>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item) => (
              <ProductCard key={item.id} product={item} mobileLayout="horizontal" locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

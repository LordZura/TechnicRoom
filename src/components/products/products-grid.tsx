'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';
import { ProductCardSkeleton } from '@/components/products/product-card-skeleton';
import type {
  CatalogProduct,
  ProductFilters,
  ProductPageResult,
  ProductSort,
} from '@/lib/supabase/queries';
import type { Locale } from '@/types';

const PRODUCT_GRID_PAGE_SIZE = 20;

type ProductsGridLabels = {
  empty: string;
  sortBy: string;
  sortNewest: string;
  sortPrice: string;
  sortViews: string;
  sortLikes: string;
  more: string;
};

function appendValues(params: URLSearchParams, key: string, values?: string[]) {
  values?.forEach((value) => {
    if (value.trim()) params.append(key, value.trim());
  });
}

function buildParams(filters: ProductFilters, sort: ProductSort) {
  const params = new URLSearchParams();

  if (filters.q?.trim()) params.set('q', filters.q.trim());
  appendValues(params, 'brand', filters.brand);
  appendValues(params, 'category', filters.category);
  appendValues(params, 'recommendedArea', filters.recommendedArea);
  appendValues(params, 'color', filters.color);
  if (filters.freshAir) params.set('freshAir', '1');
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (sort !== 'newest') params.set('sort', sort);

  return params;
}

export function ProductsGrid({
  initialProducts,
  initialHasMore,
  initialNextOffset,
  filters,
  sort,
  locale,
  labels,
  resetKey,
}: {
  initialProducts: CatalogProduct[];
  initialHasMore: boolean;
  initialNextOffset: number;
  filters: ProductFilters;
  sort: ProductSort;
  locale: Locale;
  labels: ProductsGridLabels;
  resetKey: string;
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextOffset, setNextOffset] = useState(initialNextOffset);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(initialHasMore);
    setNextOffset(initialNextOffset);
    setLoadingMore(false);
  }, [initialHasMore, initialNextOffset, initialProducts, resetKey]);

  const changeSort = (nextSort: ProductSort) => {
    const params = buildParams(filters, nextSort);
    const query = params.toString();
    router.push(query ? `/products?${query}` : '/products');
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const params = buildParams(filters, sort);
      params.set('offset', String(nextOffset));
      params.set('limit', String(PRODUCT_GRID_PAGE_SIZE));

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) return;

      const page = (await response.json()) as ProductPageResult;
      setProducts((current) => [...current, ...page.products]);
      setHasMore(page.hasMore);
      setNextOffset(page.nextOffset);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex justify-end">
        <label className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-brand-line bg-brand-ivory px-3 text-sm text-brand-700/85 shadow-soft sm:w-auto">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em]">
            {labels.sortBy}
          </span>
          <select
            value={sort}
            onChange={(event) => changeSort(event.target.value as ProductSort)}
            className="min-h-9 min-w-0 flex-1 bg-transparent text-sm font-semibold text-brand-espresso outline-none sm:min-w-36"
          >
            <option value="newest">{labels.sortNewest}</option>
            <option value="price">{labels.sortPrice}</option>
            <option value="views">{labels.sortViews}</option>
            <option value="likes">{labels.sortLikes}</option>
          </select>
        </label>
      </div>

      {products.length === 0 ? (
        <div className="tr-surface animate-fade-in p-7 text-center text-brand-700/80">
          {labels.empty}
        </div>
      ) : (
        <div
          className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
          aria-live="polite"
        >
          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              mobileLayout="horizontal"
              locale={locale}
            />
          ))}
        </div>
      )}

      {loadingMore && (
        <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} mobileLayout="horizontal" />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            aria-busy={loadingMore}
            className="tr-btn-ghost min-w-28"
          >
            {labels.more}
          </button>
        </div>
      )}
    </div>
  );
}

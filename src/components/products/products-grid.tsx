'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, PackageOpen, Plus } from 'lucide-react';
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

  const sortOptions: { value: ProductSort; label: string }[] = [
    { value: 'newest', label: labels.sortNewest },
    { value: 'price', label: labels.sortPrice },
    { value: 'views', label: labels.sortViews },
    { value: 'likes', label: labels.sortLikes },
  ];

  const changeSort = (nextSort: ProductSort) => {
    if (nextSort === sort) return;

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
    <div className="space-y-5">
      {/* Sort rail */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="tr-label shrink-0">{labels.sortBy}</span>

        <div className="flex flex-wrap items-center gap-1.5 rounded-3xl border border-ink-100 bg-white/80 p-1 shadow-soft backdrop-blur sm:rounded-full">
          {sortOptions.map((option) => {
            const active = option.value === sort;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => changeSort(option.value)}
                aria-pressed={active}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-semibold transition-all duration-400 ease-smooth ${
                  active
                    ? 'bg-gradient-to-b from-wine-700 to-wine-800 text-white shadow-glow'
                    : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="tr-surface flex animate-fade-in flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-ink-50 text-ink-300">
            <PackageOpen className="h-6 w-6" strokeWidth={1.6} />
          </span>
          <p className="text-sm font-medium text-ink-600">{labels.empty}</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4"
          aria-live="polite"
        >
          {products.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
            >
              <ProductCard product={item} mobileLayout="horizontal" locale={locale} />
            </div>
          ))}
        </div>
      )}

      {loadingMore && (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} mobileLayout="horizontal" />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            aria-busy={loadingMore}
            className="tr-btn-ghost group min-w-36"
          >
            {loadingMore ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 transition-transform duration-400 ease-smooth group-hover:rotate-90" />
            )}
            {labels.more}
          </button>
        </div>
      )}
    </div>
  );
}

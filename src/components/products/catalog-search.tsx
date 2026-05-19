'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import type { ProductFilterOptions, ProductFilters } from '@/lib/supabase/queries';

type CatalogSearchLabels = {
  searchPlaceholder: string;
  brand: string;
  allBrands: string;
  minPrice: string;
  maxPrice: string;
  priceRange: string;
  apply: string;
  reset: string;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(value);
}

export function CatalogSearch({
  filters,
  options,
  labels
}: {
  filters: ProductFilters;
  options: ProductFilterOptions;
  labels: CatalogSearchLabels;
}) {
  const router = useRouter();
  const hasPriceBounds = options.minPrice !== null && options.maxPrice !== null;
  const priceFloor = options.minPrice ?? 0;
  const priceCeiling = options.maxPrice ?? Math.max(priceFloor, 0);
  const [query, setQuery] = useState(filters.q || '');
  const [brand, setBrand] = useState(filters.brand || '');
  const [minPrice, setMinPrice] = useState(
    filters.minPrice !== undefined ? String(filters.minPrice) : ''
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice !== undefined ? String(filters.maxPrice) : ''
  );

  const clampMinPrice = (value: string) => {
    if (value === '') {
      setMinPrice('');
      return;
    }

    const next = Number(value);
    const currentMax = maxPrice === '' ? undefined : Number(maxPrice);
    setMinPrice(String(currentMax !== undefined && next > currentMax ? currentMax : next));
  };

  const clampMaxPrice = (value: string) => {
    if (value === '') {
      setMaxPrice('');
      return;
    }

    const next = Number(value);
    const currentMin = minPrice === '' ? undefined : Number(minPrice);
    setMaxPrice(String(currentMin !== undefined && next < currentMin ? currentMin : next));
  };

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (brand.trim()) params.set('brand', brand.trim());
    if (minPrice !== '') params.set('minPrice', minPrice);
    if (maxPrice !== '') params.set('maxPrice', maxPrice);

    const next = params.toString();
    router.push(next ? `/products?${next}` : '/products');
  };

  return (
    <form onSubmit={applyFilters} className="mt-4 space-y-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(170px,0.45fr)_minmax(260px,0.75fr)]">
        <div className="group flex items-center gap-2.5 rounded-2xl border border-brand-line bg-brand-ivory px-3 py-2.5 transition focus-within:border-brand-brown focus-within:ring-2 focus-within:ring-brand-gold/40 sm:rounded-xl sm:py-2">
          <Search className="h-4.5 w-4.5 shrink-0 text-brand-600/80 transition group-focus-within:text-brand-brown" />
          <input
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-brand-500/70"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-full text-brand-600/80 transition hover:bg-brand-cream hover:text-brand-brown">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <label className="space-y-1.5 text-xs font-medium text-brand-700/80">
          <span>{labels.brand}</span>
          <select
            name="brand"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="tr-input min-h-10 py-2"
          >
            <option value="">{labels.allBrands}</option>
            {options.brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-2 rounded-xl border border-brand-line bg-brand-ivory p-3">
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-brand-700/80">
            <span className="inline-flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {labels.priceRange}
            </span>
            {hasPriceBounds && (
              <span className="text-[11px] text-brand-600/75">
                ₾{formatPrice(priceFloor)} - ₾{formatPrice(priceCeiling)}
              </span>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-[11px] text-brand-600/80">{labels.minPrice}</span>
              <input
                type="number"
                name="minPrice"
                min={hasPriceBounds ? priceFloor : 0}
                max={hasPriceBounds ? priceCeiling : undefined}
                step="1"
                value={minPrice}
                onChange={(event) => clampMinPrice(event.target.value)}
                className="tr-input min-h-10 py-2"
              />
              {hasPriceBounds && (
                <input
                  type="range"
                  min={priceFloor}
                  max={priceCeiling}
                  step="1"
                  value={minPrice || priceFloor}
                  onChange={(event) => clampMinPrice(event.target.value)}
                  className="w-full accent-brand-brown"
                  aria-label={labels.minPrice}
                />
              )}
            </label>

            <label className="space-y-1">
              <span className="text-[11px] text-brand-600/80">{labels.maxPrice}</span>
              <input
                type="number"
                name="maxPrice"
                min={hasPriceBounds ? priceFloor : 0}
                max={hasPriceBounds ? priceCeiling : undefined}
                step="1"
                value={maxPrice}
                onChange={(event) => clampMaxPrice(event.target.value)}
                className="tr-input min-h-10 py-2"
              />
              {hasPriceBounds && (
                <input
                  type="range"
                  min={priceFloor}
                  max={priceCeiling}
                  step="1"
                  value={maxPrice || priceCeiling}
                  onChange={(event) => clampMaxPrice(event.target.value)}
                  className="w-full accent-brand-brown"
                  aria-label={labels.maxPrice}
                />
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button className="tr-btn-primary min-h-10 px-4" type="submit">
          {labels.apply}
        </button>
        <Link href="/products" className="tr-btn-ghost min-h-10 gap-2 px-4">
          <RotateCcw className="h-4 w-4" />
          {labels.reset}
        </Link>
      </div>
    </form>
  );
}

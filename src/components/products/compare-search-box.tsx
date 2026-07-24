'use client';

import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CatalogProduct } from '@/lib/supabase/queries';
import type { Locale } from '@/types';

function getProductName(product: CatalogProduct, locale: Locale) {
  return locale === 'ka'
    ? product.name_ka || product.name || product.name_en || product.model
    : product.name_en || product.name || product.name_ka || product.model;
}

function getCoverImage(product: CatalogProduct) {
  return product.cover_image || product.images[0]?.url || null;
}

export function CompareSearchBox({
  products,
  firstSlug,
  secondSlug,
  slot,
  locale,
  labels
}: {
  products: CatalogProduct[];
  firstSlug: string;
  secondSlug?: string;
  slot: 'first' | 'second';
  locale: Locale;
  labels: {
    placeholder: string;
    empty: string;
    selected: string;
  };
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();
  const candidates = useMemo(() => {
    const needle = trimmedQuery.toLocaleLowerCase();
    if (!needle) return [];

    const excludedSlug = slot === 'first' ? secondSlug : firstSlug;

    return products
      .filter((product) => product.slug !== excludedSlug)
      .filter((product) => {
        const names = [product.name, product.name_en, product.name_ka].filter((item): item is string => Boolean(item));
        return names.some((name) => name.toLocaleLowerCase().includes(needle));
      })
      .slice(0, 6);
  }, [firstSlug, products, secondSlug, slot, trimmedQuery]);

  const selectProduct = (slug: string) => {
    const product = slot === 'first' ? slug : firstSlug;
    const compare = slot === 'second' ? slug : secondSlug;
    const params = new URLSearchParams({ product });

    if (compare && compare !== product) params.set('compare', compare);

    router.push(`/compare?${params.toString()}`);
    setQuery('');
  };

  return (
    <div className="relative">
      <label className="tr-field group px-3">
        <Search className="h-4 w-4 shrink-0 text-ink-400 transition-colors duration-300 group-focus-within:text-wine-700" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.placeholder}
          className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-400 transition-all duration-300 hover:bg-ink-100 hover:text-wine-700 active:scale-90"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </label>

      {trimmedQuery && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 animate-slide-down overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-lift">
          {candidates.length === 0 ? (
            <p className="px-3.5 py-3.5 text-sm text-ink-500">{labels.empty}</p>
          ) : (
            <div className="max-h-72 overflow-y-auto p-1.5">
              {candidates.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => selectProduct(product.slug)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors duration-300 hover:bg-wine-50"
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-ink-50 via-white to-ink-50 ring-1 ring-inset ring-ink-100">
                    {getCoverImage(product) ? (
                      <Image
                        src={getCoverImage(product)!}
                        alt={getProductName(product, locale)}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center px-1 text-center text-[0.5rem] font-semibold uppercase leading-tight text-ink-300">
                        No image
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-wine-600">
                      {product.brand}
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-bold text-ink-900">
                      {getProductName(product, locale)}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-500">
                      {product.model}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

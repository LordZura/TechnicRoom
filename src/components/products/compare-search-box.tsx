'use client';

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
      <label className="flex min-h-11 items-center gap-2 rounded-xl border border-brand-line bg-brand-ivory px-3 transition focus-within:border-brand-brown focus-within:ring-2 focus-within:ring-brand-gold/40">
        <Search className="h-4 w-4 shrink-0 text-brand-600/80" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.placeholder}
          className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-brand-500/70"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-brand-600/80 transition hover:bg-brand-cream hover:text-brand-brown"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </label>

      {trimmedQuery && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-brand-line bg-brand-ivory shadow-soft">
          {candidates.length === 0 ? (
            <p className="px-3 py-3 text-sm text-brand-700/75">{labels.empty}</p>
          ) : (
            <div className="max-h-72 overflow-y-auto p-1.5">
              {candidates.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => selectProduct(product.slug)}
                  className="block w-full rounded-lg px-3 py-2 text-left transition hover:bg-brand-cream"
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-700/70">{product.brand}</span>
                  <span className="mt-0.5 block text-sm font-semibold text-brand-espresso">{getProductName(product, locale)}</span>
                  <span className="mt-0.5 block text-xs text-brand-700/70">{product.model}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

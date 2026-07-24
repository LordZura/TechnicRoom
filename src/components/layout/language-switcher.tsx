'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import type { Locale } from '@/types';

const LOCALES: { value: Locale; short: string; full: string }[] = [
  { value: 'ka', short: 'KA', full: 'ქართული' },
  { value: 'en', short: 'EN', full: 'English' },
];

export function LanguageSwitcher({
  locale,
  compact = false,
  tone = 'light',
}: {
  locale: Locale;
  compact?: boolean;
  tone?: 'light' | 'dark';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [pending, startTransition] = useTransition();

  const activeIndex = LOCALES.findIndex((item) => item.value === locale);

  const updateLocale = async (value: Locale) => {
    if (value === locale) return;

    await fetch('/api/share', {
      method: 'POST',
      body: JSON.stringify({ locale: value }),
      headers: { 'Content-Type': 'application/json' },
    });

    const query = search.toString();

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
      router.refresh();
    });
  };

  const dark = tone === 'dark';

  return (
    <div
      role="group"
      aria-label="Language"
      data-pending={pending || undefined}
      className={`relative inline-flex select-none items-center rounded-full p-0.5 transition-opacity duration-300 data-[pending]:opacity-60 ${
        dark
          ? 'border border-white/20 bg-white/10 backdrop-blur-md'
          : 'border border-ink-200 bg-ink-50'
      }`}
    >
      {/* Sliding thumb */}
      <span
        aria-hidden="true"
        className={`absolute left-0.5 top-0.5 rounded-full transition-transform duration-[420ms] ease-smooth ${
          dark ? 'bg-white/90 shadow-sm' : 'bg-white shadow-soft'
        }`}
        style={{
          width: `calc((100% - 0.25rem) / ${LOCALES.length})`,
          height: 'calc(100% - 0.25rem)',
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {LOCALES.map((item) => {
        const active = item.value === locale;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => void updateLocale(item.value)}
            aria-pressed={active}
            title={item.full}
            className={`relative z-10 inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-300 ${
              compact
                ? 'h-8 w-9 text-[0.6875rem] tracking-[0.06em]'
                : 'h-8 w-11 text-xs tracking-[0.08em]'
            } ${
              active
                ? dark
                  ? 'text-wine-800'
                  : 'text-wine-700'
                : dark
                  ? 'text-white/70 hover:text-white'
                  : 'text-ink-500 hover:text-ink-800'
            }`}
          >
            {item.short}
            <span className="sr-only"> — {item.full}</span>
          </button>
        );
      })}
    </div>
  );
}

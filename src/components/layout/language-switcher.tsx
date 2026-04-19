'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function LanguageSwitcher({ locale, compact = false }: { locale: 'en' | 'ka'; compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const updateLocale = async (value: string) => {
    await fetch('/api/share', {
      method: 'POST',
      body: JSON.stringify({ locale: value }),
      headers: { 'Content-Type': 'application/json' }
    });
    const query = search.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
    router.refresh();
  };

  return (
    <select
      value={locale}
      onChange={(event) => updateLocale(event.target.value)}
      className={`tr-input rounded-xl border-brand-line bg-brand-ivory/90 font-medium ${compact ? 'min-h-11 max-w-[102px] px-2.5 text-xs' : 'max-w-[132px]'}`}
      aria-label="Language"
    >
      <option value="ka">ქართული</option>
      <option value="en">English</option>
    </select>
  );
}

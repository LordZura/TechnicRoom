'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function LanguageSwitcher({ locale }: { locale: 'en' | 'ka' }) {
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
    <select value={locale} onChange={(event) => updateLocale(event.target.value)} className="tr-input max-w-[130px]" aria-label="Language">
      <option value="ka">ქართული</option>
      <option value="en">English</option>
    </select>
  );
}

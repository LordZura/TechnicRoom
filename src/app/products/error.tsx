'use client';
import { dictionaries } from '@/lib/i18n/dictionaries';

export default function ProductsError() {
  const localeFromCookie =
    typeof document !== 'undefined' && document.cookie.includes('locale=en') ? 'en' : 'ka';
  return <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{dictionaries[localeFromCookie].products.loadError}</p>;
}

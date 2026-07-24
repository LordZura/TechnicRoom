'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';
import { dictionaries } from '@/lib/i18n/dictionaries';

export default function ProductsError({ reset }: { reset: () => void }) {
  const localeFromCookie =
    typeof document !== 'undefined' && document.cookie.includes('locale=en') ? 'en' : 'ka';
  const t = dictionaries[localeFromCookie];

  return (
    <div className="tr-shell py-16">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-wine-200 bg-wine-50/60 px-6 py-10 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-wine-700 shadow-soft">
          <AlertTriangle className="h-5 w-5" />
        </span>

        <p className="text-sm font-semibold text-wine-900">{t.products.loadError}</p>

        <button type="button" onClick={reset} className="tr-btn-ghost">
          <RotateCcw className="h-4 w-4" />
          {t.products.resetFilters}
        </button>
      </div>
    </div>
  );
}

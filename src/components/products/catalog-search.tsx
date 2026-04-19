'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

export function CatalogSearch({ defaultValue, placeholder }: { defaultValue?: string; placeholder: string }) {
  const [value, setValue] = useState(defaultValue || '');

  return (
    <form className="mt-4">
      <div className="group flex items-center gap-2.5 rounded-2xl border border-brand-line bg-brand-ivory px-3 py-2.5 transition focus-within:border-brand-brown focus-within:ring-2 focus-within:ring-brand-gold/40 sm:rounded-xl sm:py-2">
        <Search className="h-4.5 w-4.5 shrink-0 text-[#8b735f] transition group-focus-within:text-brand-brown" />
        <input
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#9d8a79]"
        />
        {value && (
          <button type="button" onClick={() => setValue('')} className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-full text-[#8b735f] transition hover:bg-brand-cream hover:text-brand-brown">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}

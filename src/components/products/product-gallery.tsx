'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ProductImage } from '@/types';

export function ProductGallery({ images, fallbackAlt }: { images: ProductImage[]; fallbackAlt: string }) {
  const sorted = useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return a.id.localeCompare(b.id);
      }),
    [images]
  );

  const [active, setActive] = useState(sorted[0]?.storage_path);

  if (!sorted.length) {
    return <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">No image</div>;
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Image src={active || sorted[0].storage_path} alt={fallbackAlt} fill className="object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {sorted.map((image) => {
          const isActive = (active || sorted[0].storage_path) === image.storage_path;
          return (
            <button
              key={image.id}
              onClick={() => setActive(image.storage_path)}
              className={`relative aspect-square overflow-hidden rounded-lg border ${isActive ? 'border-brand-600 ring-1 ring-brand-600' : 'border-slate-200'}`}
            >
              <Image src={image.storage_path} alt={image.alt || fallbackAlt} fill className="object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

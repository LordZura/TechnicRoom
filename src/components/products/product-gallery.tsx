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
    return <div className="tr-surface p-12 text-center text-[#7f6956]">No image</div>;
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-line bg-brand-ivory shadow-soft">
        <Image src={active || sorted[0].storage_path} alt={fallbackAlt} fill className="object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {sorted.map((image) => {
          const isActive = (active || sorted[0].storage_path) === image.storage_path;
          return (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(image.storage_path)}
              className={`relative aspect-square overflow-hidden rounded-lg border transition ${
                isActive ? 'border-brand-brown ring-2 ring-brand-gold/40' : 'border-brand-line hover:border-brand-gold'
              }`}
            >
              <Image src={image.storage_path} alt={image.alt || fallbackAlt} fill className="object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

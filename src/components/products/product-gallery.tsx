'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ProductImage } from '@/types';

export function ProductGallery({ images, fallbackAlt }: { images: ProductImage[]; fallbackAlt: string }) {
  const orderedImages = useMemo(
    () => [...images].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order),
    [images]
  );

  const [active, setActive] = useState(orderedImages[0]?.storage_path);

  if (!orderedImages.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-500">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Image src={active || orderedImages[0].storage_path} alt={fallbackAlt} fill className="object-cover" />
      </div>
      {orderedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {orderedImages.map((image) => {
            const isActive = image.storage_path === active;
            return (
              <button
                key={image.id}
                onClick={() => setActive(image.storage_path)}
                className={`relative aspect-square overflow-hidden rounded-lg border ${isActive ? 'border-brand-700' : 'border-slate-200'}`}
                aria-label="View image"
              >
                <Image src={image.storage_path} alt={image.alt || fallbackAlt} fill className="object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

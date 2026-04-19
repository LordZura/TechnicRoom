'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ProductImage } from '@/types';

export function ProductGallery({ images, fallbackAlt }: { images: ProductImage[]; fallbackAlt: string }) {
  const [active, setActive] = useState(images[0]?.storage_path);

  if (!images.length) {
    return <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">No image</div>;
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Image src={active || images[0].storage_path} alt={fallbackAlt} fill className="object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setActive(image.storage_path)}
            className="relative aspect-square overflow-hidden rounded-lg border border-slate-200"
          >
            <Image src={image.storage_path} alt={image.alt || fallbackAlt} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

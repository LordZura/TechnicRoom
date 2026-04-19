import Image from 'next/image';
import Link from 'next/link';
import { ProductListItem } from '@/types';

export function ProductCard({ item }: { item: ProductListItem }) {
  return (
    <Link
      href={`/products/${item.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {item.cover_image ? (
          <Image src={item.cover_image} alt={item.name || item.model} fill className="object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">No image available</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">{item.brand}</p>
        <h3 className="line-clamp-2 font-semibold text-slate-900">{item.name || item.model}</h3>
        <p className="text-sm text-slate-600">Model: {item.model}</p>
        {item.category && <p className="text-xs text-slate-500">{item.category}</p>}
      </div>
    </Link>
  );
}

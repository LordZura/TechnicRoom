import Image from 'next/image';
import Link from 'next/link';
import { CatalogProduct } from '@/lib/supabase/queries';

function ProductPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
      No image
    </div>
  );
}

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-brand-500"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {product.cover_image ? (
          <Image src={product.cover_image} alt={product.cover_alt || product.name || product.model} fill className="object-cover" />
        ) : (
          <ProductPlaceholder />
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase text-slate-500">{product.brand}</p>
        <h3 className="line-clamp-1 font-semibold">{product.name || product.model}</h3>
        <p className="text-sm text-slate-600">Model: {product.model}</p>
        {product.category && <p className="text-sm text-slate-500">{product.category}</p>}
      </div>
    </Link>
  );
}

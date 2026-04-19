import Image from 'next/image';
import Link from 'next/link';
import { CatalogProduct } from '@/lib/supabase/queries';

function ProductPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center bg-brand-sand/30 text-xs font-medium uppercase tracking-wide text-[#8f7763]">
      No image
    </div>
  );
}

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group tr-surface overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-brand-gold/80">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-sand/30">
        {product.cover_image ? (
          <Image
            src={product.cover_image}
            alt={product.cover_alt || product.name || product.model}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <ProductPlaceholder />
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wide text-[#8a725f]">{product.brand}</p>
        <h3 className="line-clamp-2 text-base font-semibold text-brand-espresso">{product.name || product.model}</h3>
        <p className="text-sm text-[#705946]">Model: {product.model}</p>
        {product.category && <p className="text-sm text-[#876f5a]">{product.category}</p>}
      </div>
    </Link>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { CatalogProduct } from '@/lib/supabase/queries';

function ProductPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center rounded-[1rem] bg-white/80 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-600/75 ring-1 ring-brand-sand">
      No image
    </div>
  );
}

export function ProductCard({ product, mobileLayout = 'vertical' }: { product: CatalogProduct; mobileLayout?: 'vertical' | 'horizontal' }) {
  const horizontalMobile = mobileLayout === 'horizontal';

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group block overflow-hidden border border-brand-line bg-brand-ivory shadow-soft transition-all duration-300 active:scale-[0.995] hover:border-brand-gold hover:shadow-[0_18px_40px_rgba(145,44,70,0.16)] ${
        horizontalMobile ? 'rounded-[1.2rem] sm:rounded-[1.6rem] sm:hover:-translate-y-1.5' : 'rounded-[1.35rem] sm:rounded-[1.6rem] sm:hover:-translate-y-1.5'
      }`}
    >
      <div className={`${horizontalMobile ? 'flex gap-3 p-3 sm:block sm:p-3 sm:pb-0' : 'p-3 pb-0'}`}>
        <div className={`relative overflow-hidden bg-white/80 ring-1 ring-brand-sand ${horizontalMobile ? 'h-[108px] w-[116px] shrink-0 rounded-[0.95rem] sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-[1.1rem]' : 'aspect-[4/3] w-full rounded-[1.1rem]'}`}>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-espresso/20 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          {product.cover_image ? (
            <Image
              src={product.cover_image}
              alt={product.cover_alt || product.name || product.model}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.045]"
            />
          ) : (
            <ProductPlaceholder />
          )}
        </div>

        <div className={`space-y-1.5 ${horizontalMobile ? 'min-w-0 flex-1 pt-0.5 sm:px-4 sm:pb-5 sm:pt-4' : 'space-y-2 px-4 pb-5 pt-4'}`}>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-700/75 sm:text-[11px]">
            {product.brand}
          </p>

          <h3 className="line-clamp-2 text-[1rem] font-semibold leading-snug text-brand-espresso transition-colors duration-300 group-hover:text-brand-brown sm:text-[1.05rem]">
            {product.name || product.model}
          </h3>

          <p className="text-xs text-brand-700/80 sm:text-sm">
            <span className="font-medium text-brand-espresso/90">Model:</span>{' '}
            {product.model}
          </p>

          {product.category && (
            <p className="line-clamp-1 text-xs text-brand-600/80 sm:text-sm">{product.category}</p>
          )}
        </div>
      </div>

      {horizontalMobile && <div className="border-t border-brand-sand sm:hidden" />}
    </Link>
  );
}

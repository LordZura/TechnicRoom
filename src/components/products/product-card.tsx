'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { CatalogProduct } from '@/lib/supabase/queries';

function ProductPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center rounded-[1rem] bg-brand-50 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-600/75 ring-1 ring-brand-line/80">
      No image
    </div>
  );
}

function getNumericPrice(price: number | string | null) {
  if (price === null || price === '') return null;

  const value = Number(price);
  return Number.isFinite(value) ? value : null;
}

function formatPrice(price: number) {
  return `₾${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(price)}`;
}

export function ProductCard({
  product,
  mobileLayout = 'vertical'
}: {
  product: CatalogProduct;
  mobileLayout?: 'vertical' | 'horizontal';
}) {
  const horizontalMobile = mobileLayout === 'horizontal';
  const numericPrice = getNumericPrice(product.price);

  const indexRef = useRef(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const images = useMemo(() => {
    if (product.images?.length) return product.images;

    if (product.cover_image) {
      return [{ url: product.cover_image, alt: product.cover_alt }];
    }

    return [];
  }, [product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const ratio = x / rect.width;
    const index = Math.min(
      images.length - 1,
      Math.max(0, Math.floor(ratio * images.length))
    );

    if (index !== indexRef.current) {
      indexRef.current = index;

      const next = images[index];
      if (imgRef.current && next) {
        imgRef.current.src = next.url;
      }
    }
  };

  const reset = () => {
    indexRef.current = 0;

    if (imgRef.current && images[0]) {
      imgRef.current.src = images[0].url;
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group block overflow-hidden border border-brand-line bg-brand-cream shadow-soft transition-all duration-300 active:scale-[0.995] hover:border-brand-gold hover:shadow-[0_18px_40px_rgba(145,44,70,0.16)] ${
        horizontalMobile
          ? 'rounded-[1.2rem] sm:rounded-[1.6rem] sm:hover:-translate-y-1.5'
          : 'rounded-[1.35rem] sm:rounded-[1.6rem] sm:hover:-translate-y-1.5'
      }`}
    >
      <div
        className={`${
          horizontalMobile ? 'flex gap-3 p-3 sm:block sm:p-3 sm:pb-0' : 'p-3 pb-0'
        }`}
      >
        {/* IMAGE */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={reset}
          className={`relative overflow-hidden rounded-[1.1rem] ring-1 ring-brand-line/80 shadow-inner ${
            horizontalMobile
              ? 'h-[108px] w-[116px] shrink-0 bg-brand-50 sm:aspect-[4/3] sm:h-auto sm:w-full'
              : 'aspect-[4/3] w-full bg-brand-50'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_55%)]" />

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-espresso/12 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

          {images[0] ? (
            <Image
              ref={imgRef}
              src={images[0].url}
              alt={images[0].alt || product.name || product.model}
              fill
              sizes={
                horizontalMobile
                  ? '(max-width: 640px) 116px, (max-width: 1024px) 50vw, 33vw'
                  : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              }
              className="object-contain p-2.5 transition duration-150"
            />
          ) : (
            <ProductPlaceholder />
          )}
        </div>

        {/* CONTENT */}
        <div
          className={`${
            horizontalMobile
              ? 'min-w-0 flex-1 space-y-1.5 pt-0.5 sm:px-4 sm:pb-5 sm:pt-4'
              : 'space-y-2 px-4 pb-5 pt-4'
          }`}
        >
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
            <p className="line-clamp-1 text-xs text-brand-600/80 sm:text-sm">
              {product.category}
            </p>
          )}

          {numericPrice !== null && (
            <p className="text-sm font-semibold text-brand-brown sm:text-base">
              {formatPrice(numericPrice)}
            </p>
          )}
        </div>
      </div>

      {horizontalMobile && (
        <div className="border-t border-brand-sand sm:hidden" />
      )}
    </Link>
  );
}

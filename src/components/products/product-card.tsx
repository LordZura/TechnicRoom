'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getProductOptionLabel } from '@/lib/product-options';
import type { CatalogProduct } from '@/lib/supabase/queries';
import type { Locale } from '@/types';

function ProductPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center rounded-[1rem] bg-white text-[10px] font-medium uppercase tracking-[0.18em] text-brand-600/75 ring-1 ring-brand-line/80">
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
    maximumFractionDigits: 2,
  }).format(price)}`;
}

export function ProductCard({
  product,
  mobileLayout = 'vertical',
  locale = 'en',
}: {
  product: CatalogProduct;
  mobileLayout?: 'vertical' | 'horizontal';
  locale?: Locale;
}) {
  const horizontalMobile = mobileLayout === 'horizontal';
  const numericPrice = getNumericPrice(product.price);
  const productName =
    locale === 'ka'
      ? product.name_ka || product.name || product.name_en || product.model
      : product.name_en || product.name || product.name_ka || product.model;
  const likeLabel = locale === 'ka' ? 'პროდუქტის მოწონება' : 'Like product';
  const unlikeLabel =
    locale === 'ka' ? 'მოწონების გაუქმება' : 'Unlike product';

  const indexRef = useRef(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const [liked, setLiked] = useState(Boolean(product.viewer_has_liked));
  const [likeCount, setLikeCount] = useState(product.likes_count ?? 0);
  const [likePending, setLikePending] = useState(false);
  const [imageError, setImageError] = useState(false);

  const images = useMemo(() => {
    if (product.images?.length) return product.images;

    if (product.cover_image) {
      return [{ url: product.cover_image, alt: product.cover_alt }];
    }

    return [];
  }, [product]);

  useEffect(() => {
    setLiked(Boolean(product.viewer_has_liked));
    setLikeCount(product.likes_count ?? 0);
  }, [product.id, product.likes_count, product.viewer_has_liked]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const ratio = x / rect.width;
    const index = Math.min(
      images.length - 1,
      Math.max(0, Math.floor(ratio * images.length)),
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

  const toggleLike = async () => {
    if (likePending) return;

    setLikePending(true);

    try {
      const response = await fetch(`/api/products/${product.id}/like`, {
        method: 'POST',
      });

      if (!response.ok) return;

      const data = (await response.json()) as {
        liked?: boolean;
        likeCount?: number;
      };

      setLiked(Boolean(data.liked));
      setLikeCount(Math.max(0, Number(data.likeCount ?? 0)));
    } finally {
      setLikePending(false);
    }
  };

  return (
    <article
      className={`group relative block overflow-hidden border border-brand-line bg-brand-cream shadow-soft transition-all duration-300 active:scale-[0.995] hover:border-brand-gold hover:shadow-[0_18px_40px_rgba(145,44,70,0.16)] ${
        horizontalMobile
          ? 'rounded-[1.2rem] sm:rounded-[1.6rem] sm:hover:-translate-y-1.5'
          : 'rounded-[1.35rem] sm:rounded-[1.6rem] sm:hover:-translate-y-1.5'
      }`}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className={`${
            horizontalMobile
              ? 'flex gap-3 p-3 sm:block sm:p-3 sm:pb-0'
              : 'p-3 pb-0'
          }`}
        >
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            className={`relative overflow-hidden rounded-[1.1rem] bg-white ring-1 ring-brand-line/80 shadow-inner ${
              horizontalMobile
                ? 'h-[108px] w-[116px] shrink-0 sm:aspect-[4/3] sm:h-auto sm:w-full'
                : 'aspect-[4/3] w-full'
            }`}
          >
            {images[0]?.url && !imageError ? (
              <Image
                ref={imgRef}
                src={images[0].url}
                alt={images[0].alt || productName}
                fill
                sizes={
                  horizontalMobile
                    ? '(max-width: 640px) 116px, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 20vw'
                    : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 20vw'
                }
                className="object-contain p-2.5 transition duration-150"
                onError={() => setImageError(true)}
              />
            ) : (
              <ProductPlaceholder />
            )}
          </div>

          <div
            className={`${
              horizontalMobile
                ? 'min-w-0 flex-1 space-y-1.5 pt-0.5 pr-10 sm:px-4 sm:pb-5 sm:pt-4'
                : 'space-y-2 px-4 pb-5 pt-4'
            }`}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-700/75 sm:text-[11px]">
              {product.brand}
            </p>

            <h3 className="line-clamp-2 text-[1rem] font-semibold leading-snug text-brand-espresso transition-colors duration-300 group-hover:text-brand-brown sm:text-[1.05rem]">
              {productName}
            </h3>

            <p className="text-xs text-brand-700/80 sm:text-sm">
              <span className="font-medium text-brand-espresso/90">Model:</span>{' '}
              {product.model}
            </p>

            {product.category && (
              <p className="line-clamp-1 text-xs text-brand-600/80 sm:text-sm">
                {getProductOptionLabel('category', product.category, locale)}
              </p>
            )}

            {numericPrice !== null && (
              <p className="text-sm font-semibold text-brand-brown sm:text-base">
                {formatPrice(numericPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={toggleLike}
        disabled={likePending}
        aria-label={liked ? unlikeLabel : likeLabel}
        aria-pressed={liked}
        className={`absolute right-5 top-5 z-20 inline-flex h-9 items-center justify-center gap-1 rounded-full border border-brand-line bg-white/95 text-brand-brown shadow-sm transition hover:border-brand-brown hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream disabled:pointer-events-none disabled:opacity-60 ${
          likeCount > 0 ? 'min-w-9 px-2.5' : 'w-9 px-0'
        }`}
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-brand-brown' : ''}`} />
        {likeCount > 0 && (
          <span className="min-w-[1ch] text-xs font-semibold leading-none">
            {likeCount}
          </span>
        )}
      </button>

      {horizontalMobile && (
        <div className="border-t border-brand-sand sm:hidden" />
      )}
    </article>
  );
}

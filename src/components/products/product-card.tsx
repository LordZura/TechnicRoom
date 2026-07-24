'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ImageOff } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getProductOptionLabel } from '@/lib/product-options';
import type { CatalogProduct } from '@/lib/supabase/queries';
import type { Locale } from '@/types';

function ProductPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 text-ink-300">
      <ImageOff className="h-5 w-5" strokeWidth={1.6} />
      <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em]">
        No image
      </span>
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
  const unlikeLabel = locale === 'ka' ? 'მოწონების გაუქმება' : 'Unlike product';

  const imgRef = useRef<HTMLImageElement>(null);
  const [activeImage, setActiveImage] = useState(0);
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

  // Sweeping the cursor across the frame scrubs through the gallery.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const index = Math.min(
      images.length - 1,
      Math.max(0, Math.floor(ratio * images.length)),
    );

    if (index !== activeImage) {
      setActiveImage(index);

      const next = images[index];
      if (imgRef.current && next) imgRef.current.src = next.url;
    }
  };

  const reset = () => {
    setActiveImage(0);
    if (imgRef.current && images[0]) imgRef.current.src = images[0].url;
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
      className={`tr-card group relative h-full ${
        horizontalMobile ? 'rounded-[1.35rem] sm:rounded-3xl' : 'rounded-3xl'
      } hover:-translate-y-1 hover:border-wine-200 hover:shadow-lift`}
    >
      {/* Hover sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-gradient-to-b from-wine-50/0 via-wine-50/0 to-wine-50/60 opacity-0 transition-opacity duration-600 ease-smooth group-hover:opacity-100"
      />

      <Link
        href={`/products/${product.slug}`}
        className="relative z-[2] flex h-full flex-col rounded-[inherit]"
      >
        <div
          className={
            horizontalMobile
              ? 'flex flex-1 gap-3.5 p-3 sm:block sm:p-3 sm:pb-0'
              : 'flex flex-1 flex-col p-3 pb-0'
          }
        >
          {/* Image */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            className={`relative shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-ink-50 via-white to-ink-50 ring-1 ring-inset ring-ink-100 ${
              horizontalMobile
                ? 'h-[104px] w-[112px] sm:aspect-[4/3] sm:h-auto sm:w-full'
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
                    : '(max-width: 640px) 90vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                }
                className="object-contain p-3 transition-transform duration-600 ease-smooth group-hover:scale-[1.06]"
                onError={() => setImageError(true)}
              />
            ) : (
              <ProductPlaceholder />
            )}

            {/* Gallery scrub indicator */}
            {images.length > 1 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-2 hidden items-center justify-center gap-1 opacity-0 transition-opacity duration-400 group-hover:opacity-100 sm:flex">
                {images.slice(0, 6).map((image, index) => (
                  <span
                    key={image.url + index}
                    className={`h-1 rounded-full transition-all duration-300 ease-smooth ${
                      index === activeImage
                        ? 'w-4 bg-wine-700'
                        : 'w-1 bg-ink-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div
            className={
              horizontalMobile
                ? 'flex min-w-0 flex-1 flex-col pr-9 pt-0.5 sm:px-4 sm:pb-5 sm:pt-4 sm:pr-4'
                : 'flex flex-1 flex-col px-4 pb-5 pt-4'
            }
          >
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-wine-600">
              {product.brand}
            </p>

            <h3 className="mt-1.5 line-clamp-2 font-display text-[0.975rem] font-bold leading-snug tracking-[-0.015em] text-ink-900 transition-colors duration-300 group-hover:text-wine-800 sm:text-[1.0625rem]">
              {productName}
            </h3>

            <p className="mt-1 truncate text-xs text-ink-500">{product.model}</p>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
              {numericPrice !== null && (
                <span className="inline-flex items-center rounded-full bg-gradient-to-b from-wine-700 to-wine-800 px-3 py-1.5 text-[0.8125rem] font-bold tabular-nums text-white shadow-glow">
                  {formatPrice(numericPrice)}
                </span>
              )}

              {product.category && (
                <span className="inline-flex max-w-full items-center truncate rounded-full bg-ink-100 px-2.5 py-1.5 text-[0.6875rem] font-semibold text-ink-600">
                  {getProductOptionLabel('category', product.category, locale)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Like */}
      <button
        type="button"
        onClick={toggleLike}
        disabled={likePending}
        aria-label={liked ? unlikeLabel : likeLabel}
        aria-pressed={liked}
        className={`absolute right-3.5 top-3.5 z-10 inline-flex h-9 items-center justify-center gap-1 rounded-full border backdrop-blur-md transition-all duration-400 ease-smooth active:scale-90 disabled:pointer-events-none disabled:opacity-60 ${
          likeCount > 0 ? 'min-w-9 px-2.5' : 'w-9 px-0'
        } ${
          liked
            ? 'border-transparent bg-wine-700 text-white shadow-glow'
            : 'border-ink-100 bg-white/85 text-ink-500 hover:border-wine-200 hover:text-wine-700 hover:shadow-soft'
        }`}
      >
        <Heart
          className={`h-[0.9375rem] w-[0.9375rem] transition-transform duration-400 ease-spring ${
            liked ? 'scale-110 fill-current' : ''
          }`}
        />
        {likeCount > 0 && (
          <span className="min-w-[1ch] text-[0.6875rem] font-bold leading-none tabular-nums">
            {likeCount}
          </span>
        )}
      </button>
    </article>
  );
}

'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageOff, Maximize2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Locale, ProductImage } from '@/types';
import { getDictionary } from '@/lib/i18n/dictionaries';

export function ProductGallery({
  images,
  fallbackAlt,
  locale,
}: {
  images: ProductImage[];
  fallbackAlt: string;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const sorted = useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return a.id.localeCompare(b.id);
      }),
    [images],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [failedPaths, setFailedPaths] = useState<Set<string>>(new Set());

  const markFailed = (path: string) =>
    setFailedPaths((prev) => (prev.has(path) ? prev : new Set([...prev, path])));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [sorted]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % sorted.length);
      } else if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + sorted.length) % sorted.length);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, sorted.length]);

  if (!sorted.length) {
    return (
      <div className="tr-card flex aspect-[4/3] flex-col items-center justify-center gap-3 text-ink-300">
        <ImageOff className="h-8 w-8" strokeWidth={1.4} />
        <span className="text-xs font-semibold uppercase tracking-[0.16em]">
          {t.product.noImage}
        </span>
      </div>
    );
  }

  const activeImage = sorted[activeIndex];
  const multiple = sorted.length > 1;

  const goTo = (index: number) => setActiveIndex(index);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % sorted.length);
  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + sorted.length) % sorted.length);

  const lightbox =
    lightboxOpen && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[99999] animate-fade-in">
            <div
              className="absolute inset-0 bg-ink-900/[0.92] backdrop-blur-md"
              onClick={() => setLightboxOpen(false)}
            />

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-3 top-3 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 ease-smooth hover:bg-white/20 active:scale-95 sm:right-5 sm:top-5"
              aria-label={t.product.closeGallery}
            >
              <X className="h-5 w-5" />
            </button>

            {multiple && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-2 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 ease-smooth hover:bg-white/20 active:scale-95 sm:left-5"
                  aria-label={t.product.previousImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-2 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 ease-smooth hover:bg-white/20 active:scale-95 sm:right-5"
                  aria-label={t.product.nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div
              className="relative z-20 flex h-[100dvh] w-screen items-center justify-center px-4 pb-28 pt-16 sm:px-16 sm:pb-32 sm:pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full animate-scale-in">
                <Image
                  key={activeImage.storage_path + '-fullscreen'}
                  src={activeImage.storage_path}
                  alt={activeImage.alt || fallbackAlt}
                  fill
                  className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                  sizes="100vw"
                  priority
                  onError={() => markFailed(activeImage.storage_path)}
                />
              </div>
            </div>

            {multiple && (
              <>
                <div className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tabular-nums text-white backdrop-blur-md">
                  {activeIndex + 1} / {sorted.length}
                </div>

                <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-5 pt-4">
                  <div className="mx-auto flex max-w-3xl items-center justify-start gap-2 overflow-x-auto pb-1 no-scrollbar sm:justify-center">
                    {sorted.map((image, index) => {
                      const isActive = activeIndex === index;

                      return (
                        <button
                          key={image.id + '-lightbox-thumb'}
                          type="button"
                          onClick={() => goTo(index)}
                          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-white/5 transition-all duration-400 ease-smooth sm:h-16 sm:w-16 ${
                            isActive
                              ? 'border-white opacity-100'
                              : 'border-white/15 opacity-55 hover:opacity-90'
                          }`}
                          aria-label={`${t.product.viewImage} ${index + 1}`}
                        >
                          <Image
                            src={image.storage_path}
                            alt={image.alt || fallbackAlt}
                            fill
                            sizes="64px"
                            className="object-cover"
                            onError={() => markFailed(image.storage_path)}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="space-y-3">
        <div className="group relative">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-50 via-white to-ink-50 shadow-card transition-shadow duration-500 ease-smooth hover:shadow-lift"
            aria-label={t.product.tapToZoom}
          >
            {failedPaths.has(activeImage.storage_path) ? (
              <span className="flex h-full flex-col items-center justify-center gap-2 text-ink-300">
                <ImageOff className="h-7 w-7" strokeWidth={1.4} />
                <span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em]">
                  {t.product.noImage}
                </span>
              </span>
            ) : (
              <Image
                key={activeImage.storage_path}
                src={activeImage.storage_path}
                alt={activeImage.alt || fallbackAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
                className="animate-fade-in object-contain p-5 transition-transform duration-700 ease-smooth group-hover:scale-[1.04] sm:p-8"
                onError={() => markFailed(activeImage.storage_path)}
              />
            )}

            <span className="pointer-events-none absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white/90 px-3 py-1.5 text-[0.6875rem] font-semibold text-ink-600 shadow-soft backdrop-blur transition-all duration-400 ease-smooth group-hover:border-wine-200 group-hover:text-wine-700 sm:bottom-4 sm:right-4">
              <Maximize2 className="h-3.5 w-3.5" />
              {t.product.tapToZoom}
            </span>
          </button>

          {multiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label={t.product.previousImage}
                className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-ink-100 bg-white/90 text-ink-700 opacity-0 shadow-soft backdrop-blur transition-all duration-400 ease-smooth hover:text-wine-700 group-hover:opacity-100 active:scale-90 md:grid"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label={t.product.nextImage}
                className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-ink-100 bg-white/90 text-ink-700 opacity-0 shadow-soft backdrop-blur transition-all duration-400 ease-smooth hover:text-wine-700 group-hover:opacity-100 active:scale-90 md:grid"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {multiple && (
          <div className="-mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
            {sorted.map((image, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${t.product.viewImage} ${index + 1}`}
                  className={`relative aspect-square w-[4.5rem] shrink-0 snap-start overflow-hidden rounded-2xl border bg-white transition-all duration-400 ease-smooth sm:w-auto ${
                    isActive
                      ? 'border-wine-700 shadow-glow'
                      : 'border-ink-100 hover:-translate-y-0.5 hover:border-wine-200 hover:shadow-soft'
                  }`}
                >
                  <Image
                    src={image.storage_path}
                    alt={image.alt || fallbackAlt}
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                    onError={() => markFailed(image.storage_path)}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightbox}
    </>
  );
}

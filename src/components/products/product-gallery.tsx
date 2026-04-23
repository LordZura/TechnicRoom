'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ProductImage } from '@/types';

export function ProductGallery({
  images,
  fallbackAlt
}: {
  images: ProductImage[];
  fallbackAlt: string;
}) {
  const sorted = useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return a.id.localeCompare(b.id);
      }),
    [images]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      <div className="rounded-2xl border border-brand-line bg-brand-ivory p-10 text-center text-brand-700/75 shadow-soft sm:p-12">
        No image
      </div>
    );
  }

  const activeImage = sorted[activeIndex];

  function goTo(index: number) {
    setActiveIndex(index);
  }

  function goNext() {
    setActiveIndex((prev) => (prev + 1) % sorted.length);
  }

  function goPrev() {
    setActiveIndex((prev) => (prev - 1 + sorted.length) % sorted.length);
  }

  const lightbox =
    lightboxOpen && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[99999]">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
              onClick={() => setLightboxOpen(false)}
            />

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-3 top-4 z-30 rounded-full bg-white/12 px-4 py-2 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:right-4"
              aria-label="Close gallery"
            >
              ✕
            </button>

            {sorted.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/12 px-3 py-2.5 text-3xl text-white backdrop-blur transition hover:bg-white/20 sm:left-3 sm:px-4 sm:py-3"
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/12 px-3 py-2.5 text-3xl text-white backdrop-blur transition hover:bg-white/20 sm:right-3 sm:px-4 sm:py-3"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            <div
              className="relative z-20 flex h-screen w-screen items-center justify-center px-4 pb-24 pt-16 sm:px-8 sm:pb-28 sm:pt-24"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full">
                <Image
                  key={activeImage.storage_path + '-fullscreen'}
                  src={activeImage.storage_path}
                  alt={activeImage.alt || fallbackAlt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>

            {sorted.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/45 px-4 py-4 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-start gap-2 overflow-x-auto pb-1 no-scrollbar sm:justify-center">
                  {sorted.map((image, index) => {
                    const isActive = activeIndex === index;

                    return (
                      <button
                        key={image.id + '-lightbox-thumb'}
                        type="button"
                        onClick={() => goTo(index)}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-20 sm:w-20 ${
                          isActive
                            ? 'border-brand-gold ring-2 ring-brand-gold/40'
                            : 'border-white/20 hover:border-white/50'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <Image
                          src={image.storage_path}
                          alt={image.alt || fallbackAlt}
                          fill
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {sorted.length > 1 && (
              <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-xs text-white backdrop-blur sm:top-5 sm:text-sm">
                {activeIndex + 1} / {sorted.length}
              </div>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-brand-line bg-brand-ivory shadow-soft sm:rounded-3xl"
        >
          <Image
            key={activeImage.storage_path}
            src={activeImage.storage_path}
            alt={activeImage.alt || fallbackAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/20 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

          <div className="absolute bottom-2.5 right-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-brand-800 shadow-sm transition group-hover:bg-white sm:bottom-3 sm:right-3 sm:px-3 sm:text-xs">
            Tap to zoom
          </div>
        </button>

        <div className="-mx-1.5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1.5 pb-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-2 sm:overflow-visible sm:px-0">
          {sorted.map((image, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => goTo(index)}
                className={`relative aspect-square w-20 shrink-0 snap-start overflow-hidden rounded-xl border bg-brand-ivory transition-all duration-300 sm:w-auto ${
                  isActive
                    ? 'border-brand-brown ring-2 ring-brand-gold/35'
                    : 'border-brand-line hover:-translate-y-0.5 hover:border-brand-gold'
                }`}
              >
                <Image
                  src={image.storage_path}
                  alt={image.alt || fallbackAlt}
                  fill
                  className="object-cover transition duration-300 hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      </div>

      {lightbox}
    </>
  );
}

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
      <div className="rounded-2xl border border-[#D8C1A8] bg-[#FFF8F1] p-12 text-center text-[#7f6956] shadow-[0_8px_24px_rgba(58,36,24,0.05)]">
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
              className="absolute right-4 top-4 z-30 rounded-full bg-white/10 px-4 py-2 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/20"
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
                  className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-3xl text-white backdrop-blur transition hover:bg-white/20"
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
                  className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-3xl text-white backdrop-blur transition hover:bg-white/20"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            <div
              className="relative z-20 flex h-screen w-screen items-center justify-center px-4 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-24"
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
                <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 overflow-x-auto pb-1">
                  {sorted.map((image, index) => {
                    const isActive = activeIndex === index;

                    return (
                      <button
                        key={image.id + '-lightbox-thumb'}
                        type="button"
                        onClick={() => goTo(index)}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-20 sm:w-20 ${
                          isActive
                            ? 'border-[#C89A5A] ring-2 ring-[#C89A5A]/40'
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
              <div className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-sm text-white backdrop-blur">
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
          className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-[#D8C1A8] bg-[#FFF8F1] shadow-[0_8px_24px_rgba(58,36,24,0.06)]"
        >
          <Image
            key={activeImage.storage_path}
            src={activeImage.storage_path}
            alt={activeImage.alt || fallbackAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#3A2418]/18 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

          <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#5b3a23] shadow-sm transition group-hover:bg-white">
            View
          </div>
        </button>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {sorted.map((image, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => goTo(index)}
                className={`relative aspect-square overflow-hidden rounded-xl border bg-[#FFF8F1] transition-all duration-300 ${
                  isActive
                    ? 'border-[#7A4E2E] ring-2 ring-[#C89A5A]/35'
                    : 'border-[#D8C1A8] hover:-translate-y-0.5 hover:border-[#C89A5A]'
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
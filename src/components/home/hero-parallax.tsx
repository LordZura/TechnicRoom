"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic hero backdrop: a slow parallax drift on the photograph plus the
 * layered scrims that keep headline text legible over it.
 */
export function HeroParallax() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const node = imgRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let currentY = 0;
    let currentScale = 1.08;

    // The loop parks itself once the image has caught up with the scroll
    // position, so an idle page costs nothing.
    const update = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;

      const targetY = Math.min(scrollY * (isMobile ? 0.28 : 0.22), isMobile ? 120 : 180);
      const targetScale =
        1.08 + Math.min(scrollY * 0.00014, isMobile ? 0.08 : 0.06);

      const ease = 0.12;
      currentY += (targetY - currentY) * ease;
      currentScale += (targetScale - currentScale) * ease;

      const settled =
        Math.abs(targetY - currentY) < 0.15 &&
        Math.abs(targetScale - currentScale) < 0.0005;

      if (settled) {
        currentY = targetY;
        currentScale = targetScale;
      }

      node.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) scale(${currentScale.toFixed(4)})`;

      raf = settled ? 0 : requestAnimationFrame(update);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover object-[58%_35%] sm:object-[50%_30%] lg:object-[50%_38%]"
        style={{
          transform: "translate3d(0,0,0) scale(1.08)",
          transformOrigin: "center center",
          willChange: "transform",
          filter: "saturate(1.05) contrast(1.02)",
        }}
      />

      {/* Readability scrim — heaviest on the left, where the copy sits, and
          fading out to the right so the photograph stays visible. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/[0.88] via-ink-900/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/75 via-transparent to-ink-900/30" />

      {/* Brand wash. */}
      <div className="absolute inset-0 bg-gradient-to-br from-wine-950/40 via-transparent to-wine-800/15 mix-blend-multiply" />

      {/* Ambient blooms. */}
      <div className="absolute -right-24 top-4 h-72 w-72 animate-drift rounded-full bg-wine-500/20 blur-[90px]" />
      <div className="absolute -left-28 bottom-0 h-80 w-80 animate-drift-slow rounded-full bg-sea-500/[0.18] blur-[100px]" />

      {/* Film grain. */}
      <div className="tr-grain absolute inset-0 opacity-[0.055] mix-blend-overlay" />

      {/* Hairline that seats the hero against the page below it. The hero ends
          on a crisp edge — a light fade here would wash out the trust strip. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
    </div>
  );
}

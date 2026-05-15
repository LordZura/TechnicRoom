"use client";

import { useEffect, useRef } from "react";

export function HeroParallax() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;
    let currentY = 0;
    let currentScale = 1.02;

    const update = () => {
      const scrollY = window.scrollY;

      const targetY = Math.min(scrollY * 0.18, 90);
      const targetScale = 1.02 + Math.min(scrollY * 0.00012, 0.06);

      // smoothing factor:
      // smaller = smoother/slower
      // larger = snappier/faster
      const ease = 0.50;

      currentY += (targetY - currentY) * ease;
      currentScale += (targetScale - currentScale) * ease;

      if (imgRef.current) {
        imgRef.current.style.transform = `translate3d(0, ${currentY}px, 0) scale(${currentScale})`;
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        ref={imgRef}
        src="/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        className="
          h-full w-full object-cover object-top
          sm:object-[50%_5%]
          lg:object-[50%_10%]
          xl:object-[50%_15%]
        "
        style={{
          transform: "translate3d(0, 0px, 0) scale(1.02)",
          transformOrigin: "center top",
          willChange: "transform",
        }}
      />
    </div>
  );
}
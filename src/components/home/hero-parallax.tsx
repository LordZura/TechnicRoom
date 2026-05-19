"use client";

import { useEffect, useRef } from "react";

export function HeroParallax() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;

    let currentY = 0;
    let currentScale = 1.03;
    let currentBrightness = 0.92;

    const update = () => {
      const scrollY = window.scrollY;

      const isMobile = window.innerWidth < 768;

      // MOVEMENT
      const targetY = Math.min(
        scrollY * (isMobile ? 0.5 : 0.3),
        isMobile ? 200 : 160,
      );

      // SCALE
      const targetScale =
        1.03 +
        Math.min(
          scrollY * (isMobile ? 0.00022 : 0.00012),
          isMobile ? 0.1 : 0.065,
        );

      // BRIGHTNESS
      const targetBrightness = Math.max(
        isMobile ? 0.82 : 0.86,
        0.96 - scrollY * 0.00022,
      );

      // SMOOTHING
      const ease = isMobile ? 1 : 0.67;

      currentY += (targetY - currentY) * ease;
      currentScale += (targetScale - currentScale) * ease;
      currentBrightness +=
        (targetBrightness - currentBrightness) * ease;

      if (imgRef.current) {
        imgRef.current.style.transform = `
          translate3d(0, ${currentY}px, 0)
          scale(${currentScale})
        `;

        imgRef.current.style.filter = `
          brightness(${currentBrightness})
          blur(${scrollY > 40 ? 0.3 : 0}px)
        `;
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
          xl:object-[50%_25%]
        "
        style={{
          transform: "translate3d(0,0,0) scale(1.03)",
          transformOrigin: "center top",
          willChange: "transform, filter",
          filter: "brightness(0.92)",
        }}
      />
    </div>
  );
}
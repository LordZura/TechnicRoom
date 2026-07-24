'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type RevealVariant = 'up' | 'fade' | 'left' | 'right' | 'scale';

const HIDDEN: Record<RevealVariant, string> = {
  up: 'translate-y-6 opacity-0',
  fade: 'opacity-0',
  left: '-translate-x-6 opacity-0',
  right: 'translate-x-6 opacity-0',
  scale: 'scale-[0.97] opacity-0',
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  as?: 'div' | 'section' | 'article' | 'li';
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Anything already on screen (or above it) shows immediately — avoids a
    // blank first paint when the browser restores scroll position.
    if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-[transform,opacity] duration-[750ms] ease-smooth will-change-[transform,opacity]',
        visible ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : HIDDEN[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

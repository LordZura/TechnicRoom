'use client';

import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';

export function ShareButton({
  label,
  copiedLabel,
  className = '',
  iconOnly = false,
}: {
  label: string;
  copiedLabel: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: window.location.href, title: document.title });
        return;
      } catch {
        // fall back to clipboard below
      }
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      className={`tr-btn-ghost ${copied ? '!border-sea-300 !text-sea-600' : ''} ${
        iconOnly ? 'w-11 px-0' : ''
      } ${className}`}
    >
      <span className="relative grid h-4 w-4 place-items-center">
        <Share2
          className={`absolute h-4 w-4 transition-all duration-400 ease-spring ${
            copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}
        />
        <Check
          className={`absolute h-4 w-4 transition-all duration-400 ease-spring ${
            copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          strokeWidth={3}
        />
      </span>
      {!iconOnly && (copied ? copiedLabel : label)}
    </button>
  );
}

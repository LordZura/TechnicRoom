'use client';

import { Check, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

export function ShareButton({ label, copiedLabel }: { label: string; copiedLabel: string }) {
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
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button type="button" onClick={onShare} className="tr-btn-ghost inline-flex items-center gap-2 transition hover:-translate-y-0.5">
      {copied ? <Check className="h-4 w-4 text-emerald-700" /> : <LinkIcon className="h-4 w-4" />}
      {copied ? copiedLabel : label}
    </button>
  );
}

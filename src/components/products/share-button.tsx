'use client';

import { useState } from 'react';

export function ShareButton({ label, copiedLabel }: { label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

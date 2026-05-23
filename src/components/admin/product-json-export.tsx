'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ProductJsonExport() {
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const downloadAll = async () => {
    setError('');
    setDownloading(true);

    try {
      const res = await fetch('/api/admin/products/export');
      const payload = await res.json();

      if (!res.ok) {
        setError(payload.error || 'Failed to export products.');
        return;
      }

      downloadJson('technic-room-products.json', payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export products.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="tr-surface flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
      <div>
        <h3 className="text-lg font-semibold">JSON Product Export</h3>
        <p className="tr-muted mt-1 text-sm">Download all products as JSON. Images are not included.</p>
      </div>
      <button
        type="button"
        onClick={downloadAll}
        disabled={downloading}
        className="tr-btn-primary inline-flex items-center gap-2 disabled:opacity-40"
      >
        <Download className="h-4 w-4" />
        {downloading ? 'Downloading...' : 'Download All JSON'}
      </button>
      {error && <p className="basis-full text-sm text-red-700">{error}</p>}
    </section>
  );
}

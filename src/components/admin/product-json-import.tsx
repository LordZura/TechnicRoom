'use client';

import { Upload } from 'lucide-react';
import { useState } from 'react';

type ImportResponse = {
  total?: number;
  imported?: number;
  failed?: number;
  partial?: boolean;
  results?: Array<{ index: number; slug: string }>;
  errors?: Array<{ index: number; error: string }>;
  error?: string;
};

function readJsonFile(file: File) {
  return new Promise<unknown>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result || '')));
      } catch {
        reject(new Error('The selected file is not valid JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read the selected file.'));
    reader.readAsText(file);
  });
}

export function ProductJsonImport({ onImported }: { onImported?: () => Promise<void> | void }) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [details, setDetails] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const importJson = async () => {
    if (!file) return;

    setUploading(true);
    setMessage('');
    setError('');
    setWarning('');
    setDetails([]);

    try {
      const json = await readJsonFile(file);
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      });
      const payload = (await res.json()) as ImportResponse;
      const resultDetails = [
        ...(payload.results || []).map((item) => `Created product #${item.index + 1}: /products/${item.slug}`),
        ...(payload.errors || []).map((item) => `Failed product #${item.index + 1}: ${item.error}`)
      ];

      if (!res.ok) {
        setError(payload.error || `Imported ${payload.imported || 0}, failed ${payload.failed || 0}.`);
        setDetails(resultDetails);
        return;
      }

      if (payload.partial) {
        setWarning(`Imported ${payload.imported || 0} of ${payload.total || 0} products. ${payload.failed || 0} failed.`);
      } else {
        setMessage(`Imported ${payload.imported || 0} product${payload.imported === 1 ? '' : 's'}.`);
      }

      setDetails(resultDetails);
      setFile(null);
      await onImported?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="tr-surface space-y-3 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">JSON Product Import</h3>
          <p className="tr-muted mt-1 text-sm">Upload one product, a raw array, or a file with a products array. Images can be added later.</p>
        </div>
        <a href="/PRODUCT_JSON_IMPORT.md" className="text-sm font-medium text-brand-brown underline-offset-4 hover:underline">
          JSON guide
        </a>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <input
          type="file"
          accept="application/json,.json"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="tr-input text-sm"
        />
        <button
          type="button"
          disabled={!file || uploading}
          onClick={importJson}
          className="tr-btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Importing...' : 'Import JSON'}
        </button>
      </div>

      {message && <p className="animate-fade-in text-sm text-emerald-700">{message}</p>}
      {warning && <p className="animate-fade-in text-sm text-amber-700">{warning}</p>}
      {error && <p className="animate-fade-in text-sm text-red-700">{error}</p>}
      {details.length > 0 && (
        <ul className="space-y-1 text-xs text-brand-700/85">
          {details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

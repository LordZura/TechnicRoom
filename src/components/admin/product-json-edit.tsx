'use client';

import { FilePenLine, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

type EditResponse = {
  total?: number;
  edited?: number;
  failed?: number;
  partial?: boolean;
  results?: Array<{ index: number; slug: string }>;
  errors?: Array<{ index: number; error: string }>;
  error?: string;
};

function readJsonFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      try {
        JSON.parse(text);
        resolve(text);
      } catch {
        reject(new Error('The selected file is not valid JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read the selected file.'));
    reader.readAsText(file);
  });
}

export function ProductJsonEdit({
  initialText,
  onEdited
}: {
  initialText?: string;
  onEdited?: () => Promise<void> | void;
}) {
  const [text, setText] = useState(initialText || '');
  const [message, setMessage] = useState('');
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');
  const [details, setDetails] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialText) setText(initialText);
  }, [initialText]);

  const loadFile = async (file: File | null) => {
    if (!file) return;

    setMessage('');
    setWarning('');
    setError('');
    setDetails([]);

    try {
      setText(await readJsonFile(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load JSON file.');
    }
  };

  const editProducts = async () => {
    setMessage('');
    setWarning('');
    setError('');
    setDetails([]);

    let json: unknown;

    try {
      json = JSON.parse(text);
    } catch {
      setError('The editor content is not valid JSON.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/products/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      });
      const payload = (await res.json()) as EditResponse;
      const resultDetails = [
        ...(payload.results || []).map((item) => `Edited product #${item.index + 1}: /products/${item.slug}`),
        ...(payload.errors || []).map((item) => `Failed product #${item.index + 1}: ${item.error}`)
      ];

      if (!res.ok) {
        setError(payload.error || `Edited ${payload.edited || 0}, failed ${payload.failed || 0}.`);
        setDetails(resultDetails);
        return;
      }

      if (payload.partial) {
        setWarning(`Edited ${payload.edited || 0} of ${payload.total || 0} products. ${payload.failed || 0} failed.`);
      } else {
        setMessage(`Edited ${payload.edited || 0} product${payload.edited === 1 ? '' : 's'}.`);
      }

      setDetails(resultDetails);
      await onEdited?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON edit failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="tr-surface space-y-3 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">JSON Product Edit</h3>
          <p className="tr-muted mt-1 text-sm">Edit existing products by JSON. Requires an existing id, slug, or current_slug.</p>
        </div>
        <a href="/PRODUCT_JSON_EDIT.md" className="text-sm font-medium text-brand-brown underline-offset-4 hover:underline">
          Edit guide
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <input
          type="file"
          accept="application/json,.json"
          onChange={(event) => loadFile(event.target.files?.[0] ?? null)}
          className="tr-input text-sm"
        />
        <button
          type="button"
          onClick={editProducts}
          disabled={!text.trim() || submitting}
          className="tr-btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <FilePenLine className="h-4 w-4" />
          {submitting ? 'Editing...' : 'Apply JSON Edit'}
        </button>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        spellCheck={false}
        placeholder="Paste exported product JSON here, edit it, then apply."
        className="tr-input min-h-72 font-mono text-xs leading-5"
      />

      <button
        type="button"
        onClick={() => setText('')}
        className="tr-btn-ghost inline-flex items-center gap-2"
      >
        <Upload className="h-4 w-4 rotate-45" />
        Clear Editor
      </button>

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

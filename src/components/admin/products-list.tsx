'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Download, FilePenLine } from 'lucide-react';

type AdminProduct = {
  id: string;
  model: string;
  slug: string;
  brand: string;
  is_active: boolean;
};

export function ProductsList({
  initialProducts,
  onEdit,
  onEditJson,
  editingId
}: {
  initialProducts: AdminProduct[];
  onEdit?: (productId: string) => void;
  onEditJson?: (json: string) => void;
  editingId?: string;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [exportingId, setExportingId] = useState('');
  const router = useRouter();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  async function onDelete(productId: string) {
    setDeletingId(productId);
    setMessage('');
    setError('');

    const res = await fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' });
    const payload = await res.json();

    if (!res.ok) {
      setError(payload.error || 'Failed to delete product');
      setDeletingId('');
      return;
    }

    setProducts((prev) => prev.filter((item) => item.id !== productId));
    setMessage(payload.warning || payload.message || 'Product deleted');
    setDeletingId('');
    router.refresh();
  }

  async function fetchProductJson(productId: string) {
    const res = await fetch(`/api/admin/products/export?id=${productId}`);
    const payload = await res.json();

    if (!res.ok) {
      throw new Error(payload.error || 'Failed to export product JSON');
    }

    return payload;
  }

  function downloadJson(filename: string, data: unknown) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyJson(product: AdminProduct) {
    setExportingId(product.id);
    setMessage('');
    setError('');

    try {
      const json = await fetchProductJson(product.id);
      await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
      setMessage(`Copied JSON for ${product.model}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy product JSON');
    } finally {
      setExportingId('');
    }
  }

  async function downloadProductJson(product: AdminProduct) {
    setExportingId(product.id);
    setMessage('');
    setError('');

    try {
      const json = await fetchProductJson(product.id);
      downloadJson(`${product.slug || product.model}.json`, json);
      setMessage(`Downloaded JSON for ${product.model}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download product JSON');
    } finally {
      setExportingId('');
    }
  }

  async function loadProductJsonForEdit(product: AdminProduct) {
    setExportingId(product.id);
    setMessage('');
    setError('');

    try {
      const json = await fetchProductJson(product.id);
      onEditJson?.(JSON.stringify(json, null, 2));
      setMessage(`Loaded JSON editor for ${product.model}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product JSON');
    } finally {
      setExportingId('');
    }
  }

  return (
    <section className="tr-surface p-4 sm:p-6">
      <h2 className="mb-3 text-lg font-semibold sm:text-xl">Existing products</h2>
      <ul className="space-y-2 text-sm">
        {products.map((product) => (
          <li key={product.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-line bg-brand-cream px-3 py-2">
            <span className="min-w-0 text-brand-700/85">
              <span className="block break-all font-medium text-brand-espresso">{product.model}</span>
              <span className="block break-all text-xs">
                {product.brand} · {product.slug} · {product.is_active ? 'Active' : 'Hidden'}
              </span>
            </span>
            <span className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copyJson(product)}
                disabled={exportingId === product.id}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-brand-line bg-brand-ivory px-3 py-1.5 text-brand-espresso transition hover:border-brand-brown hover:bg-brand-cream disabled:opacity-50"
                title="Copy product JSON"
              >
                <Copy className="h-4 w-4" />
                Copy JSON
              </button>
              <button
                type="button"
                onClick={() => downloadProductJson(product)}
                disabled={exportingId === product.id}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-brand-line bg-brand-ivory px-3 py-1.5 text-brand-espresso transition hover:border-brand-brown hover:bg-brand-cream disabled:opacity-50"
                title="Download product JSON"
              >
                <Download className="h-4 w-4" />
                JSON
              </button>
              <button
                type="button"
                onClick={() => loadProductJsonForEdit(product)}
                disabled={exportingId === product.id}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-brand-line bg-brand-ivory px-3 py-1.5 text-brand-espresso transition hover:border-brand-brown hover:bg-brand-cream disabled:opacity-50"
                title="Load product JSON in editor"
              >
                <FilePenLine className="h-4 w-4" />
                Edit JSON
              </button>
              <button
                type="button"
                onClick={() => onEdit?.(product.id)}
                disabled={editingId === product.id}
                className="min-h-10 rounded-lg border border-brand-line bg-brand-ivory px-3 py-1.5 text-brand-espresso transition hover:border-brand-brown hover:bg-brand-cream disabled:opacity-50"
              >
                {editingId === product.id ? 'Editing' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => onDelete(product.id)}
                disabled={deletingId === product.id}
                className="min-h-10 rounded-lg border border-red-300 px-3 py-1.5 text-red-700 disabled:opacity-40"
              >
                {deletingId === product.id ? 'Deleting...' : 'Delete'}
              </button>
            </span>
          </li>
        ))}
      </ul>
      {message && <p className="mt-3 text-xs text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-xs text-red-700">{error}</p>}
    </section>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AdminProduct = {
  id: string;
  model: string;
  slug: string;
};

export function ProductsList({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const router = useRouter();

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

  return (
    <section className="tr-surface p-4 sm:p-6">
      <h2 className="mb-3 text-lg font-semibold sm:text-xl">Existing products</h2>
      <ul className="space-y-2 text-sm">
        {products.map((product) => (
          <li key={product.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-line bg-brand-cream px-3 py-2">
            <span className="break-all text-brand-700/85">
              {product.model} ({product.slug})
            </span>
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              disabled={deletingId === product.id}
              className="min-h-10 rounded-lg border border-red-300 px-3 py-1.5 text-red-700 disabled:opacity-40"
            >
              {deletingId === product.id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      {message && <p className="mt-3 text-xs text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-xs text-red-700">{error}</p>}
    </section>
  );
}

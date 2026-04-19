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
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-3 text-lg font-semibold">Existing products</h2>
      <ul className="space-y-2 text-sm">
        {products.map((product) => (
          <li key={product.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2">
            <span>
              {product.model} ({product.slug})
            </span>
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              disabled={deletingId === product.id}
              className="text-red-600 disabled:opacity-40"
            >
              {deletingId === product.id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      {message && <p className="mt-3 text-xs text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </section>
  );
}

'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ProductForm } from './product-form';

type AdminImage = {
  id: string;
  storage_path: string;
  is_primary: boolean;
  sort_order: number;
};

type AdminProduct = {
  id: string;
  model: string;
  slug: string;
  brand: string;
  images: AdminImage[];
};

export function AdminProductsManager({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0]?.id || '');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId),
    [products, selectedProductId]
  );

  const refreshImages = (productId: string, images: AdminImage[]) => {
    setProducts((prev) => prev.map((item) => (item.id === productId ? { ...item, images } : item)));
  };

  const handleDeleteProduct = async (productId: string) => {
    setMessage('');
    const res = await fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' });
    const json = await res.json();

    if (!res.ok) {
      setMessage(json.error || 'Failed to delete product.');
      return;
    }

    const remaining = products.filter((p) => p.id !== productId);
    setProducts(remaining);
    if (selectedProductId === productId) setSelectedProductId(remaining[0]?.id || '');
    setMessage('Product deleted successfully.');
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || !selectedProductId) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('productId', selectedProductId);
    Array.from(files).forEach((file) => formData.append('files', file));

    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const json = await res.json();
    setUploading(false);

    if (!res.ok) {
      setMessage(json.error || 'Upload failed.');
      return;
    }

    const images = [...(selectedProduct?.images || []), ...json.images].sort((a, b) => a.sort_order - b.sort_order);
    refreshImages(selectedProductId, images);
    setMessage('Image upload completed.');
  };

  const setCover = async (imageId: string) => {
    if (!selectedProductId) return;
    setMessage('');

    const res = await fetch('/api/admin/upload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: selectedProductId, imageId })
    });

    const json = await res.json();
    if (!res.ok) {
      setMessage(json.error || 'Failed to set cover image.');
      return;
    }

    const images = (selectedProduct?.images || []).map((image) => ({ ...image, is_primary: image.id === imageId }));
    refreshImages(selectedProductId, images);
    setMessage('Cover image updated.');
  };

  const deleteImage = async (imageId: string) => {
    setMessage('');
    const res = await fetch(`/api/admin/upload?imageId=${imageId}`, { method: 'DELETE' });
    const json = await res.json();

    if (!res.ok) {
      setMessage(json.error || 'Failed to remove image.');
      return;
    }

    const images = (selectedProduct?.images || []).filter((image) => image.id !== imageId);
    refreshImages(selectedProductId, images);
    setMessage('Image removed.');
  };

  const onSavedProduct = (product: { id: string; slug: string; model: string; brand: string }) => {
    if (!products.some((item) => item.id === product.id)) {
      setProducts((prev) => [{ ...product, images: [] }, ...prev]);
    } else {
      setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, ...product } : item)));
    }
    setSelectedProductId(product.id);
  };

  return (
    <div className="space-y-6">
      <ProductForm onSaved={onSavedProduct} />

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Manage product images & deletion</h2>
        <p className="mt-1 text-sm text-slate-500">Upload multiple images, pick a cover image, or delete products.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
              className={`rounded-lg border p-3 text-left ${product.id === selectedProductId ? 'border-brand-700 bg-brand-50' : 'border-slate-200'}`}
            >
              <p className="text-xs uppercase text-slate-500">{product.brand}</p>
              <p className="font-semibold">{product.model}</p>
              <p className="text-xs text-slate-500">{product.slug}</p>
            </button>
          ))}
        </div>

        {selectedProduct && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                multiple
                onChange={(event) => handleUpload(event.target.files)}
                className="max-w-xs text-sm"
              />
              <button
                onClick={() => handleDeleteProduct(selectedProduct.id)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700"
              >
                Delete product
              </button>
              {uploading && <span className="text-sm text-slate-500">Uploading...</span>}
            </div>

            {selectedProduct.images.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">No images uploaded yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {selectedProduct.images.map((image) => (
                  <div key={image.id} className="space-y-2 rounded-lg border border-slate-200 p-2">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-slate-100">
                      <Image src={image.storage_path} alt="Product image" fill className="object-cover" />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button onClick={() => setCover(image.id)} className="text-xs text-brand-700">
                        {image.is_primary ? 'Cover image' : 'Set as cover'}
                      </button>
                      <button onClick={() => deleteImage(image.id)} className="text-xs text-red-600">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
      </section>
    </div>
  );
}

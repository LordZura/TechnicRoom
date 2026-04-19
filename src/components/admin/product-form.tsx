'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductFormInput, productSchema } from '@/lib/validation/product';
import { ProductImage } from '@/types';

const baseDefaults: ProductFormInput = {
  slug: '',
  model: '',
  brand: '',
  category: '',
  price: null,
  recommended_area: '',
  cooling_power: '',
  heating_power: '',
  cooling_consumption: '',
  heating_consumption: '',
  eer_cop: '',
  freon_type_amount: '',
  operating_temperature: '',
  indoor_unit_size: '',
  indoor_unit_weight: '',
  outdoor_unit_size: '',
  outdoor_unit_weight: '',
  noise_level: '',
  pipe_size: '',
  is_active: true,
  translations: [
    { locale: 'en', name: '', description: '', features: '' },
    { locale: 'ka', name: '', description: '', features: '' }
  ]
};

export function ProductForm({ initialData, onSaved }: { initialData?: Partial<ProductFormInput>; onSaved?: () => Promise<void> | void }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [productId, setProductId] = useState(initialData?.id || '');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...baseDefaults, ...initialData }
  });

  const fetchImages = useCallback(async (id: string) => {
      const res = await fetch(`/api/admin/product-images?productId=${id}`);
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || 'Failed to load images');
        return;
      }
      setImages(payload.images || []);
  }, []);

  useEffect(() => {
    if (productId) {
      fetchImages(productId);
    }
  }, [fetchImages, productId]);

  const onSubmit = async (data: ProductFormInput) => {
    setMessage('');
    setError('');

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, id: productId || undefined })
    });

    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error || 'Failed to save product');
      return;
    }

    setProductId(payload.id);
    setMessage('Saved successfully');
    await onSaved?.();
  };

  const uploadImages = async () => {
    if (!productId || !files.length) return;

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('productId', productId);
    files.forEach((file) => formData.append('files', file));

    const res = await fetch('/api/admin/product-images', { method: 'POST', body: formData });
    const payload = await res.json();

    if (!res.ok) {
      setError(payload.error || 'Image upload failed');
      setUploading(false);
      return;
    }

    setFiles([]);
    setMessage('Images uploaded successfully');
    await fetchImages(productId);
    await onSaved?.();
    setUploading(false);
  };

  const makeCover = async (imageId: string) => {
    const res = await fetch('/api/admin/product-images', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, imageId, isCover: true })
    });

    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error || 'Failed to set cover image');
      return;
    }

    setMessage('Cover image updated');
    await fetchImages(productId);
    await onSaved?.();
  };

  const removeImage = async (imageId: string) => {
    const res = await fetch(`/api/admin/product-images?productId=${productId}&imageId=${imageId}`, {
      method: 'DELETE'
    });
    const payload = await res.json();

    if (!res.ok) {
      setError(payload.error || 'Failed to remove image');
      return;
    }

    setMessage('Image removed');
    await fetchImages(productId);
    await onSaved?.();
  };

  const fields = [
    'slug',
    'model',
    'brand',
    'category',
    'recommended_area',
    'cooling_power',
    'heating_power',
    'cooling_consumption',
    'heating_consumption',
    'eer_cop',
    'freon_type_amount',
    'operating_temperature',
    'indoor_unit_size',
    'indoor_unit_weight',
    'outdoor_unit_size',
    'outdoor_unit_weight',
    'noise_level',
    'pipe_size'
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field} className="space-y-1 text-sm">
            <span className="capitalize text-slate-600">{field.replaceAll('_', ' ')}</span>
            <input className="w-full rounded-lg border p-2" {...register(field)} />
            {errors[field] && <span className="text-xs text-red-600">Invalid value</span>}
          </label>
        ))}
        <label className="space-y-1 text-sm">
          <span>Price</span>
          <input type="number" step="0.01" className="w-full rounded-lg border p-2" {...register('price')} />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span>English Name</span>
          <input className="w-full rounded-lg border p-2" {...register('translations.0.name')} />
        </label>
        <label className="space-y-1">
          <span>Georgian Name</span>
          <input className="w-full rounded-lg border p-2" {...register('translations.1.name')} />
        </label>
        <label className="space-y-1">
          <span>English Features</span>
          <textarea className="w-full rounded-lg border p-2" {...register('translations.0.features')} />
        </label>
        <label className="space-y-1">
          <span>Georgian Features</span>
          <textarea className="w-full rounded-lg border p-2" {...register('translations.1.features')} />
        </label>
      </div>

      <section className="space-y-3 rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold">Product images</h3>
        {!productId && <p className="text-sm text-slate-500">Save product first to enable image uploads.</p>}
        {productId && (
          <>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm"
            />
            <button
              type="button"
              disabled={uploading || files.length === 0}
              onClick={uploadImages}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-40"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length || ''} image${files.length === 1 ? '' : 's'}`}
            </button>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <div key={image.id} className="space-y-2 rounded-lg border border-slate-200 p-2">
                  <div className="relative aspect-square overflow-hidden rounded-md bg-slate-100">
                    <Image src={image.storage_path} alt={image.alt || 'Product image'} fill className="object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => makeCover(image.id)}
                      className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
                    >
                      {image.is_primary ? 'Cover image' : 'Set as cover'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <button disabled={isSubmitting} className="rounded-lg bg-brand-700 px-4 py-2 text-white">
        {isSubmitting ? 'Saving...' : 'Save Product'}
      </button>

      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

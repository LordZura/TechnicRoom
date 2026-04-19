'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductFormInput, productSchema } from '@/lib/validation/product';

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

export function ProductForm({ onSaved, initialData }: { onSaved?: (product: { id: string; slug: string; model: string; brand: string }) => void; initialData?: Partial<ProductFormInput> }) {
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...baseDefaults, ...initialData }
  });

  const onSubmit = async (data: ProductFormInput) => {
    setMessage('');
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    if (!res.ok) {
      setMessage(json.error || 'Failed to save product');
      return;
    }

    setMessage('Saved successfully. You can now upload images below.');
    if (!initialData) reset(baseDefaults);
    if (json.product?.id && onSaved) onSaved(json.product);
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
        <label className="space-y-1"><span>English Name</span><input className="w-full rounded-lg border p-2" {...register('translations.0.name')} /></label>
        <label className="space-y-1"><span>Georgian Name</span><input className="w-full rounded-lg border p-2" {...register('translations.1.name')} /></label>
        <label className="space-y-1"><span>English Description</span><textarea className="w-full rounded-lg border p-2" {...register('translations.0.description')} /></label>
        <label className="space-y-1"><span>Georgian Description</span><textarea className="w-full rounded-lg border p-2" {...register('translations.1.description')} /></label>
        <label className="space-y-1"><span>English Features</span><textarea className="w-full rounded-lg border p-2" {...register('translations.0.features')} /></label>
        <label className="space-y-1"><span>Georgian Features</span><textarea className="w-full rounded-lg border p-2" {...register('translations.1.features')} /></label>
      </div>
      <button disabled={isSubmitting} className="rounded-lg bg-brand-700 px-4 py-2 text-white">
        {isSubmitting ? 'Saving...' : 'Save Product'}
      </button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}

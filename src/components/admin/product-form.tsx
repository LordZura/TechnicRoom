'use client';

import Image from 'next/image';
import { ChevronDown, RefreshCw, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildProductSlug, slugify } from '@/lib/slug';
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

type FieldDef = { name: keyof ProductFormInput; label: string; required?: boolean; type?: 'text' | 'number' };

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="inline-flex items-center gap-2 text-[#6b5442]">
        {label}
        {required ? <span className="rounded-full bg-brand-brown/10 px-2 py-0.5 text-xs font-semibold text-brand-brown">Required</span> : <span className="text-xs text-[#8f7763]">Optional</span>}
      </span>
      {children}
      {error && <span className="text-xs text-red-700">{error}</span>}
    </label>
  );
}

export function ProductForm({ initialData, onSaved }: { initialData?: Partial<ProductFormInput>; onSaved?: () => Promise<void> | void }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [productId, setProductId] = useState(initialData?.id || '');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData?.slug));
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...baseDefaults, ...initialData }
  });

  const model = watch('model');
  const enName = watch('translations.0.name');
  const kaName = watch('translations.1.name');
  const slug = watch('slug');

  const autoSlug = useMemo(() => buildProductSlug({ model, englishName: enName, georgianName: kaName }), [model, enName, kaName]);

  useEffect(() => {
    if (!slugEdited && autoSlug) {
      setValue('slug', autoSlug, { shouldValidate: true });
    }
  }, [autoSlug, setValue, slugEdited]);

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

  const regenerateSlug = () => {
    const generated = buildProductSlug({
      model: getValues('model'),
      englishName: getValues('translations.0.name'),
      georgianName: getValues('translations.1.name')
    });
    if (generated) {
      setSlugEdited(false);
      setValue('slug', generated, { shouldValidate: true, shouldDirty: true });
    }
  };

  const onSubmit = async (data: ProductFormInput) => {
    setMessage('');
    setError('');

    const normalizedSlug = slugify(data.slug || autoSlug);
    if (!normalizedSlug) {
      setError('Slug is required. Add a model or product name first.');
      return;
    }

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, slug: normalizedSlug, id: productId || undefined })
    });

    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error || 'Failed to save product');
      return;
    }

    setProductId(payload.id);
    setValue('slug', payload.slug || normalizedSlug, { shouldDirty: true });
    setMessage(`Saved successfully (${payload.slug || normalizedSlug})`);
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

  const keySpecs: FieldDef[] = [
    { name: 'recommended_area', label: 'Recommended Area' },
    { name: 'cooling_power', label: 'Cooling Power' },
    { name: 'heating_power', label: 'Heating Power' },
    { name: 'noise_level', label: 'Noise Level' },
    { name: 'price', label: 'Price', type: 'number' }
  ];

  const advancedSpecs: FieldDef[] = [
    { name: 'cooling_consumption', label: 'Cooling Consumption' },
    { name: 'heating_consumption', label: 'Heating Consumption' },
    { name: 'eer_cop', label: 'EER / COP' },
    { name: 'freon_type_amount', label: 'Freon Type / Amount' },
    { name: 'operating_temperature', label: 'Operating Temperature' },
    { name: 'indoor_unit_size', label: 'Indoor Unit Size' },
    { name: 'indoor_unit_weight', label: 'Indoor Unit Weight' },
    { name: 'outdoor_unit_size', label: 'Outdoor Unit Size' },
    { name: 'outdoor_unit_weight', label: 'Outdoor Unit Weight' },
    { name: 'pipe_size', label: 'Pipe Size' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="tr-surface space-y-6 p-5 sm:p-6">
      <section className="space-y-3 rounded-2xl border border-brand-line/90 bg-brand-cream p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold"><Sparkles className="h-4 w-4 text-brand-gold" />Basic Info</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Model" required error={errors.model?.message}><input className="tr-input" {...register('model')} /></Field>
          <Field label="Brand" required error={errors.brand?.message}><input className="tr-input" {...register('brand')} /></Field>
          <Field label="Category" required error={errors.category?.message}><input className="tr-input" {...register('category')} /></Field>
          <Field label="Slug" required error={errors.slug?.message}>
            <div className="flex gap-2">
              <input
                className="tr-input"
                {...register('slug', {
                  onChange: () => setSlugEdited(true),
                  onBlur: (event) => setValue('slug', slugify(event.target.value), { shouldValidate: true })
                })}
              />
              <button type="button" onClick={regenerateSlug} className="tr-btn-ghost px-3" title="Regenerate slug">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-[#7e6856]">Auto source: model → English Name → Georgian Name. Editable anytime.</p>
          </Field>
          <Field label="English Name" required={false} error={errors.translations?.message}><input className="tr-input" {...register('translations.0.name')} /></Field>
          <Field label="Georgian Name" required={false} error={errors.translations?.message}><input className="tr-input" {...register('translations.1.name')} /></Field>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-brand-line/90 bg-brand-cream p-4">
        <h3 className="text-lg font-semibold">Key Specs</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {keySpecs.map((item) => (
            <Field key={item.name} label={item.label}>
              <input type={item.type || 'text'} step={item.type === 'number' ? '0.01' : undefined} className="tr-input" {...register(item.name)} />
            </Field>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-brand-line/90 bg-brand-cream p-4">
        <h3 className="text-lg font-semibold">Features</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="English Features"><textarea className="tr-input min-h-24" {...register('translations.0.features')} /></Field>
          <Field label="Georgian Features"><textarea className="tr-input min-h-24" {...register('translations.1.features')} /></Field>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-brand-line/90 bg-brand-cream">
        <button
          type="button"
          onClick={() => setAdvancedOpen((prev) => !prev)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-lg font-semibold transition hover:bg-brand-ivory"
        >
          Advanced Technical Specs
          <ChevronDown className={`h-4 w-4 transition ${advancedOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`grid transition-all duration-300 ${advancedOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden px-4 pb-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {advancedSpecs.map((item) => (
                <Field key={item.name} label={item.label}><input className="tr-input" {...register(item.name)} /></Field>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-brand-line bg-brand-cream p-4">
        <h3 className="font-semibold">Images</h3>
        {!productId && <p className="text-sm text-[#725c49]">Save product first to enable image uploads.</p>}
        {productId && (
          <>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
              className="tr-input text-sm"
            />
            <button
              type="button"
              disabled={uploading || files.length === 0}
              onClick={uploadImages}
              className="tr-btn-ghost disabled:opacity-40"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length || ''} image${files.length === 1 ? '' : 's'}`}
            </button>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <div key={image.id} className="space-y-2 rounded-xl border border-brand-line bg-brand-ivory p-2 transition hover:-translate-y-0.5 hover:shadow-soft">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-sand/30">
                    <Image src={image.storage_path} alt={image.alt || 'Product image'} fill className="object-cover transition duration-500 hover:scale-[1.03]" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => makeCover(image.id)}
                      className="rounded border border-brand-line px-2 py-1 text-xs hover:bg-brand-cream"
                    >
                      {image.is_primary ? 'Cover image' : 'Set as cover'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
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

      <div className="flex flex-wrap items-center gap-3">
        <button disabled={isSubmitting} className="tr-btn-primary">
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
        {slug && <span className="rounded-full border border-brand-line bg-brand-ivory px-3 py-1 text-xs text-[#6b5442]">Slug preview: /products/{slug}</span>}
      </div>

      {message && <p className="animate-fade-in text-sm text-emerald-700">{message}</p>}
      {error && <p className="animate-fade-in text-sm text-red-700">{error}</p>}
    </form>
  );
}

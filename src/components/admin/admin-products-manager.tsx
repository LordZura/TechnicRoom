'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import { ProductJsonEdit } from '@/components/admin/product-json-edit';
import { ProductJsonExport } from '@/components/admin/product-json-export';
import { ProductJsonImport } from '@/components/admin/product-json-import';
import { ProductsList } from '@/components/admin/products-list';
import type { AdminProductSummary } from '@/lib/supabase/queries';
import type { ProductFormInput } from '@/lib/validation/product';

const nullableStringFields: Array<keyof ProductFormInput> = [
  'color',
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
];

function normalizeProduct(product: ProductFormInput): ProductFormInput {
  const normalized = { ...product };

  for (const field of nullableStringFields) {
    if (normalized[field] === null || normalized[field] === undefined) {
      normalized[field] = '' as never;
    }
  }

  normalized.translations = normalized.translations.map((translation) => ({
    ...translation,
    name: translation.name ?? '',
    description: translation.description ?? '',
    features: translation.features ?? ''
  }));
  normalized.custom_specs = normalized.custom_specs ?? [];

  return normalized;
}

export function AdminProductsManager({
  initialProducts,
  initialProductId,
  initialEditShortcutEnabled
}: {
  initialProducts: AdminProductSummary[];
  initialProductId?: string;
  initialEditShortcutEnabled: boolean;
}) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<ProductFormInput | undefined>();
  const [jsonEditText, setJsonEditText] = useState('');
  const [loadingId, setLoadingId] = useState('');
  const [error, setError] = useState('');
  const [loadedInitialProductId, setLoadedInitialProductId] = useState('');

  const loadProduct = useCallback(async (productId: string) => {
    setLoadingId(productId);
    setError('');

    const res = await fetch(`/api/admin/products?id=${productId}`);
    const payload = await res.json();

    if (!res.ok) {
      setError(payload.error || 'Failed to load product');
      setLoadingId('');
      return;
    }

    setSelectedProduct(normalizeProduct(payload.product));
    setLoadingId('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!initialProductId || loadedInitialProductId === initialProductId) return;
    setLoadedInitialProductId(initialProductId);
    void loadProduct(initialProductId);
  }, [initialProductId, loadProduct, loadedInitialProductId]);

  const startNewProduct = () => {
    setSelectedProduct(undefined);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">
            {selectedProduct ? `Editing ${selectedProduct.model}` : 'Create a new product'}
          </h2>
          <p className="tr-muted mt-1">Every storefront filterable field is editable here.</p>
        </div>
        {selectedProduct && (
          <button type="button" onClick={startNewProduct} className="tr-btn-ghost">
            New Product
          </button>
        )}
      </div>

      <ProductJsonImport onImported={() => router.refresh()} />

      <AdminEditShortcutSetting initialEnabled={initialEditShortcutEnabled} />

      <ProductJsonEdit initialText={jsonEditText} onEdited={() => router.refresh()} />

      <ProductJsonExport />

      <ProductForm
        key={selectedProduct?.id || 'new-product'}
        initialData={selectedProduct}
        onSaved={() => router.refresh()}
      />

      <ProductsList
        initialProducts={initialProducts}
        onEdit={loadProduct}
        onEditJson={(json) => {
          setJsonEditText(json);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        editingId={loadingId || selectedProduct?.id}
      />

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

function AdminEditShortcutSetting({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateSetting = async (nextEnabled: boolean) => {
    setEnabled(nextEnabled);
    setSaving(true);
    setError('');

    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_product_edit_shortcut_enabled: nextEnabled })
    });
    const payload = await res.json();

    if (!res.ok) {
      setEnabled(!nextEnabled);
      setError(payload.error || 'Failed to update setting');
    }

    setSaving(false);
  };

  return (
    <section className="tr-surface flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
      <div>
        <h3 className="text-base font-semibold">Product page edit shortcut</h3>
        <p className="tr-muted mt-1">Show admins a direct edit button on product pages.</p>
      </div>
      <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-brand-espresso">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => updateSetting(event.target.checked)}
          disabled={saving}
          className="h-5 w-5 rounded border-brand-line text-brand-brown focus:ring-brand-gold disabled:opacity-50"
        />
        {saving ? 'Saving...' : enabled ? 'Enabled' : 'Disabled'}
      </label>
      {error && <p className="basis-full text-sm text-red-700">{error}</p>}
    </section>
  );
}

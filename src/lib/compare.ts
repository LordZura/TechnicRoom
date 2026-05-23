import { getProductOptionLabel } from '@/lib/product-options';
import type { Locale, ProductWithRelations } from '@/types';

export type CompareRow = {
  key: string;
  label: string;
  first: string | null;
  second: string | null;
  isCustom?: boolean;
};

const defaultSpecKeys = [
  'brand',
  'model',
  'category',
  'price',
  'color',
  'has_fresh_air_intake',
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

function getTranslationValue(product: ProductWithRelations, locale: Locale, field: 'description' | 'features') {
  const translated = product.translations.find((item) => item.locale === locale);
  const fallback = product.translations.find((item) => item.locale === 'en');
  const value = translated?.[field] || fallback?.[field];

  return value?.trim() || null;
}

function formatPrice(value: number | string | null) {
  if (value === null || value === '') return null;

  const price = Number(value);
  if (!Number.isFinite(price)) return null;

  return `₾${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(price)}`;
}

function getDefaultValue(product: ProductWithRelations, key: typeof defaultSpecKeys[number], locale: Locale, labels: Record<string, string>) {
  const value = product[key];

  if (key === 'price') return formatPrice(product.price);
  if (key === 'category' && typeof value === 'string') return getProductOptionLabel('category', value, locale);
  if (key === 'color' && typeof value === 'string') return getProductOptionLabel('color', value, locale);
  if (key === 'has_fresh_air_intake') return product.has_fresh_air_intake ? labels.has_fresh_air_intake : null;
  if (value === null || value === undefined || value === '') return null;

  return String(value);
}

function getCustomLabel(spec: ProductWithRelations['custom_specs'][number], locale: Locale) {
  if (locale === 'ka' && spec.name_ka?.trim()) return spec.name_ka.trim();
  return spec.name.trim();
}

function getCustomValue(spec: ProductWithRelations['custom_specs'][number], locale: Locale) {
  if (locale === 'ka' && spec.value_ka?.trim()) return spec.value_ka.trim();
  return spec.value.trim();
}

function customSpecMap(product: ProductWithRelations, locale: Locale) {
  const rows = new Map<string, { label: string; value: string }>();

  for (const spec of product.custom_specs || []) {
    const label = getCustomLabel(spec, locale);
    const value = getCustomValue(spec, locale);
    if (!label || !value) continue;

    rows.set(label.toLocaleLowerCase(), { label, value });
  }

  return rows;
}

export function buildCompareRows({
  first,
  second,
  locale,
  labels
}: {
  first: ProductWithRelations;
  second: ProductWithRelations | null;
  locale: Locale;
  labels: Record<string, string>;
}) {
  const fieldRows: CompareRow[] = defaultSpecKeys
    .map((key) => ({
      key,
      label: labels[key] || key,
      first: getDefaultValue(first, key, locale, labels),
      second: second ? getDefaultValue(second, key, locale, labels) : null
    }))
    .filter((row) => row.first || row.second);
  const translationRows: CompareRow[] = (['description', 'features'] as const)
    .map((key) => ({
      key,
      label: labels[key] || key,
      first: getTranslationValue(first, locale, key),
      second: second ? getTranslationValue(second, locale, key) : null
    }))
    .filter((row) => row.first || row.second);
  const defaultRows = [
    ...fieldRows.slice(0, 4),
    ...translationRows,
    ...fieldRows.slice(4)
  ];

  const firstCustom = customSpecMap(first, locale);
  const secondCustom = second ? customSpecMap(second, locale) : new Map<string, { label: string; value: string }>();
  const customKeys = Array.from(new Set([...firstCustom.keys(), ...secondCustom.keys()]));
  const customRows: CompareRow[] = customKeys.map((key) => ({
    key: `custom:${key}`,
    label: firstCustom.get(key)?.label || secondCustom.get(key)?.label || key,
    first: firstCustom.get(key)?.value || null,
    second: secondCustom.get(key)?.value || null,
    isCustom: true
  }));

  return { defaultRows, customRows };
}

import type { Locale } from '@/types';

type ProductOption = {
  value: string;
  labels: Record<Locale, string>;
};

export const MANUFACTURER_OPTIONS = [
  'Samsung',
  'Hisense',
  'LG',
  'AUX',
  'MIDEA',
  'Dixi',
  'Panasonic'
];

export const PRODUCT_TYPE_OPTIONS: ProductOption[] = [
  { value: 'Inverter', labels: { en: 'Inverter', ka: 'ინვერტერი' } },
  { value: 'On-off', labels: { en: 'On-off', ka: 'On-off' } },
  { value: 'Column', labels: { en: 'Column', ka: 'კოლონური' } },
  { value: 'Portable', labels: { en: 'Portable', ka: 'პორტატული' } }
];

export const RECOMMENDED_AREA_OPTIONS: ProductOption[] = [
  { value: '20-35 m²', labels: { en: '20-35 m²', ka: '20-35 მ²' } },
  { value: '35-45 m²', labels: { en: '35-45 m²', ka: '35-45 მ²' } },
  { value: '45-65 m²', labels: { en: '45-65 m²', ka: '45-65 მ²' } },
  { value: '70-80 m²', labels: { en: '70-80 m²', ka: '70-80 მ²' } },
  { value: '80+ m²', labels: { en: '80+ m²', ka: '80 მ² და მეტი' } }
];

export const COLOR_OPTIONS: ProductOption[] = [
  { value: 'White', labels: { en: 'White', ka: 'თეთრი' } },
  { value: 'Black', labels: { en: 'Black', ka: 'შავი' } },
  { value: 'Silver', labels: { en: 'Silver', ka: 'ვერცხლისფერი' } }
];

export const FRESH_AIR_INTAKE_LABELS: Record<Locale, string> = {
  en: 'Fresh air intake',
  ka: 'ჰაერის გარედან შემოტანის ფუნქცია'
};

const optionGroups = {
  category: PRODUCT_TYPE_OPTIONS,
  recommendedArea: RECOMMENDED_AREA_OPTIONS,
  color: COLOR_OPTIONS
};

export type LocalizedOptionKind = keyof typeof optionGroups;

export function getOptionValues(options: ProductOption[]) {
  return options.map((option) => option.value);
}

export function getProductOptionLabel(kind: LocalizedOptionKind, value: string, locale: Locale) {
  const normalized = value.trim().toLocaleLowerCase();
  const option = optionGroups[kind].find((item) => {
    const candidates = [item.value, item.labels.en, item.labels.ka];
    return candidates.some((candidate) => candidate.toLocaleLowerCase() === normalized);
  });

  return option?.labels[locale] ?? value;
}

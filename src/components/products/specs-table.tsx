import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProductOptionLabel } from '@/lib/product-options';

type SpecRow = { label: string; value: unknown };

const specKeys = [
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

export function SpecsTable({ product }: { product: Record<string, unknown> }) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);

  const rows = specKeys
    .map((key) => ({
      label: t.productSpecLabels[key],
      value: key === 'has_fresh_air_intake'
        ? product[key] === true
          ? t.productSpecLabels.has_fresh_air_intake
          : null
        : key === 'color' && typeof product[key] === 'string'
          ? getProductOptionLabel('color', product[key] as string, locale)
        : product[key]
    }))
    .filter((row) => row.value !== null && row.value !== undefined && row.value !== '');
  const customRows: SpecRow[] = Array.isArray(product.custom_specs)
    ? product.custom_specs
        .flatMap((item) => {
          if (!item || typeof item !== 'object') return [];

          const spec = item as { name?: unknown; value?: unknown };
          const localizedSpec = item as { name_ka?: unknown; value_ka?: unknown };
          const label = locale === 'ka' && typeof localizedSpec.name_ka === 'string' && localizedSpec.name_ka.trim()
            ? localizedSpec.name_ka
            : spec.name;
          const value = locale === 'ka' && typeof localizedSpec.value_ka === 'string' && localizedSpec.value_ka.trim()
            ? localizedSpec.value_ka
            : spec.value;

          if (typeof label !== 'string' || !label.trim()) return [];
          if (value === null || value === undefined || value === '') return [];

          return [{ label: label.trim(), value }];
        })
    : [];
  const allRows = [...rows, ...customRows];

  if (!allRows.length) return null;

  return (
    <>
      {/* Mobile: stat tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:hidden">
        {allRows.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl border border-ink-100 bg-white px-3.5 py-3 shadow-soft"
          >
            <p className="text-[0.625rem] font-bold uppercase leading-tight tracking-[0.14em] text-ink-400">
              {row.label}
            </p>
            <p className="mt-2 text-[0.875rem] font-semibold leading-snug text-ink-900">
              {String(row.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop: definition list */}
      <dl className="hidden overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card sm:block">
        {allRows.map((row, idx) => (
          <div
            key={row.label}
            className={`group grid grid-cols-[1.15fr_1fr] items-baseline gap-4 px-5 py-3.5 transition-colors duration-300 hover:bg-wine-50/60 ${
              idx !== allRows.length - 1 ? 'border-b border-ink-100' : ''
            }`}
          >
            <dt className="text-[0.8125rem] font-medium text-ink-500 transition-colors duration-300 group-hover:text-ink-700">
              {row.label}
            </dt>
            <dd className="text-[0.875rem] font-semibold text-ink-900">
              {String(row.value)}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

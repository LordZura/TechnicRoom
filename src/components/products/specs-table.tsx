import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';

const specKeys = [
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
      value: product[key]
    }))
    .filter((row) => row.value !== null && row.value !== undefined && row.value !== '');

  if (!rows.length) return null;

  return (
    <>
      <div className="space-y-2.5 sm:hidden">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl border border-[#D8C1A8] bg-[#FFF8F1] px-4 py-3 shadow-[0_8px_24px_rgba(58,36,24,0.05)]"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#7f6956]">
              {row.label}
            </p>
            <p className="mt-1.5 text-sm font-medium text-brand-espresso">
              {String(row.value)}
            </p>
          </div>
        ))}
      </div>

      <dl className="hidden overflow-hidden rounded-[1.4rem] border border-[#D8C1A8] bg-[#FFF8F1] shadow-[0_8px_24px_rgba(58,36,24,0.05)] sm:block">
        {rows.map((row, idx) => (
          <div
            key={row.label}
            className={`grid gap-2 px-4 py-3 sm:grid-cols-[1.3fr_1fr] sm:items-start sm:px-5 ${
              idx % 2 === 0 ? 'bg-[#FFF8F1]' : 'bg-[#F8EFE3]'
            } ${idx !== rows.length - 1 ? 'border-b border-[#E8D9C7]' : ''}`}
          >
            <dt className="text-sm font-medium text-[#705946]">{row.label}</dt>
            <dd className="text-sm text-brand-espresso">{String(row.value)}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
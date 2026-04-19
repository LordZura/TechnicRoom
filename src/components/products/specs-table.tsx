const labels: Record<string, string> = {
  recommended_area: 'Recommended area',
  cooling_power: 'Cooling power',
  heating_power: 'Heating power',
  cooling_consumption: 'Cooling consumption',
  heating_consumption: 'Heating consumption',
  eer_cop: 'EER/COP',
  freon_type_amount: 'Freon type / amount',
  operating_temperature: 'Operating temperature',
  indoor_unit_size: 'Indoor unit size',
  indoor_unit_weight: 'Indoor unit weight',
  outdoor_unit_size: 'Outdoor unit size',
  outdoor_unit_weight: 'Outdoor unit weight',
  noise_level: 'Noise level',
  pipe_size: 'Pipe size'
};

export function SpecsTable({ product }: { product: Record<string, unknown> }) {
  const rows = Object.entries(labels)
    .map(([key, label]) => ({ label, value: product[key] }))
    .filter((row) => row.value !== null && row.value !== undefined && row.value !== '');

  if (!rows.length) return null;

  return (
    <dl className="tr-surface overflow-hidden p-0">
      {rows.map((row, idx) => (
        <div key={row.label} className={`grid gap-2 px-4 py-3 sm:grid-cols-[1.3fr_1fr] sm:items-start sm:px-5 ${idx % 2 === 0 ? 'bg-brand-ivory' : 'bg-brand-cream'}`}>
          <dt className="text-sm font-medium text-[#705946]">{row.label}</dt>
          <dd className="text-sm text-brand-espresso">{String(row.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

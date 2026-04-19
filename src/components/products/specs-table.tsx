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

export function SpecsTable({ product }: { product: Record<string, string | number | null | boolean> }) {
  const rows = Object.entries(labels)
    .map(([key, label]) => ({ label, value: product[key] }))
    .filter((row) => row.value);

  if (!rows.length) return null;

  return (
    <dl className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2 last:border-none">
          <dt className="text-sm font-medium text-slate-500">{row.label}</dt>
          <dd className="text-sm text-slate-900">{String(row.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

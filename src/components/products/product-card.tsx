import Image from "next/image";
import Link from "next/link";
import { CatalogProduct } from "@/lib/supabase/queries";

function ProductPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center rounded-[1.1rem] bg-white/80 text-xs font-medium uppercase tracking-[0.18em] text-[#8f7763] ring-1 ring-[#E8D9C7]">
      No image
    </div>
  );
}

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-[1.6rem] border border-[#D8C1A8] bg-[#FFF8F1] shadow-[0_8px_24px_rgba(58,36,24,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C89A5A] hover:shadow-[0_18px_40px_rgba(58,36,24,0.12)]"
    >
      <div className="p-3 pb-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.1rem] bg-white/80 ring-1 ring-[#E8D9C7]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#3A2418]/18 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          {product.cover_image ? (
            <Image
              src={product.cover_image}
              alt={product.cover_alt || product.name || product.model}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.045]"
            />
          ) : (
            <ProductPlaceholder />
          )}
        </div>
      </div>

      <div className="space-y-2 px-4 pb-5 pt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a725f]">
          {product.brand}
        </p>

        <h3 className="line-clamp-2 text-[1.05rem] font-semibold leading-snug text-brand-espresso transition-colors duration-300 group-hover:text-brand-brown">
          {product.name || product.model}
        </h3>

        <div className="space-y-1.5 text-sm">
          <p className="text-[#705946]">
            <span className="font-medium text-brand-espresso/90">Model:</span>{" "}
            {product.model}
          </p>

          {product.category && (
            <p className="text-[#876f5a]">{product.category}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

const labels: Record<string, string> = {
  recommended_area: "Recommended area",
  cooling_power: "Cooling power",
  heating_power: "Heating power",
  cooling_consumption: "Cooling consumption",
  heating_consumption: "Heating consumption",
  eer_cop: "EER/COP",
  freon_type_amount: "Freon type / amount",
  operating_temperature: "Operating temperature",
  indoor_unit_size: "Indoor unit size",
  indoor_unit_weight: "Indoor unit weight",
  outdoor_unit_size: "Outdoor unit size",
  outdoor_unit_weight: "Outdoor unit weight",
  noise_level: "Noise level",
  pipe_size: "Pipe size",
};

export function SpecsTable({ product }: { product: Record<string, unknown> }) {
  const rows = Object.entries(labels)
    .map(([key, label]) => ({ label, value: product[key] }))
    .filter(
      (row) =>
        row.value !== null && row.value !== undefined && row.value !== "",
    );

  if (!rows.length) return null;

  return (
    <dl className="overflow-hidden rounded-[1.4rem] border border-[#D8C1A8] bg-[#FFF8F1] shadow-[0_8px_24px_rgba(58,36,24,0.05)]">
      {rows.map((row, idx) => (
        <div
          key={row.label}
          className={`grid gap-2 px-4 py-3 sm:grid-cols-[1.3fr_1fr] sm:items-start sm:px-5 ${
            idx % 2 === 0 ? "bg-[#FFF8F1]" : "bg-[#F8EFE3]"
          } ${idx !== rows.length - 1 ? "border-b border-[#E8D9C7]" : ""}`}
        >
          <dt className="text-sm font-medium text-[#705946]">{row.label}</dt>
          <dd className="text-sm text-brand-espresso">{String(row.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

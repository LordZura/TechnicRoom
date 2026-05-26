import { ProductCardSkeleton } from '@/components/products/product-card-skeleton';

function Line({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-full bg-brand-sand/75 ${className}`}
      aria-hidden="true"
    />
  );
}

export default function LoadingProducts() {
  return (
    <div
      className="space-y-5 pt-3 sm:space-y-6 sm:pt-4 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-5 lg:space-y-0 lg:pt-5 xl:grid-cols-[310px_minmax(0,1fr)]"
      aria-label="Products are loading"
      aria-busy="true"
    >
      <aside className="lg:sticky lg:top-24">
        <section className="tr-surface space-y-4 p-4 sm:p-6 lg:p-4 xl:p-5">
          <Line className="h-7 w-4/5" />
          <div className="space-y-2">
            <Line className="h-3 w-full" />
            <Line className="h-3 w-3/4" />
          </div>
          <div className="space-y-3 rounded-2xl border border-brand-line/90 bg-brand-cream/70 p-2.5 lg:border-0 lg:bg-transparent lg:p-0">
            <div className="h-11 animate-pulse rounded-xl bg-brand-ivory ring-1 ring-brand-line" />
            <div className="h-24 animate-pulse rounded-xl bg-brand-ivory ring-1 ring-brand-line" />
            <div className="h-12 animate-pulse rounded-xl bg-brand-ivory ring-1 ring-brand-line" />
            <div className="h-12 animate-pulse rounded-xl bg-brand-ivory ring-1 ring-brand-line" />
          </div>
        </section>
      </aside>

      <section className="min-w-0 space-y-3.5">
        <div className="flex justify-end">
          <div className="h-11 w-full animate-pulse rounded-xl bg-brand-ivory ring-1 ring-brand-line sm:w-48" />
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} mobileLayout="horizontal" />
          ))}
        </div>
      </section>
    </div>
  );
}

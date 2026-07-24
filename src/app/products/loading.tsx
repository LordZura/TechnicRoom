import { ProductCardSkeleton } from '@/components/products/product-card-skeleton';

export default function LoadingProducts() {
  return (
    <div
      className="tr-shell pb-4 pt-8 sm:pt-10"
      aria-label="Products are loading"
      aria-busy="true"
    >
      <header className="max-w-3xl space-y-3">
        <div className="tr-skeleton h-2.5 w-24" />
        <div className="tr-skeleton h-8 w-3/4 sm:h-10" />
        <div className="tr-skeleton h-3 w-full max-w-xl" />
      </header>

      <div className="mt-7 lg:grid lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start lg:gap-7 xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="space-y-2.5 lg:sticky lg:top-[5.5rem]">
          <div className="tr-skeleton h-11 w-full !rounded-2xl bg-white ring-1 ring-ink-100" />
          <div className="tr-skeleton h-11 w-full !rounded-2xl bg-white ring-1 ring-ink-100 lg:hidden" />
          <div className="tr-skeleton h-40 w-full !rounded-2xl bg-white ring-1 ring-ink-100" />
          <div className="tr-skeleton h-24 w-full !rounded-2xl bg-white ring-1 ring-ink-100" />
          <div className="tr-skeleton h-11 w-full !rounded-full bg-white ring-1 ring-ink-100" />
        </aside>

        <section className="mt-6 min-w-0 space-y-5 lg:mt-0">
          <div className="flex items-center gap-3">
            <div className="tr-skeleton h-2.5 w-14" />
            <div className="tr-skeleton h-10 w-72 !rounded-full bg-white ring-1 ring-ink-100" />
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} mobileLayout="horizontal" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

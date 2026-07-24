export default function LoadingProduct() {
  return (
    <div
      className="tr-shell pb-28 pt-6 sm:pb-8 sm:pt-8"
      aria-label="Product is loading"
      aria-busy="true"
    >
      <div className="tr-skeleton mb-5 h-3 w-56" />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <div className="space-y-3">
          <div className="tr-skeleton aspect-[4/3] w-full !rounded-3xl bg-white ring-1 ring-ink-100" />
          <div className="hidden gap-2.5 sm:grid sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="tr-skeleton aspect-square w-full !rounded-2xl bg-white ring-1 ring-ink-100"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="tr-skeleton h-2.5 w-24" />
            <div className="tr-skeleton h-9 w-4/5 sm:h-11" />
            <div className="tr-skeleton h-3 w-40" />
          </div>

          <div className="tr-skeleton h-9 w-36" />

          <div className="flex gap-2">
            <div className="tr-skeleton h-8 w-28 !rounded-full" />
            <div className="tr-skeleton h-8 w-32 !rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="tr-skeleton h-3 w-full" />
            <div className="tr-skeleton h-3 w-5/6" />
            <div className="tr-skeleton h-3 w-2/3" />
          </div>

          <div className="flex gap-2.5">
            <div className="tr-skeleton h-11 w-44 !rounded-full" />
            <div className="tr-skeleton h-11 w-32 !rounded-full" />
          </div>

          <div className="tr-skeleton h-28 w-full !rounded-3xl bg-white ring-1 ring-ink-100" />
        </div>
      </section>

      <section className="mt-14 space-y-5 sm:mt-20">
        <div className="tr-skeleton h-8 w-64" />
        <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1.15fr_1fr] gap-4 border-b border-ink-100 px-5 py-3.5 last:border-b-0"
            >
              <div className="tr-skeleton h-3 w-28" />
              <div className="tr-skeleton h-3 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

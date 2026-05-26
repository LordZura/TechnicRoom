function Line({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-full bg-brand-sand/75 ${className}`}
      aria-hidden="true"
    />
  );
}

export default function LoadingProduct() {
  return (
    <div
      className="space-y-7 pb-20 sm:space-y-8 sm:pb-0"
      aria-label="Product is loading"
      aria-busy="true"
    >
      <section className="grid gap-5 lg:grid-cols-[1.06fr_0.94fr] lg:gap-6">
        <div className="space-y-3">
          <div className="aspect-[2/1] animate-pulse rounded-2xl border border-brand-line bg-white shadow-soft sm:rounded-3xl" />
          <div className="-mx-1.5 flex gap-2.5 overflow-hidden px-1.5 pb-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square w-20 shrink-0 animate-pulse rounded-xl border border-brand-line bg-white sm:w-auto"
              />
            ))}
          </div>
        </div>

        <div className="tr-surface space-y-4 p-4 sm:p-6">
          <Line className="h-3 w-20" />
          <Line className="h-8 w-4/5" />
          <Line className="h-4 w-36" />
          <Line className="h-6 w-24" />
          <div className="space-y-2">
            <Line className="h-3 w-full" />
            <Line className="h-3 w-5/6" />
            <Line className="h-3 w-2/3" />
          </div>
          <div className="h-24 animate-pulse rounded-2xl border border-brand-line bg-brand-cream" />
          <div className="flex justify-end border-t border-brand-line pt-4">
            <div className="h-10 w-28 animate-pulse rounded-xl bg-brand-sand/75" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <Line className="h-8 w-56" />
        <div className="overflow-hidden rounded-2xl border border-brand-line bg-brand-ivory shadow-soft">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(7rem,0.95fr)_1fr] border-b border-brand-sand last:border-b-0"
            >
              <div className="px-3 py-3">
                <Line className="h-3 w-24" />
              </div>
              <div className="px-3 py-3">
                <Line className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

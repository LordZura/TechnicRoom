export function ProductCardSkeleton({
  mobileLayout = 'vertical',
}: {
  mobileLayout?: 'vertical' | 'horizontal';
}) {
  const horizontalMobile = mobileLayout === 'horizontal';

  return (
    <div
      className={`overflow-hidden border border-brand-line bg-brand-cream shadow-soft ${
        horizontalMobile
          ? 'rounded-[1.2rem] sm:rounded-[1.6rem]'
          : 'rounded-[1.35rem] sm:rounded-[1.6rem]'
      }`}
      aria-hidden="true"
    >
      <div
        className={`${
          horizontalMobile
            ? 'flex gap-3 p-3 sm:block sm:p-3 sm:pb-0'
            : 'p-3 pb-0'
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-[1.1rem] bg-white ring-1 ring-brand-line/80 shadow-inner ${
            horizontalMobile
              ? 'h-[108px] w-[116px] shrink-0 sm:aspect-[4/3] sm:h-auto sm:w-full'
              : 'aspect-[4/3] w-full'
          }`}
        >
          <div className="absolute inset-3 animate-pulse rounded-xl bg-brand-sand/60" />
        </div>

        <div
          className={`${
            horizontalMobile
              ? 'min-w-0 flex-1 space-y-2 pt-0.5 sm:px-4 sm:pb-5 sm:pt-4'
              : 'space-y-2 px-4 pb-5 pt-4'
          }`}
        >
          <div className="h-3 w-16 animate-pulse rounded-full bg-brand-sand/80" />
          <div className="h-4 w-4/5 animate-pulse rounded-full bg-brand-sand/80" />
          <div className="h-4 w-3/5 animate-pulse rounded-full bg-brand-sand/70" />
          <div className="h-3 w-20 animate-pulse rounded-full bg-brand-sand/60" />
          <div className="h-4 w-24 animate-pulse rounded-full bg-brand-sand/80" />
        </div>
      </div>

      {horizontalMobile && (
        <div className="border-t border-brand-sand sm:hidden" />
      )}
    </div>
  );
}

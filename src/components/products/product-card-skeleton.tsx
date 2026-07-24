export function ProductCardSkeleton({
  mobileLayout = 'vertical',
}: {
  mobileLayout?: 'vertical' | 'horizontal';
}) {
  const horizontalMobile = mobileLayout === 'horizontal';

  return (
    <div
      className={`overflow-hidden border border-ink-100 bg-white shadow-card ${
        horizontalMobile ? 'rounded-[1.35rem] sm:rounded-3xl' : 'rounded-3xl'
      }`}
      aria-hidden="true"
    >
      <div
        className={
          horizontalMobile
            ? 'flex gap-3.5 p-3 sm:block sm:p-3 sm:pb-0'
            : 'p-3 pb-0'
        }
      >
        <div
          className={`tr-skeleton !rounded-2xl bg-ink-50 ${
            horizontalMobile
              ? 'h-[104px] w-[112px] shrink-0 sm:aspect-[4/3] sm:h-auto sm:w-full'
              : 'aspect-[4/3] w-full'
          }`}
        />

        <div
          className={
            horizontalMobile
              ? 'min-w-0 flex-1 space-y-2.5 pt-1 sm:px-4 sm:pb-5 sm:pt-4'
              : 'space-y-2.5 px-4 pb-5 pt-4'
          }
        >
          <div className="tr-skeleton h-2.5 w-14" />
          <div className="tr-skeleton h-3.5 w-4/5" />
          <div className="tr-skeleton h-3.5 w-3/5" />
          <div className="pt-1.5">
            <div className="tr-skeleton h-7 w-24 !rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default function NotFound() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);

  const message =
    locale === 'ka'
      ? 'მოთხოვნილი გვერდი ვერ მოიძებნა.'
      : 'The page you requested does not exist.';
  const backLabel = locale === 'ka' ? 'მთავარზე დაბრუნება' : 'Back to home';

  return (
    <div className="tr-shell flex min-h-[62vh] items-center justify-center py-16">
      <div className="relative w-full max-w-lg text-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine-100/60 blur-[70px]"
        />

        <p
          aria-hidden="true"
          className="tr-display relative bg-gradient-to-b from-wine-700 to-wine-950 bg-clip-text text-[6rem] leading-none text-transparent sm:text-[8rem]"
        >
          404
        </p>

        <p className="relative mt-4 text-[0.9375rem] text-ink-600">{message}</p>

        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="tr-btn-primary group">
            <ArrowLeft className="h-4 w-4 transition-transform duration-400 ease-smooth group-hover:-translate-x-1" />
            {backLabel}
          </Link>

          <Link href="/products" className="tr-btn-ghost">
            <Compass className="h-4 w-4" />
            {t.nav.products}
          </Link>
        </div>
      </div>
    </div>
  );
}

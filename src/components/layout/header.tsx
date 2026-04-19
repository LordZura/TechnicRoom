import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { Locale } from '@/types';
import { LanguageSwitcher } from './language-switcher';

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const nav = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
    { href: '/admin/login', label: t.nav.admin }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line/80 bg-brand-ivory/95 backdrop-blur">
      <div className="tr-shell py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-lg font-bold tracking-wide text-brand-espresso sm:text-xl">
            Technic <span className="text-brand-gold">Room</span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-5 md:flex">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm font-medium text-[#684f3b] transition hover:text-brand-brown">
                  {item.label}
                </Link>
              ))}
            </nav>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>

        <details className="mt-2 rounded-xl border border-brand-line bg-brand-cream p-2 md:hidden">
          <summary className="cursor-pointer list-none text-sm font-medium text-brand-espresso">Menu</summary>
          <nav className="mt-2 grid gap-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm text-[#684f3b] hover:bg-brand-ivory hover:text-brand-brown">
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

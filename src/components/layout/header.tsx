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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-brand-700">Technic Room</Link>
        <nav className="hidden gap-5 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 hover:text-brand-700">{item.label}</Link>
          ))}
        </nav>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { Locale } from '@/types';
import { LanguageSwitcher } from './language-switcher';

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const nav = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
    { href: '/admin/login', label: t.nav.admin }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line/80 bg-brand-ivory/85 backdrop-blur-lg">
      <div className="tr-shell py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="group relative inline-flex items-center gap-2 rounded-xl p-1">
            {logoFailed ? (
              <span className="text-lg font-bold tracking-wide text-brand-espresso sm:text-xl">Technic <span className="text-brand-gold">Room</span></span>
            ) : (
              <Image
                src="/logo.svg"
                alt="Technic Room"
                width={160}
                height={40}
                priority
                className="h-9 w-auto sm:h-10"
                onError={() => setLogoFailed(true)}
              />
            )}
            <span className="absolute -bottom-1 left-1 h-0.5 w-0 bg-brand-gold transition-all duration-300 group-hover:w-[70%]" />
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <nav className="flex items-center gap-2">
              {nav.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive ? 'text-brand-brown' : 'text-[#684f3b] hover:text-brand-brown'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-brand-gold transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </Link>
                );
              })}
            </nav>
            <LanguageSwitcher locale={locale} />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher locale={locale} />
            <button onClick={() => setMenuOpen((prev) => !prev)} type="button" className="rounded-xl border border-brand-line p-2 text-brand-espresso transition hover:border-brand-brown hover:bg-brand-cream">
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className={`grid transition-all duration-300 md:hidden ${menuOpen ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <nav className="overflow-hidden rounded-xl border border-brand-line bg-brand-cream p-2">
            {nav.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? 'bg-brand-ivory text-brand-brown' : 'text-[#684f3b] hover:bg-brand-ivory hover:text-brand-brown'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

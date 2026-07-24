import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { Locale } from '@/types';
import { getDictionary } from '@/lib/i18n/dictionaries';

const CONTACT = {
  email: 'unispacegeo@gmail.com',
  phoneLabel: '+995 574 50 44 00',
  phoneHref: '+995574504400',
  facebook: 'https://www.facebook.com/profile.php?id=61575732009127',
};

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();

  const links = [
    { href: '/products', label: t.nav.products },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="relative mt-16 overflow-hidden bg-ink-900 text-white/75 sm:mt-24">
      {/* Ambient brand light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-wine-700/35 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sea-600/20 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="tr-grain pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
      />

      <div className="tr-shell relative">
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.1fr] md:gap-8 md:py-16 lg:gap-14 lg:py-20">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center" aria-label="Technic Room">
              <Image
                src="/logo.png"
                alt="Technic Room"
                width={400}
                height={100}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>

            <p className="mt-5 text-[0.9375rem] leading-relaxed text-white/60">
              {t.footer.tagline}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/65 backdrop-blur">
              <MapPin className="h-3.5 w-3.5 text-wine-300" />
              {locale === 'ka' ? 'საქართველო' : 'Georgia'}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/40">
              {t.footer.quickLinks}
            </p>

            <ul className="mt-5 space-y-1">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 py-1.5 text-[0.9375rem] font-medium text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    <span className="tr-underline">{item.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 ease-smooth group-hover:translate-x-0.5 group-hover:opacity-70" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/40">
              {t.footer.contactTitle}
            </p>

            <div className="mt-5 space-y-2.5">
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 transition-all duration-400 ease-smooth hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-wine-700/40 text-wine-100 transition-colors duration-300 group-hover:bg-wine-600/60">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/40">
                    {t.contact.phone}
                  </span>
                  <span className="block truncate text-sm font-semibold text-white/85">
                    {CONTACT.phoneLabel}
                  </span>
                </span>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 transition-all duration-400 ease-smooth hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sea-600/35 text-sea-100 transition-colors duration-300 group-hover:bg-sea-500/50">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/40">
                    {t.contact.email}
                  </span>
                  <span className="block truncate text-sm font-semibold text-white/85">
                    {CONTACT.email}
                  </span>
                </span>
              </a>

              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 pl-1 pt-1 text-xs font-semibold text-white/50 transition-colors duration-300 hover:text-white/85"
              >
                <Facebook className="h-3.5 w-3.5" />
                {t.contact.facebook}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] py-6 text-xs text-white/40 sm:flex-row">
          <p>
            © {year} Technic Room. {t.footer.copyright}
          </p>
          <p className="font-medium tracking-[0.08em] text-white/30">
            HVAC · GEORGIA
          </p>
        </div>
      </div>
    </footer>
  );
}

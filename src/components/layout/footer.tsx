import Link from 'next/link';
import { Locale } from '@/types';
import { getDictionary } from '@/lib/i18n/dictionaries';

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="mt-8 border-t border-brand-line bg-brand-ivory sm:mt-10">
      <div className="tr-shell grid gap-7 py-8 text-sm md:grid-cols-3 md:gap-8 md:py-10">
        <div>
          <p className="text-base font-semibold text-brand-espresso">Technic Room</p>
          <p className="mt-2 text-brand-700/80">{t.footer.tagline}</p>
        </div>
        <div>
          <p className="font-semibold text-brand-espresso">{t.footer.quickLinks}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-brand-700/80">
            <Link className="transition hover:text-brand-brown" href="/products">{t.nav.products}</Link>
            <Link className="transition hover:text-brand-brown" href="/about">{t.nav.about}</Link>
            <Link className="transition hover:text-brand-brown" href="/contact">{t.nav.contact}</Link>
          </div>
        </div>
        <div className="text-brand-700/80 md:text-right">
          <p className="font-semibold text-brand-espresso">{t.footer.contactTitle}</p>
          <p className="mt-2"><a href="mailto:unispacegeo@gmail.com" className="transition hover:text-brand-brown">unispacegeo@gmail.com</a></p>
          <p><a href="tel:+995574504400" className="transition hover:text-brand-brown">+995 574 50 44 00</a></p>
        </div>
      </div>
      <div className="border-t border-brand-line bg-brand-cream">
        <div className="tr-shell py-3 text-xs text-brand-700/75">© {new Date().getFullYear()} Technic Room. {t.footer.copyright}</div>
      </div>
    </footer>
  );
}

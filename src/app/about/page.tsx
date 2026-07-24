import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Wallet, Zap } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';


export const metadata: Metadata = {
  title: 'About Technic Room',
  description: 'Learn about Technic Room and our HVAC installation, maintenance, and air conditioner consultation services in Georgia.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Technic Room | Technic Room',
    description: 'Learn about Technic Room and our HVAC installation, maintenance, and air conditioner consultation services in Georgia.',
    url: '/about',
    images: [DEFAULT_OG_IMAGE]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Technic Room | Technic Room',
    description: 'Learn about Technic Room and our HVAC installation, maintenance, and air conditioner consultation services in Georgia.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default function AboutPage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);

  const cards = [
    { icon: Zap, title: t.about.card1Title, body: t.about.card1Body },
    { icon: ShieldCheck, title: t.about.card2Title, body: t.about.card2Body },
    { icon: Wallet, title: t.about.card3Title, body: t.about.card3Body }
  ];

  return (
    <article className="tr-shell pt-10 sm:pt-14">
      {/* Intro */}
      <Reveal className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-wine-800 via-wine-900 to-ink-900 px-6 py-14 sm:rounded-5xl sm:px-12 sm:py-20">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 animate-drift rounded-full bg-wine-500/30 blur-[90px]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 animate-drift-slow rounded-full bg-sea-500/25 blur-[100px]"
        />
        <span
          aria-hidden="true"
          className="tr-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        />

        <div className="relative max-w-2xl">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white/50">
            Technic Room
          </p>
          <h1 className="tr-display mt-3 text-[1.85rem] text-white sm:text-[2.75rem]">
            {t.about.title}
          </h1>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-white/70 sm:text-lg">
            {t.about.body}
          </p>
        </div>
      </Reveal>

      {/* Value cards */}
      <section className="mt-6 grid grid-cols-1 gap-3.5 sm:mt-8 sm:gap-5 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, body }, index) => (
          <Reveal key={title} delay={index * 90}>
            <div className="tr-card tr-card-hover group h-full p-6 sm:p-7">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-wine-50 opacity-0 blur-2xl transition-opacity duration-600 group-hover:opacity-100"
              />

              <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-wine-700 to-wine-900 text-white shadow-glow transition-transform duration-400 ease-smooth group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </span>

              <h2 className="relative mt-5 text-[1.0625rem] font-bold text-ink-900">{title}</h2>
              <p className="relative mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Closing links */}
      <Reveal className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10" delay={120}>
        <Link href="/products" className="tr-btn-primary group">
          {t.home.cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-400 ease-smooth group-hover:translate-x-1" />
        </Link>
        <Link href="/contact" className="tr-btn-ghost">
          {t.nav.contact}
        </Link>
      </Reveal>
    </article>
  );
}

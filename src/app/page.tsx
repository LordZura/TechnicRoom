import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck, Wallet, Zap } from "lucide-react";

import { HeroParallax } from "@/components/home/hero-parallax";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocaleFromCookie } from "@/lib/i18n/locale";
import { getProducts } from "@/lib/supabase/queries";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);

  return {
    title: t.home.metadataTitle,
    description: t.home.metadataDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: t.home.ogTitle,
      description: t.home.ogDescription,
      url: "/",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: t.home.ogTitle,
      description: t.home.ogDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function HomePage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const products = await getProducts({}, { limit: 6 });

  const region = locale === "ka" ? "საქართველო" : "Georgia";

  const highlights = [
    { icon: Zap, title: t.about.card1Title, body: t.about.card1Body },
    { icon: ShieldCheck, title: t.about.card2Title, body: t.about.card2Body },
    { icon: Wallet, title: t.about.card3Title, body: t.about.card3Body },
  ];

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative -mt-[4.5rem] flex min-h-[92svh] items-end overflow-hidden pb-10 pt-[7rem] text-white sm:min-h-[88vh] sm:pb-14 lg:pb-16">
        <HeroParallax />

        <div className="tr-shell relative w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex animate-fade-in items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1.5 pl-2.5 pr-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-sea-300" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sea-300" />
              </span>
              HVAC · {region}
            </div>

            <h1
              className="tr-display mt-5 animate-fade-up text-[2.05rem] text-white [animation-delay:80ms] sm:mt-6 sm:text-[3.25rem] lg:text-[4.15rem]"
              style={{ textShadow: "0 2px 30px rgba(0,0,0,0.35)" }}
            >
              {t.home.title}
            </h1>

            <p className="mt-4 max-w-xl animate-fade-up text-[0.975rem] leading-relaxed text-white/75 [animation-delay:160ms] sm:mt-5 sm:text-lg">
              {t.home.subtitle}
            </p>

            <div className="mt-7 flex animate-fade-up flex-col items-stretch gap-2.5 [animation-delay:240ms] sm:mt-9 sm:flex-row sm:items-center sm:gap-3">
              <Link
                href="/products"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-white px-6 text-sm font-bold text-ink-900 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.7)] transition-all duration-400 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-14px_rgba(0,0,0,0.75)] active:scale-[0.97]"
              >
                {t.home.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-400 ease-smooth group-hover:translate-x-1" />
              </Link>

              <Link
                href="/about"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-400 ease-smooth hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 active:scale-[0.97]"
              >
                {t.home.learnMore}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-400 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-10 grid grid-cols-1 animate-fade-up gap-2.5 [animation-delay:340ms] sm:mt-14 sm:grid-cols-3 sm:gap-3">
            {highlights.map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.12] bg-white/[0.07] px-4 py-3 backdrop-blur-md transition-colors duration-400 hover:border-white/25 hover:bg-white/[0.12]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.12] text-white">
                  <Icon className="h-[1.05rem] w-[1.05rem]" />
                </span>
                <span className="text-[0.8125rem] font-semibold leading-snug text-white/90">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= FEATURED PRODUCTS ======================= */}
      <section className="tr-shell pt-14 sm:pt-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="tr-eyebrow">Technic Room</p>
            <h2 className="tr-section-title mt-2">{t.home.featuredProducts}</h2>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-wine-700 transition-colors hover:text-wine-800"
          >
            <span className="tr-underline">{t.home.viewAll}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-400 ease-smooth group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-3 no-scrollbar sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3">
          {products.map((product, index) => (
            <Reveal
              key={product.id}
              delay={index * 70}
              className="min-w-[80%] snap-start sm:min-w-0"
            >
              <ProductCard product={product} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================== WHY US ========================== */}
      <section className="tr-shell pt-16 sm:pt-24">
        <Reveal className="max-w-2xl">
          <p className="tr-eyebrow">{t.about.title}</p>
          <h2 className="tr-section-title mt-2">{t.about.body}</h2>
        </Reveal>

        <div className="mt-7 grid grid-cols-1 gap-3.5 sm:mt-10 sm:gap-5 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, body }, index) => (
            <Reveal key={title} delay={index * 90}>
              <article className="tr-card tr-card-hover group h-full p-6 sm:p-7">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-wine-50 opacity-0 blur-2xl transition-opacity duration-600 group-hover:opacity-100"
                />

                <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-wine-700 to-wine-900 text-white shadow-glow transition-transform duration-400 ease-smooth group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="relative mt-5 text-[1.0625rem] font-bold text-ink-900">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-ink-600">
                  {body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================== CTA BAND ========================== */}
      <section className="tr-shell pt-16 sm:pt-24">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-wine-800 via-wine-900 to-ink-900 px-6 py-12 text-center sm:rounded-5xl sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 animate-drift rounded-full bg-wine-500/30 blur-[80px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 animate-drift-slow rounded-full bg-sea-500/25 blur-[90px]"
            />
            <div
              aria-hidden="true"
              className="tr-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="tr-display text-[1.6rem] text-white sm:text-4xl">
                {t.contact.title}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-white/70 sm:text-base">
                {t.contact.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-white px-6 text-sm font-bold text-ink-900 transition-all duration-400 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-16px_rgba(0,0,0,0.6)] active:scale-[0.97]"
                >
                  {t.product.contactAdvisor}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-400 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <Link
                  href="/products"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-400 ease-smooth hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 active:scale-[0.97]"
                >
                  {t.home.cta}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

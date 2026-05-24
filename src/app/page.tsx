import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HeroParallax } from "@/components/home/hero-parallax";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocaleFromCookie } from "@/lib/i18n/locale";
import { getProducts } from "@/lib/supabase/queries";

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
      images: ["/og-image.png"],
    },
  };
}

export default async function HomePage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const products = await getProducts();

  return (
    <div className="space-y-7 sm:space-y-10 lg:space-y-12">
      <section
        className="relative overflow-hidden border-y border-brand-line/70 px-4 py-10 text-brand-ivory sm:px-8 sm:py-16 lg:min-h-[70vh] lg:px-12 lg:pt-[4.8rem] xl:min-h-[45vh]"
      >
        <HeroParallax />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_100%,rgba(90,20,30,0.95)_0%,rgba(115,38,58,0.75)_35%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(90,20,30,0.85)_0%,rgba(115,38,58,0.55)_35%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />
        <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-[0.06] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-brand-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-2 h-52 w-52 rounded-full bg-brand-300/25 blur-3xl" />

        <Reveal className="relative grid gap-8 pt-1 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
          <div className="max-w-3xl space-y-3 pt-1 sm:space-y-5">
            <h1
              className="
                max-w-[28ch]
                font-bold
                tracking-[-0.02em]
                leading-[1.05]
                text-[1.15rem]
                text-brand-ivory

                sm:max-w-none
                sm:text-4xl

                lg:max-w-[18ch]
                lg:text-5xl
              "
            >
              {t.home.title}
            </h1>
          </div>

          <div className="space-y-4">
            <p className="max-w-[38ch] text-[0.95rem] leading-7 text-brand-ivory/85 sm:text-base">
              {t.home.subtitle}
            </p>

            <div className="flex flex-row flex-nowrap items-center gap-3">
              <Link
                href="/products"
                className="group inline-flex shrink-0 items-center gap-2 text-[13px] font-semibold tracking-[0.06em] text-brand-ivory"
              >
                <span className="relative">
                  {t.home.cta}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-gradient-to-r from-brand-gold/90 to-brand-gold/20 transition group-hover:scale-x-110" />
                </span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/about"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-gold/35 bg-black/25 px-3 py-1.5 text-[13px] font-medium text-brand-ivory/90 backdrop-blur"
              >
                {t.home.learnMore}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal className="space-y-3.5 sm:space-y-4" delay={100}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="tr-section-title">{t.home.featuredProducts}</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-brand-brown hover:underline"
          >
            {t.home.viewAll}
          </Link>
        </div>

        <div className="-mx-1.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1.5 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3">
          {products.slice(0, 6).map((product, index) => (
            <Reveal
              key={product.id}
              delay={index * 80}
              className="min-w-[86%] snap-start sm:min-w-0"
            >
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
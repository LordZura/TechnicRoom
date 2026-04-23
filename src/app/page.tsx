import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProducts } from '@/lib/supabase/queries';
import { ProductCard } from '@/components/products/product-card';
import { Reveal } from '@/components/ui/reveal';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default async function HomePage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const products = await getProducts();

  return (
    <div className="space-y-7 sm:space-y-10 lg:space-y-12">
      <section className="relative -mx-4 overflow-hidden border-y border-brand-line/70 bg-[radial-gradient(120%_90%_at_80%_15%,rgba(78,142,138,0.24),transparent_44%),radial-gradient(85%_70%_at_0%_100%,rgba(200,76,109,0.24),transparent_62%),linear-gradient(130deg,#4f1d2a_0%,#73263a_48%,#2c1a20_100%)] px-4 py-11 text-brand-ivory sm:-mx-6 sm:rounded-b-[2.6rem] sm:border sm:px-8 sm:py-16 lg:-mx-8 lg:px-12 lg:pt-[4.8rem]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,249,250,0.12),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/15 to-transparent" />
        <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full border border-brand-gold/20 bg-brand-gold/10 blur-2xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute -left-24 bottom-2 h-52 w-52 rounded-full bg-brand-300/20 blur-3xl sm:h-64 sm:w-64" />
        <Reveal className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
          <div className="max-w-3xl space-y-5 sm:space-y-6">
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-brand-gold sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Premium climate comfort
            </p>
            <h1 className="text-[1.95rem] font-bold leading-[1.08] text-brand-ivory sm:text-4xl md:text-5xl">{t.home.title}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-brand-ivory/84 sm:text-base">{t.home.subtitle}</p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.08em] text-brand-ivory transition duration-300 hover:text-brand-gold"
              >
                <span className="relative">
                  {t.home.cta}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-gradient-to-r from-brand-gold/90 to-brand-gold/20 transition duration-300 group-hover:scale-x-110" />
                </span>
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full border border-brand-gold/35 bg-brand-ivory/10 px-4 py-2 text-sm font-medium text-brand-ivory/90 backdrop-blur-sm transition duration-300 hover:border-brand-gold/70 hover:bg-brand-ivory/15 hover:text-brand-ivory"
              >
                Learn more
                <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="hidden min-w-[250px] self-stretch rounded-[1.6rem] border border-brand-gold/20 bg-gradient-to-b from-brand-ivory/14 via-brand-ivory/6 to-transparent p-5 text-sm text-brand-ivory/80 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.7)] backdrop-blur sm:block">
            <p className="text-[10px] uppercase tracking-[0.22em] text-brand-gold/90">Showroom standard</p>
            <p className="mt-3 text-lg font-semibold leading-tight text-brand-ivory">Refined HVAC picks, curated for comfort and aesthetics.</p>
            <div className="mt-6 space-y-2 border-t border-brand-gold/20 pt-4 text-brand-ivory/74">
              <p>Premium multi-brand selection</p>
              <p>Design-conscious home integration</p>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal className="space-y-3.5 sm:space-y-4" delay={100}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="tr-section-title">Featured products</h2>
          <Link href="/products" className="text-sm font-medium text-brand-brown transition hover:text-brand-espresso hover:underline">View all</Link>
        </div>

        <div className="-mx-1.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1.5 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3">
          {products.slice(0, 6).map((product, index) => (
            <Reveal key={product.id} delay={index * 80} className="min-w-[86%] snap-start sm:min-w-0">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

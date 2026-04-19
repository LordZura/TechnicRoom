import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProducts } from '@/lib/supabase/queries';
import { ProductCard } from '@/components/products/product-card';
import { Reveal } from '@/components/ui/reveal';
import Link from 'next/link';

export default async function HomePage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const products = await getProducts();

  return (
    <div className="space-y-7 sm:space-y-10 lg:space-y-12">
      <section className="relative -mx-1 overflow-hidden rounded-[1.7rem] border border-brand-line/80 bg-gradient-to-br from-brand-brown via-[#6b4228] to-brand-espresso px-4 py-10 text-brand-ivory shadow-soft sm:mx-0 sm:rounded-[2rem] sm:px-8 sm:py-16">
        <div className="absolute -right-24 -top-20 h-52 w-52 rounded-full bg-brand-gold/20 blur-3xl sm:h-64 sm:w-64" />
        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#d1b58d]/18 blur-3xl sm:left-8 sm:h-52 sm:w-52" />
        <Reveal className="relative max-w-3xl space-y-4 sm:space-y-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-brand-gold sm:text-xs">Premium climate comfort</p>
          <h1 className="text-[1.8rem] font-bold leading-[1.13] text-brand-ivory sm:text-4xl md:text-5xl">{t.home.title}</h1>
          <p className="max-w-2xl text-sm text-brand-ivory/85 sm:text-base">{t.home.subtitle}</p>
          <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link href="/products" className="tr-btn-primary shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              {t.home.cta}
            </Link>
            <Link href="/about" className="tr-btn-ghost border-brand-gold/40 bg-brand-ivory/10 text-brand-ivory hover:bg-brand-ivory/20">Learn more</Link>
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

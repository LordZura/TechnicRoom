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
    <div className="space-y-8 sm:space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-brand-line bg-gradient-to-br from-brand-brown via-[#6b4228] to-brand-espresso px-5 py-12 text-brand-ivory shadow-soft sm:px-8 sm:py-16">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-gold/25 blur-3xl" />
        <div className="absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-[#d1b58d]/20 blur-3xl" />
        <Reveal className="relative max-w-3xl space-y-5">
          <p className="text-sm uppercase tracking-[0.24em] text-brand-gold">Premium climate comfort</p>
          <h1 className="text-3xl font-bold leading-tight text-brand-ivory md:text-5xl">{t.home.title}</h1>
          <p className="max-w-2xl text-sm text-brand-ivory/85 sm:text-base">{t.home.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="tr-btn-primary shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              {t.home.cta}
            </Link>
            <Link href="/about" className="tr-btn-ghost border-brand-gold/40 bg-brand-ivory/10 text-brand-ivory hover:bg-brand-ivory/20">Learn more</Link>
          </div>
        </Reveal>
      </section>

      <Reveal className="space-y-4" delay={100}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="tr-section-title">Featured products</h2>
          <Link href="/products" className="text-sm font-medium text-brand-brown transition hover:text-brand-espresso hover:underline">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.slice(0, 6).map((product, index) => (
            <Reveal key={product.id} delay={index * 80}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

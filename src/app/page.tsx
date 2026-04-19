import Link from 'next/link';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProducts } from '@/lib/supabase/queries';
import { ProductCard } from '@/components/products/product-card';

export default async function HomePage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const products = await getProducts();

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-r from-brand-700 to-brand-900 px-6 py-16 text-white">
        <h1 className="text-3xl font-bold md:text-5xl">{t.home.title}</h1>
        <p className="mt-3 max-w-xl text-white/85">{t.home.subtitle}</p>
        <Link href="/products" className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-brand-900">
          {t.home.cta}
        </Link>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Featured</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProducts } from '@/lib/supabase/queries';
import { ProductCard } from '@/components/products/product-card';
import { Reveal } from '@/components/ui/reveal';
import { CatalogSearch } from '@/components/products/catalog-search';


export const metadata: Metadata = {
  title: 'Buy Air Conditioners in Georgia',
  description: 'Browse air conditioners and HVAC systems with professional support and installation across Georgia.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Buy Air Conditioners in Georgia | Technic Room',
    description: 'Browse air conditioners and HVAC systems with professional support and installation across Georgia.',
    url: '/products',
    images: ['/og-image.png']
  }
};

export default async function ProductsPage({ searchParams }: { searchParams: { q?: string } }) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const products = await getProducts(searchParams.q);

  return (
    <div className="space-y-5 sm:space-y-6">
      <Reveal>
        <section className="tr-surface p-4 sm:p-6">
          <h1 className="tr-section-title">{t.products.title}</h1>
          <p className="tr-muted mt-2 max-w-2xl">{t.products.intro}</p>
          <CatalogSearch defaultValue={searchParams.q} placeholder={t.products.searchPlaceholder} />
        </section>
      </Reveal>

      {products.length === 0 ? (
        <div className="tr-surface animate-fade-in p-7 text-center text-brand-700/80">{t.products.empty}</div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {products.map((item, index) => (
            <Reveal key={item.id} delay={Math.min(index * 40, 240)}>
              <ProductCard product={item} mobileLayout="horizontal" />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

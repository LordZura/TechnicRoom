import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProducts } from '@/lib/supabase/queries';
import { ProductCard } from '@/components/products/product-card';
import { Reveal } from '@/components/ui/reveal';
import { CatalogSearch } from '@/components/products/catalog-search';

export default async function ProductsPage({ searchParams }: { searchParams: { q?: string } }) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const products = await getProducts(searchParams.q);

  return (
    <div className="space-y-5 sm:space-y-6">
      <Reveal>
        <section className="tr-surface p-4 sm:p-6">
          <h1 className="tr-section-title">{t.products.title}</h1>
          <p className="tr-muted mt-2 max-w-2xl">Browse dependable heating and cooling systems tailored for residential and commercial spaces.</p>
          <CatalogSearch defaultValue={searchParams.q} placeholder={t.products.searchPlaceholder} />
        </section>
      </Reveal>

      {products.length === 0 ? (
        <div className="tr-surface animate-fade-in p-7 text-center text-[#725c49]">{t.products.empty}</div>
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

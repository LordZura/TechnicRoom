import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProducts } from '@/lib/supabase/queries';
import { ProductCard } from '@/components/products/product-card';

export default async function ProductsPage({ searchParams }: { searchParams: { q?: string } }) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const products = await getProducts(searchParams.q);

  return (
    <div className="space-y-6">
      <section className="tr-surface p-4 sm:p-6">
        <h1 className="tr-section-title">{t.products.title}</h1>
        <p className="tr-muted mt-2">Browse dependable heating and cooling systems tailored for residential and commercial spaces.</p>
        <form className="mt-4">
          <input name="q" defaultValue={searchParams.q} placeholder={t.products.searchPlaceholder} className="tr-input" />
        </form>
      </section>

      {products.length === 0 ? (
        <div className="tr-surface p-8 text-center text-[#725c49]">{t.products.empty}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}

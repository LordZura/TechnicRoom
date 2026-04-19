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
      <h1 className="text-2xl font-bold">{t.products.title}</h1>
      <form>
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder={t.products.searchPlaceholder}
          className="w-full rounded-xl border border-slate-300 bg-white p-3"
        />
      </form>
      {products.length === 0 ? (
        <p>{t.products.empty}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}

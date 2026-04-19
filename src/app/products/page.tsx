import Link from 'next/link';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProducts } from '@/lib/supabase/queries';

export default async function ProductsPage({ searchParams }: { searchParams: { q?: string } }) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const products = await getProducts(searchParams.q);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.products.title}</h1>
      <form>
        <input name="q" defaultValue={searchParams.q} placeholder={t.products.searchPlaceholder} className="w-full rounded-xl border border-slate-300 bg-white p-3" />
      </form>
      {products.length === 0 ? <p>{t.products.empty}</p> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <Link href={`/products/${item.slug}`} key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-500">
              <p className="text-xs uppercase text-slate-500">{item.brand}</p>
              <h3 className="mt-1 font-semibold">{item.name || item.model}</h3>
              <p className="text-sm text-slate-600">{item.model}</p>
              <p className="text-xs text-slate-500">#{item.slug}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

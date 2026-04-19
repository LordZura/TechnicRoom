import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ProductGallery } from '@/components/products/product-gallery';
import { ShareButton } from '@/components/products/share-button';
import { SpecsTable } from '@/components/products/specs-table';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProductBySlug, getProducts, pickTranslation } from '@/lib/supabase/queries';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Not found' };
  return {
    title: `${product.brand} ${product.model} | Technic Room`,
    description: `Details and technical specs for ${product.model}.`
  };
}

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();
  const translation = pickTranslation(product, locale);

  const related = (await getProducts()).filter((item) => item.slug !== product.slug && item.brand === product.brand).slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <ProductGallery images={product.images} fallbackAlt={translation?.name || product.model} />
        <div className="space-y-3">
          <p className="text-sm uppercase text-slate-500">{product.brand}</p>
          <h1 className="text-3xl font-bold">{translation?.name || product.model}</h1>
          <p className="text-slate-600">Model: {product.model}</p>
          {translation?.description && <p className="text-slate-700">{translation.description}</p>}
          <ShareButton label={t.product.share} copiedLabel={t.product.copied} />
          {translation?.features && (
            <div>
              <h2 className="text-lg font-semibold">{t.product.features}</h2>
              <p className="text-slate-700">{translation.features}</p>
            </div>
          )}
        </div>
      </div>
      <section>
        <h2 className="mb-3 text-xl font-semibold">{t.product.specs}</h2>
        <SpecsTable product={product} />
      </section>
      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t.product.related}</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <Link key={item.id} href={`/products/${item.slug}`} className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-500">{item.brand}</p>
                <p className="font-medium">{item.model}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

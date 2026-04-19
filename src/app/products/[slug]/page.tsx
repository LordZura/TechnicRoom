import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ProductGallery } from '@/components/products/product-gallery';
import { ShareButton } from '@/components/products/share-button';
import { SpecsTable } from '@/components/products/specs-table';
import { ProductCard } from '@/components/products/product-card';
import { Reveal } from '@/components/ui/reveal';
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
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <ProductGallery images={product.images} fallbackAlt={translation?.name || product.model} />
        </Reveal>
        <Reveal delay={120}>
          <div className="tr-surface space-y-4 p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#876f5a]">{product.brand}</p>
            <h1 className="text-2xl font-bold sm:text-3xl">{translation?.name || product.model}</h1>
            <p className="text-sm text-[#705946]">Model: {product.model}</p>
            {translation?.description && <p className="text-sm text-[#624c3a] sm:text-base">{translation.description}</p>}
            <div className="pt-1">
              <ShareButton label={t.product.share} copiedLabel={t.product.copied} />
            </div>
            {translation?.features && (
              <div className="rounded-xl border border-brand-line bg-brand-cream p-4 transition hover:border-brand-gold/70">
                <h2 className="mb-2 text-base font-semibold">{t.product.features}</h2>
                <p className="text-sm text-[#624c3a]">{translation.features}</p>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      <Reveal className="space-y-3" delay={120}>
        <h2 className="tr-section-title">{t.product.specs}</h2>
        <SpecsTable product={product} />
      </Reveal>

      {related.length > 0 && (
        <Reveal className="space-y-4" delay={180}>
          <h2 className="tr-section-title">{t.product.related}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item, index) => (
              <Reveal key={item.id} delay={index * 70}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductGallery } from '@/components/products/product-gallery';
import { ShareButton } from '@/components/products/share-button';
import { SpecsTable } from '@/components/products/specs-table';
import { ProductCard } from '@/components/products/product-card';
import { Reveal } from '@/components/ui/reveal';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import {
  getAdminEditShortcutEnabled,
  getProductBySlug,
  getProducts,
  incrementProductView,
  pickTranslation,
} from '@/lib/supabase/queries';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function formatPrice(price: number) {
  return `₾${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(price)}`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  // Keep unpublished or missing products out of indexes.
  if (!product) {
    return {
      title: 'Product not found',
      robots: { index: false, follow: false }
    };
  }

  const translation = pickTranslation(product, 'en');
  const title = translation?.name || `${product.brand} ${product.model}`;
  const description =
    translation?.description || `Buy ${product.brand} ${product.model} with HVAC installation support in Georgia.`;
  const ogImage = product.images[0]?.storage_path || '/og-image.png';

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${title} | Technic Room`,
      description,
      url: `/products/${product.slug}`,
      images: [ogImage]
    }
  };
}

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();
  await incrementProductView(product.id);
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  const showAdminEdit = Boolean(session) && await getAdminEditShortcutEnabled();
  const translation = pickTranslation(product, locale);
  const numericPrice = product.price === null ? null : Number(product.price);
  const compareLabel = locale === 'ka' ? 'შედარება' : 'Compare to';
  const adminEditLabel = locale === 'ka' ? 'ადმინში რედაქტირება' : 'Edit in admin';

  const related = (await getProducts({ brand: [product.brand] }, { limit: 5 }))
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="space-y-7 pb-20 sm:space-y-8 sm:pb-0">
      <section className="grid gap-5 lg:grid-cols-[1.06fr_0.94fr] lg:gap-6">
        <Reveal>
          <ProductGallery images={product.images} fallbackAlt={translation?.name || product.model} locale={locale} />
        </Reveal>
        <Reveal delay={120}>
          <div className="tr-surface space-y-4 p-4 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-brand-600/80">{product.brand}</p>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{translation?.name || product.model}</h1>
            <p className="text-sm text-brand-700/85">{t.product.modelLabel}: {product.model}</p>
            {numericPrice !== null && Number.isFinite(numericPrice) && (
              <p className="text-xl font-semibold text-brand-brown">
                {formatPrice(numericPrice)}
              </p>
            )}
            {translation?.description && <p className="text-sm text-brand-800/85 sm:text-base">{translation.description}</p>}

            <div className="hidden gap-3 sm:flex">
              <ShareButton label={t.product.share} copiedLabel={t.product.copied} />
              <Link href="/contact" className="tr-btn-primary">{t.product.contactAdvisor}</Link>
              {showAdminEdit && (
                <Link href={`/admin/dashboard?product=${product.id}`} className="tr-btn-ghost">
                  {adminEditLabel}
                </Link>
              )}
            </div>

            {translation?.features && (
              <div className="rounded-2xl border border-brand-line bg-brand-cream p-4 transition hover:border-brand-gold/70">
                <h2 className="mb-2 text-base font-semibold">{t.product.features}</h2>
                <p className="text-sm text-brand-800/85">{translation.features}</p>
              </div>
            )}

            <div className="flex justify-end border-t border-brand-line pt-4">
              <Link href={`/compare?product=${product.slug}`} className="tr-btn-ghost">{compareLabel}</Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal className="space-y-3" delay={120}>
        <h2 className="tr-section-title">{t.product.specs}</h2>
        <SpecsTable product={product} />
      </Reveal>

      {related.length > 0 && (
        <Reveal className="space-y-3.5" delay={180}>
          <h2 className="tr-section-title">{t.product.related}</h2>
          <div className="-mx-1.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1.5 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4">
            {related.map((item, index) => (
              <Reveal key={item.id} delay={index * 70} className="min-w-[84%] snap-start sm:min-w-0">
                <ProductCard product={item} locale={locale} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-line bg-brand-ivory/95 px-3.5 py-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-2.5">
          <ShareButton label={t.product.share} copiedLabel={t.product.copied} />
          <Link href="/contact" className="tr-btn-primary flex-1">{t.product.contactAdvisor}</Link>
          {showAdminEdit && (
            <Link href={`/admin/dashboard?product=${product.id}`} className="tr-btn-ghost flex-1">
              {adminEditLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

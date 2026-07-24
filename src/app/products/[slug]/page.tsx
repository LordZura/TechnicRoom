import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, ChevronRight, PencilLine, Scale, Sparkles } from 'lucide-react';
import { ProductGallery } from '@/components/products/product-gallery';
import { ShareButton } from '@/components/products/share-button';
import { SpecsTable } from '@/components/products/specs-table';
import { ProductCard } from '@/components/products/product-card';
import { Reveal } from '@/components/ui/reveal';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProductOptionLabel } from '@/lib/product-options';
import {
  getAdminEditShortcutEnabled,
  getProductBySlug,
  getProducts,
  incrementProductView,
  pickTranslation
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
  const showAdminEdit = Boolean(session) && (await getAdminEditShortcutEnabled());
  const translation = pickTranslation(product, locale);
  const numericPrice = product.price === null ? null : Number(product.price);
  const productName = translation?.name || product.model;
  const compareLabel = locale === 'ka' ? 'შედარება' : 'Compare to';
  const adminEditLabel = locale === 'ka' ? 'ადმინში რედაქტირება' : 'Edit in admin';
  const homeLabel = locale === 'ka' ? 'მთავარი' : 'Home';

  const related = (await getProducts({ brand: [product.brand] }, { limit: 5 }))
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  // Small at-a-glance chips above the fold.
  const quickFacts = [
    product.category && getProductOptionLabel('category', product.category, locale),
    product.recommended_area && `${t.productSpecLabels.recommended_area}: ${product.recommended_area}`,
    product.cooling_power && `${t.productSpecLabels.cooling_power}: ${product.cooling_power}`
  ].filter(Boolean) as string[];

  return (
    <div className="tr-shell pb-28 pt-6 sm:pb-8 sm:pt-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-ink-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="transition-colors hover:text-wine-700">
              {homeLabel}
            </Link>
          </li>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <li>
            <Link href="/products" className="transition-colors hover:text-wine-700">
              {t.nav.products}
            </Link>
          </li>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <li className="truncate font-medium text-ink-700">{productName}</li>
        </ol>
      </nav>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <Reveal variant="fade">
          <div className="lg:sticky lg:top-[5.5rem]">
            <ProductGallery
              images={product.images}
              fallbackAlt={productName}
              locale={locale}
            />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="space-y-6">
            <div>
              <Link
                href={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="tr-eyebrow transition-colors hover:text-wine-800"
              >
                {product.brand}
              </Link>

              <h1 className="tr-display mt-2.5 text-[1.75rem] text-ink-900 sm:text-[2.35rem]">
                {productName}
              </h1>

              <p className="mt-2.5 text-sm text-ink-500">
                {t.product.modelLabel} · <span className="font-semibold text-ink-700">{product.model}</span>
              </p>
            </div>

            {numericPrice !== null && Number.isFinite(numericPrice) && (
              <p className="font-display text-[2rem] font-extrabold tracking-[-0.03em] tabular-nums text-wine-700 sm:text-[2.35rem]">
                {formatPrice(numericPrice)}
              </p>
            )}

            {quickFacts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {quickFacts.map((fact) => (
                  <span
                    key={fact}
                    className="inline-flex items-center rounded-full bg-ink-100 px-3 py-1.5 text-[0.75rem] font-semibold text-ink-600"
                  >
                    {fact}
                  </span>
                ))}
                {product.has_fresh_air_intake && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sea-50 px-3 py-1.5 text-[0.75rem] font-semibold text-sea-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t.productSpecLabels.has_fresh_air_intake}
                  </span>
                )}
              </div>
            )}

            {translation?.description && (
              <p className="text-[0.9375rem] leading-relaxed text-ink-600">
                {translation.description}
              </p>
            )}

            {/* Desktop actions */}
            <div className="hidden flex-wrap gap-2.5 sm:flex">
              <Link href="/contact" className="tr-btn-primary group">
                {t.product.contactAdvisor}
                <ArrowRight className="h-4 w-4 transition-transform duration-400 ease-smooth group-hover:translate-x-1" />
              </Link>

              <ShareButton label={t.product.share} copiedLabel={t.product.copied} />

              <Link href={`/compare?product=${product.slug}`} className="tr-btn-ghost">
                <Scale className="h-4 w-4" />
                {compareLabel}
              </Link>

              {showAdminEdit && (
                <Link href={`/admin/dashboard?product=${product.id}`} className="tr-btn-quiet">
                  <PencilLine className="h-4 w-4" />
                  {adminEditLabel}
                </Link>
              )}
            </div>

            {translation?.features && (
              <div className="tr-card group p-5 sm:p-6">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-wine-50 blur-2xl"
                />
                <h2 className="relative inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-wine-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t.product.features}
                </h2>
                <p className="relative mt-3 whitespace-pre-line text-[0.9375rem] leading-relaxed text-ink-700">
                  {translation.features}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* Specs */}
      <Reveal className="mt-14 sm:mt-20" delay={80}>
        <h2 className="tr-section-title">{t.product.specs}</h2>
        <div className="mt-5">
          <SpecsTable product={product} />
        </div>
      </Reveal>

      {/* Related */}
      {related.length > 0 && (
        <Reveal className="mt-14 sm:mt-20" delay={80}>
          <h2 className="tr-section-title">{t.product.related}</h2>

          <div className="-mx-4 mt-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-3 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4">
            {related.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 70}
                className="min-w-[78%] snap-start sm:min-w-0"
              >
                <ProductCard product={item} locale={locale} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/90 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-2">
          <ShareButton
            label={t.product.share}
            copiedLabel={t.product.copied}
            iconOnly
            className="min-h-11 shrink-0"
          />

          <Link
            href={`/compare?product=${product.slug}`}
            className="tr-btn-ghost min-h-11 w-11 shrink-0 px-0"
            title={compareLabel}
          >
            <Scale className="h-4 w-4" />
            <span className="sr-only">{compareLabel}</span>
          </Link>

          {showAdminEdit && (
            <Link
              href={`/admin/dashboard?product=${product.id}`}
              className="tr-btn-quiet min-h-11 w-11 shrink-0 px-0"
              title={adminEditLabel}
            >
              <PencilLine className="h-4 w-4" />
              <span className="sr-only">{adminEditLabel}</span>
            </Link>
          )}

          <Link href="/contact" className="tr-btn-primary min-h-11 flex-1">
            {t.product.contactAdvisor}
          </Link>
        </div>
      </div>
    </div>
  );
}

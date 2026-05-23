import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CompareSearchBox } from '@/components/products/compare-search-box';
import { Reveal } from '@/components/ui/reveal';
import { buildCompareRows, CompareRow } from '@/lib/compare';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getProductBySlug, getProducts, pickTranslation } from '@/lib/supabase/queries';
import type { Locale, ProductWithRelations } from '@/types';

export const metadata: Metadata = {
  title: 'Compare Products',
  robots: {
    index: false,
    follow: false
  }
};

function productName(product: ProductWithRelations, locale: Locale) {
  return pickTranslation(product, locale)?.name || product.model;
}

function coverImage(product: ProductWithRelations) {
  return product.images[0]?.storage_path || null;
}

function ProductHeader({ product, locale }: { product: ProductWithRelations; locale: Locale }) {
  const image = coverImage(product);

  return (
    <Link href={`/products/${product.slug}`} className="group block rounded-xl border border-brand-line bg-brand-cream p-3 transition hover:border-brand-brown hover:bg-brand-ivory">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-brand-50">
        {image ? (
          <Image src={image} alt={productName(product, locale)} fill className="object-contain p-2 transition group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.16em] text-brand-600/70">No image</div>
        )}
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700/75">{product.brand}</p>
      <h2 className="mt-1 line-clamp-2 text-base font-semibold text-brand-espresso">{productName(product, locale)}</h2>
      <p className="mt-1 text-xs text-brand-700/75">{product.model}</p>
    </Link>
  );
}

function EmptyHeader({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] min-h-44 items-center justify-center rounded-xl border border-dashed border-brand-line bg-brand-cream p-4 text-center text-sm font-semibold text-brand-700/75">
      {label}
    </div>
  );
}

function CompareTable({ title, rows }: { title: string; rows: CompareRow[] }) {
  if (!rows.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="tr-section-title">{title}</h2>
      <div className="overflow-hidden rounded-2xl border border-brand-line bg-brand-ivory shadow-soft">
        {rows.map((row, index) => {
          const differs = row.first && row.second && row.first !== row.second;

          return (
            <div
              key={row.key}
              className={`grid gap-0 border-brand-sand sm:grid-cols-[1.1fr_1fr_1fr] ${
                index !== rows.length - 1 ? 'border-b' : ''
              } ${index % 2 === 0 ? 'bg-brand-ivory' : 'bg-brand-50'}`}
            >
              <div className="border-b border-brand-sand px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-brand-700/75 sm:border-b-0 sm:border-r sm:text-[11px]">
                {row.label}
              </div>
              <div className={`border-b border-brand-sand px-4 py-3 text-sm text-brand-espresso sm:border-b-0 sm:border-r ${differs ? 'font-semibold' : ''}`}>
                {row.first || '-'}
              </div>
              <div className={`px-4 py-3 text-sm text-brand-espresso ${differs ? 'font-semibold text-brand-brown' : ''}`}>
                {row.second || '-'}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default async function ComparePage({
  searchParams
}: {
  searchParams: {
    product?: string;
    compare?: string;
  };
}) {
  const firstSlug = searchParams.product;
  if (!firstSlug) return notFound();

  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const [first, second, candidates] = await Promise.all([
    getProductBySlug(firstSlug),
    searchParams.compare ? getProductBySlug(searchParams.compare) : Promise.resolve(null),
    getProducts()
  ]);

  if (!first) return notFound();

  const { defaultRows, customRows } = buildCompareRows({
    first,
    second,
    locale,
    labels: {
      ...t.productSpecLabels,
      brand: locale === 'ka' ? 'ბრენდი' : 'Brand',
      model: t.product.modelLabel,
      category: locale === 'ka' ? 'ტიპი' : 'Type',
      price: locale === 'ka' ? 'ფასი' : 'Price',
      description: locale === 'ka' ? 'აღწერა' : 'Description',
      features: t.product.features
    }
  });

  const compareLabels = {
    title: locale === 'ka' ? 'პროდუქტების შედარება' : 'Product Compare',
    subtitle: locale === 'ka'
      ? 'პირველი პროდუქტი უკვე არჩეულია. მოძებნეთ მეორე პროდუქტი სახელით.'
      : 'The first product is already selected. Search the second product by name.',
    first: locale === 'ka' ? 'პირველი პროდუქტი' : 'First product',
    second: locale === 'ka' ? 'შესადარებელი პროდუქტი' : 'Compare to',
    chooseProduct: locale === 'ka' ? 'აირჩიეთ მეორე პროდუქტი' : 'Choose second product',
    searchFirst: locale === 'ka' ? 'პირველი პროდუქტის შეცვლა სახელით...' : 'Change first product by name...',
    searchSecond: locale === 'ka' ? 'მეორე პროდუქტის ძებნა სახელით...' : 'Search second product by name...',
    selected: locale === 'ka' ? 'არჩეულია' : 'Selected',
    empty: locale === 'ka' ? 'ამ სახელით პროდუქტი ვერ მოიძებნა.' : 'No product found by that name.',
    defaultSpecs: locale === 'ka' ? 'ძირითადი შედარება' : 'Default comparison',
    customSpecs: locale === 'ka' ? 'დამატებითი ხაზები' : 'Custom lines'
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <section className="tr-surface p-4 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700/75">{compareLabels.second}</p>
        <h1 className="mt-1 text-2xl font-bold text-brand-espresso sm:text-3xl">{compareLabels.title}</h1>
        <p className="tr-muted mt-2 max-w-2xl text-sm">{compareLabels.subtitle}</p>
      </section>

      <Reveal>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700/75">{compareLabels.first}</p>
            <CompareSearchBox
              products={candidates}
              firstSlug={first.slug}
              secondSlug={second?.slug}
              slot="first"
              locale={locale}
              labels={{
                placeholder: compareLabels.searchFirst,
                selected: compareLabels.selected,
                empty: compareLabels.empty
              }}
            />
            <ProductHeader product={first} locale={locale} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700/75">{compareLabels.second}</p>
            <CompareSearchBox
              products={candidates}
              firstSlug={first.slug}
              secondSlug={second?.slug}
              slot="second"
              locale={locale}
              labels={{
                placeholder: compareLabels.searchSecond,
                selected: compareLabels.selected,
                empty: compareLabels.empty
              }}
            />
            {second ? <ProductHeader product={second} locale={locale} /> : <EmptyHeader label={compareLabels.chooseProduct} />}
          </div>
        </div>
      </Reveal>

      <Reveal className="space-y-6" delay={140}>
        <CompareTable title={compareLabels.defaultSpecs} rows={defaultRows} />
        <CompareTable title={compareLabels.customSpecs} rows={customRows} />
      </Reveal>
    </div>
  );
}

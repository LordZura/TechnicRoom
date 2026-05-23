import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CompareSearchBox } from "@/components/products/compare-search-box";
import { Reveal } from "@/components/ui/reveal";
import { buildCompareRows, CompareRow } from "@/lib/compare";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocaleFromCookie } from "@/lib/i18n/locale";
import {
  getProductBySlug,
  getProducts,
  pickTranslation,
} from "@/lib/supabase/queries";
import type { Locale, ProductWithRelations } from "@/types";

export const metadata: Metadata = {
  title: "Compare Products",
  robots: {
    index: false,
    follow: false,
  },
};

function productName(product: ProductWithRelations, locale: Locale) {
  return pickTranslation(product, locale)?.name || product.model;
}

function coverImage(product: ProductWithRelations) {
  return product.images[0]?.storage_path || null;
}

function ProductHeader({
  product,
  locale,
}: {
  product: ProductWithRelations;
  locale: Locale;
}) {
  const image = coverImage(product);
  const name = productName(product, locale);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block h-full min-w-0 overflow-hidden rounded-xl border border-brand-line bg-brand-cream p-2 transition hover:border-brand-brown hover:bg-brand-ivory"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-brand-50">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-1 transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] leading-tight text-brand-600/70 break-words whitespace-normal">
            No image
          </div>
        )}
      </div>

      <div className="mt-2 min-h-[4.5rem] min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700/75">
          {product.brand}
        </p>
        <h2 className="mt-1 min-h-[2.5rem] line-clamp-2 text-sm font-semibold leading-snug text-brand-espresso">
          {name}
        </h2>
        <p className="mt-1 min-h-[1.1rem] text-[11px] text-brand-700/75">
          {product.model}
        </p>
      </div>
    </Link>
  );
}

function EmptyHeader({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] min-h-44 min-w-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-brand-line bg-brand-cream p-3 text-center">
      <span className="max-w-full px-1 text-[10px] font-semibold uppercase tracking-[0.12em] leading-tight text-brand-700/75 break-words whitespace-normal">
        {label}
      </span>
    </div>
  );
}

function CompareTable({ title, rows }: { title: string; rows: CompareRow[] }) {
  if (!rows.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="tr-section-title">{title}</h2>

      <div className="overflow-x-auto rounded-2xl border border-brand-line bg-brand-ivory shadow-soft">
        <div className="min-w-[560px]">
          {rows.map((row, index) => {
            const differs = row.first && row.second && row.first !== row.second;

            return (
              <div
                key={row.key}
                className={`grid grid-cols-[1.1fr_1fr_1fr] gap-0 border-brand-sand ${
                  index !== rows.length - 1 ? "border-b" : ""
                } ${index % 2 === 0 ? "bg-brand-ivory" : "bg-brand-50"}`}
              >
                <div className="border-b border-brand-sand px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-700/75 sm:border-b-0 sm:border-r">
                  {row.label}
                </div>

                <div
                  className={`border-b border-brand-sand px-3 py-2 text-xs text-brand-espresso sm:border-b-0 sm:border-r ${
                    differs ? "font-semibold" : ""
                  }`}
                >
                  {row.first || "-"}
                </div>

                <div
                  className={`px-3 py-2 text-xs text-brand-espresso ${differs ? "font-semibold text-brand-brown" : ""}`}
                >
                  {row.second || "-"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default async function ComparePage({
  searchParams,
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
    searchParams.compare
      ? getProductBySlug(searchParams.compare)
      : Promise.resolve(null),
    getProducts(),
  ]);

  if (!first) return notFound();

  const { defaultRows, customRows } = buildCompareRows({
    first,
    second,
    locale,
    labels: {
      ...t.productSpecLabels,
      brand: locale === "ka" ? "ბრენდი" : "Brand",
      model: t.product.modelLabel,
      category: locale === "ka" ? "ტიპი" : "Type",
      price: locale === "ka" ? "ფასი" : "Price",
      description: locale === "ka" ? "აღწერა" : "Description",
      features: t.product.features,
    },
  });

  const compareLabels = {
    title: locale === "ka" ? "პროდუქტების შედარება" : "Product Compare",
    subtitle:
      locale === "ka"
        ? "პირველი პროდუქტი უკვე არჩეულია. მოძებნეთ მეორე პროდუქტი სახელით."
        : "The first product is already selected. Search the second product by name.",
    first: locale === "ka" ? "პირველი პროდუქტი" : "First product",
    second: locale === "ka" ? "შესადარებელი პროდუქტი" : "Compare to",
    chooseProduct:
      locale === "ka" ? "აირჩიეთ მეორე პროდუქტი" : "Choose second product",
    searchFirst:
      locale === "ka"
        ? "პირველი პროდუქტის შეცვლა სახელით..."
        : "Change first product by name...",
    searchSecond:
      locale === "ka"
        ? "მეორე პროდუქტის ძებნა სახელით..."
        : "Search second product by name...",
    selected: locale === "ka" ? "არჩეულია" : "Selected",
    empty:
      locale === "ka"
        ? "ამ სახელით პროდუქტი ვერ მოიძებნა."
        : "No product found by that name.",
    defaultSpecs: locale === "ka" ? "ძირითადი შედარება" : "Default comparison",
    customSpecs: locale === "ka" ? "დამატებითი ხაზები" : "Custom lines",
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <section className="tr-surface p-4 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700/75">
          {compareLabels.second}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-espresso sm:text-3xl">
          {compareLabels.title}
        </h1>
        <p className="tr-muted mt-2 max-w-2xl text-sm">
          {compareLabels.subtitle}
        </p>
      </section>

      <Reveal>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-700/75">
              {compareLabels.first}
            </p>

            <div className="relative z-20 min-w-0">
              <CompareSearchBox
                products={candidates}
                firstSlug={first.slug}
                secondSlug={second?.slug}
                slot="first"
                locale={locale}
                labels={{
                  placeholder: compareLabels.searchFirst,
                  selected: compareLabels.selected,
                  empty: compareLabels.empty,
                }}
              />
            </div>

            <ProductHeader product={first} locale={locale} />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-700/75">
              {compareLabels.second}
            </p>

            <div className="relative z-10 min-w-0">
              <CompareSearchBox
                products={candidates}
                firstSlug={first.slug}
                secondSlug={second?.slug}
                slot="second"
                locale={locale}
                labels={{
                  placeholder: compareLabels.searchSecond,
                  selected: compareLabels.selected,
                  empty: compareLabels.empty,
                }}
              />
            </div>

            {second ? (
              <ProductHeader product={second} locale={locale} />
            ) : (
              <EmptyHeader label={compareLabels.chooseProduct} />
            )}
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

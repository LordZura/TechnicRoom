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
  description:
    "Compare air conditioner models by technical specifications, price, features, and dimensions.",
  alternates: { canonical: "/products" },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Compare Air Conditioner Models | Technic Room",
    description:
      "Compare air conditioner models by technical specifications, price, features, and dimensions.",
    url: "/compare",
    images: ["/logo.png"],
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
      className="tr-card tr-card-hover group block h-full min-h-[13rem] min-w-0 p-2.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-ink-50 via-white to-ink-50 ring-1 ring-inset ring-ink-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 45vw, 30vw"
            className="object-contain p-2 transition-transform duration-600 ease-smooth group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center whitespace-normal break-words px-2 text-center text-[0.5625rem] font-semibold uppercase leading-tight tracking-[0.14em] text-ink-300">
            No image
          </span>
        )}
      </div>

      <div className="mt-2.5 min-h-[4.75rem] min-w-0 px-1">
        <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-wine-600">
          {product.brand}
        </p>
        <h2 className="mt-1 line-clamp-2 min-h-[2.5rem] font-display text-sm font-bold leading-snug text-ink-900 transition-colors duration-300 group-hover:text-wine-800">
          {name}
        </h2>
        <p className="mt-1 min-h-[1.1rem] truncate text-[0.6875rem] text-ink-500">
          {product.model}
        </p>
      </div>
    </Link>
  );
}

function EmptyHeader({ label }: { label: string }) {
  return (
    <div className="flex min-h-[13rem] items-center justify-center overflow-hidden rounded-3xl border border-dashed border-ink-200 bg-ink-50/50 p-4 text-center">
      <span className="max-w-full whitespace-normal break-words px-1 text-[0.625rem] font-semibold uppercase leading-tight tracking-[0.12em] text-ink-400">
        {label}
      </span>
    </div>
  );
}

function CompareTable({ title, rows }: { title: string; rows: CompareRow[] }) {
  if (!rows.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="tr-section-title">{title}</h2>

      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
        {rows.map((row, index) => {
          const differs = row.first && row.second && row.first !== row.second;

          return (
            <div
              key={row.key}
              className={`transition-colors duration-300 hover:bg-wine-50/40 ${
                index !== rows.length - 1 ? "border-b border-ink-100" : ""
              }`}
            >
              {/* Mobile */}
              <div className="px-3.5 py-3 sm:hidden">
                <div className="whitespace-normal break-words text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-ink-400">
                  {row.label}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div
                    className={`min-w-0 whitespace-normal break-words rounded-xl bg-ink-50 px-2.5 py-2 text-[0.75rem] text-ink-800 ${
                      differs ? "font-bold" : ""
                    }`}
                  >
                    {row.first || "—"}
                  </div>

                  <div
                    className={`min-w-0 whitespace-normal break-words rounded-xl px-2.5 py-2 text-[0.75rem] ${
                      differs
                        ? "bg-wine-50 font-bold text-wine-800"
                        : "bg-ink-50 text-ink-800"
                    }`}
                  >
                    {row.second || "—"}
                  </div>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden grid-cols-[minmax(8rem,0.9fr)_1fr_1fr] items-baseline gap-4 px-5 py-3.5 sm:grid">
                <div className="whitespace-normal break-words text-[0.75rem] font-medium text-ink-500">
                  {row.label}
                </div>

                <div
                  className={`whitespace-normal break-words text-[0.8125rem] text-ink-900 ${
                    differs ? "font-bold" : "font-medium"
                  }`}
                >
                  {row.first || "—"}
                </div>

                <div
                  className={`whitespace-normal break-words text-[0.8125rem] ${
                    differs ? "font-bold text-wine-700" : "font-medium text-ink-900"
                  }`}
                >
                  {row.second || "—"}
                </div>
              </div>
            </div>
          );
        })}
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
    <div className="tr-shell space-y-8 pb-12 pt-8 sm:pt-10">
      <header className="max-w-2xl">
        <p className="tr-eyebrow">Technic Room</p>
        <h1 className="tr-section-title mt-2 text-[1.7rem] sm:text-[2.1rem]">
          {compareLabels.title}
        </h1>
      </header>

      <Reveal>
        <div className="grid grid-cols-2 items-start gap-3 sm:gap-5">
          <div className="flex min-w-0 flex-col gap-2.5">
            <div className="min-h-[2.5rem]">
              <p className="line-clamp-2 text-[0.625rem] font-bold uppercase leading-tight tracking-[0.14em] text-ink-400">
                {compareLabels.first}
              </p>
            </div>

            <div className="relative z-20 min-h-[3.25rem] min-w-0">
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

          <div className="flex min-w-0 flex-col gap-2.5">
            <div className="min-h-[2.5rem]">
              <p className="line-clamp-2 text-[0.625rem] font-bold uppercase leading-tight tracking-[0.14em] text-ink-400">
                {compareLabels.second}
              </p>
            </div>

            <div className="relative z-10 min-h-[3.25rem] min-w-0">
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

      <Reveal className="space-y-10" delay={140}>
        <CompareTable title={compareLabels.defaultSpecs} rows={defaultRows} />
        <CompareTable title={compareLabels.customSpecs} rows={customRows} />
      </Reveal>
    </div>
  );
}

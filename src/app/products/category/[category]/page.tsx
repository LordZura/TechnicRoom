import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getProductOptionLabel } from '@/lib/product-options';
import { getProducts } from '@/lib/supabase/queries';
import { breadcrumbJsonLd, DEFAULT_OG_IMAGE, findValueBySlug } from '@/lib/seo';
import { slugify } from '@/lib/slug';

type CategoryPageProps = {
  params: { category: string };
};

async function getCategoryProducts(categorySlug: string) {
  const products = await getProducts();
  const category = findValueBySlug(products.map((product) => product.category), categorySlug);

  if (!category) return { category: null, products: [] };

  return {
    category,
    products: products.filter((product) => product.category?.trim().toLowerCase() === category.toLowerCase())
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category, products } = await getCategoryProducts(params.category);

  if (!category || products.length === 0) {
    return {
      title: 'Category not found',
      robots: { index: false, follow: false }
    };
  }

  const label = getProductOptionLabel('category', category, 'en');
  const description = `Browse ${label} air conditioners available from Technic Room in Georgia, including live models, prices, and specifications.`;

  return {
    title: `${label} Air Conditioners in Georgia`,
    description,
    alternates: { canonical: `/products/category/${slugify(category)}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${label} Air Conditioners | Technic Room`,
      description,
      url: `/products/category/${slugify(category)}`,
      images: [DEFAULT_OG_IMAGE]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${label} Air Conditioners | Technic Room`,
      description,
      images: [DEFAULT_OG_IMAGE]
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const { category, products } = await getCategoryProducts(params.category);

  if (!category || products.length === 0) return notFound();

  const label = getProductOptionLabel('category', category, locale);
  const homeText = locale === 'ka' ? 'მთავარი' : 'Home';
  const productsText = locale === 'ka' ? 'პროდუქტები' : 'Products';
  const title = locale === 'ka' ? `${label} კონდიციონერები` : `${label} Air Conditioners`;
  const intro =
    locale === 'ka'
      ? `დაათვალიერეთ ${label} ტიპის მოქმედი მოდელები, ფასები და ტექნიკური მახასიათებლები.`
      : `Browse current ${label} models with prices, technical specifications, and product pages.`;

  const breadcrumb = breadcrumbJsonLd([
    { name: homeText, url: '/' },
    { name: productsText, url: '/products' },
    { name: title, url: `/products/category/${slugify(category)}` }
  ]);

  return (
    <div className="space-y-5 pt-3 sm:space-y-6 sm:pt-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <nav aria-label="Breadcrumb" className="text-xs text-brand-700/75">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-brand-brown">{homeText}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-brand-brown">{productsText}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-brand-espresso">{title}</li>
        </ol>
      </nav>

      <section className="tr-surface p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700/75">
          {t.products.typeFilter}
        </p>
        <h1 className="mt-1 tr-section-title">{title}</h1>
        <p className="tr-muted mt-2 max-w-3xl text-sm">{intro}</p>
      </section>

      <section className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} mobileLayout="horizontal" locale={locale} />
        ))}
      </section>
    </div>
  );
}

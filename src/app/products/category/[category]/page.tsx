import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getProductOptionLabel } from '@/lib/product-options';
import { getProductFilterOptions, getProducts } from '@/lib/supabase/queries';
import { breadcrumbJsonLd, DEFAULT_OG_IMAGE, findValueBySlug } from '@/lib/seo';
import { slugify } from '@/lib/slug';

type CategoryPageProps = {
  params: { category: string };
};

async function getCategoryProducts(categorySlug: string) {
  const filterOptions = await getProductFilterOptions();
  const category = findValueBySlug(filterOptions.categories, categorySlug);

  if (!category) return { category: null, products: [] };

  return {
    category,
    products: await getProducts({ category: [category] })
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
    <div className="tr-shell pt-6 sm:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <nav aria-label="Breadcrumb" className="text-xs text-ink-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="transition-colors hover:text-wine-700">{homeText}</Link></li>
          <li aria-hidden="true" className="text-ink-300">/</li>
          <li><Link href="/products" className="transition-colors hover:text-wine-700">{productsText}</Link></li>
          <li aria-hidden="true" className="text-ink-300">/</li>
          <li className="font-medium text-ink-700">{title}</li>
        </ol>
      </nav>

      <header className="mt-5 max-w-3xl">
        <p className="tr-eyebrow">{t.products.typeFilter}</p>
        <h1 className="tr-section-title mt-2 text-[1.7rem] sm:text-[2.1rem] md:text-[2.4rem]">{title}</h1>
        <p className="tr-muted mt-3 max-w-2xl">{intro}</p>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
          >
            <ProductCard product={product} mobileLayout="horizontal" locale={locale} />
          </div>
        ))}
      </section>
    </div>
  );
}

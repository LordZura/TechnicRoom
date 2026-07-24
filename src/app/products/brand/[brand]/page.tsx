import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getProductFilterOptions, getProducts } from '@/lib/supabase/queries';
import { breadcrumbJsonLd, DEFAULT_OG_IMAGE, findValueBySlug } from '@/lib/seo';
import { slugify } from '@/lib/slug';

type BrandPageProps = {
  params: { brand: string };
};

async function getBrandProducts(brandSlug: string) {
  const filterOptions = await getProductFilterOptions();
  const brand = findValueBySlug(filterOptions.brands, brandSlug);

  if (!brand) return { brand: null, products: [] };

  return {
    brand,
    products: await getProducts({ brand: [brand] })
  };
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand, products } = await getBrandProducts(params.brand);

  if (!brand || products.length === 0) {
    return {
      title: 'Brand not found',
      robots: { index: false, follow: false }
    };
  }

  const description = `Browse ${brand} air conditioners available from Technic Room in Georgia, including current models, prices, and technical specifications.`;

  return {
    title: `${brand} Air Conditioners in Georgia`,
    description,
    alternates: { canonical: `/products/brand/${slugify(brand)}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${brand} Air Conditioners | Technic Room`,
      description,
      url: `/products/brand/${slugify(brand)}`,
      images: [DEFAULT_OG_IMAGE]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand} Air Conditioners | Technic Room`,
      description,
      images: [DEFAULT_OG_IMAGE]
    }
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);
  const { brand, products } = await getBrandProducts(params.brand);

  if (!brand || products.length === 0) return notFound();

  const homeText = locale === 'ka' ? 'მთავარი' : 'Home';
  const productsText = locale === 'ka' ? 'პროდუქტები' : 'Products';
  const title = locale === 'ka' ? `${brand} კონდიციონერები` : `${brand} Air Conditioners`;
  const intro =
    locale === 'ka'
      ? `დაათვალიერეთ ${brand} ბრენდის მოქმედი მოდელები, ფასები და ტექნიკური მახასიათებლები.`
      : `Browse current ${brand} models with prices, technical specifications, and product pages.`;

  const breadcrumb = breadcrumbJsonLd([
    { name: homeText, url: '/' },
    { name: productsText, url: '/products' },
    { name: title, url: `/products/brand/${slugify(brand)}` }
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
        <p className="tr-eyebrow">{t.products.brandFilter}</p>
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

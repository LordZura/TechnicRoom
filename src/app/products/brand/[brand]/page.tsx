import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/products/product-card';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getProducts } from '@/lib/supabase/queries';
import { breadcrumbJsonLd, DEFAULT_OG_IMAGE, findValueBySlug } from '@/lib/seo';
import { slugify } from '@/lib/slug';

type BrandPageProps = {
  params: { brand: string };
};

async function getBrandProducts(brandSlug: string) {
  const products = await getProducts();
  const brand = findValueBySlug(products.map((product) => product.brand), brandSlug);

  if (!brand) return { brand: null, products: [] };

  return {
    brand,
    products: products.filter((product) => product.brand.trim().toLowerCase() === brand.toLowerCase())
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
          {t.products.brandFilter}
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

import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/supabase/queries';
import { SITE_URL, uniqueValues } from '@/lib/seo';
import { slugify } from '@/lib/slug';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Only include routes that exist in this repository.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 }
  ];

  const products = await getProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: new Date(product.updated_at || product.created_at),
    changeFrequency: 'weekly',
    priority: 0.8
  }));
  const latestProductModified = products.reduce((latest, product) => {
    const modified = new Date(product.updated_at || product.created_at);
    return modified > latest ? modified : latest;
  }, new Date(0));
  const brandRoutes: MetadataRoute.Sitemap = uniqueValues(products.map((product) => product.brand)).map((brand) => ({
    url: `${SITE_URL}/products/brand/${slugify(brand)}`,
    lastModified: latestProductModified,
    changeFrequency: 'weekly',
    priority: 0.65
  }));
  const categoryRoutes: MetadataRoute.Sitemap = uniqueValues(products.map((product) => product.category)).map((category) => ({
    url: `${SITE_URL}/products/category/${slugify(category)}`,
    lastModified: latestProductModified,
    changeFrequency: 'weekly',
    priority: 0.65
  }));

  return [...staticRoutes, ...brandRoutes, ...categoryRoutes, ...productRoutes];
}

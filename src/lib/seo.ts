import type { Metadata } from 'next';
import { getProductOptionLabel } from '@/lib/product-options';
import { slugify } from '@/lib/slug';
import type { CatalogProduct } from '@/lib/supabase/queries';
import type { Locale, ProductWithRelations } from '@/types';

export const SITE_URL = 'https://technic-room.com';
export const SITE_NAME = 'Technic Room';
export const DEFAULT_OG_IMAGE = '/logo.png';
export const PRICE_CURRENCY = 'GEL';

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function findValueBySlug(values: Array<string | null | undefined>, slug: string) {
  return uniqueValues(values).find((value) => slugify(value) === slug) ?? null;
}

export function getCatalogProductName(product: CatalogProduct, locale: Locale) {
  return locale === 'ka'
    ? product.name_ka || product.name || product.name_en || product.model
    : product.name_en || product.name || product.name_ka || product.model;
}

export function getProductName(product: ProductWithRelations, locale: Locale) {
  const translation = product.translations.find((item) => item.locale === locale);
  const fallback = product.translations.find((item) => item.locale === 'en');
  return translation?.name || fallback?.name || `${product.brand} ${product.model}`;
}

export function getProductDescription(product: ProductWithRelations, locale: Locale) {
  const translation = product.translations.find((item) => item.locale === locale);
  const fallback = product.translations.find((item) => item.locale === 'en');
  const description = translation?.description || fallback?.description;

  if (description?.trim()) return description.trim();

  const category = product.category ? getProductOptionLabel('category', product.category, locale) : null;
  const area = product.recommended_area ? ` ${product.recommended_area}` : '';

  if (locale === 'ka') {
    return `${product.brand} ${product.model}${category ? ` ${category}` : ''} კონდიციონერი${area ? ` რეკომენდებულია ${area} სივრცისთვის` : ''}.`;
  }

  return `${product.brand} ${product.model}${category ? ` ${category}` : ''} air conditioner${area ? ` recommended for ${area} spaces` : ''}.`;
}

export function truncateMeta(value: string, maxLength = 155) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

export function buildProductMetadata(product: ProductWithRelations): Metadata {
  const name = getProductName(product, 'en');
  const title = name.toLowerCase().includes(product.model.toLowerCase())
    ? name
    : `${product.brand} ${product.model} - ${name}`;
  const description = truncateMeta(getProductDescription(product, 'en'));
  const url = `/products/${product.slug}`;
  const image = product.images[0]?.storage_path || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image]
    }
  };
}

export function productJsonLd(product: ProductWithRelations, locale: Locale) {
  const url = absoluteUrl(`/products/${product.slug}`);
  const numericPrice = product.price === null ? null : Number(product.price);
  const description = getProductDescription(product, locale);
  const images = product.images.map((image) => absoluteUrl(image.storage_path));
  const category = product.category ? getProductOptionLabel('category', product.category, locale) : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: getProductName(product, locale),
    description,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    sku: product.model,
    model: product.model,
    category,
    image: images.length ? images : undefined,
    offers:
      numericPrice !== null && Number.isFinite(numericPrice)
        ? {
            '@type': 'Offer',
            url,
            priceCurrency: PRICE_CURRENCY,
            price: numericPrice.toFixed(2),
            availability: 'https://schema.org/InStock'
          }
        : undefined
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url)
    }))
  };
}

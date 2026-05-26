import { NextRequest, NextResponse } from 'next/server';
import {
  getProductPage,
  normalizeProductSort,
  PRODUCT_PAGE_SIZE,
  type ProductFilters,
} from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

function parsePrice(value: string | null) {
  if (!value) return undefined;

  const price = Number(value);
  return Number.isFinite(price) ? price : undefined;
}

function parseLimit(value: string | null) {
  const limit = Number(value);
  return Number.isFinite(limit) && limit > 0
    ? Math.min(Math.floor(limit), 40)
    : PRODUCT_PAGE_SIZE;
}

function parseOffset(value: string | null) {
  const offset = Number(value);
  return Number.isFinite(offset) && offset > 0 ? Math.floor(offset) : 0;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const filters: ProductFilters = {
    q: params.get('q') || undefined,
    brand: params.getAll('brand'),
    category: params.getAll('category'),
    recommendedArea: params.getAll('recommendedArea'),
    color: params.getAll('color'),
    freshAir: params.get('freshAir') === '1',
    minPrice: parsePrice(params.get('minPrice')),
    maxPrice: parsePrice(params.get('maxPrice')),
  };

  const page = await getProductPage(filters, {
    sort: normalizeProductSort(params.get('sort')),
    limit: parseLimit(params.get('limit')),
    offset: parseOffset(params.get('offset')),
  });

  return NextResponse.json(page);
}

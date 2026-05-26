import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { PRODUCT_LIKE_VISITOR_COOKIE } from '@/lib/supabase/queries';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getVisitorId(request: NextRequest) {
  return request.cookies.get(PRODUCT_LIKE_VISITOR_COOKIE)?.value || randomUUID();
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!UUID_PATTERN.test(params.id)) {
    return NextResponse.json({ ok: false, error: 'Invalid product id' }, { status: 400 });
  }

  const visitorId = getVisitorId(request);
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc('toggle_product_like', {
    p_product_id: params.id,
    p_visitor_id: visitorId,
  });

  if (error) {
    const status = error.message.includes('Product not found') ? 404 : 500;
    return NextResponse.json({ ok: false, error: error.message }, { status });
  }

  const result = Array.isArray(data) ? data[0] : data;
  const response = NextResponse.json({
    ok: true,
    liked: Boolean(result?.liked),
    likeCount: Number(result?.like_count ?? 0),
  });

  response.cookies.set(PRODUCT_LIKE_VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

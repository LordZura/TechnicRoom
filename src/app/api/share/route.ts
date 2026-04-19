import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const locale = body?.locale === 'en' ? 'en' : 'ka';

  const response = NextResponse.json({ ok: true });
  response.cookies.set('locale', locale, { maxAge: 60 * 60 * 24 * 365, path: '/' });
  return response;
}

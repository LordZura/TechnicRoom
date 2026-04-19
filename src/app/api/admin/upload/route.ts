import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');
  const productId = formData.get('productId');

  if (!(file instanceof File) || typeof productId !== 'string') {
    return NextResponse.json({ error: 'Missing file or productId' }, { status: 400 });
  }

  const payload = new FormData();
  payload.append('productId', productId);
  payload.append('files', file);

  const forwarded = await fetch(new URL('/api/admin/product-images', request.url), {
    method: 'POST',
    headers: {
      cookie: request.headers.get('cookie') || ''
    },
    body: payload
  });

  const data = await forwarded.json();
  return NextResponse.json(data, { status: forwarded.status });
}

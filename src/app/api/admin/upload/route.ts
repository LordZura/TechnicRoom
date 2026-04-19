import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const productId = String(formData.get('productId') || '');

  if (!file || !productId) return NextResponse.json({ error: 'Missing file or productId' }, { status: 400 });

  const filePath = `${productId}/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const admin = createSupabaseAdminClient();

  const { error: uploadError } = await admin.storage
    .from('product-images')
    .upload(filePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });

  const { data: publicUrl } = admin.storage.from('product-images').getPublicUrl(filePath);
  await admin.from('product_images').insert({ product_id: productId, storage_path: publicUrl.publicUrl });

  return NextResponse.json({ success: true, path: publicUrl.publicUrl });
}

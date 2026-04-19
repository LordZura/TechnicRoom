import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
}

function extractStorageKey(publicUrl: string) {
  const marker = '/storage/v1/object/public/product-images/';
  const idx = publicUrl.indexOf(marker);
  return idx === -1 ? null : publicUrl.slice(idx + marker.length);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const productId = String(formData.get('productId') || '');
    const files = formData.getAll('files').filter((entry): entry is File => entry instanceof File);

    if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    if (files.length === 0) return NextResponse.json({ error: 'Please choose at least one image.' }, { status: 400 });

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json({ error: `${file.name}: unsupported format.` }, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `${file.name}: must be smaller than 5MB.` }, { status: 400 });
      }
    }

    const admin = createSupabaseAdminClient();
    const { data: existingImages } = await admin
      .from('product_images')
      .select('sort_order,is_primary')
      .eq('product_id', productId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const hasCover = existingImages?.some((item) => item.is_primary) ?? false;
    let nextSortOrder = (existingImages?.[0]?.sort_order ?? -1) + 1;

    const insertedRows = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const filePath = `${productId}/${Date.now()}-${randomUUID()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await admin.storage
        .from('product-images')
        .upload(filePath, buffer, { contentType: file.type, upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = admin.storage.from('product-images').getPublicUrl(filePath);
      insertedRows.push({
        product_id: productId,
        storage_path: publicUrl.publicUrl,
        sort_order: nextSortOrder,
        is_primary: !hasCover && i === 0
      });
      nextSortOrder += 1;
    }

    const { data: rows, error: rowsError } = await admin
      .from('product_images')
      .insert(insertedRows)
      .select('*')
      .order('sort_order', { ascending: true });

    if (rowsError) throw rowsError;
    return NextResponse.json({ success: true, images: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const code = message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ error: message }, { status: code });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { productId, imageId } = await request.json();
    if (!productId || !imageId) {
      return NextResponse.json({ error: 'Missing productId or imageId.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    await admin.from('product_images').update({ is_primary: false }).eq('product_id', productId);
    const { error } = await admin.from('product_images').update({ is_primary: true }).eq('id', imageId).eq('product_id', productId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const code = message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ error: message }, { status: code });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const imageId = request.nextUrl.searchParams.get('imageId');
    if (!imageId) return NextResponse.json({ error: 'Missing imageId.' }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const { data: image, error: imageError } = await admin
      .from('product_images')
      .select('id,storage_path,product_id,is_primary')
      .eq('id', imageId)
      .single();

    if (imageError || !image) throw new Error('Image not found.');

    const storageKey = extractStorageKey(image.storage_path);
    if (storageKey) {
      const { error: storageDeleteError } = await admin.storage.from('product-images').remove([storageKey]);
      if (storageDeleteError) throw storageDeleteError;
    }

    const { error: rowDeleteError } = await admin.from('product_images').delete().eq('id', imageId);
    if (rowDeleteError) throw rowDeleteError;

    if (image.is_primary) {
      const { data: replacement } = await admin
        .from('product_images')
        .select('id')
        .eq('product_id', image.product_id)
        .order('sort_order', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (replacement?.id) {
        await admin.from('product_images').update({ is_primary: true }).eq('id', replacement.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const code = message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ error: message }, { status: code });
  }
}

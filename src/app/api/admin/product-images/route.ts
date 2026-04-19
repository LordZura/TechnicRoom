import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const BUCKET = 'product-images';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }
}

function isImage(file: File) {
  return file.type.startsWith('image/');
}

function toStoragePath(productId: string, fileName: string) {
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
  return `${productId}/${Date.now()}-${randomUUID()}-${sanitized}`;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const productId = request.nextUrl.searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('is_primary', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ images: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const productId = String(formData.get('productId') || '');
    const files = formData.getAll('files').filter((file): file is File => file instanceof File);

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    for (const file of files) {
      if (!isImage(file)) {
        return NextResponse.json({ error: `${file.name}: only image files are allowed` }, { status: 400 });
      }

      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: `${file.name}: file exceeds 5MB limit` }, { status: 400 });
      }
    }

    const admin = createSupabaseAdminClient();

    const { data: currentRows, error: currentError } = await admin
      .from('product_images')
      .select('id, is_primary, sort_order')
      .eq('product_id', productId)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (currentError) throw currentError;

    const hasPrimary = Boolean(currentRows?.some((item) => item.is_primary));
    let nextSortOrder = (currentRows?.[0]?.sort_order ?? -1) + 1;

    const inserted: Record<string, unknown>[] = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const path = toStoragePath(productId, file.name);
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, buffer, {
        contentType: file.type,
        upsert: false
      });

      if (uploadError) {
        throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
      }

      const { data: publicUrl } = admin.storage.from(BUCKET).getPublicUrl(path);
      const { data: imageRow, error: insertError } = await admin
        .from('product_images')
        .insert({
          product_id: productId,
          storage_path: publicUrl.publicUrl,
          alt: null,
          sort_order: nextSortOrder,
          is_primary: !hasPrimary && index === 0
        })
        .select('*')
        .single();

      if (insertError) {
        await admin.storage.from(BUCKET).remove([path]);
        throw new Error(`Image metadata insert failed for ${file.name}: ${insertError.message}`);
      }

      inserted.push(imageRow);
      nextSortOrder += 1;
    }

    return NextResponse.json({ success: true, images: inserted });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as {
      productId?: string;
      imageId?: string;
      alt?: string | null;
      isCover?: boolean;
      sortOrder?: number;
    };

    if (!body.productId || !body.imageId) {
      return NextResponse.json({ error: 'Missing productId or imageId' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    if (body.isCover) {
      const { error: clearError } = await admin
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', body.productId);

      if (clearError) throw clearError;
    }

    const updatePayload: { alt?: string | null; is_primary?: boolean; sort_order?: number } = {};

    if (typeof body.alt === 'string' || body.alt === null) updatePayload.alt = body.alt;
    if (typeof body.isCover === 'boolean') updatePayload.is_primary = body.isCover;
    if (typeof body.sortOrder === 'number') updatePayload.sort_order = body.sortOrder;

    const { error } = await admin
      .from('product_images')
      .update(updatePayload)
      .eq('id', body.imageId)
      .eq('product_id', body.productId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const productId = request.nextUrl.searchParams.get('productId');
    const imageId = request.nextUrl.searchParams.get('imageId');

    if (!productId || !imageId) {
      return NextResponse.json({ error: 'Missing productId or imageId' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    const { data: image, error: findError } = await admin
      .from('product_images')
      .select('id, storage_path, is_primary')
      .eq('id', imageId)
      .eq('product_id', productId)
      .single();

    if (findError || !image) throw new Error('Image not found');

    const { error: deleteError } = await admin
      .from('product_images')
      .delete()
      .eq('id', imageId)
      .eq('product_id', productId);

    if (deleteError) throw deleteError;

    const storagePath = image.storage_path.split(`/${BUCKET}/`)[1];
    if (storagePath) {
      await admin.storage.from(BUCKET).remove([storagePath]);
    }

    if (image.is_primary) {
      const { data: replacement } = await admin
        .from('product_images')
        .select('id')
        .eq('product_id', productId)
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
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

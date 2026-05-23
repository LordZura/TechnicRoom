import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { saveProduct } from '@/lib/admin/product-save';
import { ZodError } from 'zod';

const BUCKET = 'product-images';

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const admin = createSupabaseAdminClient();
    const product = await saveProduct(admin, body);

    return NextResponse.json({ success: true, id: product.id, slug: product.slug });
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? 'Invalid product data';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from('products')
      .select('*, translations:product_translations(locale, name, description, features)')
      .eq('id', id)
      .single();

    if (error) throw error;

    const translations = ['en', 'ka'].map((locale) => {
      const translation = (data.translations ?? []).find((item: { locale: string }) => item.locale === locale);

      return {
        locale,
        name: translation?.name ?? '',
        description: translation?.description ?? '',
        features: translation?.features ?? ''
      };
    });

    return NextResponse.json({ product: { ...data, translations } });
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? 'Invalid product data';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });

    const admin = createSupabaseAdminClient();

    const { data: images, error: imagesError } = await admin
      .from('product_images')
      .select('storage_path')
      .eq('product_id', id);

    if (imagesError) throw imagesError;

    const storagePaths = (images ?? [])
      .map((item) => item.storage_path.split(`/${BUCKET}/`)[1])
      .filter(Boolean) as string[];

    const { error: imageRowDeleteError } = await admin.from('product_images').delete().eq('product_id', id);
    if (imageRowDeleteError) throw imageRowDeleteError;

    const { error: translationDeleteError } = await admin.from('product_translations').delete().eq('product_id', id);
    if (translationDeleteError) throw translationDeleteError;

    const { error: productDeleteError } = await admin.from('products').delete().eq('id', id);
    if (productDeleteError) throw productDeleteError;

    if (storagePaths.length) {
      const { error: storageDeleteError } = await admin.storage.from(BUCKET).remove(storagePaths);
      if (storageDeleteError) {
        return NextResponse.json({
          success: true,
          warning: `Product deleted, but failed to remove some files: ${storageDeleteError.message}`
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? 'Invalid product data';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

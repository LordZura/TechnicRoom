import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
}

function formatError(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const enabled = Boolean((body as { admin_product_edit_shortcut_enabled?: unknown }).admin_product_edit_shortcut_enabled);
    const admin = createSupabaseAdminClient();
    const { error } = await admin
      .from('site_settings')
      .upsert({
        id: 1,
        admin_product_edit_shortcut_enabled: enabled,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) throw error;

    return NextResponse.json({ success: true, admin_product_edit_shortcut_enabled: enabled });
  } catch (error) {
    return NextResponse.json({ error: formatError(error) }, { status: 400 });
  }
}

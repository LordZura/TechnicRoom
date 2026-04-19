import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const name = String(data.get('name') || '');
  const email = String(data.get('email') || '');
  const message = String(data.get('message') || '');

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('contact_messages').insert({ name, email, message });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.redirect(new URL('/contact?sent=1', request.url));
}

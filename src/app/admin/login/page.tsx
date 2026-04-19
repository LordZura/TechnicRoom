import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { AdminLoginForm } from '@/components/admin/admin-login-form';

export default async function AdminLoginPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) redirect('/admin/dashboard');

  return <AdminLoginForm />;
}

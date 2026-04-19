import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AdminProductsManager } from '@/components/admin/admin-products-manager';

type AdminProductRow = {
  id: string;
  model: string;
  slug: string;
  brand: string;
  images: {
    id: string;
    storage_path: string;
    is_primary: boolean;
    sort_order: number;
  }[];
};

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) redirect('/admin/login');

  const admin = createSupabaseAdminClient();
  const { data: products } = await admin
    .from('products')
    .select('id,model,slug,brand,images:product_images(id,storage_path,is_primary,sort_order)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <AdminProductsManager initialProducts={(products || []) as AdminProductRow[]} />
    </div>
  );
}

import { redirect } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import { ProductsList } from '@/components/admin/products-list';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getProducts } from '@/lib/supabase/queries';

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) redirect('/admin/login');

  const products = await getProducts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <ProductForm />
      <ProductsList initialProducts={products.map((p) => ({ id: p.id, model: p.model, slug: p.slug }))} />
    </div>
  );
}

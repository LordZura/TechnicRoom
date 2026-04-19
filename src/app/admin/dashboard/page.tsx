import { redirect } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getProducts } from '@/lib/supabase/queries';

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/admin/login');

  const products = await getProducts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <ProductForm />
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-lg font-semibold">Existing products</h2>
        <ul className="space-y-2 text-sm">
          {products.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2">
              <span>{p.model} ({p.slug})</span>
              <form action={`/api/admin/products?id=${p.id}`} method="post">
                <input type="hidden" name="_method" value="DELETE" />
                <button className="text-red-600">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

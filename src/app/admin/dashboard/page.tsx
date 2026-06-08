import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminProductsManager } from '@/components/admin/admin-products-manager';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminEditShortcutEnabled, getAdminProductSummaries } from '@/lib/supabase/queries';


export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams?: { product?: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) redirect('/admin/login');

  const [products, editShortcutEnabled] = await Promise.all([
    getAdminProductSummaries(),
    getAdminEditShortcutEnabled()
  ]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="tr-surface p-4 sm:p-6">
        <h1 className="text-xl font-bold sm:text-2xl">Admin Dashboard</h1>
        <p className="tr-muted mt-2">Manage catalog data, translations, and gallery images in one place.</p>
      </section>
      <AdminProductsManager
        initialProducts={products}
        initialProductId={searchParams?.product}
        initialEditShortcutEnabled={editShortcutEnabled}
      />
    </div>
  );
}

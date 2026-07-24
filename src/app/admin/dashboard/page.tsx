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
    <div className="tr-shell space-y-6 pb-10 pt-8 sm:pt-10">
      <header className="max-w-2xl">
        <p className="tr-eyebrow">Technic Room</p>
        <h1 className="tr-section-title mt-2">Admin Dashboard</h1>
        <p className="tr-muted mt-2">
          Manage catalog data, translations, and gallery images in one place.
        </p>
      </header>

      <AdminProductsManager
        initialProducts={products}
        initialProductId={searchParams?.product}
        initialEditShortcutEnabled={editShortcutEnabled}
      />
    </div>
  );
}

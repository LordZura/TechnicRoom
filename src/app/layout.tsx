import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getLocaleFromCookie } from '@/lib/i18n/locale';

export const metadata: Metadata = {
  title: 'Technic Room',
  description: 'Modern air conditioner catalog and management platform.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocaleFromCookie();

  return (
    <html lang={locale}>
      <body>
        <Header locale={locale} />
        <main className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

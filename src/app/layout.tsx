import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getLocaleFromCookie } from "@/lib/i18n/locale";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const siteUrl = "https://technic-room.com";
const defaultTitle = "Technic Room";
const defaultDescription =
  "Professional air conditioner sales, installation, maintenance, and HVAC services in Georgia.";
const defaultKeywords = [
  "air conditioners",
  "HVAC installation",
  "air conditioner repair",
  "air conditioner cleaning",
  "cooling systems",
  "heating and cooling",
  "air conditioner монтаж",
  "კონდიციონერები",
  "კონდიციონერის მონტაჟი",
  "კონდიციონერის შეკეთება",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Technic Room",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
    },
    {
      "@type": "HVACBusiness",
      name: "Technic Room",
      url: siteUrl,
      image: `${siteUrl}/og-image.png`,
      description: defaultDescription,
      areaServed: "Georgia",
      priceRange: "$$",
    },
    {
      "@type": "WebSite",
      name: "Technic Room",
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Technic Room",
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  category: "business",
  alternates: {
    canonical: "/",
    languages: {
      "ka-GE": "/",
      "en-US": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ka_GE",
    alternateLocale: "en_US",
    siteName: "Technic Room",
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-image.png"],
  },
  icons: {
    icon: ["/icon.png"],
    apple: ["/apple-touch-icon.png"],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocaleFromCookie();

  return (
    <html lang={locale}>
      <body>
        {/* TODO(seo-assets): Ensure /favicon.ico, /apple-touch-icon.png, and /og-image.png exist in /public for production. */}
        {/* TODO(seo-assets): Verify /logo.png stays available for Organization JSON-LD logo reference. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header locale={locale} />
        <main className="tr-shell min-h-[calc(100vh-210px)] py-0 sm:py-0">
          {children}
        </main>
        <Footer locale={locale} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

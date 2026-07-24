import type { Metadata, Viewport } from "next";
import { Manrope, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getLocaleFromCookie } from "@/lib/i18n/locale";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const manropeDisplay = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const georgian = Noto_Sans_Georgian({
  subsets: ["georgian"],
  display: "swap",
  variable: "--font-georgian",
  weight: ["400", "500", "600", "700", "800"],
});

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
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    {
      "@type": "HVACBusiness",
      name: "Technic Room",
      url: SITE_URL,
      image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      description: defaultDescription,
      areaServed: "Georgia",
      priceRange: "$$",
    },
    {
      "@type": "WebSite",
      name: "Technic Room",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#FBF8F9",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [DEFAULT_OG_IMAGE],
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
    <html
      lang={locale}
      className={`${manrope.variable} ${manropeDisplay.variable} ${georgian.variable}`}
    >
      <body className="flex min-h-[100dvh] flex-col">
        {/* TODO(seo-assets): Ensure /favicon.ico and /apple-touch-icon.png exist in /public for production. */}
        {/* TODO(seo-assets): Verify /logo.png stays available for Organization JSON-LD logo reference. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-wine-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <Header locale={locale} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer locale={locale} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

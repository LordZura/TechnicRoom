import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { getLocaleFromCookie } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { ContactButtons } from "./contact-buttons";

export const metadata: Metadata = {
  title: "Contact Technic Room",
  description:
    "Contact Technic Room for air conditioner sales, HVAC installation, maintenance, and repair support in Georgia.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Technic Room | Technic Room",
    description:
      "Contact Technic Room for air conditioner sales, HVAC installation, maintenance, and repair support in Georgia.",
    url: "/contact",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Technic Room | Technic Room",
    description:
      "Contact Technic Room for air conditioner sales, HVAC installation, maintenance, and repair support in Georgia.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ContactPage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);

  return (
    <div className="tr-shell pt-12 sm:pt-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="tr-eyebrow">Technic Room</p>
        <h1 className="tr-display mt-3 text-[1.9rem] text-ink-900 sm:text-[2.75rem]">
          {t.contact.title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ink-600 sm:text-base">
          {t.contact.subtitle}
        </p>
      </Reveal>

      <Reveal delay={120} className="mx-auto mt-10 max-w-5xl sm:mt-14">
        <ContactButtons
          locale={locale}
          phoneLabel={t.contact.phone}
          emailLabel={t.contact.email}
          facebookLabel={t.contact.facebook}
        />
      </Reveal>
    </div>
  );
}

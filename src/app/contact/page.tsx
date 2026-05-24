import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { getLocaleFromCookie } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
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
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
      <Reveal>
        <section className="tr-surface overflow-hidden p-5 sm:p-8">
          <div className="rounded-2xl border border-brand-line/70 bg-gradient-to-r from-brand-cream via-brand-ivory to-brand-cream p-4 sm:p-5">
            <h1 className="tr-section-title">{t.contact.title}</h1>
            <p className="tr-muted mt-2">{t.contact.subtitle}</p>
          </div>

          <ContactButtons
            locale={locale}
            phoneLabel={t.contact.phone}
            emailLabel={t.contact.email}
            facebookLabel={t.contact.facebook}
          />
        </section>
      </Reveal>
    </div>
  );
}
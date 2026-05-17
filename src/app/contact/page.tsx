import type { Metadata } from "next";
import { Facebook, Mail, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const contact = {
  email: "unispacegeo@gmail.com",
  phoneLabel: "+995 574 50 44 00",
  phoneHref: "+995574504400",
  facebookLabel: "Technic Room on Facebook",
  facebookHref: "https://www.facebook.com/profile.php?id=61575732009127",
};

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
  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
      <Reveal>
        <section className="tr-surface overflow-hidden p-5 sm:p-8">
          <div className="rounded-2xl border border-brand-line/70 bg-gradient-to-r from-brand-cream via-brand-ivory to-brand-cream p-4 sm:p-5">
            <h1 className="tr-section-title">Contact</h1>
            <p className="tr-muted mt-2">
              Reach our team directly. We&apos;ll help you choose the right
              climate solution for your space.
            </p>
          </div>
          <div className="mt-5 grid gap-3.5 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            <a
              href={`tel:${contact.phoneHref}`}
              className="group rounded-2xl border border-brand-line bg-brand-cream p-4 transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-soft"
            >
              <div className="mb-3 inline-flex rounded-full bg-brand-ivory p-2.5 text-brand-brown">
                <Phone className="h-4 w-4" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-600/80">
                Phone
              </p>
              <p className="mt-2 text-lg font-semibold text-brand-espresso transition group-hover:text-brand-brown">
                {contact.phoneLabel}
              </p>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="group rounded-2xl border border-brand-line bg-brand-cream p-4 transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-soft"
            >
              <div className="mb-3 inline-flex rounded-full bg-brand-ivory p-2.5 text-brand-brown">
                <Mail className="h-4 w-4" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-600/80">
                Email
              </p>
              <p className="mt-2 break-all text-lg font-semibold text-brand-espresso transition group-hover:text-brand-brown">
                {contact.email}
              </p>
            </a>
            <a
              href={contact.facebookHref}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-brand-line bg-brand-cream p-4 transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-soft"
            >
              <div className="mb-3 inline-flex rounded-full bg-brand-ivory p-2.5 text-brand-brown">
                <Facebook className="h-4 w-4" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-600/80">
                Facebook
              </p>
              <p className="mt-2 text-lg font-semibold text-brand-espresso transition group-hover:text-brand-brown">
                {contact.facebookLabel}
              </p>
            </a>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

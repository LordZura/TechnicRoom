"use client";

import { Facebook, Mail, Phone } from "lucide-react";
import type { Locale } from "@/types";

const contact = {
  email: "unispacegeo@gmail.com",
  phoneLabel: "+995 574 50 44 00",
  phoneHref: "+995574504400",
  facebookHref: "https://www.facebook.com/profile.php?id=61575732009127",
};

async function trackButtonClick(
  buttonId: "contact_phone" | "contact_email" | "contact_facebook",
  locale: Locale
) {
  try {
    await fetch("/api/button-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buttonId,
        path: "/contact",
        locale,
      }),
      keepalive: true,
    });
  } catch {
    // no-op
  }
}

type Props = {
  locale: Locale;
  phoneLabel: string;
  emailLabel: string;
  facebookLabel: string;
};

export function ContactButtons({
  locale,
  phoneLabel,
  emailLabel,
  facebookLabel,
}: Props) {
  return (
    <div className="mt-5 grid gap-3.5 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      <a
        href={`tel:${contact.phoneHref}`}
        onClick={() => {
          void trackButtonClick("contact_phone", locale);
        }}
        className="group rounded-2xl border border-brand-line bg-brand-cream p-4 transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-soft"
      >
        <div className="mb-3 inline-flex rounded-full bg-brand-ivory p-2.5 text-brand-brown">
          <Phone className="h-4 w-4" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-brand-600/80">
          {phoneLabel}
        </p>
        <p className="mt-2 text-lg font-semibold text-brand-espresso transition group-hover:text-brand-brown">
          {contact.phoneLabel}
        </p>
      </a>

      <a
        href={`mailto:${contact.email}`}
        onClick={() => {
          void trackButtonClick("contact_email", locale);
        }}
        className="group rounded-2xl border border-brand-line bg-brand-cream p-4 transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-soft"
      >
        <div className="mb-3 inline-flex rounded-full bg-brand-ivory p-2.5 text-brand-brown">
          <Mail className="h-4 w-4" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-brand-600/80">
          {emailLabel}
        </p>
        <p className="mt-2 break-all text-lg font-semibold text-brand-espresso transition group-hover:text-brand-brown">
          {contact.email}
        </p>
      </a>

      <a
        href={contact.facebookHref}
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          void trackButtonClick("contact_facebook", locale);
        }}
        className="group rounded-2xl border border-brand-line bg-brand-cream p-4 transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-soft"
      >
        <div className="mb-3 inline-flex rounded-full bg-brand-ivory p-2.5 text-brand-brown">
          <Facebook className="h-4 w-4" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-brand-600/80">
          {facebookLabel}
        </p>
        <p className="mt-2 text-lg font-semibold text-brand-espresso transition group-hover:text-brand-brown">
          {facebookLabel}
        </p>
      </a>
    </div>
  );
}
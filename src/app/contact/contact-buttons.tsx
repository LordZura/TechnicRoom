"use client";

import { ArrowUpRight, Facebook, Mail, Phone } from "lucide-react";
import type { Locale } from "@/types";

const contact = {
  email: "unispacegeo@gmail.com",
  phoneLabel: "+995 574 50 44 00",
  phoneHref: "+995574504400",
  facebookHref: "https://www.facebook.com/profile.php?id=61575732009127",
};

type ButtonId = "contact_phone" | "contact_email" | "contact_facebook";

async function trackButtonClick(buttonId: ButtonId, locale: Locale) {
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
  const cards: {
    id: ButtonId;
    icon: typeof Phone;
    kicker: string;
    value: string;
    href: string;
    external?: boolean;
    accent: string;
  }[] = [
    {
      id: "contact_phone",
      icon: Phone,
      kicker: phoneLabel,
      value: contact.phoneLabel,
      href: `tel:${contact.phoneHref}`,
      accent: "from-wine-700 to-wine-900",
    },
    {
      id: "contact_email",
      icon: Mail,
      kicker: emailLabel,
      value: contact.email,
      href: `mailto:${contact.email}`,
      accent: "from-sea-500 to-sea-700",
    },
    {
      id: "contact_facebook",
      icon: Facebook,
      kicker: facebookLabel,
      value: "Technic Room",
      href: contact.facebookHref,
      external: true,
      accent: "from-ink-700 to-ink-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:gap-5 md:grid-cols-3">
      {cards.map(({ id, icon: Icon, kicker, value, href, external, accent }) => (
        <a
          key={id}
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          onClick={() => {
            void trackButtonClick(id, locale);
          }}
          className="tr-card tr-card-hover group flex flex-col p-6 sm:p-7"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-wine-50 opacity-0 blur-2xl transition-opacity duration-600 group-hover:opacity-100"
          />

          <span className="relative flex items-start justify-between">
            <span
              className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-glow transition-transform duration-400 ease-smooth group-hover:scale-105`}
            >
              <Icon className="h-5 w-5" />
            </span>

            <ArrowUpRight className="h-4 w-4 text-ink-300 transition-all duration-400 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-wine-700" />
          </span>

          <span className="relative mt-6 block text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink-400">
            {kicker}
          </span>

          <span className="relative mt-1.5 block break-words text-[1.0625rem] font-bold leading-snug text-ink-900 transition-colors duration-300 group-hover:text-wine-800">
            {value}
          </span>
        </a>
      ))}
    </div>
  );
}

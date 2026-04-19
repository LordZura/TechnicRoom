"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Locale } from "@/types";
import { LanguageSwitcher } from "./language-switcher";

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const nav = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
    { href: "/admin/login", label: t.nav.admin },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-brand-line/80 bg-brand-ivory/90 backdrop-blur-xl">
        <div className="tr-shell py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="group relative inline-flex min-h-11 items-center rounded-xl pr-2"
            >
              {logoFailed ? (
                <span className="text-base font-bold tracking-wide text-brand-espresso sm:text-xl">
                  Technic <span className="text-brand-gold">Room</span>
                </span>
              ) : (
                <Image
                  src="/logo.svg"
                  alt="Technic Room"
                  width={150}
                  height={36}
                  priority
                  className="h-8 w-auto sm:h-9"
                  onError={() => setLogoFailed(true)}
                />
              )}
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-brand-gold transition-all duration-300 group-hover:w-[70%]" />
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              <nav className="flex items-center gap-2">
                {nav.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "text-brand-brown"
                          : "text-[#684f3b] hover:text-brand-brown"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-brand-gold transition-transform duration-300 ${
                          isActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>

              <LanguageSwitcher locale={locale} compact={false} />
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <LanguageSwitcher locale={locale} compact />
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                type="button"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-brand-line bg-brand-ivory text-brand-espresso transition hover:border-brand-brown hover:bg-brand-cream"
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#2f2117]/45 backdrop-blur-[2px] transition duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-[100dvh] w-[86vw] max-w-[360px] border-l border-brand-line bg-gradient-to-b from-brand-ivory to-[#f6ecdf] px-4 pb-8 pt-20 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-brand-line bg-brand-ivory text-brand-espresso transition hover:border-brand-brown hover:bg-brand-cream"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 border-b border-brand-line/80 pb-4">
          {logoFailed ? (
            <p className="text-base font-bold tracking-wide text-brand-espresso">
              Technic <span className="text-brand-gold">Room</span>
            </p>
          ) : (
            <Image
              src="/logo.svg"
              alt="Technic Room"
              width={140}
              height={34}
              className="h-8 w-auto"
              onError={() => setLogoFailed(true)}
            />
          )}
        </div>

        <nav className="space-y-2">
          {nav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-medium transition-all ${
                  isActive
                    ? "bg-brand-brown text-brand-ivory shadow-lg shadow-brand-brown/20"
                    : "bg-brand-ivory/70 text-[#684f3b] hover:bg-brand-ivory active:scale-[0.99]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

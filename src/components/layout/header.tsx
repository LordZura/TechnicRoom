"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Locale } from "@/types";
import { LanguageSwitcher } from "./language-switcher";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-[1.05rem] font-extrabold tracking-[-0.03em] text-ink-900 sm:text-xl ${className}`}
    >
      Technic<span className="text-wine-700">Room</span>
    </span>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-50 pt-2 sm:pt-3">
        <div className="tr-shell">
          <div
            className={`flex items-center justify-between gap-3 rounded-full border px-2.5 py-2 transition-all duration-500 ease-smooth sm:px-3 ${
              scrolled
                ? "border-ink-100 bg-white/85 shadow-card backdrop-blur-xl"
                : "border-transparent bg-white/55 shadow-none backdrop-blur-md"
            }`}
          >
            {/* Brand */}
            <Link
              href="/"
              aria-label="Technic Room"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full pl-1.5 pr-2 transition-transform duration-300 ease-smooth hover:scale-[1.02] active:scale-95"
            >
              {logoFailed ? (
                <Wordmark />
              ) : (
                <Image
                  src="/logo.png"
                  alt="Technic Room"
                  width={400}
                  height={100}
                  priority
                  className="h-7 w-auto sm:h-8"
                  onError={() => setLogoFailed(true)}
                />
              )}
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 md:flex">
              {nav.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative rounded-full px-3.5 py-2 text-[0.8125rem] font-semibold transition-colors duration-300 lg:px-4 lg:text-sm ${
                      active
                        ? "text-wine-800"
                        : "text-ink-600 hover:text-ink-900"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 rounded-full transition-all duration-400 ease-smooth ${
                        active
                          ? "scale-100 bg-wine-50 opacity-100 ring-1 ring-inset ring-wine-100"
                          : "scale-90 bg-ink-100/80 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                      }`}
                    />
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-2 md:flex">
              <LanguageSwitcher locale={locale} />

              <Link
                href="/admin/login"
                title={t.nav.admin}
                aria-label={t.nav.admin}
                className="tr-btn-icon h-9 w-9"
              >
                <ShieldCheck className="h-[1.05rem] w-[1.05rem]" />
              </Link>

              <Link
                href="/contact"
                className="tr-btn-primary group h-9 min-h-0 px-4 text-[0.8125rem]"
              >
                {t.nav.contact}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <LanguageSwitcher locale={locale} compact />
              <button
                onClick={() => setMenuOpen(true)}
                type="button"
                aria-expanded={menuOpen}
                aria-label={t.footer.openMenu}
                className="tr-btn-icon h-9 w-9"
              >
                <Menu className="h-[1.15rem] w-[1.15rem]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-ink-900/40 backdrop-blur-sm transition-opacity duration-400 ease-smooth md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        aria-hidden={!menuOpen}
        className={`fixed right-0 top-0 z-[70] flex h-[100dvh] w-[88vw] max-w-[380px] flex-col bg-white shadow-[-24px_0_60px_-30px_rgba(34,19,25,0.5)] transition-transform duration-[450ms] ease-smooth md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-wine-100/70 blur-3xl"
        />

        <div className="relative flex items-center justify-between border-b border-ink-100 px-5 py-4">
          {logoFailed ? (
            <Wordmark />
          ) : (
            <Image
              src="/logo.png"
              alt="Technic Room"
              width={400}
              height={100}
              className="h-7 w-auto"
              onError={() => setLogoFailed(true)}
            />
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="tr-btn-icon h-9 w-9"
            aria-label={t.footer.closeMenu}
          >
            <X className="h-[1.15rem] w-[1.15rem]" />
          </button>
        </div>

        <nav className="relative flex-1 space-y-1.5 overflow-y-auto px-4 py-5">
          {nav.map((item, index) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${90 + index * 55}ms` : "0ms" }}
                className={`flex min-h-[3.25rem] items-center justify-between rounded-2xl px-4 text-[0.95rem] font-semibold transition-all duration-500 ease-smooth active:scale-[0.98] ${
                  menuOpen ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
                } ${
                  active
                    ? "bg-gradient-to-r from-wine-700 to-wine-800 text-white shadow-glow"
                    : "bg-ink-50 text-ink-700 hover:bg-ink-100"
                }`}
              >
                {item.label}
                <ArrowUpRight
                  className={`h-4 w-4 transition-opacity ${
                    active ? "opacity-90" : "opacity-35"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="relative space-y-3 border-t border-ink-100 px-4 pb-6 pt-4">
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="tr-btn-primary w-full"
          >
            {t.nav.contact}
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <Link
            href="/admin/login"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 py-1 text-xs font-semibold text-ink-500 transition-colors hover:text-wine-700"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.nav.admin}
          </Link>
        </div>
      </aside>
    </>
  );
}

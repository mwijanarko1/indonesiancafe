"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

const nav = [
  { href: "#about", label: "About" },
  { href: "/menu", label: "Menu" },
] as const;

type SocialLink = {
  href: string;
  label: string;
  shortLabel: string;
  Icon: IconType;
};

const socialLinks: SocialLink[] = [
  {
    href: "https://www.instagram.com/indonesiancafe_/",
    label: "Indonesian Cafe on Instagram",
    shortLabel: "Instagram",
    Icon: FaInstagram,
  },
  {
    href: "https://www.facebook.com/profile.php?id=61583156852755",
    label: "Indonesian Cafe on Facebook",
    shortLabel: "Facebook",
    Icon: FaFacebook,
  },
];

const socialButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold/70 text-brand-address transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:h-10 sm:w-10";

const navLinkClass =
  "rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-address/95 transition-colors hover:bg-white/10 hover:text-brand-address focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-[0.7rem]";

const titleClass =
  "max-w-full font-[family-name:var(--font-cinzel)] text-xl font-extrabold uppercase leading-none tracking-[0.14em] text-white drop-shadow-[0_2px_8px_rgb(0_0_0_/_0.35)] sm:text-2xl sm:tracking-[0.16em] md:text-3xl md:tracking-[0.18em]";

function SocialNav({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Social media" className={`flex min-w-0 items-center gap-2 ${className}`}>
      {socialLinks.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={socialButtonClass}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
        </a>
      ))}
    </nav>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/15 bg-brand-crimson/98 backdrop-blur-md">
        {/* Mobile: title | menu (social links live in the flyout only) */}
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 md:hidden">
          <div className="flex min-w-0 justify-center px-1 text-center">
            <p className={titleClass} lang="en">
              Indonesian Cafe
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/20 text-brand-address transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={2} aria-hidden /> : <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />}
          </button>
        </div>

        {/* Desktop */}
        <div className="mx-auto hidden max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-4 py-4 md:grid">
          <nav aria-label="Primary" className="flex min-w-0 flex-wrap justify-start gap-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex min-w-0 items-center justify-center px-2 text-center">
            <p className={titleClass} lang="en">
              Indonesian Cafe
            </p>
          </div>
          <SocialNav className="justify-end" />
        </div>
      </header>

      {/* Full-screen mobile menu (above header) */}
      {menuOpen ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          className="batik-bg fixed inset-0 z-[100] flex min-h-0 flex-col overflow-y-auto md:hidden"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/15 px-4 py-4">
            <p id="mobile-menu-title" className={`min-w-0 ${titleClass}`} lang="en">
              Indonesian Cafe
            </p>
            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/20 text-brand-address transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X className="h-6 w-6" strokeWidth={2} aria-hidden />
            </button>
          </div>

          <nav className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8" aria-label="Site menu">
            <ul className="flex flex-col gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-4 py-4 text-center font-[family-name:var(--font-serif)] text-2xl font-semibold uppercase tracking-[0.12em] text-brand-address transition-colors hover:bg-white/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-white/15 pt-8">
              <p className="px-4 pb-3 text-center font-[family-name:var(--font-cinzel)] text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold/90">
                Follow us
              </p>
              <ul className="flex flex-col gap-2">
                {socialLinks.map(({ href, shortLabel, label, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 rounded-lg px-4 py-4 text-base font-semibold uppercase tracking-[0.12em] text-brand-address transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon className="h-6 w-6 shrink-0 text-white" aria-hidden />
                      {shortLabel}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

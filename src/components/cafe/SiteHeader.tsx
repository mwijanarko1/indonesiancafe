"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { SITE } from "@/lib/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#visit", label: "Contact" },
] as const;

const logoClass =
  "font-[family-name:var(--font-serif)] text-lg font-bold uppercase tracking-[0.08em] text-brand-cream sm:text-xl";

function navLinkClass(pathname: string, href: string) {
  const active =
    (href === "/" && pathname === "/") || (href === "/menu" && pathname === "/menu");
  return `rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-[0.7rem] ${
    active
      ? "text-brand-cream underline decoration-brand-cream decoration-2 underline-offset-8"
      : "text-brand-cream/75 hover:text-brand-cream"
  }`;
}

const orderButtonClass =
  "inline-flex items-center justify-center rounded-md bg-brand-cream px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-brand-maroon shadow-sm transition hover:bg-brand-cream-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:px-5 sm:text-[0.7rem]";

export function SiteHeader() {
  const pathname = usePathname();
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
      <header className="sticky top-0 z-50 border-b border-brand-cream/15 bg-brand-maroon/95 backdrop-blur-md">
        <div className="flex w-full items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:hidden">
          <Link href="/" className={`min-w-0 shrink ${logoClass}`} lang="en">
            {SITE.name}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-brand-cream/25 text-brand-cream transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={2} aria-hidden /> : <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />}
          </button>
        </div>

        <div className="hidden w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 px-4 py-4 sm:px-6 lg:grid">
          <Link href="/" className={`justify-self-start ${logoClass}`} lang="en">
            {SITE.name}
          </Link>
          <nav aria-label="Primary" className="flex flex-wrap items-center justify-center gap-1">
            {nav.map((item) => (
              <Link key={item.label} href={item.href} className={navLinkClass(pathname, item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-cream/25 text-brand-cream transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              aria-label="View menu and order"
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" aria-hidden />
            </Link>
            <Link href="/menu" className={orderButtonClass}>
              Order now
            </Link>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-labelledby="site-mobile-menu-title"
          className="fixed inset-0 z-[100] flex min-h-0 flex-col overflow-y-auto bg-brand-maroon lg:hidden"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-brand-cream/15 px-4 py-4">
            <p id="site-mobile-menu-title" className={`min-w-0 ${logoClass}`} lang="en">
              {SITE.name}
            </p>
            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-brand-cream/25 text-brand-cream transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X className="h-6 w-6" strokeWidth={2} aria-hidden />
            </button>
          </div>
          <nav className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8" aria-label="Site menu">
            <ul className="flex flex-col gap-2">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-4 py-4 text-center font-[family-name:var(--font-serif)] text-xl font-semibold tracking-wide text-brand-cream transition-colors hover:bg-white/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 border-t border-brand-cream/15 pt-8">
              <Link href="/menu" className={`${orderButtonClass} w-full text-center`} onClick={() => setMenuOpen(false)}>
                Order now
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

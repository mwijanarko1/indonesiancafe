"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "#visit", label: "Contact" },
] as const;

const logoClass =
  "font-[family-name:var(--font-serif)] text-lg font-bold uppercase tracking-[0.06em] text-brand-charcoal sm:text-xl";

const navLinkClass =
  "rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-600 transition-colors hover:text-brand-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-crimson sm:text-[0.7rem]";

const orderButtonClass =
  "inline-flex items-center justify-center rounded-sm bg-brand-crimson px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-brand-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-charcoal sm:px-5 sm:text-[0.7rem]";

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
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-brand-cream-page/95 backdrop-blur-md">
        {/* Mobile */}
        <div className="flex w-full items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8 md:hidden">
          <Link href="/" className={`min-w-0 shrink ${logoClass}`} lang="en">
            Indonesian Cafe
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-stone-300 text-brand-charcoal transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-crimson"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={2} aria-hidden /> : <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />}
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 px-4 py-4 sm:px-6 lg:px-8 md:grid">
          <Link href="/" className={`justify-self-start ${logoClass}`} lang="en">
            Indonesian Cafe
          </Link>
          <nav aria-label="Primary" className="flex flex-wrap items-center justify-center gap-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-brand-charcoal transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-crimson"
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
          aria-labelledby="mobile-menu-title"
          className="fixed inset-0 z-[100] flex min-h-0 flex-col overflow-y-auto bg-brand-cream-page md:hidden"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-stone-200 px-4 py-4">
            <p id="mobile-menu-title" className={`min-w-0 ${logoClass}`} lang="en">
              Indonesian Cafe
            </p>
            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-stone-300 text-brand-charcoal transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-crimson"
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
                    className="block rounded-lg px-4 py-4 text-center font-[family-name:var(--font-serif)] text-xl font-semibold tracking-wide text-brand-charcoal transition-colors hover:bg-stone-200/60"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 border-t border-stone-200 pt-8">
              <Link
                href="/menu"
                className={`${orderButtonClass} w-full text-center`}
                onClick={() => setMenuOpen(false)}
              >
                Order now
              </Link>
              <Link
                href="/menu"
                className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 py-3 text-sm font-semibold text-brand-charcoal transition hover:bg-stone-100"
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingBag className="h-5 w-5" aria-hidden />
                View menu
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * Apply to `<main id="main-content">` on pages where the hero does not run under the
 * fixed header (e.g. menu, reviews) so the first content clears the overlay bar.
 */
export const SITE_HEADER_OVERLAY_MAIN_PAD =
  "pt-[5.25rem] sm:pt-[5.75rem]";

export type SiteHeaderVariant = "default" | "inverse";

const logoDefaultClass =
  "font-[family-name:var(--font-label)] min-w-0 shrink text-base font-bold uppercase tracking-[0.04em] text-brand-maroon sm:text-lg";

const logoInverseClass =
  "font-[family-name:var(--font-label)] min-w-0 shrink text-base font-bold uppercase tracking-[0.04em] text-brand-cream sm:text-lg";

const menuPillDefaultClass =
  "font-[family-name:var(--font-label)] inline-flex min-h-10 items-center justify-center rounded-lg bg-brand-maroon px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-brand-cream shadow-sm transition hover:bg-brand-oxblood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:px-6 sm:text-xs";

const menuPillInverseClass =
  "font-[family-name:var(--font-label)] inline-flex min-h-10 items-center justify-center rounded-lg bg-brand-cream px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-brand-maroon shadow-sm transition hover:bg-brand-cream-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:px-6 sm:text-xs";

type SiteHeaderProps = {
  variant?: SiteHeaderVariant;
};

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const barClass =
    variant === "inverse"
      ? "bg-brand-maroon shadow-[0_8px_28px_-6px_rgb(0_0_0/0.35)] ring-1 ring-brand-cream/25"
      : "bg-brand-cream shadow-[0_8px_28px_-6px_rgb(90_10_20/0.2)] ring-1 ring-brand-maroon/15";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-transparent px-3 pt-3 pb-1 sm:px-5 sm:pt-4 sm:pb-2">
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`pointer-events-auto flex min-h-[3.25rem] items-center justify-between gap-3 rounded-full px-4 py-2 sm:min-h-[3.5rem] sm:gap-4 sm:px-6 sm:py-2.5 md:px-8 ${barClass}`}
        >
          <Link
            href="/"
            className={variant === "inverse" ? logoInverseClass : logoDefaultClass}
            lang="en"
          >
            {SITE.name}
          </Link>

          <nav
            className="flex min-w-0 items-center gap-3 sm:gap-4"
            aria-label="Main navigation"
          >
            <Link
              href="/menu"
              className={variant === "inverse" ? menuPillInverseClass : menuPillDefaultClass}
              aria-current={variant === "inverse" ? "page" : undefined}
            >
              Menu
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

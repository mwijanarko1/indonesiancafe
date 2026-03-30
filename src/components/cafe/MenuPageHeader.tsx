import Link from "next/link";
import { SITE } from "@/lib/site";

const titleClass =
  "truncate font-[family-name:var(--font-cinzel)] text-base font-extrabold uppercase leading-none tracking-[0.12em] text-white drop-shadow-[0_2px_6px_rgb(0_0_0_/_0.35)] sm:text-lg sm:tracking-[0.14em]";

const linkClass =
  "inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-address transition motion-safe:duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-[0.7rem]";

export function MenuPageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-brand-crimson/98 backdrop-blur-md batik-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        <Link href="/" className={linkClass}>
          ← Home
        </Link>
        <p className={`min-w-0 flex-1 text-center ${titleClass}`} lang="en">
          Indonesian Cafe
        </p>
        <a
          href={SITE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClass} shrink-0`}
        >
          Directions
        </a>
      </div>
    </header>
  );
}

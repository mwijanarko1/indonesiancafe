import Link from "next/link";
import { SITE } from "@/lib/site";

const titleClass =
  "truncate font-[family-name:var(--font-serif)] text-base font-bold uppercase tracking-[0.06em] text-brand-charcoal sm:text-lg";

const linkClass =
  "inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-stone-600 transition motion-safe:duration-200 hover:bg-stone-100 hover:text-brand-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-crimson sm:text-[0.7rem]";

export function MenuPageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-brand-cream-page/95 backdrop-blur-md">
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

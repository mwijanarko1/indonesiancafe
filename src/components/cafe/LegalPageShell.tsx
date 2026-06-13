import Link from "next/link";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SITE_HEADER_OVERLAY_MAIN_PAD, SiteHeader } from "@/components/cafe/SiteHeader";
import type { OpeningHoursRow } from "@/lib/site";

type LegalPageShellProps = {
  title: string;
  /** Line above the main heading (brand line). */
  eyebrow?: string;
  hours: readonly OpeningHoursRow[];
  footnote: string;
  children: React.ReactNode;
};

export function LegalPageShell({
  title,
  eyebrow = "Indonesian Cafe",
  hours,
  footnote,
  children,
}: LegalPageShellProps) {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className={`min-h-[50vh] bg-brand-cream-page px-4 py-16 sm:py-20 ${SITE_HEADER_OVERLAY_MAIN_PAD}`}
      >
        <article
          className="mx-auto max-w-3xl text-brand-maroon"
          aria-labelledby="legal-page-title"
        >
          <p className="text-center font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-maroon">
            {eyebrow}
          </p>
          <h1
            id="legal-page-title"
            className="mt-3 text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-brand-maroon sm:text-4xl"
          >
            {title}
          </h1>
          <div
            className="mx-auto mt-4 h-1 w-14 rounded-full bg-brand-gold/75"
            aria-hidden
          />
          <div
            className="mt-10 space-y-6 font-[family-name:var(--font-sans)] text-sm font-medium leading-relaxed text-brand-maroon/90 sm:text-base [&_a]:font-semibold [&_a]:text-brand-maroon [&_a]:underline [&_a]:decoration-brand-gold/50 [&_a]:underline-offset-2 [&_a]:transition [&_a]:hover:text-brand-oxblood [&_a]:hover:decoration-brand-gold [&_a]:focus-visible:outline [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-brand-gold [&_strong]:font-semibold [&_strong]:text-brand-maroon [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:font-[family-name:var(--font-serif)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-maroon [&_h2]:first:mt-8 [&_p+p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-brand-gold/70"
          >
            {children}
          </div>
          <p className="mt-12 text-center">
            <Link
              href="/"
              className="font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.12em] text-brand-maroon underline-offset-4 transition hover:text-brand-oxblood hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              ← Back to home
            </Link>
          </p>
        </article>
      </main>
      <SiteFooter hours={hours} footnote={footnote} />
    </>
  );
}

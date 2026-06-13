import type { Metadata } from "next";
import Link from "next/link";
import { PageCrossLinks } from "@/components/cafe/PageCrossLinks";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SITE_HEADER_OVERLAY_MAIN_PAD, SiteHeader } from "@/components/cafe/SiteHeader";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { SITE } from "@/lib/site";
import { getSiteOpeningHours } from "@/lib/server/site-content";
import { VISIT_PAGE_DESCRIPTION, VISIT_PAGE_TITLE, VISIT_SECTION_BLURB } from "@/lib/site-copy";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Visit",
  description: VISIT_PAGE_DESCRIPTION,
  alternates: {
    canonical: "/visit",
  },
  openGraph: {
    title: "Visit · Indonesian Cafe Sheffield",
    description: VISIT_PAGE_DESCRIPTION,
    url: "/visit",
  },
  twitter: {
    title: "Visit · Indonesian Cafe Sheffield",
    description: VISIT_PAGE_DESCRIPTION,
  },
};

export default async function VisitPage() {
  const { hours, footnote } = await getSiteOpeningHours();

  return (
    <>
      <PageJsonLd
        path="/visit"
        name="Visit - Indonesian Cafe"
        description={VISIT_PAGE_DESCRIPTION}
        breadcrumbLabel="Visit"
      />
      <SiteHeader />
      <main
        id="main-content"
        className={`min-h-[50vh] bg-brand-cream-page px-4 py-16 sm:py-20 ${SITE_HEADER_OVERLAY_MAIN_PAD}`}
      >
        <div className="mx-auto max-w-5xl text-brand-maroon">
          <p className="text-center font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-maroon">
            Indonesian Cafe
          </p>
          <h1 className="mt-3 text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-brand-maroon sm:text-4xl">
            {VISIT_PAGE_TITLE}
          </h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-brand-gold/75" aria-hidden />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-brand-maroon/80 sm:text-base">
            {VISIT_SECTION_BLURB}
          </p>

          <section className="mt-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl border border-brand-maroon/15 bg-white shadow-sm">
              <div className="relative aspect-[5/4] min-h-[20rem]">
                <iframe
                  title="Map of Indonesian Cafe, 15 Crookes, Sheffield"
                  className="absolute inset-0 h-full w-full border-0"
                  src={SITE.mapsEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="rounded-2xl border border-brand-maroon/15 bg-white px-6 py-6 shadow-sm">
              <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-brand-maroon">
                Address and contact
              </h2>
              <address className="mt-4 not-italic text-base leading-relaxed text-brand-maroon/85">
                {SITE.name}
                <br />
                {SITE.streetAddress}
                <br />
                {SITE.addressLocality} {SITE.postalCode}
                <br />
                United Kingdom
              </address>
              <p className="mt-4">
                <Link
                  href={`tel:${SITE.phoneE164}`}
                  className="font-[family-name:var(--font-label)] text-sm font-bold uppercase tracking-[0.08em] text-brand-maroon underline decoration-brand-gold/60 underline-offset-4"
                >
                  {SITE.phoneDisplay}
                </Link>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-sm border-2 border-brand-maroon px-5 py-2 font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.12em] text-brand-maroon transition hover:bg-brand-maroon/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                >
                  Open Google Maps
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-brand-maroon/15 bg-white px-6 py-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-brand-maroon">
              Opening hours
            </h2>
            <dl className="mt-5 grid gap-2 sm:max-w-xl">
              {hours.map((row) => (
                <div key={row.day} className="flex items-center justify-between gap-4 border-b border-brand-maroon/10 pb-2 text-sm sm:text-base">
                  <dt className="font-semibold text-brand-maroon">{row.day}</dt>
                  <dd className="text-brand-maroon/80">{row.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-brand-maroon/75">{footnote}</p>
            <p className="mt-4 text-sm leading-relaxed text-brand-maroon/80">
              Dine in or takeaway, with coffee and bakery favourites available alongside the menu.
            </p>
          </section>

          <PageCrossLinks
            title="Keep exploring"
            description="Use the menu and guest reviews pages when you want to share what to order or what other diners have said."
            links={[
              { href: "/menu", label: "Browse the menu" },
              { href: "/reviews", label: "Read guest reviews" },
            ]}
          />
        </div>
      </main>
      <SiteFooter hours={hours} footnote={footnote} />
    </>
  );
}

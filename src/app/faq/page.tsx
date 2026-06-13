import type { Metadata } from "next";
import { PageCrossLinks } from "@/components/cafe/PageCrossLinks";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SITE_HEADER_OVERLAY_MAIN_PAD, SiteHeader } from "@/components/cafe/SiteHeader";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { FAQ_ITEMS, FAQ_PAGE_DESCRIPTION } from "@/lib/faq";
import { getSiteOpeningHours } from "@/lib/server/site-content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "FAQ",
  description: FAQ_PAGE_DESCRIPTION,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ · Indonesian Cafe Sheffield",
    description: FAQ_PAGE_DESCRIPTION,
    url: "/faq",
  },
  twitter: {
    title: "FAQ · Indonesian Cafe Sheffield",
    description: FAQ_PAGE_DESCRIPTION,
  },
};

export default async function FaqPage() {
  const openingHours = await getSiteOpeningHours();

  return (
    <>
      <FaqJsonLd path="/faq" items={FAQ_ITEMS} />
      <PageJsonLd
        path="/faq"
        name="FAQ - Indonesian Cafe"
        description={FAQ_PAGE_DESCRIPTION}
        breadcrumbLabel="FAQ"
      />
      <SiteHeader />
      <main
        id="main-content"
        className={`min-h-[50vh] bg-brand-cream-page px-4 py-16 sm:py-20 ${SITE_HEADER_OVERLAY_MAIN_PAD}`}
      >
        <div className="mx-auto max-w-4xl text-brand-maroon">
          <p className="text-center font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-maroon">
            Indonesian Cafe
          </p>
          <h1 className="mt-3 text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-brand-maroon sm:text-4xl">
            FAQ
          </h1>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-brand-gold/75" aria-hidden />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-brand-maroon/80 sm:text-base">
            Straight answers from us. The things guests ask most often.
          </p>

          <div className="mt-10 space-y-4">
            {FAQ_ITEMS.map((item) => (
              <section
                key={item.question}
                className="rounded-2xl border border-brand-maroon/15 bg-white px-6 py-6 shadow-sm"
              >
                <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-brand-maroon">
                  {item.question}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-maroon/80 sm:text-base">
                  {item.answer}
                </p>
              </section>
            ))}
          </div>

          <PageCrossLinks
            title="Next pages to open"
            description="If you are deciding what to order or how to get here, these are the fastest follow-up routes."
            links={[
              { href: "/menu", label: "Browse the menu" },
              { href: "/visit", label: "Plan your visit" },
            ]}
          />
        </div>
      </main>
      <SiteFooter hours={openingHours.hours} footnote={openingHours.footnote} />
    </>
  );
}

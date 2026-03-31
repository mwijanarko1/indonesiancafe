import type { Metadata } from "next";
import Link from "next/link";
import { GuestReviewsListView } from "@/components/cafe/GuestReviewsList";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SiteHeader } from "@/components/cafe/SiteHeader";
import { SITE } from "@/lib/site";
import { getSiteReviewsContent } from "@/lib/server/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guest reviews",
  description:
    "What guests say about Indonesian Cafe in Crookes, Sheffield — authentic Indonesian food, nasi padang, rendang, and warm service.",
  alternates: {
    canonical: "/reviews",
  },
};

export default async function ReviewsPage() {
  const { reviews } = await getSiteReviewsContent();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="bg-brand-cream min-h-[50vh] px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-center font-[family-name:var(--font-cinzel)] text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brand-crimson">
            Indonesian Cafe
          </p>
          <h1 className="mt-3 text-center font-[family-name:var(--font-serif)] text-3xl font-semibold text-brand-crimson sm:text-4xl">
            Guest reviews
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-brand-maroon/80 sm:text-base">
            Thank you to everyone who has shared kind words. We are grateful to cook for Crookes and
            Sheffield.
          </p>
          <GuestReviewsListView reviews={reviews} />

          <div className="mt-16 rounded-lg border border-brand-crimson/20 bg-white/40 px-6 py-8 text-center">
            <p className="text-sm leading-relaxed text-brand-maroon/85">
              Leave a rating or read more on Google Maps — it helps other people find us.
            </p>
            <Link
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full border-2 border-brand-crimson bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-brand-crimson transition hover:bg-brand-crimson/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-crimson"
            >
              Open Google Maps
            </Link>
          </div>

          <p className="mt-10 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-brand-crimson underline-offset-4 transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-crimson"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

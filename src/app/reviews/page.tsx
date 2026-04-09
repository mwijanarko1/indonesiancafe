import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { GuestReviewsListView } from "@/components/cafe/GuestReviewsList";
import { SiteFooter } from "@/components/cafe/SiteFooter";
import { SITE_HEADER_OVERLAY_MAIN_PAD, SiteHeader } from "@/components/cafe/SiteHeader";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { HERO_IMAGE_PATH, SITE } from "@/lib/site";
import { getSiteReviewsContent } from "@/lib/server/site-content";

export const dynamic = "force-dynamic";

const reviewsDescription =
  "Guest reviews for Indonesian restaurant Sheffield — Indonesian Cafe Crookes, halal Indonesian food, takeaway and dine-in. Coffee and bakery at 15 Crookes, S10 1UA. See what diners say.";

export const metadata: Metadata = {
  title: "Guest reviews",
  description: reviewsDescription,
  alternates: {
    canonical: "/reviews",
  },
  openGraph: {
    title: "Guest reviews · Indonesian Cafe Sheffield",
    description: reviewsDescription,
    url: "/reviews",
    images: [
      {
        url: HERO_IMAGE_PATH,
        width: 1966,
        height: 1423,
        alt: "Indonesian restaurant Sheffield — Indonesian Cafe, halal Indonesian food, coffee and bakery, 15 Crookes S10",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guest reviews · Indonesian Cafe Sheffield",
    description: reviewsDescription,
    images: [HERO_IMAGE_PATH],
  },
};

export default async function ReviewsPage() {
  const [{ reviews }, requestHeaders] = await Promise.all([getSiteReviewsContent(), headers()]);
  const nonce = requestHeaders.get("x-nonce") ?? "";

  return (
    <>
      <PageJsonLd
        nonce={nonce}
        path="/reviews"
        name="Guest reviews - Indonesian Cafe"
        description={reviewsDescription}
        breadcrumbLabel="Reviews"
      />
      <SiteHeader />
      <main
        id="main-content"
        className={`min-h-[50vh] bg-brand-cream-page px-4 py-16 sm:py-20 ${SITE_HEADER_OVERLAY_MAIN_PAD}`}
      >
        <div className="mx-auto max-w-3xl text-brand-maroon">
          <p className="text-center font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-maroon">
            Indonesian Cafe
          </p>
          <h1 className="mt-3 text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-brand-maroon sm:text-4xl">
            Guest reviews
          </h1>
          <div
            className="mx-auto mt-4 h-1 w-14 rounded-full bg-brand-gold/75"
            aria-hidden
          />
          <p className="mx-auto mt-6 max-w-xl text-center text-sm text-brand-maroon/80 sm:text-base">
            Thank you to everyone who has shared kind words. We are grateful to cook for Crookes and
            Sheffield.
          </p>
          <GuestReviewsListView reviews={reviews} />

          <div className="mt-16 rounded-lg border border-brand-maroon/15 bg-brand-cream px-6 py-8 text-center">
            <p className="text-sm leading-relaxed text-brand-maroon/85">
              Leave a rating or read more on Google Maps — it helps other people find us.
            </p>
            <Link
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full border-2 border-brand-maroon bg-transparent px-8 py-3 font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.08em] text-brand-maroon transition hover:bg-brand-maroon/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              Open Google Maps
            </Link>
          </div>

          <p className="mt-10 text-center">
            <Link
              href="/"
              className="font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.12em] text-brand-maroon underline-offset-4 transition hover:text-brand-oxblood hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
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

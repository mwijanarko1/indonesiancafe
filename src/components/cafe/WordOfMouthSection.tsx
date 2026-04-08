import Link from "next/link";
import { FeaturedGuestReviewsCardsView } from "@/components/cafe/GuestReviewsList";
import { type GuestReview } from "@/lib/guest-reviews";
import { REVIEWS_SECTION_BLURB, REVIEWS_SECTION_TITLE } from "@/lib/site-copy";

export function WordOfMouthSection({ featured }: { featured: readonly GuestReview[] }) {
  return (
    <section
      className="bg-brand-maroon px-4 py-16 text-brand-address sm:py-20"
      aria-labelledby="word-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="word-heading"
          className="text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-brand-address sm:text-4xl"
        >
          {REVIEWS_SECTION_TITLE}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-brand-address/85">
          {REVIEWS_SECTION_BLURB}
        </p>
        <FeaturedGuestReviewsCardsView featured={featured} variant="maroon" />
        <div className="mt-12 flex justify-center">
          <Link
            href="/reviews"
            className="rounded-sm border-2 border-brand-address/85 bg-transparent px-8 py-3 font-[family-name:var(--font-label)] text-sm font-bold uppercase tracking-[0.08em] text-brand-address transition hover:bg-brand-address/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            See more reviews
          </Link>
        </div>
      </div>
    </section>
  );
}

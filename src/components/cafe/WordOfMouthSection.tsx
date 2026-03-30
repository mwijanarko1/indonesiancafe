import Link from "next/link";
import { FeaturedGuestReviewsCards } from "@/components/cafe/GuestReviewsList";

export function WordOfMouthSection() {
  return (
    <section
      className="bg-brand-cream px-4 py-16 sm:py-20"
      aria-labelledby="word-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="word-heading"
          className="text-center font-[family-name:var(--font-serif)] text-3xl font-semibold text-brand-crimson sm:text-4xl"
        >
          Word of mouth
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-brand-maroon/80">
          Real words from guests — thank you for eating with us in Crookes.
        </p>
        <FeaturedGuestReviewsCards />
        <div className="mt-12 flex justify-center">
          <Link
            href="/reviews"
            className="rounded-full border-2 border-brand-crimson bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-brand-crimson transition hover:bg-brand-crimson/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-crimson"
          >
            See more reviews
          </Link>
        </div>
      </div>
    </section>
  );
}

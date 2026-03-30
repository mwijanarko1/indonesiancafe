import Link from "next/link";
import { FeaturedGuestReviewsCards } from "@/components/cafe/GuestReviewsList";

export function WordOfMouthSection() {
  return (
    <section
      className="bg-brand-charcoal px-4 py-16 text-brand-address sm:py-20"
      aria-labelledby="word-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="word-heading"
          className="text-center font-[family-name:var(--font-serif)] text-3xl font-semibold text-white sm:text-4xl"
        >
          Word of mouth
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/75">
          Real words from guests — thank you for eating with us in Crookes.
        </p>
        <FeaturedGuestReviewsCards variant="dark" />
        <div className="mt-12 flex justify-center">
          <Link
            href="/reviews"
            className="rounded-sm border-2 border-white/80 bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            See more reviews
          </Link>
        </div>
      </div>
    </section>
  );
}

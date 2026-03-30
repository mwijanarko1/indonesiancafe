"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  getFeaturedGuestReviews,
  getFeaturedGuestReviewsFrom,
  GUEST_REVIEWS,
  type GuestReview,
} from "@/lib/guest-reviews";

function GuestReviewsListView({
  reviews,
  loading,
}: {
  reviews: readonly GuestReview[];
  loading?: boolean;
}) {
  return (
    <ul
      className="mt-14 flex list-none flex-col gap-12 p-0"
      aria-busy={loading ? true : undefined}
    >
      {reviews.map((r) => (
        <li
          key={r.author}
          className="border-t-2 border-brand-crimson/20 pt-8 first:border-t-0 first:pt-0"
        >
          <p className="font-[family-name:var(--font-cinzel)] text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-crimson">
            {r.author}
          </p>
          <blockquote className="mt-3 text-base leading-relaxed text-brand-maroon/90">
            <p className="text-pretty whitespace-pre-line">“{r.quote}”</p>
          </blockquote>
        </li>
      ))}
    </ul>
  );
}

function GuestReviewsListConvex() {
  const remote = useQuery(api.reviews.get, {});
  const reviews =
    remote !== undefined && remote !== null ? remote.reviews : GUEST_REVIEWS;
  const loading = remote === undefined;

  return <GuestReviewsListView reviews={reviews} loading={loading} />;
}

export function GuestReviewsList() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL?.trim()) {
    return <GuestReviewsListView reviews={GUEST_REVIEWS} />;
  }
  return <GuestReviewsListConvex />;
}

function FeaturedGuestReviewsCardsView({
  featured,
  loading,
}: {
  featured: GuestReview[];
  loading?: boolean;
}) {
  return (
    <ul
      className="mt-12 grid gap-8 sm:grid-cols-3"
      aria-busy={loading ? true : undefined}
    >
      {featured.map((r) => (
        <li
          key={r.author}
          className="border-t-2 border-brand-crimson/25 pt-6 text-center sm:text-left"
        >
          <p className="font-[family-name:var(--font-cinzel)] text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-crimson">
            {r.author}
          </p>
          <blockquote className="mt-3 text-sm leading-relaxed text-brand-maroon/88 sm:text-base">
            <p className="text-pretty whitespace-pre-line">
              “{r.homeExcerpt ?? r.quote}”
            </p>
          </blockquote>
        </li>
      ))}
    </ul>
  );
}

function FeaturedGuestReviewsCardsConvex() {
  const remote = useQuery(api.reviews.get, {});
  const loading = remote === undefined;
  const featured =
    remote !== undefined && remote !== null
      ? getFeaturedGuestReviewsFrom(remote.reviews, remote.featuredAuthorOrder)
      : getFeaturedGuestReviews();

  return <FeaturedGuestReviewsCardsView featured={featured} loading={loading} />;
}

export function FeaturedGuestReviewsCards() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL?.trim()) {
    return (
      <FeaturedGuestReviewsCardsView featured={getFeaturedGuestReviews()} />
    );
  }
  return <FeaturedGuestReviewsCardsConvex />;
}

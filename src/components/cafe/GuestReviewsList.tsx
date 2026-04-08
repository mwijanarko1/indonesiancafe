import { type GuestReview } from "@/lib/guest-reviews";

export function GuestReviewsListView({
  reviews,
}: {
  reviews: readonly GuestReview[];
}) {
  return (
    <ul className="mt-14 flex list-none flex-col gap-12 p-0">
      {reviews.map((r) => (
        <li
          key={r.author}
          className="border-t-2 border-brand-maroon/15 pt-8 first:border-t-0 first:pt-0"
        >
          <p className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.22em] text-brand-maroon">
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

export function FeaturedGuestReviewsCardsView({
  featured,
  variant = "cream",
}: {
  featured: readonly GuestReview[];
  variant?: "cream" | "dark" | "maroon";
}) {
  const isDark = variant === "dark";
  const isMaroon = variant === "maroon";
  return (
    <ul className="mt-12 grid gap-8 sm:grid-cols-3">
      {featured.map((r) => (
        <li
          key={r.author}
          className={`border-t-2 pt-6 text-center sm:text-left ${
            isMaroon
              ? "border-brand-address/30"
              : isDark
                ? "border-white/20"
                : "border-brand-crimson/25"
          }`}
        >
          <p
            className={`font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.22em] ${
              isMaroon
                ? "text-brand-address"
                : isDark
                  ? "text-brand-gold"
                  : "text-brand-crimson"
            }`}
          >
            {r.author}
          </p>
          <blockquote
            className={`mt-3 text-sm leading-relaxed sm:text-base ${
              isMaroon ? "text-brand-address/92" : isDark ? "text-white/88" : "text-brand-maroon/88"
            }`}
          >
            <p className="text-pretty whitespace-pre-line">
              “{r.homeExcerpt ?? r.quote}”
            </p>
          </blockquote>
        </li>
      ))}
    </ul>
  );
}

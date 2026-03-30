export type GuestReview = {
  author: string;
  /** Full review text as shared by the guest. */
  quote: string;
  /** Shorter text for homepage word-of-mouth cards when the full quote is long. */
  homeExcerpt?: string;
};

/** Homepage “Word of mouth” cards — author names in display order. */
export const DEFAULT_FEATURED_AUTHOR_ORDER = [
  "Christopher Cooksley",
  "Fandy Laksono",
  "Yusuf Kurniawan",
] as const;

/**
 * Guest reviews (word of mouth). Order matches how they were collected.
 * Featured on the homepage: see `DEFAULT_FEATURED_AUTHOR_ORDER`.
 */
export const GUEST_REVIEWS: readonly GuestReview[] = [
  {
    author: "Christopher Cooksley",
    quote:
      "Finally, a place to eat delicious, authentic Indonesian food in Sheffield! We had the nasi padang, gado gado and various side dishes and it was all fantastic, the rendang was the best I’ve had in the UK. Fantastic service too. Will definitely be back!",
  },
  {
    author: "Renny Fernandes",
    quote:
      "I'm so happy there's an Indonesian restaurant in Sheffield selling delicious Padang rice. The friendly staff often give extras. I hope they keep it going! I highly recommend their authentic Padang rice.",
  },
  {
    author: "Asma Badri",
    quote:
      "I visited this Indonesian restaurant with my friends and had a wonderful experience. The atmosphere was vibrant and welcoming, making it a great place to eat and enjoy good company. The food was absolutely delicious, full of authentic flavors and clearly prepared with care. The service was excellent friendly, attentive, and genuinely warm throughout our visit. The owners are incredibly kind and welcoming, which truly adds a special touch to the place. Overall, it was a memorable experience, and I would highly recommend this restaurant to anyone looking to enjoy great Indonesian food in a lovely setting.",
  },
  {
    author: "Kelsey Wong",
    quote:
      "Enjoyed our bakso daging and nasi padang komplit. Lovely staff and atmosphere. 10/10 would recommend for authentic Indonesian food ! Thanks!",
  },
  {
    author: "Fandy Laksono",
    quote:
      "If you’re looking for authentic Indonesian food in Sheffield, this place is a must-visit. The café has a warm, cozy atmosphere that makes you feel comfortable as soon as you walk in.\n\nI tried the mixed rice with rendang, egg balado, vegetables, sambal, and crackers. The rendang was tender and full of rich spices, and the sambal had a great balance of heat and flavour. The portion was generous and very satisfying.\n\nThe staff were friendly and welcoming, and the overall experience felt homely and relaxed. Prices are reasonable for the quality and portion size. Highly recommended for anyone missing Indonesian food or wanting to try something authentic.",
    homeExcerpt:
      "If you’re looking for authentic Indonesian food in Sheffield, this place is a must-visit. The café has a warm, cozy atmosphere. I tried the mixed rice with rendang, egg balado, vegetables, sambal, and crackers. The rendang was tender and full of rich spices, and the sambal had a great balance of heat and flavour. Highly recommended.",
  },
  {
    author: "Yusuf Kurniawan",
    quote:
      "The rendang here is so good that when Uni Linda greeted us after the meal, I was not surprised to learn that she is originally from West Sumatra. The beef is perfectly tender, while the sauce, thick, rich, and full of flavour, is not overly dry and carries a pleasant hint of mild spiciness. If this is your first visit, start with the Nasi Padang Komplit (Complete Padang Rice) and go from there.\n\nOther notable dishes we tried were cireng (tapioca fritters) and bakwan, also known as ote-ote, pia-pia, bala-bala, and heci depending on where you're from (think vegetable tempura). With fritters, texture is the first thing you notice, and both had it perfect: crunchy outside, tender inside. The cireng was clearly fresh from the fryer, otherwise, you would notice immediately, as the inside would not stretch when bitten. The bakwan was filled with shredded cabbage and carrot, and I thought I caught a hint of shrimp inside. Both from simple ingredients, both full of flavour.\n\nWill definitely come back here as soon as I can. Next trip: Mie Ayam!",
    homeExcerpt:
      "The rendang here is so good… If this is your first visit, start with the Nasi Padang Komplit (Complete Padang Rice) and go from there. Other notable dishes we tried were cireng (tapioca fritters) and bakwan… crunchy outside, tender inside. Will definitely come back — next trip: Mie Ayam!",
  },
  {
    author: "Chris Scott",
    quote:
      "A very welcome addition to Crookes! Great-tasting, fresh food made and served by a friendly family who were very happy to offer recommendations. I can't wait to come back and try more dishes here - I can tell it's going to be a regular spot. Highly recommended!",
  },
  {
    author: "Laverita Chantika",
    quote:
      "finally an authentic indonesian restaurant in sheffield!! tried the nasi padang and it’s amazingg! staff are friendly and welcoming. will definitely be back ☺️",
  },
  {
    author: "Nelson Jong",
    quote:
      "Best Indonesian food probably North of England. Nasi padang is a must, try tempeh mendoan and their vegetable fritters too. Like home away from home.",
  },
] as const;

export function getFeaturedGuestReviewsFrom(
  reviews: readonly GuestReview[],
  order: readonly string[],
): GuestReview[] {
  const byAuthor = new Map(reviews.map((r) => [r.author, r]));
  return order.map((name) => byAuthor.get(name)).filter((r): r is GuestReview => r !== undefined);
}

export function getFeaturedGuestReviews(): GuestReview[] {
  return getFeaturedGuestReviewsFrom(GUEST_REVIEWS, DEFAULT_FEATURED_AUTHOR_ORDER);
}

import "server-only";

import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { DEFAULT_SITE_MENU, type SiteMenuContent } from "@/lib/cafe-menu";
import {
  DEFAULT_FEATURED_AUTHOR_ORDER,
  GUEST_REVIEWS,
  type GuestReview,
} from "@/lib/guest-reviews";

type ContentSource = "convex" | "fallback";

export type SiteMenuContentResult = {
  menu: SiteMenuContent;
  source: ContentSource;
};

export type SiteReviewsContentResult = {
  reviews: readonly GuestReview[];
  featuredAuthorOrder: readonly string[];
  source: ContentSource;
};

function getConvexDeploymentUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  return url ? url : null;
}

function fallbackMenuContent(): SiteMenuContentResult {
  return {
    menu: DEFAULT_SITE_MENU,
    source: "fallback",
  };
}

function fallbackReviewsContent(): SiteReviewsContentResult {
  return {
    reviews: GUEST_REVIEWS,
    featuredAuthorOrder: DEFAULT_FEATURED_AUTHOR_ORDER,
    source: "fallback",
  };
}

export async function getSiteMenuContent(): Promise<SiteMenuContentResult> {
  const url = getConvexDeploymentUrl();
  if (!url) {
    return fallbackMenuContent();
  }

  try {
    const menu = await fetchQuery(api.menu.get, {}, { url });
    if (menu !== null) {
      return { menu, source: "convex" };
    }
    console.error("[site-content] menu query returned null; using fallback.");
  } catch (error) {
    console.error("[site-content] menu query failed; using fallback.", error);
  }

  return fallbackMenuContent();
}

export async function getSiteReviewsContent(): Promise<SiteReviewsContentResult> {
  const url = getConvexDeploymentUrl();
  if (!url) {
    return fallbackReviewsContent();
  }

  try {
    const reviews = await fetchQuery(api.reviews.get, {}, { url });
    if (reviews !== null) {
      return {
        reviews: reviews.reviews,
        featuredAuthorOrder: reviews.featuredAuthorOrder,
        source: "convex",
      };
    }
    console.error("[site-content] reviews query returned null; using fallback.");
  } catch (error) {
    console.error("[site-content] reviews query failed; using fallback.", error);
  }

  return fallbackReviewsContent();
}

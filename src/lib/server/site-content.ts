import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { DEFAULT_SITE_MENU, type SiteMenuContent } from "@/lib/cafe-menu";
import {
  DEFAULT_FEATURED_AUTHOR_ORDER,
  GUEST_REVIEWS,
  type GuestReview,
} from "@/lib/guest-reviews";

type ContentSource = "convex" | "fallback";
type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

const SITE_CONTENT_REVALIDATE_SECONDS = 3600;

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

function createConvexServerFetch(): typeof fetch {
  return (input, init) =>
    fetch(input, {
      ...init,
      cache: "force-cache",
      next: { revalidate: SITE_CONTENT_REVALIDATE_SECONDS },
    } as NextFetchInit);
}

function createConvexClient(url: string): ConvexHttpClient {
  return new ConvexHttpClient(url, {
    fetch: createConvexServerFetch(),
  });
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
    const menu = await createConvexClient(url).query(api.menu.get, {});
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
    const reviews = await createConvexClient(url).query(api.reviews.get, {});
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

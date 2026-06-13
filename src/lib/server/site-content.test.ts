import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SITE_MENU } from "@/lib/cafe-menu";
import {
  DEFAULT_FEATURED_AUTHOR_ORDER,
  GUEST_REVIEWS,
} from "@/lib/guest-reviews";

const mockConvexQuery = vi.fn();
const MockConvexHttpClient = vi.fn(function MockConvexHttpClient() {
  return {
    query: mockConvexQuery,
  };
});

vi.mock("convex/browser", () => ({
  ConvexHttpClient: MockConvexHttpClient,
}));

vi.mock("@convex/_generated/api", () => ({
  api: {
    menu: { get: "menu.get" },
    reviews: { get: "reviews.get" },
    openingHours: { get: "openingHours.get" },
  },
}));

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("site content loaders", () => {
  it("returns Convex menu data when configured", async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "https://example.convex.cloud";
    mockConvexQuery.mockResolvedValueOnce(DEFAULT_SITE_MENU);

    const { getSiteMenuContent } = await import("./site-content");
    await expect(getSiteMenuContent()).resolves.toEqual({
      menu: DEFAULT_SITE_MENU,
      source: "convex",
    });
  });

  it("falls back when the menu query returns null", async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "https://example.convex.cloud";
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockConvexQuery.mockResolvedValueOnce(null);

    const { getSiteMenuContent } = await import("./site-content");
    await expect(getSiteMenuContent()).resolves.toEqual({
      menu: DEFAULT_SITE_MENU,
      source: "fallback",
    });

    expect(consoleError).toHaveBeenCalled();
  });

  it("falls back when the reviews query throws", async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "https://example.convex.cloud";
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockConvexQuery.mockRejectedValueOnce(new Error("boom"));

    const { getSiteReviewsContent } = await import("./site-content");
    await expect(getSiteReviewsContent()).resolves.toEqual({
      reviews: GUEST_REVIEWS,
      featuredAuthorOrder: DEFAULT_FEATURED_AUTHOR_ORDER,
      source: "fallback",
    });

    expect(consoleError).toHaveBeenCalled();
  });

  it("uses fallback content when Convex is not configured", async () => {
    delete process.env.NEXT_PUBLIC_CONVEX_URL;

    const { getSiteReviewsContent } = await import("./site-content");
    await expect(getSiteReviewsContent()).resolves.toEqual({
      reviews: GUEST_REVIEWS,
      featuredAuthorOrder: DEFAULT_FEATURED_AUTHOR_ORDER,
      source: "fallback",
    });
  });

  it("returns Convex opening hours when configured", async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "https://example.convex.cloud";
    mockConvexQuery.mockResolvedValueOnce({
      hours: [{ day: "Monday", time: "9 am–5 pm" }],
      footnote: "Custom footnote",
    });

    const { getSiteOpeningHours } = await import("./site-content");
    await expect(getSiteOpeningHours()).resolves.toEqual({
      hours: [{ day: "Monday", time: "9 am–5 pm" }],
      footnote: "Custom footnote",
      source: "convex",
    });
  });
});

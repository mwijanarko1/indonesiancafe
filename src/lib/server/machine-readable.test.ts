import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SITE_MENU } from "@/lib/cafe-menu";
import {
  DEFAULT_FEATURED_AUTHOR_ORDER,
  GUEST_REVIEWS,
  type GuestReview,
} from "@/lib/guest-reviews";

const ORIGINAL_ENV = { ...process.env };

let mockMenu = DEFAULT_SITE_MENU;
let mockReviews: readonly GuestReview[] = GUEST_REVIEWS;
let mockFeaturedOrder: readonly string[] = DEFAULT_FEATURED_AUTHOR_ORDER;

vi.mock("@/lib/server/site-content", () => ({
  getSiteMenuContent: vi.fn(async () => ({
    menu: mockMenu,
    source: "fallback",
  })),
  getSiteReviewsContent: vi.fn(async () => ({
    reviews: mockReviews,
    featuredAuthorOrder: mockFeaturedOrder,
    source: "fallback",
  })),
}));

describe("machine-readable generators", () => {
  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_APP_URL: "https://indonesiancafe.co.uk",
      NODE_ENV: "test",
    };
    mockMenu = DEFAULT_SITE_MENU;
    mockReviews = GUEST_REVIEWS;
    mockFeaturedOrder = DEFAULT_FEATURED_AUTHOR_ORDER;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("buildLlmsTxt includes all markdown document URLs", async () => {
    const { buildLlmsTxt } = await import("./machine-readable");
    const txt = buildLlmsTxt();

    expect(txt).toContain("https://indonesiancafe.co.uk/llms/home.md");
    expect(txt).toContain("https://indonesiancafe.co.uk/llms/menu.md");
    expect(txt).toContain("https://indonesiancafe.co.uk/llms/reviews.md");
    expect(txt).toContain("https://indonesiancafe.co.uk/llms/privacy.md");
    expect(txt).toContain("https://indonesiancafe.co.uk/llms/terms.md");
  });

  it("home markdown includes key location and hours content", async () => {
    const { buildHomeMarkdown } = await import("./machine-readable");
    const markdown = await buildHomeMarkdown();

    expect(markdown).toContain("# Home - Indonesian Cafe");
    expect(markdown).toContain("15 Crookes");
    expect(markdown).toContain("Monday: 10 am");
    expect(markdown).toContain("## Opening hours");
  });

  it("menu markdown includes disclaimer and excludes unavailable items", async () => {
    const hiddenName =
      DEFAULT_SITE_MENU.categories[0].variant === "priced"
        ? DEFAULT_SITE_MENU.categories[0].items[0].name
        : "";

    mockMenu = {
      ...DEFAULT_SITE_MENU,
      categories: DEFAULT_SITE_MENU.categories.map((category, index) => {
        if (index !== 0 || category.variant !== "priced") {
          return category;
        }
        return {
          ...category,
          items: category.items.map((item, itemIndex) =>
            itemIndex === 0 ? { ...item, isAvailable: false as const } : item,
          ),
        };
      }),
    };

    const { buildMenuMarkdown } = await import("./machine-readable");
    const markdown = await buildMenuMarkdown();

    expect(markdown).toContain(DEFAULT_SITE_MENU.disclaimer);
    expect(markdown).not.toContain(hiddenName);
    expect(markdown).toContain("## Main Menu");
  });

  it("reviews markdown includes author names and quote content", async () => {
    const { buildReviewsMarkdown } = await import("./machine-readable");
    const markdown = await buildReviewsMarkdown();

    expect(markdown).toContain("## All reviews");
    expect(markdown).toContain("### Christopher Cooksley");
    expect(markdown).toContain("Finally, a place to eat delicious, authentic Indonesian food in Sheffield");
  });

  it("privacy and terms markdown include expected headings and related links", async () => {
    const { buildPrivacyMarkdown, buildTermsMarkdown } = await import("./machine-readable");
    const privacy = buildPrivacyMarkdown();
    const terms = buildTermsMarkdown();

    expect(privacy).toContain("## Who we are");
    expect(privacy).toContain("[Terms of use](https://indonesiancafe.co.uk/terms)");
    expect(terms).toContain("## Agreement");
    expect(terms).toContain("[Privacy notice](https://indonesiancafe.co.uk/privacy)");
  });
});

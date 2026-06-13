import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GUEST_REVIEWS } from "@/lib/guest-reviews";
import ReviewsPage, { metadata } from "./page";
import { openingHoursContentMock } from "@/test/opening-hours-mock";

vi.mock("@/lib/server/site-content", () => ({
  getSiteReviewsContent: vi.fn(async () => ({
    reviews: GUEST_REVIEWS,
    source: "fallback",
  })),
  getSiteOpeningHours: vi.fn(async () => openingHoursContentMock),
}));

describe("/reviews page", () => {
  it("exports reviews metadata with canonical /reviews", () => {
    expect(metadata.title).toBe("Guest reviews");
    expect(metadata.alternates?.canonical).toBe("/reviews");
  });

  it("renders reviews heading", async () => {
    render(await ReviewsPage());
    expect(screen.getByRole("heading", { name: /Guest reviews/i, level: 1 })).toBeInTheDocument();
  });

  it("renders breadcrumb json-ld for the reviews page", async () => {
    const { container } = render(await ReviewsPage());
    const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));

    expect(
      scripts.some((script) => {
        const content = script.textContent ?? "";
        return content.includes('"BreadcrumbList"') && content.includes("/reviews");
      }),
    ).toBe(true);
  });

  it("links review readers to visit and menu pages", async () => {
    render(await ReviewsPage());
    expect(screen.getByRole("link", { name: /Open Google Maps/i })).toHaveAttribute(
      "href",
      expect.stringContaining("maps"),
    );
    expect(screen.getByRole("link", { name: /Browse the menu/i })).toHaveAttribute("href", "/menu");
    expect(screen.getByRole("link", { name: /Plan your visit/i })).toHaveAttribute("href", "/visit");
  });
});

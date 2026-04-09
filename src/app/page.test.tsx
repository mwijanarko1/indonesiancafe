import { render, screen } from "@testing-library/react";
import { DEFAULT_SITE_MENU } from "@/lib/cafe-menu";
import {
  DEFAULT_FEATURED_AUTHOR_ORDER,
  GUEST_REVIEWS,
} from "@/lib/guest-reviews";
import Home, { metadata } from "./page";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/lib/server/site-content", () => ({
  getSiteMenuContent: vi.fn(async () => ({
    menu: DEFAULT_SITE_MENU,
    source: "fallback",
  })),
  getSiteReviewsContent: vi.fn(async () => ({
    reviews: GUEST_REVIEWS,
    featuredAuthorOrder: DEFAULT_FEATURED_AUTHOR_ORDER,
    source: "fallback",
  })),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element -- test double for next/image
    <img alt={alt ?? ""} {...props} />
  ),
}));

describe("Home (Indonesian Cafe)", () => {
  it("exports home metadata with canonical /", () => {
    expect(metadata.alternates?.canonical).toBe("/");
  });

  it("renders the hero heading", async () => {
    render(await Home());
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/Indonesian Restaurant in Sheffield/i);
  });

  it("renders menu and visit sections", async () => {
    render(await Home());
    expect(screen.getByRole("heading", { name: /Indonesian favourites/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Home in Crookes/i })).toBeInTheDocument();
  });

  it("primary nav Menu link targets /menu", async () => {
    render(await Home());
    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    const menuLinks = nav.querySelectorAll('a[href="/menu"]');
    expect(menuLinks.length).toBe(1);
    expect(menuLinks[0]).toHaveTextContent(/^Menu$/i);
  });

  it("homepage menu section links to full menu page", async () => {
    render(await Home());
    expect(screen.getByRole("link", { name: /view full menu/i })).toHaveAttribute("href", "/menu");
  });

  it("shows the Sheffield address", async () => {
    render(await Home());
    expect(screen.getAllByText(/15 Crookes/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/S10 1UA/i).length).toBeGreaterThan(0);
  });

  it("shows the public phone number", async () => {
    render(await Home());
    expect(screen.getAllByRole("link", { name: /07491 287515/i }).length).toBeGreaterThan(0);
  });
});

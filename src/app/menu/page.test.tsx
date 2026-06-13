import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MenuPageBody } from "@/components/cafe/MenuPageBody";
import { SITE_HEADER_OVERLAY_MAIN_PAD, SiteHeader } from "@/components/cafe/SiteHeader";
import { DEFAULT_SITE_MENU } from "@/lib/cafe-menu";
import MenuPage, { metadata } from "./page";
import { openingHoursContentMock } from "@/test/opening-hours-mock";

vi.mock("@/lib/server/site-content", () => ({
  getSiteMenuContent: vi.fn(async () => ({
    menu: DEFAULT_SITE_MENU,
    source: "fallback",
  })),
  getSiteOpeningHours: vi.fn(async () => openingHoursContentMock),
}));

function MenuPageTestShell() {
  return (
    <>
      <SiteHeader variant="inverse" />
      <main id="main-content" className={SITE_HEADER_OVERLAY_MAIN_PAD}>
        <MenuPageBody menu={DEFAULT_SITE_MENU} />
      </main>
    </>
  );
}

describe("/menu page", () => {
  it("exports menu metadata with canonical /menu", () => {
    expect(metadata.title).toBe("Menu");
    expect(metadata.alternates?.canonical).toBe("/menu");
    expect(String(metadata.description ?? "")).toMatch(/Sheffield/i);
  });

  it("renders the page heading and category jump controls", () => {
    render(<MenuPageTestShell />);
    expect(screen.getByRole("heading", { name: /^The menu$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Main courses$/i })).toBeInTheDocument();
  });

  it("shows fallback food and drinks scan links", () => {
    render(<MenuPageTestShell />);
    expect(screen.getByRole("link", { name: /food menu \(PDF \/ image\)/i })).toHaveAttribute(
      "href",
      "/menu-food.jpeg",
    );
    expect(screen.getByRole("link", { name: /drinks menu \(PDF \/ image\)/i })).toHaveAttribute(
      "href",
      "/indo-cafe-drinks-menu.jpg",
    );
  });

  it("renders site logo linking home in header", () => {
    render(<MenuPageTestShell />);
    const logo = screen.getByRole("link", { name: /^Indonesian Cafe$/i });
    expect(logo).toHaveAttribute("href", "/");
  });

  it("does not list items marked unavailable", () => {
    const hiddenName =
      DEFAULT_SITE_MENU.categories[0].variant === "priced"
        ? DEFAULT_SITE_MENU.categories[0].items[0].name
        : "";
    expect(hiddenName).toBeTruthy();

    const menu = {
      ...DEFAULT_SITE_MENU,
      categories: DEFAULT_SITE_MENU.categories.map((cat, idx) => {
        if (idx !== 0 || cat.variant !== "priced") return cat;
        return {
          ...cat,
          items: cat.items.map((item, j) =>
            j === 0 ? { ...item, isAvailable: false as const } : item,
          ),
        };
      }),
    };

    render(
      <>
        <SiteHeader variant="inverse" />
        <main id="main-content" className={SITE_HEADER_OVERLAY_MAIN_PAD}>
          <MenuPageBody menu={menu} />
        </main>
      </>,
    );
    expect(screen.queryByText(hiddenName)).not.toBeInTheDocument();
  });

  it("renders breadcrumb json-ld for the menu page", async () => {
    const { container } = render(await MenuPage());
    const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));

    expect(
      scripts.some((script) => {
        const content = script.textContent ?? "";
        return content.includes('"BreadcrumbList"') && content.includes("/menu");
      }),
    ).toBe(true);
    expect(
      scripts.some((script) => {
        const content = script.textContent ?? "";
        return content.includes('"Menu"') && content.includes('"Offer"');
      }),
    ).toBe(true);
  });
});

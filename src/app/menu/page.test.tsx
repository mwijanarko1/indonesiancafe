import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MenuPageBody } from "@/components/cafe/MenuPageBody";
import { SiteHeader } from "@/components/cafe/SiteHeader";
import { DEFAULT_SITE_MENU } from "@/lib/cafe-menu";
import { metadata } from "./page";

function MenuPageTestShell() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
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
      "/indo-cafe-menu.jpg",
    );
    expect(screen.getByRole("link", { name: /drinks menu \(PDF \/ image\)/i })).toHaveAttribute(
      "href",
      "/indo-cafe-drinks-menu.jpg",
    );
  });

  it("renders home link in header and primary nav", () => {
    render(<MenuPageTestShell />);
    const homeLinks = screen.getAllByRole("link", { name: /^Home$/i });
    expect(homeLinks.some((el) => el.getAttribute("href") === "/")).toBe(true);
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
        <SiteHeader />
        <main id="main-content">
          <MenuPageBody menu={menu} />
        </main>
      </>,
    );
    expect(screen.queryByText(hiddenName)).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MenuPageBody } from "@/components/cafe/MenuPageBody";
import { MenuPageHeader } from "@/components/cafe/MenuPageHeader";
import { DEFAULT_SITE_MENU } from "@/lib/cafe-menu";
import { useSiteMenu } from "@/components/cafe/useSiteMenu";
import { metadata } from "./page";

vi.mock("@/components/cafe/useSiteMenu", () => ({
  useSiteMenu: vi.fn(),
}));

const mockedUseSiteMenu = vi.mocked(useSiteMenu);

function MenuPageTestShell() {
  return (
    <>
      <MenuPageHeader />
      <main id="main-content">
        <MenuPageBody />
      </main>
    </>
  );
}

describe("/menu page", () => {
  beforeEach(() => {
    mockedUseSiteMenu.mockReturnValue({
      menu: DEFAULT_SITE_MENU,
      contentLoading: false,
    });
  });

  it("exports menu metadata with canonical /menu", () => {
    expect(metadata.title).toBe("Menu");
    expect(metadata.alternates?.canonical).toBe("/menu");
    expect(String(metadata.description ?? "")).toMatch(/Sheffield/i);
  });

  it("renders the page heading and at least one category tab", () => {
    render(<MenuPageTestShell />);
    expect(screen.getByRole("heading", { name: /our menu/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /^Breakfast$/i })).toBeInTheDocument();
  });

  it("shows fallback food and drinks scan links", () => {
    render(<MenuPageTestShell />);
    expect(screen.getByRole("link", { name: /food menu \(image\)/i })).toHaveAttribute(
      "href",
      "/indo-cafe-menu.jpg",
    );
    expect(screen.getByRole("link", { name: /drinks menu \(image\)/i })).toHaveAttribute(
      "href",
      "/indo-cafe-drinks-menu.jpg",
    );
  });

  it("renders back to home and directions", () => {
    render(<MenuPageTestShell />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /^Directions$/i })).toHaveAttribute("href", expect.stringContaining("http"));
  });

  it("does not list items marked unavailable", () => {
    const hiddenName = DEFAULT_SITE_MENU.categories[0].variant === "priced" ? DEFAULT_SITE_MENU.categories[0].items[0].name : "";
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

    mockedUseSiteMenu.mockReturnValue({ menu, contentLoading: false });
    render(<MenuPageTestShell />);
    expect(screen.queryByRole("heading", { name: hiddenName })).not.toBeInTheDocument();
  });
});

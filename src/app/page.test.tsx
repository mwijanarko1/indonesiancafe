import { render, screen } from "@testing-library/react";
import { DEFAULT_SITE_MENU } from "@/lib/cafe-menu";
import Home from "./page";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/components/cafe/useSiteMenu", () => ({
  useSiteMenu: () => ({
    menu: DEFAULT_SITE_MENU,
    contentLoading: false,
  }),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    fill: _fill,
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element -- test double for next/image
    <img alt={alt ?? ""} {...props} />
  ),
}));

describe("Home (Indonesian Cafe)", () => {
  it("renders the hero heading", () => {
    render(<Home />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/Authentic Indonesian Taste/i);
  });

  it("renders menu and visit sections", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /Indonesian favourites/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Home in Crookes/i })).toBeInTheDocument();
  });

  it("primary nav Menu link targets /menu", () => {
    render(<Home />);
    const menuLinks = screen.getAllByRole("link", { name: /^Menu$/i });
    expect(menuLinks.length).toBeGreaterThan(0);
    for (const link of menuLinks) {
      expect(link).toHaveAttribute("href", "/menu");
    }
  });

  it("homepage menu section links to full menu page", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /view full menu/i })).toHaveAttribute("href", "/menu");
  });

  it("shows the Sheffield address", () => {
    render(<Home />);
    expect(screen.getAllByText(/15 Crookes/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/S10 1UA/i).length).toBeGreaterThan(0);
  });
});

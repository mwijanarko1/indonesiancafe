import { render, screen } from "@testing-library/react";
import { DEFAULT_SITE_MENU } from "@/lib/cafe-menu";
import Home from "./page";
import { vi } from "vitest";

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
  it("renders the restaurant name as the main heading", () => {
    render(<Home />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/Indonesian/i);
    expect(h1).toHaveTextContent(/CAFE/i);
  });

  it("renders menu and visit sections", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /Indonesian Cafe menu/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Visit us/i })).toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: /open full menu page/i })).toHaveAttribute("href", "/menu");
  });

  it("shows the Sheffield address", () => {
    render(<Home />);
    expect(screen.getByText("15, Crookes")).toBeInTheDocument();
    expect(screen.getAllByText(/S10 1UA/i).length).toBeGreaterThan(0);
  });
});

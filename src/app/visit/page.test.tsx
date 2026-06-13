import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import VisitPage, { metadata } from "./page";
import { openingHoursContentMock } from "@/test/opening-hours-mock";

vi.mock("@/lib/server/site-content", () => ({
  getSiteOpeningHours: vi.fn(async () => openingHoursContentMock),
}));

describe("/visit page", () => {
  it("exports visit metadata with canonical /visit", () => {
    expect(metadata.title).toBe("Visit");
    expect(metadata.alternates?.canonical).toBe("/visit");
  });

  it("renders location, hours, maps, and cross-links", async () => {
    render(await VisitPage());

    expect(screen.getByRole("heading", { level: 1, name: /Visit Indonesian Cafe/i })).toBeInTheDocument();
    expect(screen.getAllByText(/15 Crookes/i).length).toBeGreaterThan(0);
    expect(
      screen
        .getAllByRole("link", { name: /07491 287515/i })
        .some((link) => link.getAttribute("href") === "tel:+447491287515"),
    ).toBe(true);
    expect(screen.getByRole("link", { name: /Open Google Maps/i })).toHaveAttribute("href", expect.stringContaining("maps"));
    expect(screen.getByRole("link", { name: /Browse the menu/i })).toHaveAttribute("href", "/menu");
    expect(screen.getByRole("link", { name: /Read guest reviews/i })).toHaveAttribute("href", "/reviews");
  });
});

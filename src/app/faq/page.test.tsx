import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import FaqPage, { metadata } from "./page";
import { openingHoursContentMock } from "@/test/opening-hours-mock";

vi.mock("@/lib/server/site-content", () => ({
  getSiteOpeningHours: vi.fn(async () => openingHoursContentMock),
}));

describe("/faq page", () => {
  it("exports faq metadata with canonical /faq", () => {
    expect(metadata.title).toBe("FAQ");
    expect(metadata.alternates?.canonical).toBe("/faq");
  });

  it("renders the verified customer questions", async () => {
    const { container } = render(await FaqPage());

    expect(screen.getByRole("heading", { level: 1, name: /FAQ/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Is the food halal/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Do you offer takeaway/i })).toBeInTheDocument();
    expect(screen.getByText(/Just walk in while we're open/i)).toBeInTheDocument();

    const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));
    expect(scripts.some((script) => (script.textContent ?? "").includes('"FAQPage"'))).toBe(true);
  });
});

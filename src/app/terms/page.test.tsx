import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import TermsPage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/terms",
}));

describe("/terms page", () => {
  it("exports canonical metadata", () => {
    expect(metadata.title).toBe("Terms of use");
    expect(metadata.alternates?.canonical).toBe("/terms");
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });

  it("renders terms heading and related legal link", () => {
    render(<TermsPage />);

    expect(screen.getByRole("heading", { name: "Terms of use", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy notice" })).toHaveAttribute("href", "/privacy");
  });
});

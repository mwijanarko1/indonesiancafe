import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import PrivacyPage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/privacy",
}));

describe("/privacy page", () => {
  it("exports canonical metadata", () => {
    expect(metadata.title).toBe("Privacy");
    expect(metadata.alternates?.canonical).toBe("/privacy");
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });

  it("renders privacy heading and related legal link", async () => {
    const { container } = render(await PrivacyPage());

    expect(screen.getByRole("heading", { name: "Privacy notice", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms of use" })).toHaveAttribute("href", "/terms");
    expect(container.innerHTML).toContain('"BreadcrumbList"');
    expect(container.innerHTML).toContain("/privacy");
  });
});

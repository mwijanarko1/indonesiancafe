import { render, screen } from "@testing-library/react";
import Home from "./page";

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
    expect(screen.getByRole("heading", { name: /^Menu$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Visit us/i })).toBeInTheDocument();
  });

  it("shows the Sheffield address", () => {
    render(<Home />);
    expect(screen.getByText("15, Crookes")).toBeInTheDocument();
    expect(screen.getAllByText(/S10 1UA/i).length).toBeGreaterThan(0);
  });
});

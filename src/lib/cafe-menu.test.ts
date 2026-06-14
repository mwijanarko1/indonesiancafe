import { describe, expect, it } from "vitest";
import { parsePrice, parseDrinkPrice } from "./cafe-menu";

describe("parsePrice", () => {
  it("parses standard GBP prices", () => {
    expect(parsePrice("£12.80")).toBe(12.8);
    expect(parsePrice("£2.50")).toBe(2.5);
    expect(parsePrice("£5.00")).toBe(5);
  });

  it("parses prices with commas", () => {
    expect(parsePrice("£5,000")).toBe(5000);
    expect(parsePrice("£1,234.56")).toBe(1234.56);
  });

  it("handles empty string and null", () => {
    expect(parsePrice("")).toBe(0);
    expect(parsePrice(null)).toBe(0);
    expect(parsePrice(undefined)).toBe(0);
  });

  it("returns 0 for unparseable strings", () => {
    expect(parsePrice("Free")).toBe(0);
    expect(parsePrice("POA")).toBe(0);
    expect(parsePrice("TBC")).toBe(0);
  });

  it("handles dollar prices", () => {
    expect(parsePrice("$12.80")).toBe(12.8);
    expect(parsePrice("$5.00")).toBe(5);
  });

  it("strips whitespace", () => {
    expect(parsePrice("  £12.80  ")).toBe(12.8);
  });

  it("handles prices with trailing zeros", () => {
    expect(parsePrice("£10.00")).toBe(10);
    expect(parsePrice("£3.50")).toBe(3.5);
  });
});

describe("parseDrinkPrice", () => {
  it("returns hot price when available", () => {
    expect(parseDrinkPrice("£3.00", "£3.50")).toBe(3);
  });

  it("falls back to iced when hot is null", () => {
    expect(parseDrinkPrice(null, "£3.50")).toBe(3.5);
  });

  it("returns 0 when both are null", () => {
    expect(parseDrinkPrice(null, null)).toBe(0);
  });

  it("returns 0 when both are unparseable", () => {
    expect(parseDrinkPrice("Free", null)).toBe(0);
  });

  it("handles undefined gracefully", () => {
    expect(parseDrinkPrice(undefined, "£3.00")).toBe(3);
    expect(parseDrinkPrice(undefined, undefined)).toBe(0);
  });

  it("prefers hot over iced", () => {
    expect(parseDrinkPrice("£2.50", "£4.00")).toBe(2.5);
  });
});

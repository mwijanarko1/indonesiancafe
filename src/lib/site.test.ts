import { afterEach, describe, expect, it } from "vitest";
import {
  buildRestaurantJsonLd,
  getCanonicalSiteUrl,
  getRequiredCanonicalSiteUrl,
} from "./site";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("site URL helpers", () => {
  it("falls back to localhost in development", () => {
    process.env.NODE_ENV = "development";
    delete process.env.NEXT_PUBLIC_APP_URL;

    expect(getCanonicalSiteUrl()).toBe("http://localhost:3000");
    expect(getRequiredCanonicalSiteUrl()).toBe("http://localhost:3000");
  });

  it("throws in production when NEXT_PUBLIC_APP_URL is missing", () => {
    process.env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.VERCEL_URL;
    delete process.env.NEXT_PHASE;

    expect(() => getRequiredCanonicalSiteUrl()).toThrow(
      "NEXT_PUBLIC_APP_URL must be set for production metadata generation.",
    );
  });

  it("uses VERCEL_URL in production when NEXT_PUBLIC_APP_URL is unset", () => {
    process.env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_APP_URL;
    process.env.VERCEL_URL = "indonesiancafe.vercel.app";
    delete process.env.NEXT_PHASE;

    expect(getRequiredCanonicalSiteUrl()).toBe("https://indonesiancafe.vercel.app");
  });

  it("falls back to localhost during next production build when no URL env", () => {
    process.env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.VERCEL_URL;
    process.env.NEXT_PHASE = "phase-production-build";

    expect(getRequiredCanonicalSiteUrl()).toBe("http://localhost:3000");
  });

  it("normalizes a configured canonical URL", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_APP_URL = "https://indonesiancafe.example.com/";

    expect(getCanonicalSiteUrl()).toBe("https://indonesiancafe.example.com");
    expect(getRequiredCanonicalSiteUrl()).toBe("https://indonesiancafe.example.com");
  });

  it("normalizes legacy apex host to www host", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_APP_URL = "https://indonesiancafe.co.uk/";

    expect(getCanonicalSiteUrl()).toBe("https://www.indonesiancafe.co.uk");
    expect(getRequiredCanonicalSiteUrl()).toBe("https://www.indonesiancafe.co.uk");
  });
});

describe("restaurant json-ld", () => {
  it("includes local SEO fields and canonical urls", () => {
    const graph = buildRestaurantJsonLd("https://www.indonesiancafe.co.uk");
    expect(graph["@context"]).toBe("https://schema.org");
    expect(Array.isArray(graph["@graph"])).toBe(true);

    const restaurant = graph["@graph"].find(
      (node): node is Record<string, unknown> =>
        typeof node === "object" && node !== null && node["@type"] === "Restaurant",
    );

    expect(restaurant).toBeTruthy();
    expect(restaurant?.url).toBe("https://www.indonesiancafe.co.uk/");
    expect(restaurant?.telephone).toBe("+447491287515");
    expect(restaurant?.menu).toBe("https://www.indonesiancafe.co.uk/menu");
    expect(restaurant?.geo).toMatchObject({
      "@type": "GeoCoordinates",
      latitude: 53.3811,
      longitude: -1.4701,
    });
    expect(restaurant?.servesCuisine).toEqual([
      "Indonesian",
      "Southeast Asian",
      "Halal",
      "Asian",
    ]);
  });
});

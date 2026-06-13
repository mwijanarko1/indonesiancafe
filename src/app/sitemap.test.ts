import { afterEach, describe, expect, it } from "vitest";
import sitemap from "./sitemap";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("/sitemap.xml metadata", () => {
  it("includes the main public HTML routes only", () => {
    process.env.NODE_ENV = "test";
    process.env.NEXT_PUBLIC_APP_URL = "https://www.indonesiancafe.co.uk";

    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual([
      "https://www.indonesiancafe.co.uk/",
      "https://www.indonesiancafe.co.uk/menu",
      "https://www.indonesiancafe.co.uk/reviews",
      "https://www.indonesiancafe.co.uk/visit",
      "https://www.indonesiancafe.co.uk/faq",
      "https://www.indonesiancafe.co.uk/privacy",
      "https://www.indonesiancafe.co.uk/terms",
    ]);
    expect(urls).not.toContain("https://www.indonesiancafe.co.uk/llms.txt");
    expect(urls).not.toContain("https://www.indonesiancafe.co.uk/llms-full.txt");
    expect(urls.some((url) => url.endsWith(".md"))).toBe(false);
  });
});

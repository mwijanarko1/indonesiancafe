import { afterEach, describe, expect, it } from "vitest";
import robots from "./robots";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("/robots.txt metadata", () => {
  it("allowlists major AI and search bots while blocking others", () => {
    process.env.NODE_ENV = "test";
    process.env.NEXT_PUBLIC_APP_URL = "https://www.indonesiancafe.co.uk";

    const config = robots();
    expect(config.sitemap).toBe("https://www.indonesiancafe.co.uk/sitemap.xml");
    expect(config.rules).toEqual([
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "*", disallow: "/" },
    ]);
  });
});

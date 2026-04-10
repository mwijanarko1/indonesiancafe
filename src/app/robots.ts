import type { MetadataRoute } from "next";
import { getRequiredCanonicalSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getRequiredCanonicalSiteUrl();

  return {
    rules: [
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "*", disallow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

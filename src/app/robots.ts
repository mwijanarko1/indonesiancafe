import type { MetadataRoute } from "next";
import { getRequiredCanonicalSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getRequiredCanonicalSiteUrl();

  return {
    rules: [
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

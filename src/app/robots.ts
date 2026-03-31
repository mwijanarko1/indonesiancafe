import type { MetadataRoute } from "next";
import { getRequiredCanonicalSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getRequiredCanonicalSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

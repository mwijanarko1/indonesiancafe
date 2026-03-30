import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

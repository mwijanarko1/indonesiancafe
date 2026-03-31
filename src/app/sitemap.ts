import type { MetadataRoute } from "next";
import { getRequiredCanonicalSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getRequiredCanonicalSiteUrl();
  const lastModified = new Date();

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/menu`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/reviews`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}

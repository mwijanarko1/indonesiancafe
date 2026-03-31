import { getEnv } from "./env";

const LOCAL_CANONICAL_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

/**
 * Local-safe site URL helper for non-critical contexts. Production metadata should
 * use `getRequiredCanonicalSiteUrl()` instead.
 */
export function getCanonicalSiteUrl(): string {
  const { NEXT_PUBLIC_APP_URL } = getEnv();
  return NEXT_PUBLIC_APP_URL
    ? normalizeSiteUrl(NEXT_PUBLIC_APP_URL)
    : LOCAL_CANONICAL_SITE_URL;
}

/**
 * Canonical public site URL for metadata, sitemap, and structured data.
 * Prefer `NEXT_PUBLIC_APP_URL`. On Vercel, `VERCEL_URL` is set during build.
 * During `next build` without either, falls back to localhost so local builds succeed.
 */
export function getRequiredCanonicalSiteUrl(): string {
  const { NODE_ENV, NEXT_PUBLIC_APP_URL } = getEnv();
  if (NEXT_PUBLIC_APP_URL) {
    return normalizeSiteUrl(NEXT_PUBLIC_APP_URL);
  }
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return normalizeSiteUrl(`https://${vercelUrl}`);
  }
  if (NODE_ENV === "development" || NODE_ENV === "test") {
    return LOCAL_CANONICAL_SITE_URL;
  }
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return LOCAL_CANONICAL_SITE_URL;
  }
  throw new Error("NEXT_PUBLIC_APP_URL must be set for production metadata generation.");
}

export const SITE = {
  name: "Indonesian Cafe",
  tagline: "Indonesian restaurant in Crookes, Sheffield, UK",
  streetAddress: "15 Crookes",
  addressLocality: "Sheffield",
  postalCode: "S10 1UA",
  addressRegion: "South Yorkshire",
  addressCountry: "GB",
  mapsUrl: "https://maps.app.goo.gl/p6cuBbE77hqYN3j68",
  /** Embed URL for homepage (no Maps API key; matches Share → Embed query style). */
  mapsEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(
    "Indonesian Cafe, 15 Crookes, Sheffield S10 1UA, United Kingdom",
  )}&hl=en&z=17&output=embed`,
} as const;

/** Weekly hours shown on the site (matches Google listing; holidays may differ). */
export const OPENING_HOURS: readonly { day: string; time: string }[] = [
  { day: "Monday", time: "11 am–7 pm" },
  { day: "Tuesday", time: "Closed" },
  { day: "Wednesday", time: "11 am–7 pm" },
  { day: "Thursday", time: "11 am–7 pm" },
  { day: "Friday", time: "11 am–7:30 pm" },
  { day: "Saturday", time: "11 am–7 pm" },
  { day: "Sunday", time: "11 am–7:30 pm" },
] as const;

export const OPENING_HOURS_FOOTNOTE =
  "Bank holiday hours may differ — check Google Maps before you travel.";

export function buildRestaurantJsonLd(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, "");
  const restaurantId = `${base}/#restaurant`;
  const websiteId = `${base}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": restaurantId,
        name: SITE.name,
        description:
          "Authentic Indonesian restaurant and cafe in Crookes, Sheffield, UK. Home-style Indonesian cooking, rice and noodle dishes, satay, and cafe favourites.",
        image: [`${base}/poster.png`, `${base}/logo.png`],
        url: `${base}/`,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.streetAddress,
          addressLocality: SITE.addressLocality,
          postalCode: SITE.postalCode,
          addressRegion: SITE.addressRegion,
          addressCountry: SITE.addressCountry,
        },
        servesCuisine: ["Indonesian", "Asian"],
        priceRange: "$$",
        sameAs: [SITE.mapsUrl],
        hasMap: SITE.mapsUrl,
        areaServed: [
          { "@type": "City", name: "Sheffield" },
          { "@type": "AdministrativeArea", name: "South Yorkshire" },
          { "@type": "Country", name: "United Kingdom" },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Wednesday", "Thursday", "Saturday"],
            opens: "11:00",
            closes: "19:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Friday", "Sunday"],
            opens: "11:00",
            closes: "19:30",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${base}/`,
        name: SITE.name,
        inLanguage: "en-GB",
        publisher: { "@id": restaurantId },
      },
    ],
  };
}

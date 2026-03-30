/**
 * Canonical public site URL for metadata, sitemap, and structured data.
 * On Vercel, `VERCEL_URL` is used when unset. Set `NEXT_PUBLIC_APP_URL` for a
 * stable canonical (e.g. https://indonesiancafe.vercel.app or a custom domain).
 */
export function getCanonicalSiteUrl(requestOrigin?: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  if (requestOrigin) return requestOrigin.replace(/\/$/, "");

  return "http://localhost:3000";
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

import { getEnv } from "./env";
import type { SiteMenuContent } from "./cafe-menu";
import type { FaqItem } from "./faq";

const LOCAL_CANONICAL_SITE_URL = "http://localhost:3000";
const LEGACY_APEX_SITE_URL = "https://indonesiancafe.co.uk";
const LIVE_CANONICAL_SITE_URL = "https://www.indonesiancafe.co.uk";

export const HERO_IMAGE_PATH = "/images/seo/hero-home-v1.webp";
export const LOGO_IMAGE_PATH = "/images/seo/logo-v1.webp";

function normalizeSiteUrl(url: string): string {
  const normalized = url.trim().replace(/\/$/, "");
  return normalized === LEGACY_APEX_SITE_URL
    ? LIVE_CANONICAL_SITE_URL
    : normalized;
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

/**
 * Primary meta description (Google snippet), Open Graph, Twitter default, and Restaurant JSON-LD.
 * Leans on local + cuisine intent (Sheffield, Crookes S10, halal, takeaway); menu-level terms live in `keywords` and menu copy.
 */
export const SITE_SEO_DESCRIPTION =
  "Indonesian restaurant and cafe in Sheffield, serving authentic halal Indonesian food, takeaway, coffee and bakery. 15 Crookes, Crookes S10 1UA, UK.";

/** Shown on /privacy and /terms (update when legal copy changes). */
export const LEGAL_CONTENT_LAST_UPDATED = "8 April 2026";

export const SITE = {
  name: "Indonesian Cafe",
  tagline:
    "Indonesian restaurant & cafe Sheffield, halal Indonesian food, takeaway, coffee and bakery · 15 Crookes, S10",
  /** Production origin — set `NEXT_PUBLIC_APP_URL` to this on Vercel (metadata, sitemap, JSON-LD). */
  liveUrl: LIVE_CANONICAL_SITE_URL,
  streetAddress: "15 Crookes",
  addressLocality: "Sheffield",
  postalCode: "S10 1UA",
  addressRegion: "South Yorkshire",
  addressCountry: "GB",
  phoneDisplay: "07491 287515",
  phoneE164: "+447491287515",
  geo: {
    latitude: 53.3811,
    longitude: -1.4701,
  },
  menuPath: "/menu",
  mapsUrl: "https://maps.app.goo.gl/p6cuBbE77hqYN3j68",
  instagramUrl: "https://www.instagram.com/indonesiancafe_/",
  facebookUrl: "https://www.facebook.com/profile.php?id=61583156852755",
  /** Embed URL for homepage (no Maps API key; matches Share → Embed query style). */
  mapsEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(
    "Indonesian Cafe, 15 Crookes, Sheffield S10 1UA, United Kingdom",
  )}&hl=en&z=17&output=embed`,
} as const;

/** Weekly hours shown on the site (holidays may differ). */
export type OpeningHoursRow = { day: string; time: string };

export const OPENING_HOURS: readonly OpeningHoursRow[] = [
  { day: "Monday", time: "10 am–8 pm" },
  { day: "Tuesday", time: "Closed" },
  { day: "Wednesday", time: "10 am–8 pm" },
  { day: "Thursday", time: "10 am–8 pm" },
  { day: "Friday", time: "10 am–8 pm" },
  { day: "Saturday", time: "10 am–8 pm" },
  { day: "Sunday", time: "10 am–8 pm" },
] as const;

export const OPENING_HOURS_FOOTNOTE =
  "Bank holiday hours may differ. Check Google Maps before you travel.";

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
        description: SITE_SEO_DESCRIPTION,
        image: [`${base}${HERO_IMAGE_PATH}`, `${base}${LOGO_IMAGE_PATH}`],
        url: `${base}/`,
        telephone: SITE.phoneE164,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.streetAddress,
          addressLocality: SITE.addressLocality,
          postalCode: SITE.postalCode,
          addressRegion: SITE.addressRegion,
          addressCountry: SITE.addressCountry,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE.geo.latitude,
          longitude: SITE.geo.longitude,
        },
        servesCuisine: ["Indonesian", "Southeast Asian", "Halal", "Asian"],
        menu: `${base}${SITE.menuPath}`,
        priceRange: "$$",
        sameAs: [SITE.mapsUrl, SITE.instagramUrl, SITE.facebookUrl],
        hasMap: SITE.mapsUrl,
        areaServed: [
          { "@type": "City", name: "Sheffield" },
          { "@type": "AdministrativeArea", name: "South Yorkshire" },
          { "@type": "Country", name: "United Kingdom" },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "10:00",
            closes: "20:00",
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

export type BreadcrumbItem = {
  name: string;
  path: string;
};

function toAbsoluteSiteUrl(base: string, path: string): string {
  if (path === "/") {
    return `${base}/`;
  }
  return `${base}${path}`;
}

export function buildWebPageJsonLd(
  siteUrl: string,
  options: { path: string; name: string; description: string },
) {
  const base = siteUrl.replace(/\/$/, "");
  const pageUrl = toAbsoluteSiteUrl(base, options.path);

  return {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: options.name,
    description: options.description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: SITE.name,
      url: `${base}/`,
    },
  };
}

export function buildBreadcrumbJsonLd(siteUrl: string, items: readonly BreadcrumbItem[]) {
  const base = siteUrl.replace(/\/$/, "");

  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteSiteUrl(base, item.path),
    })),
  };
}

export function buildFaqPageJsonLd(
  siteUrl: string,
  path: string,
  items: readonly FaqItem[],
) {
  const base = siteUrl.replace(/\/$/, "");
  const pageUrl = toAbsoluteSiteUrl(base, path);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildMenuJsonLd(siteUrl: string, menu: SiteMenuContent) {
  const base = siteUrl.replace(/\/$/, "");
  const pageUrl = `${base}${SITE.menuPath}`;

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${pageUrl}#menu`,
    name: `${SITE.name} menu`,
    url: pageUrl,
    hasMenuSection: menu.categories.map((category) => {
      if (category.variant === "priced") {
        return {
          "@type": "MenuSection",
          name: category.label,
          hasMenuItem: category.items
            .filter((item) => item.isAvailable !== false)
            .map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              description: item.description,
              offers: {
                "@type": "Offer",
                priceCurrency: "GBP",
                price: item.price.replace(/[^0-9.]/g, ""),
                availability: "https://schema.org/InStock",
                url: pageUrl,
              },
            })),
        };
      }

      return {
        "@type": "MenuSection",
        name: category.label,
        hasMenuItem: category.groups.flatMap((group) =>
          group.items
            .filter((item) => item.isAvailable !== false)
            .map((item) => ({
              "@type": "MenuItem",
              name: `${group.title}: ${item.name}`,
              offers: {
                "@type": "Offer",
                priceCurrency: "GBP",
                price: (item.iced ?? item.hot ?? "").replace(/[^0-9.]/g, ""),
                availability: "https://schema.org/InStock",
                url: pageUrl,
              },
            })),
        ),
      };
    }),
  };
}

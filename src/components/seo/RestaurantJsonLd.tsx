import { buildRestaurantJsonLd, getRequiredCanonicalSiteUrl } from "@/lib/site";

/** Inline JSON-LD for Restaurant / WebSite. */
export function RestaurantJsonLd() {
  const siteUrl = getRequiredCanonicalSiteUrl();
  const json = JSON.stringify(buildRestaurantJsonLd(siteUrl));

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

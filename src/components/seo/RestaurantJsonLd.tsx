import { buildRestaurantJsonLd, getCanonicalSiteUrl } from "@/lib/site";

/**
 * Inline JSON-LD for Restaurant / WebSite. Requires `script-src 'unsafe-inline'`
 * in CSP (see next.config) because hash-based CSP cannot cover dynamic URLs in JSON.
 */
export function RestaurantJsonLd() {
  const siteUrl = getCanonicalSiteUrl();
  const json = JSON.stringify(buildRestaurantJsonLd(siteUrl));

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD must be embedded for search engines
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

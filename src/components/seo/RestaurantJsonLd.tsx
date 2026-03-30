import { buildRestaurantJsonLd, getCanonicalSiteUrl } from "@/lib/site";

/**
 * Inline JSON-LD for Restaurant / WebSite. The `nonce` must match per-request CSP
 * from `src/middleware.ts` (`script-src ... 'nonce-…' 'strict-dynamic'`).
 */
export function RestaurantJsonLd({ nonce }: { nonce: string }) {
  const siteUrl = getCanonicalSiteUrl();
  const json = JSON.stringify(buildRestaurantJsonLd(siteUrl));

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      // eslint-disable-next-line react/no-danger -- JSON-LD must be embedded for search engines
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

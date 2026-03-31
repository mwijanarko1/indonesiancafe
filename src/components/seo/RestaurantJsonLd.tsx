import { buildRestaurantJsonLd, getRequiredCanonicalSiteUrl } from "@/lib/site";

/**
 * Inline JSON-LD for Restaurant / WebSite. The `nonce` must match per-request CSP
 * from `src/proxy.ts` (`script-src ... 'nonce-…' 'strict-dynamic'`).
 */
export function RestaurantJsonLd({ nonce }: { nonce: string }) {
  const siteUrl = getRequiredCanonicalSiteUrl();
  const json = JSON.stringify(buildRestaurantJsonLd(siteUrl));

  return (
    <script
      type="application/ld+json"
      nonce={nonce || undefined}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

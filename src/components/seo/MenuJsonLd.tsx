import type { SiteMenuContent } from "@/lib/cafe-menu";
import { buildMenuJsonLd, getRequiredCanonicalSiteUrl } from "@/lib/site";

type MenuJsonLdProps = {
  menu: SiteMenuContent;
};

export function MenuJsonLd({ menu }: MenuJsonLdProps) {
  const siteUrl = getRequiredCanonicalSiteUrl();
  const json = JSON.stringify(buildMenuJsonLd(siteUrl, menu));

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

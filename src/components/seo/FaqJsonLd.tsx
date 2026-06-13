import { buildFaqPageJsonLd, getRequiredCanonicalSiteUrl } from "@/lib/site";
import type { FaqItem } from "@/lib/faq";

type FaqJsonLdProps = {
  path: string;
  items: readonly FaqItem[];
};

export function FaqJsonLd({ path, items }: FaqJsonLdProps) {
  const siteUrl = getRequiredCanonicalSiteUrl();
  const json = JSON.stringify(buildFaqPageJsonLd(siteUrl, path, items));

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

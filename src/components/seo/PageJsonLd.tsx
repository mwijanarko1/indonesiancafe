import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
  getRequiredCanonicalSiteUrl,
} from "@/lib/site";

type PageJsonLdProps = {
  nonce: string;
  path: string;
  name: string;
  description: string;
  breadcrumbLabel: string;
};

export function PageJsonLd({
  nonce,
  path,
  name,
  description,
  breadcrumbLabel,
}: PageJsonLdProps) {
  const siteUrl = getRequiredCanonicalSiteUrl();
  const graph = [
    buildWebPageJsonLd(siteUrl, { path, name, description }),
    buildBreadcrumbJsonLd(siteUrl, [
      { name: "Home", path: "/" },
      { name: breadcrumbLabel, path },
    ]),
  ];
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });

  return (
    <script
      type="application/ld+json"
      nonce={nonce || undefined}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

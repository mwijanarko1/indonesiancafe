import "server-only";

import { formatMenuItemDisplayName, type DrinkMenuItem, type PricedMenuItem } from "@/lib/cafe-menu";
import { FAQ_ITEMS } from "@/lib/faq";
import { getFeaturedGuestReviewsFrom } from "@/lib/guest-reviews";
import type { LegalDocument, LegalInlinePart } from "@/lib/legal-documents";
import { PRIVACY_DOCUMENT, TERMS_DOCUMENT } from "@/lib/legal-documents";
import {
  HOME_HERO_TITLE,
  HOME_SUMMARY,
  REVIEWS_SECTION_BLURB,
  REVIEWS_SECTION_TITLE,
  VISIT_PAGE_DESCRIPTION,
  VISIT_PAGE_TITLE,
  VISIT_SECTION_BLURB,
  VISIT_SECTION_TITLE,
} from "@/lib/site-copy";
import { getRequiredCanonicalSiteUrl, SITE } from "@/lib/site";
import { getSiteMenuContent, getSiteOpeningHours, getSiteReviewsContent } from "@/lib/server/site-content";

export type MachineDocumentId =
  | "home"
  | "menu"
  | "reviews"
  | "visit"
  | "faq"
  | "privacy"
  | "terms";

export type MarkdownRequestMode = "suffix" | "query" | "accept-header" | "llms-index";

export type MachineSurfaceDescriptor = {
  id: MachineDocumentId;
  canonicalPath: string;
  markdownPath: string;
  title: string;
  description: string;
  priority: number;
  includeInLlms: boolean;
  includeInLlmsFull: boolean;
  includeInSitemap: boolean;
  renderStrategy: "curated" | "generated";
};

export type ResolvedMarkdownDocument = {
  body: string;
  descriptor: MachineSurfaceDescriptor;
  source: "curated";
};

const MACHINE_SURFACES: readonly MachineSurfaceDescriptor[] = [
  {
    id: "home",
    canonicalPath: "/",
    markdownPath: "/llms/home.md",
    title: "Home - Indonesian Cafe",
    description: "Restaurant summary, address, opening hours, and key links.",
    priority: 1,
    includeInLlms: true,
    includeInLlmsFull: true,
    includeInSitemap: true,
    renderStrategy: "curated",
  },
  {
    id: "menu",
    canonicalPath: "/menu",
    markdownPath: "/llms/menu.md",
    title: "Menu - Indonesian Cafe",
    description: "Current menu categories, items, prices, and allergen disclaimer.",
    priority: 0.9,
    includeInLlms: true,
    includeInLlmsFull: true,
    includeInSitemap: true,
    renderStrategy: "curated",
  },
  {
    id: "reviews",
    canonicalPath: "/reviews",
    markdownPath: "/llms/reviews.md",
    title: "Reviews - Indonesian Cafe",
    description: "Guest review text and review-related links.",
    priority: 0.7,
    includeInLlms: true,
    includeInLlmsFull: true,
    includeInSitemap: true,
    renderStrategy: "curated",
  },
  {
    id: "visit",
    canonicalPath: "/visit",
    markdownPath: "/llms/visit.md",
    title: "Visit - Indonesian Cafe",
    description: "Address, opening hours, maps, phone, and visitor planning links.",
    priority: 0.8,
    includeInLlms: true,
    includeInLlmsFull: true,
    includeInSitemap: true,
    renderStrategy: "curated",
  },
  {
    id: "faq",
    canonicalPath: "/faq",
    markdownPath: "/llms/faq.md",
    title: "FAQ - Indonesian Cafe",
    description: "Verified questions and answers about halal food, takeaway, hours, and location.",
    priority: 0.8,
    includeInLlms: true,
    includeInLlmsFull: true,
    includeInSitemap: true,
    renderStrategy: "curated",
  },
  {
    id: "privacy",
    canonicalPath: "/privacy",
    markdownPath: "/llms/privacy.md",
    title: "Privacy notice - Indonesian Cafe",
    description: "Website privacy notice.",
    priority: 0.3,
    includeInLlms: true,
    includeInLlmsFull: true,
    includeInSitemap: true,
    renderStrategy: "curated",
  },
  {
    id: "terms",
    canonicalPath: "/terms",
    markdownPath: "/llms/terms.md",
    title: "Terms of use - Indonesian Cafe",
    description: "Website terms of use.",
    priority: 0.3,
    includeInLlms: true,
    includeInLlmsFull: true,
    includeInSitemap: true,
    renderStrategy: "curated",
  },
] as const;

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: SITE.instagramUrl,
  },
  {
    label: "Facebook",
    href: SITE.facebookUrl,
  },
] as const;

function getDescriptor(id: MachineDocumentId): MachineSurfaceDescriptor {
  const descriptor = MACHINE_SURFACES.find((entry) => entry.id === id);
  if (!descriptor) {
    throw new Error(`Missing machine-readable descriptor for id: ${id}`);
  }
  return descriptor;
}

function getDescriptorForPath(pathname: string): MachineSurfaceDescriptor | null {
  const normalized = pathname === "/index" ? "/" : pathname.replace(/\/$/, "") || "/";
  return MACHINE_SURFACES.find((entry) => entry.canonicalPath === normalized) ?? null;
}

function toAbsolute(base: string, path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path === "/") {
    return `${base}/`;
  }
  return `${base}${path}`;
}

function asBulletLink(base: string, label: string, path: string): string {
  return `- [${label}](${toAbsolute(base, path)})`;
}

function renderPricedItem(item: PricedMenuItem): string {
  const line = `- ${formatMenuItemDisplayName(item.name)} - ${item.price}`;
  if (!item.description) {
    return line;
  }
  return `${line} - ${item.description}`;
}

function renderDrinkItem(item: DrinkMenuItem): string {
  const prices = [
    item.hot ? `hot ${item.hot}` : null,
    item.iced ? `iced ${item.iced}` : null,
  ].filter((value): value is string => value !== null);
  return `- ${item.name}: ${prices.join(", ")}`;
}

function renderInlinePart(base: string, part: LegalInlinePart): string {
  if (part.kind === "text") {
    return part.text;
  }
  if (part.kind === "strong") {
    return `**${part.text}**`;
  }
  return `[${part.text}](${toAbsolute(base, part.href)})`;
}

function renderLegalMarkdown(base: string, descriptor: MachineSurfaceDescriptor, document: LegalDocument): string {
  const lines: string[] = [
    `# ${document.title}`,
    "",
    `Canonical page: ${toAbsolute(base, descriptor.canonicalPath)}`,
    "",
    `Last updated: ${document.lastUpdated}.`,
    "",
  ];

  if (document.title === "Privacy notice") {
    lines.push(
      "This notice is provided for visitors to our website. It is not legal advice; ask a qualified adviser if you need certainty for your situation.",
      "",
    );
  } else if (document.title === "Terms of use") {
    lines.push("Please read these terms before using this website.", "");
  }

  for (const section of document.sections) {
    lines.push(`## ${section.heading}`, "");
    for (const block of section.blocks) {
      lines.push(block.parts.map((part) => renderInlinePart(base, part)).join(""), "");
    }
  }

  if (document.relatedLink) {
    lines.push(`[${document.relatedLink.text}](${toAbsolute(base, document.relatedLink.href)})`, "");
  }

  return lines.join("\n").trimEnd();
}

async function getHomeMenuAndReviews() {
  const [{ menu }, { reviews, featuredAuthorOrder }] = await Promise.all([
    getSiteMenuContent(),
    getSiteReviewsContent(),
  ]);

  return {
    menu,
    reviews,
    featuredReviews: getFeaturedGuestReviewsFrom(reviews, featuredAuthorOrder).slice(0, 3),
  };
}

function getMenuHighlights(
  menu: Awaited<ReturnType<typeof getHomeMenuAndReviews>>["menu"],
  limit: number,
): string[] {
  return menu.categories
    .flatMap((category) => {
      if (category.variant !== "priced") return [];
      return category.items.filter((item) => item.isAvailable !== false);
    })
    .slice(0, limit)
    .map((item) => `${formatMenuItemDisplayName(item.name)} (${item.price})`);
}

export function getMachineDocumentDescriptors(): readonly MachineSurfaceDescriptor[] {
  return MACHINE_SURFACES;
}

export async function buildHomeMarkdown(): Promise<string> {
  const base = getRequiredCanonicalSiteUrl();
  const descriptor = getDescriptor("home");
  const { menu, featuredReviews } = await getHomeMenuAndReviews();
  const { hours, footnote } = await getSiteOpeningHours();
  const menuHighlights = getMenuHighlights(menu, 4);

  return [
    `# ${descriptor.title}`,
    "",
    `Canonical page: ${toAbsolute(base, descriptor.canonicalPath)}`,
    "",
    HOME_SUMMARY,
    "",
    `## ${HOME_HERO_TITLE}`,
    "",
    `${VISIT_SECTION_TITLE}: ${VISIT_SECTION_BLURB}`,
    "",
    "## Address",
    "",
    `${SITE.name}`,
    `${SITE.streetAddress}`,
    `${SITE.addressLocality} ${SITE.postalCode}`,
    `${SITE.addressCountry}`,
    "",
    "## Opening hours",
    "",
    ...hours.map((row) => `- ${row.day}: ${row.time}`),
    "",
    footnote,
    "",
    "## Quick links",
    "",
    asBulletLink(base, "Home", "/"),
    asBulletLink(base, "Menu", "/menu"),
    asBulletLink(base, "Visit", "/visit"),
    asBulletLink(base, "Guest reviews", "/reviews"),
    asBulletLink(base, "FAQ", "/faq"),
    asBulletLink(base, "Privacy", "/privacy"),
    asBulletLink(base, "Terms", "/terms"),
    "",
    "## Menu focus",
    "",
    menuHighlights.length > 0
      ? `Current highlighted dishes: ${menuHighlights.join("; ")}.`
      : "Menu highlights are available on the full menu page.",
    "",
    `## ${REVIEWS_SECTION_TITLE}`,
    "",
    REVIEWS_SECTION_BLURB,
    "",
    ...featuredReviews.map((review) => `- ${review.author}: "${review.homeExcerpt ?? review.quote}"`),
    "",
    "## Social links",
    "",
    ...SOCIAL_LINKS.map(({ label, href }) => `- [${label}](${href})`),
    "",
    "Last generated from current site content.",
  ].join("\n");
}

export async function buildMenuMarkdown(): Promise<string> {
  const base = getRequiredCanonicalSiteUrl();
  const descriptor = getDescriptor("menu");
  const { menu } = await getSiteMenuContent();

  const lines: string[] = [
    `# ${descriptor.title}`,
    "",
    `Canonical page: ${toAbsolute(base, descriptor.canonicalPath)}`,
    "",
    menu.disclaimer,
    "",
  ];

  for (const category of menu.categories) {
    lines.push(`## ${category.label}`);
    lines.push("");

    if (category.variant === "priced" && category.subtitle) {
      lines.push(category.subtitle);
      lines.push("");
    }

    if (category.variant === "priced") {
      const items = category.items.filter((item) => item.isAvailable !== false);
      lines.push(...items.map(renderPricedItem));
      lines.push("");
      continue;
    }

    for (const group of category.groups) {
      lines.push(`### ${group.title}`);
      lines.push("");
      const items = group.items.filter((item) => item.isAvailable !== false);
      lines.push(...items.map(renderDrinkItem));
      lines.push("");
    }
  }

  lines.push(
    "## Helpful links",
    "",
    asBulletLink(base, "Visit", "/visit"),
    asBulletLink(base, "FAQ", "/faq"),
    "",
    menu.footerTagline,
    "",
    "Last generated from current site content.",
  );

  return lines.join("\n").trimEnd();
}

export async function buildReviewsMarkdown(): Promise<string> {
  const base = getRequiredCanonicalSiteUrl();
  const descriptor = getDescriptor("reviews");
  const { reviews, featuredAuthorOrder } = await getSiteReviewsContent();
  const featured = getFeaturedGuestReviewsFrom(reviews, featuredAuthorOrder);

  return [
    `# ${descriptor.title}`,
    "",
    `Canonical page: ${toAbsolute(base, descriptor.canonicalPath)}`,
    "",
    "Guest reviews shared by customers of Indonesian Cafe.",
    "",
    "## Featured authors",
    "",
    ...featured.map((review) => `- ${review.author}`),
    "",
    "## All reviews",
    "",
    ...reviews.flatMap((review) => [`### ${review.author}`, "", review.quote, ""]),
    "## Review links",
    "",
    `- [Google Maps](${SITE.mapsUrl})`,
    asBulletLink(base, "Guest reviews page", "/reviews"),
    asBulletLink(base, "Visit", "/visit"),
    asBulletLink(base, "Menu", "/menu"),
    "",
    "Last generated from current site content.",
  ].join("\n").trimEnd();
}

export async function buildVisitMarkdown(): Promise<string> {
  const base = getRequiredCanonicalSiteUrl();
  const descriptor = getDescriptor("visit");
  const { hours, footnote } = await getSiteOpeningHours();

  return [
    `# ${descriptor.title}`,
    "",
    `Canonical page: ${toAbsolute(base, descriptor.canonicalPath)}`,
    "",
    VISIT_PAGE_DESCRIPTION,
    "",
    `## ${VISIT_SECTION_TITLE}`,
    "",
    VISIT_SECTION_BLURB,
    "",
    "## Address",
    "",
    `${SITE.name}`,
    `${SITE.streetAddress}`,
    `${SITE.addressLocality} ${SITE.postalCode}`,
    `${SITE.addressCountry}`,
    "",
    "## Opening hours",
    "",
    ...hours.map((row) => `- ${row.day}: ${row.time}`),
    `- note: ${footnote}`,
    "",
    "## Contact and travel",
    "",
    `- phone: ${SITE.phoneDisplay}`,
    `- [Open Google Maps](${SITE.mapsUrl})`,
    "",
    "## Service",
    "",
    "- dine-in available",
    "- takeaway available",
    "- coffee and bakery available",
    "",
    "## Helpful links",
    "",
    asBulletLink(base, "Menu", "/menu"),
    asBulletLink(base, "Guest reviews", "/reviews"),
    asBulletLink(base, "FAQ", "/faq"),
    "",
    "Last generated from current site content.",
  ].join("\n");
}

export async function buildFaqMarkdown(): Promise<string> {
  const base = getRequiredCanonicalSiteUrl();
  const descriptor = getDescriptor("faq");

  return [
    `# ${descriptor.title}`,
    "",
    `Canonical page: ${toAbsolute(base, descriptor.canonicalPath)}`,
    "",
    "Verified answers based on the public Indonesian Cafe website.",
    "",
    ...FAQ_ITEMS.flatMap((item) => [`## ${item.question}`, "", item.answer, ""]),
    "## Helpful links",
    "",
    asBulletLink(base, "Visit", "/visit"),
    asBulletLink(base, "Menu", "/menu"),
    asBulletLink(base, "Guest reviews", "/reviews"),
  ].join("\n").trimEnd();
}

export function buildPrivacyMarkdown(): string {
  const base = getRequiredCanonicalSiteUrl();
  return renderLegalMarkdown(base, getDescriptor("privacy"), PRIVACY_DOCUMENT);
}

export function buildTermsMarkdown(): string {
  const base = getRequiredCanonicalSiteUrl();
  return renderLegalMarkdown(base, getDescriptor("terms"), TERMS_DOCUMENT);
}

function buildPreferredUrlLines(base: string, descriptors: readonly MachineSurfaceDescriptor[]): string {
  return descriptors
    .map(
      (descriptor) =>
        `- ${descriptor.id}: canonical ${toAbsolute(base, descriptor.canonicalPath)} | markdown ${toAbsolute(base, descriptor.markdownPath)}`,
    )
    .join("\n");
}

function buildPageLines(base: string, descriptors: readonly MachineSurfaceDescriptor[]): string {
  return descriptors
    .map((descriptor) => `- ${toAbsolute(base, descriptor.markdownPath)} - ${descriptor.description}`)
    .join("\n");
}

async function buildLlmsIndexBody(descriptors: readonly MachineSurfaceDescriptor[]): Promise<string> {
  const base = getRequiredCanonicalSiteUrl();
  const { menu, featuredReviews } = await getHomeMenuAndReviews();
  const { hours, footnote } = await getSiteOpeningHours();
  const menuHighlights = getMenuHighlights(menu, 6);

  return [
    "site: Indonesian Cafe",
    `url: ${toAbsolute(base, "/")}`,
    `summary: ${HOME_SUMMARY}`,
    "",
    "Restaurant description",
    `${SITE.name} is an Indonesian restaurant and cafe in Sheffield serving halal Indonesian home cooking, takeaway, coffee, and bakery favourites.`,
    `Primary positioning: ${HOME_HERO_TITLE}.`,
    `${VISIT_SECTION_TITLE}: ${VISIT_SECTION_BLURB}`,
    "",
    "Contact",
    `- address: ${SITE.streetAddress}, ${SITE.addressLocality} ${SITE.postalCode}, ${SITE.addressCountry}`,
    `- phone: ${SITE.phoneDisplay}`,
    `- maps: ${SITE.mapsUrl}`,
    "",
    "Opening hours",
    ...hours.map((row) => `- ${row.day}: ${row.time}`),
    `- note: ${footnote}`,
    "",
    "Cuisine and service",
    "- cuisine: Indonesian, Southeast Asian, halal, Asian",
    "- service: dine-in, takeaway, coffee, bakery",
    "",
    "Menu highlights",
    ...(menuHighlights.length > 0
      ? menuHighlights.map((item) => `- ${item}`)
      : ["- Menu highlights are available on the full menu page."]),
    "",
    "Guest reviews",
    REVIEWS_SECTION_BLURB,
    ...featuredReviews.map((review) => `- ${review.author}: "${review.homeExcerpt ?? review.quote}"`),
    "",
    "Social links",
    ...SOCIAL_LINKS.map(({ label, href }) => `- ${label}: ${href}`),
    "",
    "Canonical HTML pages are authoritative for ranking, presentation, and user experience.",
    "",
    "Preferred URLs",
    buildPreferredUrlLines(base, descriptors),
    "",
    "Policies",
    "- No crawler-specific content substitution.",
    "- Markdown companion pages are simplified renderings of public site content.",
    "",
    "Pages",
    buildPageLines(base, descriptors),
  ].join("\n");
}

export async function buildLlmsTxt(): Promise<string> {
  return buildLlmsIndexBody(MACHINE_SURFACES.filter((descriptor) => descriptor.includeInLlms));
}

export async function buildLlmsFullTxt(): Promise<string> {
  return buildLlmsIndexBody(MACHINE_SURFACES.filter((descriptor) => descriptor.includeInLlmsFull));
}

export async function resolveMarkdownForPath(path: readonly string[]): Promise<ResolvedMarkdownDocument | null> {
  const pathname = (() => {
    if (path.length === 0) return "/";
    if (path.length === 1 && path[0] === "index") return "/";
    return `/${path.join("/")}`;
  })();

  const descriptor = getDescriptorForPath(pathname);
  if (!descriptor || descriptor.renderStrategy !== "curated") {
    return null;
  }

  switch (descriptor.id) {
    case "home":
      return { body: await buildHomeMarkdown(), descriptor, source: "curated" };
    case "menu":
      return { body: await buildMenuMarkdown(), descriptor, source: "curated" };
    case "reviews":
      return { body: await buildReviewsMarkdown(), descriptor, source: "curated" };
    case "visit":
      return { body: await buildVisitMarkdown(), descriptor, source: "curated" };
    case "faq":
      return { body: await buildFaqMarkdown(), descriptor, source: "curated" };
    case "privacy":
      return { body: buildPrivacyMarkdown(), descriptor, source: "curated" };
    case "terms":
      return { body: buildTermsMarkdown(), descriptor, source: "curated" };
  }
}

import "server-only";

import { formatMenuItemDisplayName, type DrinkMenuItem, type PricedMenuItem } from "@/lib/cafe-menu";
import { getFeaturedGuestReviewsFrom } from "@/lib/guest-reviews";
import type { LegalDocument, LegalInlinePart } from "@/lib/legal-documents";
import { PRIVACY_DOCUMENT, TERMS_DOCUMENT } from "@/lib/legal-documents";
import {
  HOME_HERO_TITLE,
  HOME_SUMMARY,
  REVIEWS_SECTION_BLURB,
  REVIEWS_SECTION_TITLE,
  VISIT_SECTION_BLURB,
  VISIT_SECTION_TITLE,
} from "@/lib/site-copy";
import { getRequiredCanonicalSiteUrl, OPENING_HOURS, OPENING_HOURS_FOOTNOTE, SITE } from "@/lib/site";
import { getSiteMenuContent, getSiteReviewsContent } from "@/lib/server/site-content";

export type MachineDocumentId = "home" | "menu" | "reviews" | "privacy" | "terms";

export type MachineDocumentDescriptor = {
  id: MachineDocumentId;
  path: string;
  canonicalPath: string;
  title: string;
  description: string;
};

const MACHINE_DOCUMENTS: readonly MachineDocumentDescriptor[] = [
  {
    id: "home",
    path: "/llms/home.md",
    canonicalPath: "/",
    title: "Home - Indonesian Cafe",
    description: "Restaurant summary, address, opening hours, and key links.",
  },
  {
    id: "menu",
    path: "/llms/menu.md",
    canonicalPath: "/menu",
    title: "Menu - Indonesian Cafe",
    description: "Current menu categories, items, prices, and allergen disclaimer.",
  },
  {
    id: "reviews",
    path: "/llms/reviews.md",
    canonicalPath: "/reviews",
    title: "Reviews - Indonesian Cafe",
    description: "Guest review text and review-related links.",
  },
  {
    id: "privacy",
    path: "/llms/privacy.md",
    canonicalPath: "/privacy",
    title: "Privacy notice - Indonesian Cafe",
    description: "Website privacy notice.",
  },
  {
    id: "terms",
    path: "/llms/terms.md",
    canonicalPath: "/terms",
    title: "Terms of use - Indonesian Cafe",
    description: "Website terms of use.",
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

function getDescriptor(id: MachineDocumentId): MachineDocumentDescriptor {
  const descriptor = MACHINE_DOCUMENTS.find((entry) => entry.id === id);
  if (!descriptor) {
    throw new Error(`Missing machine-readable descriptor for id: ${id}`);
  }
  return descriptor;
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

function renderLegalMarkdown(base: string, descriptor: MachineDocumentDescriptor, document: LegalDocument): string {
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

export function getMachineDocumentDescriptors(): readonly MachineDocumentDescriptor[] {
  return MACHINE_DOCUMENTS;
}

export async function buildHomeMarkdown(): Promise<string> {
  const base = getRequiredCanonicalSiteUrl();
  const descriptor = getDescriptor("home");
  const [{ menu }, { reviews, featuredAuthorOrder }] = await Promise.all([
    getSiteMenuContent(),
    getSiteReviewsContent(),
  ]);
  const featuredReviews = getFeaturedGuestReviewsFrom(reviews, featuredAuthorOrder).slice(0, 3);

  const menuHighlights = menu.categories
    .flatMap((category) => {
      if (category.variant !== "priced") return [];
      return category.items.filter((item) => item.isAvailable !== false);
    })
    .slice(0, 4)
    .map((item) => `${formatMenuItemDisplayName(item.name)} (${item.price})`);

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
    ...OPENING_HOURS.map((row) => `- ${row.day}: ${row.time}`),
    "",
    OPENING_HOURS_FOOTNOTE,
    "",
    "## Quick links",
    "",
    asBulletLink(base, "Home", "/"),
    asBulletLink(base, "Menu", "/menu"),
    asBulletLink(base, "Guest reviews", "/reviews"),
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

  lines.push(menu.footerTagline, "", "Last generated from current site content.");

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
    "",
    "Last generated from current site content.",
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

export function buildLlmsTxt(): string {
  const base = getRequiredCanonicalSiteUrl();
  const descriptors = getMachineDocumentDescriptors();

  const preferredLinks = descriptors
    .map(
      (descriptor) =>
        `- ${descriptor.id}: canonical ${toAbsolute(base, descriptor.canonicalPath)} | markdown ${toAbsolute(base, descriptor.path)}`,
    )
    .join("\n");

  const pageLines = descriptors
    .map((descriptor) => `- ${toAbsolute(base, descriptor.path)} - ${descriptor.description}`)
    .join("\n");

  return [
    "site: Indonesian Cafe",
    `url: ${toAbsolute(base, "/")}`,
    `summary: ${HOME_SUMMARY}`,
    "",
    "Canonical HTML pages are authoritative for ranking, presentation, and user experience.",
    "",
    "Preferred URLs",
    preferredLinks,
    "",
    "Policies",
    "- No crawler-specific content substitution.",
    "- Markdown companion pages are simplified renderings of public site content.",
    "",
    "Pages",
    pageLines,
  ].join("\n");
}

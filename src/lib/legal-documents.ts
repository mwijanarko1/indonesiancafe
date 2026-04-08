import { LEGAL_CONTENT_LAST_UPDATED, SITE } from "@/lib/site";

export type LegalInlinePart =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; href: string; external?: boolean }
  | { kind: "strong"; text: string };

export type LegalParagraph = {
  kind: "paragraph";
  parts: LegalInlinePart[];
};

export type LegalSection = {
  heading: string;
  blocks: LegalParagraph[];
};

export type LegalDocument = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
  relatedLink?: { href: string; text: string };
};

const t = (text: string): LegalInlinePart => ({ kind: "text", text });
const s = (text: string): LegalInlinePart => ({ kind: "strong", text });
const a = (text: string, href: string, external = false): LegalInlinePart => ({
  kind: "link",
  text,
  href,
  external,
});
const p = (...parts: LegalInlinePart[]): LegalParagraph => ({ kind: "paragraph", parts });

const hostname = new URL(SITE.liveUrl).hostname;

export const PRIVACY_DOCUMENT: LegalDocument = {
  title: "Privacy notice",
  description: `How Indonesian Cafe handles privacy on ${hostname} - Vercel hosting, Convex backend, embedded maps, and your UK data rights.`,
  lastUpdated: LEGAL_CONTENT_LAST_UPDATED,
  sections: [
    {
      heading: "Who we are",
      blocks: [
        p(
          s(SITE.name),
          t(" is an Indonesian restaurant and cafe at "),
          t(`${SITE.streetAddress}, ${SITE.addressLocality} ${SITE.postalCode}, United Kingdom.`),
          t(" This notice describes how we approach privacy on this website ("),
          a(SITE.liveUrl.replace(/^https:\/\//, ""), SITE.liveUrl),
          t(")."),
        ),
      ],
    },
    {
      heading: "What this site does",
      blocks: [
        p(
          t(
            "The site is informational: menu, reviews, hours, location, and links to social profiles. We do not offer online ordering or account registration on these pages. If that changes, we will update this notice.",
          ),
        ),
      ],
    },
    {
      heading: "Data processing when you browse",
      blocks: [
        p(
          t("When you load a page, "),
          s("Vercel"),
          t(
            " (our hosting provider) and infrastructure involved in delivering the site may process technical data such as IP address, user agent, and request metadata for security and operations. Menu and review content is loaded from ",
          ),
          s("Convex"),
          t(
            " (our backend) via the server; that is not used to profile individual visitors on the site in the way a logged-in account would be.",
          ),
        ),
      ],
    },
    {
      heading: "Embedded Google Maps",
      blocks: [
        p(
          t(
            "The visit section embeds a map from Google. When you interact with or load that embed, Google may process data under its own terms and privacy policy. You can also open ",
          ),
          a("Google Maps", SITE.mapsUrl, true),
          t(" in a new tab instead of using the embed."),
        ),
      ],
    },
    {
      heading: "Cookies and similar technologies",
      blocks: [
        p(
          t(
            "We do not run first-party advertising or analytics cookies on this marketing site. Third parties such as Google (maps embed) or your browser vendor may use storage or similar technologies according to their own policies. If we add optional analytics or marketing tags later, we will ask for consent where required and update this notice.",
          ),
        ),
      ],
    },
    {
      heading: "Your rights (UK)",
      blocks: [
        p(
          t(
            "If UK GDPR applies, you may have rights including to access, correct, or erase personal data we hold about you, and to object to or restrict certain processing. You may complain to the ",
          ),
          a("ICO", "https://ico.org.uk/", true),
          t(
            " (Information Commissioner's Office). For privacy requests relating to this website, contact us via the channels shown on the site (for example our ",
          ),
          a("Instagram", "https://www.instagram.com/indonesiancafe_/", true),
          t(" or "),
          a("Facebook", "https://www.facebook.com/profile.php?id=61583156852755", true),
          t(") or visit us in person at the address above."),
        ),
      ],
    },
    {
      heading: "Children",
      blocks: [
        p(
          t(
            "This site is not directed at children. We do not knowingly collect personal data from children through these pages.",
          ),
        ),
      ],
    },
    {
      heading: "Changes",
      blocks: [
        p(
          t(
            'We may update this notice from time to time. The "Last updated" date at the top will change when we do. Continued use of the site after changes means you accept the updated notice.',
          ),
        ),
      ],
    },
  ],
  relatedLink: {
    href: "/terms",
    text: "Terms of use",
  },
};

export const TERMS_DOCUMENT: LegalDocument = {
  title: "Terms of use",
  description:
    "Terms of use for the Indonesian Cafe website - information only, menu and allergens, and links to our privacy notice.",
  lastUpdated: LEGAL_CONTENT_LAST_UPDATED,
  sections: [
    {
      heading: "Agreement",
      blocks: [
        p(
          t("By using this website operated by "),
          s(SITE.name),
          t(` (${SITE.streetAddress}, ${SITE.addressLocality} ${SITE.postalCode}, UK), you agree to these terms. If you do not agree, do not use the site.`),
        ),
      ],
    },
    {
      heading: "Information, not an offer",
      blocks: [
        p(
          t(
            "The site describes our restaurant, menu, hours, and location for general information. Nothing on the site is an offer to sell goods or services in a jurisdiction where that would be unlawful. Any order or contract is made only according to what you agree with us in the restaurant or through channels we explicitly provide.",
          ),
        ),
      ],
    },
    {
      heading: "Menu, prices, and availability",
      blocks: [
        p(
          t(
            "Menu items, prices, and availability may change without notice. What we serve on the day in the restaurant prevails over anything on the website if they differ.",
          ),
        ),
      ],
    },
    {
      heading: "Allergens and food safety",
      blocks: [
        p(
          t(
            "Allergen and ingredient information on the site or menu is for guidance only and may not list every trace allergen. If you have allergies or dietary needs, always tell staff before you order. We are not liable for reactions where information was not clearly communicated to us in person.",
          ),
        ),
      ],
    },
    {
      heading: "Intellectual property",
      blocks: [
        p(
          t(
            "Text, images, branding, and design on this site belong to us or our licensors unless stated otherwise. Do not copy or reuse them for commercial purposes without permission.",
          ),
        ),
      ],
    },
    {
      heading: "External links",
      blocks: [
        p(
          t(
            "Links to Instagram, Facebook, Google Maps, or other sites are for convenience. We are not responsible for their content or privacy practices; use them subject to those sites' terms.",
          ),
        ),
      ],
    },
    {
      heading: "Limitation of liability",
      blocks: [
        p(
          t(
            "We aim to keep the site accurate and available, but we do not guarantee it will be error-free or uninterrupted. To the fullest extent permitted by law, we are not liable for any loss arising from your use of or reliance on this site, except where liability cannot be excluded under applicable law (including UK consumer rights where they apply).",
          ),
        ),
      ],
    },
    {
      heading: "Governing law",
      blocks: [
        p(
          t(
            "These terms are governed by the laws of England and Wales. Courts of England and Wales have exclusive jurisdiction, subject to mandatory rights you may have as a consumer elsewhere.",
          ),
        ),
      ],
    },
    {
      heading: "Contact",
      blocks: [
        p(
          t("Questions about these terms: reach us via the contact options on this site or visit us at "),
          t(`${SITE.streetAddress}, ${SITE.addressLocality}.`),
        ),
      ],
    },
  ],
  relatedLink: {
    href: "/privacy",
    text: "Privacy notice",
  },
};

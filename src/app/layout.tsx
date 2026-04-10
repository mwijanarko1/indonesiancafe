import type { Metadata, Viewport } from "next";
import {
  Anton,
  Barlow_Condensed,
  DM_Sans,
  Lora,
} from "next/font/google";
import { RestaurantJsonLd } from "@/components/seo/RestaurantJsonLd";
import {
  getRequiredCanonicalSiteUrl,
  HERO_IMAGE_PATH,
  SITE_SEO_DESCRIPTION,
} from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/** Headings, menu titles, prices — readable serif that pairs with the hero poster face */
const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

/** Uppercase labels, header lockup — condensed sans in the same register as Anton without competing */
const barlowCondensed = Barlow_Condensed({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

/** Hero only — heavy poster caps */
const anton = Anton({
  weight: "400",
  variable: "--font-hero",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#b91c1c",
};

export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(getRequiredCanonicalSiteUrl()),
  title: {
    default:
      "Indonesian Restaurant Sheffield | Indonesian Cafe · Halal Food · Crookes S10",
    template: "%s · Indonesian Restaurant Sheffield",
  },
  description: SITE_SEO_DESCRIPTION,
  authors: [{ name: "Indonesian Cafe" }],
  openGraph: {
    title:
      "Indonesian Restaurant Sheffield | Indonesian Cafe · Halal Indonesian Food · UK",
    description: SITE_SEO_DESCRIPTION,
    url: "/",
    siteName: "Indonesian Cafe Sheffield",
    images: [
      {
        url: HERO_IMAGE_PATH,
        width: 1966,
        height: 1423,
        alt: "Indonesian restaurant Sheffield — Indonesian Cafe, halal food and takeaway, coffee and bakery, 15 Crookes S10",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Indonesian Restaurant Sheffield | Indonesian Cafe · Halal Indonesian Food",
    description: SITE_SEO_DESCRIPTION,
    images: [HERO_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${lora.variable} ${barlowCondensed.variable} ${anton.variable} min-h-screen antialiased bg-brand-cream-page`}
      >
        <RestaurantJsonLd />
        <a
          href="#main-content"
          className="absolute -top-12 left-4 z-[100] rounded-md bg-brand-maroon px-4 py-2 text-sm font-semibold text-brand-address transition-[top] duration-200 focus:top-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-maroon"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

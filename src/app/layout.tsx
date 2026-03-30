import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Cinzel, Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { RestaurantJsonLd } from "@/components/seo/RestaurantJsonLd";
import { getCanonicalSiteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Trajan-style display for “INDONESIAN CAFE” header */
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

/** Logo lockup: bold “INDONESIAN”, lighter “CAFE” */
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#c0272d",
};

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalSiteUrl()),
  title: {
    default: "Indonesian Restaurant Sheffield, UK | Indonesian Cafe · Crookes",
    template: "%s · Indonesian Cafe Sheffield",
  },
  description:
    "Indonesian restaurant and cafe in Crookes, Sheffield S10 1UA — authentic Indonesian food in the UK: nasi goreng, mie goreng, satay, sambals, and cafe favourites near the city centre.",
  keywords: [
    "Indonesian restaurant Sheffield",
    "Indonesian food Sheffield",
    "Indonesian restaurant UK",
    "Indonesian cafe UK",
    "Crookes restaurant",
    "South Yorkshire Indonesian",
    "Sheffield S10 restaurant",
    "authentic Indonesian food",
    "Indonesian Cafe",
    "Crookes",
    "S10 1UA",
  ],
  authors: [{ name: "Indonesian Cafe" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Indonesian Restaurant in Sheffield, UK | Indonesian Cafe",
    description:
      "Visit our Indonesian restaurant in Crookes, Sheffield — traditional cooking, warm welcome, and cafe favourites. 15 Crookes, S10 1UA, United Kingdom.",
    url: "/",
    siteName: "Indonesian Cafe Sheffield",
    images: [
      {
        url: "/poster.png",
        width: 1200,
        height: 1600,
        alt: "Indonesian Cafe — Indonesian restaurant in Sheffield, UK — poster with traditional roof motif",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indonesian Restaurant Sheffield | Indonesian Cafe",
    description:
      "Authentic Indonesian restaurant in Crookes, Sheffield, UK — dine in or find us on Google Maps.",
    images: ["/poster.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${playfair.variable} min-h-screen antialiased bg-brand-cream`}
      >
        <ConvexClientProvider>
          <RestaurantJsonLd nonce={nonce} />
          <a
            href="#main-content"
            className="absolute -top-12 left-4 z-[100] rounded-md bg-brand-maroon px-4 py-2 text-sm font-medium text-brand-address transition-[top] duration-200 focus:top-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-maroon"
          >
            Skip to main content
          </a>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}

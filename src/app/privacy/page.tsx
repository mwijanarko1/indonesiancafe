import type { Metadata } from "next";
import { headers } from "next/headers";
import { LegalDocumentContent } from "@/components/cafe/LegalDocumentContent";
import { LegalPageShell } from "@/components/cafe/LegalPageShell";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { PRIVACY_DOCUMENT } from "@/lib/legal-documents";

export const metadata: Metadata = {
  title: "Privacy",
  description: PRIVACY_DOCUMENT.description,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy · Indonesian Restaurant Sheffield",
    description: PRIVACY_DOCUMENT.description,
    url: "/privacy",
  },
  twitter: {
    title: "Privacy · Indonesian Restaurant Sheffield",
    description: PRIVACY_DOCUMENT.description,
  },
};

export default async function PrivacyPage() {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <>
      <PageJsonLd
        nonce={nonce}
        path="/privacy"
        name="Privacy - Indonesian Cafe"
        description={PRIVACY_DOCUMENT.description}
        breadcrumbLabel="Privacy"
      />
      <LegalPageShell title={PRIVACY_DOCUMENT.title}>
        <LegalDocumentContent document={PRIVACY_DOCUMENT} />
      </LegalPageShell>
    </>
  );
}

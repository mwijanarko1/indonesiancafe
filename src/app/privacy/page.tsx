import type { Metadata } from "next";
import { LegalDocumentContent } from "@/components/cafe/LegalDocumentContent";
import { LegalPageShell } from "@/components/cafe/LegalPageShell";
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

export default function PrivacyPage() {
  return (
    <LegalPageShell title={PRIVACY_DOCUMENT.title}>
      <LegalDocumentContent document={PRIVACY_DOCUMENT} />
    </LegalPageShell>
  );
}

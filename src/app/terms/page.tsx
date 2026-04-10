import type { Metadata } from "next";
import { LegalDocumentContent } from "@/components/cafe/LegalDocumentContent";
import { LegalPageShell } from "@/components/cafe/LegalPageShell";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { TERMS_DOCUMENT } from "@/lib/legal-documents";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms of use",
  description: TERMS_DOCUMENT.description,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of use · Indonesian Restaurant Sheffield",
    description: TERMS_DOCUMENT.description,
    url: "/terms",
  },
  twitter: {
    title: "Terms of use · Indonesian Restaurant Sheffield",
    description: TERMS_DOCUMENT.description,
  },
};

export default async function TermsPage() {
  return (
    <>
      <PageJsonLd
        path="/terms"
        name="Terms of use - Indonesian Cafe"
        description={TERMS_DOCUMENT.description}
        breadcrumbLabel="Terms"
      />
      <LegalPageShell title={TERMS_DOCUMENT.title}>
        <LegalDocumentContent document={TERMS_DOCUMENT} />
      </LegalPageShell>
    </>
  );
}

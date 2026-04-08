import Link from "next/link";
import type { LegalDocument, LegalInlinePart } from "@/lib/legal-documents";

function LegalInlinePartView({ part }: { part: LegalInlinePart }) {
  if (part.kind === "text") {
    return <>{part.text}</>;
  }

  if (part.kind === "strong") {
    return <strong>{part.text}</strong>;
  }

  return (
    <Link
      href={part.href}
      target={part.external ? "_blank" : undefined}
      rel={part.external ? "noopener noreferrer" : undefined}
    >
      {part.text}
    </Link>
  );
}

export function LegalDocumentContent({ document }: { document: LegalDocument }) {
  const leadSuffix =
    document.title === "Privacy notice"
      ? " This notice is provided for visitors to our website. It is not legal advice; ask a qualified adviser if you need certainty for your situation."
      : document.title === "Terms of use"
        ? " Please read these terms before using this website."
        : "";

  return (
    <>
      <p className="text-brand-maroon/75">
        Last updated: {document.lastUpdated}.{leadSuffix}
      </p>

      {document.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.blocks.map((block, blockIndex) => (
            <p key={`${section.heading}-${blockIndex}`}>
              {block.parts.map((part, partIndex) => (
                <LegalInlinePartView key={`${section.heading}-${blockIndex}-${partIndex}`} part={part} />
              ))}
            </p>
          ))}
        </section>
      ))}

      {document.relatedLink ? (
        <p>
          <Link href={document.relatedLink.href}>{document.relatedLink.text}</Link>
        </p>
      ) : null}
    </>
  );
}

import Link from "next/link";

type PageCrossLink = {
  href: string;
  label: string;
};

type PageCrossLinksProps = {
  title: string;
  description: string;
  links: readonly PageCrossLink[];
};

export function PageCrossLinks({ title, description, links }: PageCrossLinksProps) {
  return (
    <section className="mt-14 rounded-2xl border border-brand-maroon/15 bg-white/75 px-6 py-8 shadow-sm">
      <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-brand-maroon">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-maroon/80 sm:text-base">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex rounded-sm border-2 border-brand-maroon px-5 py-2 font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-[0.12em] text-brand-maroon transition hover:bg-brand-maroon/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

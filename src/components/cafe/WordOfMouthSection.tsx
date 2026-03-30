const quotes = [
  {
    source: "Regulars in Crookes",
    line: "Consistent, comforting plates — the kind of place you bring friends when they ask where to eat in S10.",
  },
  {
    source: "Sheffield food lovers",
    line: "Bold sambals and charcoal notes on the satay — Indonesian home cooking without the fuss.",
  },
  {
    source: "Students & neighbours",
    line: "Easy stop for mie goreng, nasi goreng, and a proper cup of coffee between lectures and errands.",
  },
] as const;

export function WordOfMouthSection() {
  return (
    <section
      className="bg-brand-cream px-4 py-16 sm:py-20"
      aria-labelledby="word-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="word-heading"
          className="text-center font-[family-name:var(--font-serif)] text-3xl font-semibold text-brand-crimson sm:text-4xl"
        >
          Word of mouth
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-brand-maroon/80">
          We are a neighbourhood restaurant — here is how guests describe the experience.
        </p>
        <ul className="mt-12 grid gap-8 sm:grid-cols-3">
          {quotes.map((q) => (
            <li
              key={q.source}
              className="border-t-2 border-brand-crimson/25 pt-6 text-center sm:text-left"
            >
              <p className="font-[family-name:var(--font-cinzel)] text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-crimson">
                {q.source}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand-maroon/88 sm:text-base">
                “{q.line}”
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

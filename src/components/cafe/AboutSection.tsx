import Image from "next/image";

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 overflow-x-clip bg-brand-cream-page px-4 py-16 sm:py-24"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="relative aspect-[3/4] max-h-[min(32rem,70vh)] overflow-hidden rounded-sm shadow-[0_24px_60px_-12px_rgb(0_0_0_/_0.2)] ring-1 ring-stone-300/60">
            <Image
              src="/photos/638300464_17849684961639557_4845296330349199575_n.jpg"
              alt="Cooking at Indonesian Cafe — mortar and spices"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
          <figure className="absolute -bottom-4 right-2 z-10 max-w-[14rem] bg-brand-crimson p-4 text-white shadow-lg sm:-right-2 sm:max-w-[16rem] sm:p-5">
            <blockquote className="font-[family-name:var(--font-serif)] text-sm font-medium leading-snug sm:text-base">
              &ldquo;We cook like we do at home — patient, generous, and true to the islands.&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/80">
              Indonesian Cafe
            </figcaption>
          </figure>
        </div>

        <div>
          <p className="font-[family-name:var(--font-serif)] text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-gold">
            Our mission
          </p>
          <h2
            id="about-heading"
            className="mt-3 font-[family-name:var(--font-serif)] text-3xl font-semibold leading-tight text-brand-charcoal sm:text-4xl"
          >
            A journey across the archipelago
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-700 sm:text-lg">
            From West Sumatra-style curries to street-style noodles and sambals built the slow way — we
            bring Indonesian comfort food to Crookes with a fully halal kitchen and ingredients chosen for
            honest flavour, not shortcuts.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            15 Crookes, Sheffield S10 1UA — a short walk from the city centre and universities.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-stone-200 pt-8">
            <div>
              <dt className="font-[family-name:var(--font-serif)] text-lg font-semibold text-brand-charcoal">
                100% halal
              </dt>
              <dd className="mt-1 text-sm text-stone-600">Certified standards in our kitchen</dd>
            </div>
            <div>
              <dt className="font-[family-name:var(--font-serif)] text-lg font-semibold text-brand-charcoal">
                Sheffield
              </dt>
              <dd className="mt-1 text-sm text-stone-600">Cooked fresh in Crookes</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

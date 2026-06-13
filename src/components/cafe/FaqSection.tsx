"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/faq";
import { FAQ_SECTION_BLURB, FAQ_SECTION_TITLE } from "@/lib/site-copy";

export function FaqSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-brand-maroon px-4 py-16 text-brand-address sm:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="faq-heading"
          className="text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-brand-address sm:text-4xl"
        >
          {FAQ_SECTION_TITLE}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-brand-address/85 sm:text-base">
          {FAQ_SECTION_BLURB}
        </p>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-brand-cream/15 bg-brand-menu-page px-4 shadow-sm sm:px-6">
          <Accordion type="single" collapsible>
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/faq"
            className="rounded-sm border-2 border-brand-address/85 bg-transparent px-8 py-3 font-[family-name:var(--font-label)] text-sm font-bold uppercase tracking-[0.08em] text-brand-address transition hover:bg-brand-address/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            View full FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}

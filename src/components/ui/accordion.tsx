"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-brand-maroon/10 last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left font-[family-name:var(--font-serif)] text-lg font-bold text-brand-maroon transition-all outline-none hover:text-brand-oxblood focus-visible:ring-2 focus-visible:ring-brand-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-menu-page disabled:pointer-events-none disabled:opacity-50 sm:text-xl",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden
          className="mt-1 size-4 shrink-0 text-brand-maroon/60 group-aria-expanded/accordion-trigger:hidden"
        />
        <ChevronUp
          aria-hidden
          className="mt-1 hidden size-4 shrink-0 text-brand-maroon/60 group-aria-expanded/accordion-trigger:inline"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) pb-4 text-sm leading-relaxed text-brand-maroon/80 sm:text-base",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

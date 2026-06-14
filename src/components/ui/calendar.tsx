"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-1", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex flex-col gap-4 sm:flex-row", defaultClassNames.months),
        month: cn("relative flex flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex items-center justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-7 bg-transparent p-0 text-brand-maroon/60 hover:text-brand-maroon",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-7 bg-transparent p-0 text-brand-maroon/60 hover:text-brand-maroon",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-8 items-center justify-center",
          defaultClassNames.month_caption,
        ),
        caption_label: cn(
          "font-[family-name:var(--font-label)] text-sm font-bold uppercase tracking-[0.08em] text-brand-maroon",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "w-8 flex-1 rounded-md text-center font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-[0.1em] text-stone-500",
          defaultClassNames.weekday,
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          defaultClassNames.day,
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-8 p-0 font-[family-name:var(--font-serif)] text-sm font-normal text-brand-maroon",
          defaultClassNames.day_button,
        ),
        selected: cn(
          "rounded-md bg-brand-maroon text-brand-cream hover:bg-brand-maroon focus:bg-brand-maroon focus:text-brand-cream",
          defaultClassNames.selected,
        ),
        today: cn(
          "rounded-md bg-brand-maroon/8 font-bold text-brand-maroon",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-stone-400 aria-selected:bg-brand-maroon/5 aria-selected:text-stone-500",
          defaultClassNames.outside,
        ),
        disabled: cn("text-stone-300 opacity-50", defaultClassNames.disabled),
        hidden: "invisible",
        range_start: "day-range-start rounded-l-md",
        range_end: "day-range-end rounded-r-md",
        range_middle: "rounded-none",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          if (orientation === "left") {
            return (
              <ChevronLeft className={cn("size-4", chevronClassName)} {...chevronProps} />
            )
          }

          return (
            <ChevronRight className={cn("size-4", chevronClassName)} {...chevronProps} />
          )
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-1", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-3",
        caption: "flex justify-center relative items-center w-full",
        caption_label: "font-[family-name:var(--font-label)] text-sm font-bold uppercase tracking-[0.08em] text-brand-maroon",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-7 bg-transparent p-0 text-brand-maroon/60 hover:text-brand-maroon",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-stone-500 rounded-md w-8 font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-[0.1em]",
        row: "flex w-full mt-1",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-brand-maroon/10 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-8 p-0 font-[family-name:var(--font-serif)] text-sm font-normal text-brand-maroon aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_range_start: "day-range-start",
        day_selected:
          "bg-brand-maroon text-brand-cream hover:bg-brand-maroon focus:bg-brand-maroon focus:text-brand-cream",
        day_today: "bg-brand-maroon/8 text-brand-maroon font-bold",
        day_outside:
          "day-outside text-stone-400 aria-selected:bg-brand-maroon/5 aria-selected:text-stone-500",
        day_disabled: "text-stone-300 opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

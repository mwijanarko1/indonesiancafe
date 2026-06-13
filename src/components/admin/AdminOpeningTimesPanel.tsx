"use client";

import { useState, useTransition, type ReactNode } from "react";
import { saveOpeningHours } from "@/lib/actions/admin-menu";
import {
  DAY_STATUS_ITEMS,
  formatOpeningHoursTimeString,
  OPENING_TIME_SELECT_ITEMS,
  parseOpeningHoursTimeString,
  minutesToSelectValue,
  selectValueToMinutes,
  type DaySchedule,
} from "@/lib/opening-hours-time";
import type { OpeningHoursRow } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type { OpeningHoursRow };

const ADMIN_FIELD_CLASS =
  "border-brand-maroon/15 bg-transparent text-brand-maroon placeholder:text-stone-400 focus-visible:ring-brand-maroon focus-visible:ring-offset-brand-cream-page";

const ADMIN_SELECT_TRIGGER_CLASS = cn(
  "h-10 w-full border-brand-maroon/15 bg-transparent text-brand-maroon shadow-none",
  "data-placeholder:text-stone-400 focus-visible:border-brand-maroon focus-visible:ring-brand-maroon focus-visible:ring-offset-brand-cream-page",
);

type DayHoursState = {
  day: string;
  schedule: DaySchedule;
};

function scheduleToTimeString(schedule: DaySchedule): string {
  return formatOpeningHoursTimeString(schedule);
}

function DayHoursEditor({
  day,
  schedule,
  onChange,
}: {
  day: string;
  schedule: DaySchedule;
  onChange: (schedule: DaySchedule) => void;
}) {
  const { closed, opens, closes } = schedule;

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-end">
      <div>
        <p
          className={cn(
            "font-[family-name:var(--font-serif)] font-bold text-brand-maroon",
            closed && "line-through",
          )}
        >
          {day}
        </p>
        {closed ? (
          <p className="mt-1 font-[family-name:var(--font-label)] text-[0.6rem] font-bold uppercase tracking-wide text-brand-maroon/70">
            Closed
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,8rem)_1fr_1fr] sm:items-end">
          <div className="space-y-1.5">
            <FormFieldLabel>Status</FormFieldLabel>
            <Select
              items={[...DAY_STATUS_ITEMS]}
              value={closed ? "closed" : "open"}
              onValueChange={(value) => {
                if (value === "closed") {
                  onChange({ ...schedule, closed: true });
                  return;
                }
                onChange({ ...schedule, closed: false });
              }}
            >
              <SelectTrigger className={ADMIN_SELECT_TRIGGER_CLASS} aria-label={`${day} status`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {DAY_STATUS_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {!closed ? (
            <>
              <div className="space-y-1.5">
                <FormFieldLabel>Opens</FormFieldLabel>
                <Select
                  items={OPENING_TIME_SELECT_ITEMS}
                  value={minutesToSelectValue(opens)}
                  onValueChange={(value) => {
                    const nextOpens = selectValueToMinutes(value);
                    if (nextOpens === null) {
                      return;
                    }
                    onChange({ ...schedule, opens: nextOpens });
                  }}
                >
                  <SelectTrigger className={ADMIN_SELECT_TRIGGER_CLASS} aria-label={`${day} opening time`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {OPENING_TIME_SELECT_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FormFieldLabel>Closes</FormFieldLabel>
                <Select
                  items={OPENING_TIME_SELECT_ITEMS}
                  value={minutesToSelectValue(closes)}
                  onValueChange={(value) => {
                    const nextCloses = selectValueToMinutes(value);
                    if (nextCloses === null) {
                      return;
                    }
                    onChange({ ...schedule, closes: nextCloses });
                  }}
                >
                  <SelectTrigger className={ADMIN_SELECT_TRIGGER_CLASS} aria-label={`${day} closing time`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {OPENING_TIME_SELECT_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FormFieldLabel({
  children,
  optional,
}: {
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label className="font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.14em] text-stone-500">
      {children}
      {optional ? (
        <span className="font-normal normal-case tracking-normal text-stone-400"> (optional)</span>
      ) : null}
    </label>
  );
}

export function AdminOpeningTimesPanel({
  hours: initialHours,
  footnote: initialFootnote,
}: {
  hours: readonly OpeningHoursRow[];
  footnote: string;
}) {
  const [dayHours, setDayHours] = useState<DayHoursState[]>(() =>
    initialHours.map((row) => ({
      day: row.day,
      schedule: parseOpeningHoursTimeString(row.time),
    })),
  );
  const [footnote, setFootnote] = useState(initialFootnote);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateDaySchedule(day: string, schedule: DaySchedule) {
    setDayHours((current) =>
      current.map((row) => (row.day === day ? { ...row, schedule } : row)),
    );
  }

  function handleSave() {
    setMessage(null);
    setError(null);
    const hours = dayHours.map((row) => ({
      day: row.day,
      time: scheduleToTimeString(row.schedule),
    }));

    startTransition(async () => {
      try {
        await saveOpeningHours({ hours, footnote });
        setMessage("Opening hours saved. Changes will appear across the site shortly.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save opening hours.");
      }
    });
  }

  const currentHours = dayHours.map((row) => ({
    day: row.day,
    time: scheduleToTimeString(row.schedule),
  }));

  const isDirty =
    footnote !== initialFootnote ||
    currentHours.some((row, index) => row.time !== initialHours[index]?.time);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-label)] text-2xl font-bold uppercase tracking-wide text-brand-maroon sm:text-3xl">
            Opening times
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Edit the weekly hours shown to visitors across the site.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending || !isDirty}
            className="min-w-36 bg-brand-maroon px-6 text-brand-cream hover:bg-brand-oxblood disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save changes"}
          </Button>
          {message ? (
            <p className="text-sm text-green-700" role="status">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <ul className="space-y-5">
          {dayHours.map((row) => (
            <li
              key={row.day}
              className={cn(
                "border-b border-brand-maroon/10 pb-5 last:border-0",
                row.schedule.closed && "opacity-60",
              )}
            >
              <DayHoursEditor
                day={row.day}
                schedule={row.schedule}
                onChange={(schedule) => updateDaySchedule(row.day, schedule)}
              />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="border-b border-brand-maroon/15 pb-2 font-[family-name:var(--font-label)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
          Footnote
        </p>
        <div className="mt-4">
          <Input
            id="opening-hours-footnote"
            value={footnote}
            onChange={(event) => setFootnote(event.target.value)}
            placeholder="Bank holiday hours may differ…"
            className={ADMIN_FIELD_CLASS}
            aria-label="Footnote"
          />
        </div>
      </div>
    </div>
  );
}

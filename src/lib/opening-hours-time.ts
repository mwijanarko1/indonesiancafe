export type DaySchedule = {
  closed: boolean;
  opens: number;
  closes: number;
};

export const DEFAULT_DAY_SCHEDULE: DaySchedule = {
  closed: false,
  opens: 10 * 60,
  closes: 20 * 60,
};

export const OPENING_TIME_STEP_MINUTES = 30;
export const OPENING_TIME_START_MINUTES = 6 * 60;
export const OPENING_TIME_END_MINUTES = 23 * 60 + 30;

export const DAY_STATUS_ITEMS = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
] as const;

function formatMinutes(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 < 12 ? "am" : "pm";
  const hours12 = hours24 % 12 || 12;

  if (mins === 0) {
    return `${hours12} ${period}`;
  }

  return `${hours12}:${mins.toString().padStart(2, "0")} ${period}`;
}

export function formatOpeningHoursTimeString(schedule: DaySchedule): string {
  if (schedule.closed) {
    return "Closed";
  }

  return `${formatMinutes(schedule.opens)}–${formatMinutes(schedule.closes)}`;
}

function parseTimePart(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (!match) {
    return null;
  }

  const hours = Number.parseInt(match[1] ?? "", 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);
  const period = match[3]?.toLowerCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    return null;
  }

  let hours24 = hours % 12;
  if (period === "pm") {
    hours24 += 12;
  }

  return hours24 * 60 + minutes;
}

export function parseOpeningHoursTimeString(time: string): DaySchedule {
  const trimmed = time.trim();
  if (trimmed.toLowerCase() === "closed") {
    return { ...DEFAULT_DAY_SCHEDULE, closed: true };
  }

  const parts = trimmed.split(/[–-]/).map((part) => part.trim());
  if (parts.length !== 2) {
    return DEFAULT_DAY_SCHEDULE;
  }

  const opens = parseTimePart(parts[0] ?? "");
  const closes = parseTimePart(parts[1] ?? "");
  if (opens === null || closes === null) {
    return DEFAULT_DAY_SCHEDULE;
  }

  return { closed: false, opens, closes };
}

export function buildOpeningTimeSelectItems(): { label: string; value: string }[] {
  const items: { label: string; value: string }[] = [];

  for (
    let minutes = OPENING_TIME_START_MINUTES;
    minutes <= OPENING_TIME_END_MINUTES;
    minutes += OPENING_TIME_STEP_MINUTES
  ) {
    items.push({
      label: formatMinutes(minutes),
      value: String(minutes),
    });
  }

  return items;
}

export const OPENING_TIME_SELECT_ITEMS = buildOpeningTimeSelectItems();

export function minutesToSelectValue(minutes: number): string {
  return String(minutes);
}

export function selectValueToMinutes(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const minutes = Number.parseInt(value, 10);
  return Number.isFinite(minutes) ? minutes : null;
}

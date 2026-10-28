export const CAPACITY_SCALE_MIN = 1;
export const CAPACITY_SCALE_MAX = 5;

/**
 * Calendar day in `yyyy-mm-dd` form. Capacity records are keyed by calendar
 * day rather than an absolute instant, so a record always means "this local
 * day" regardless of the user's timezone.
 */
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDayString(value: string): boolean {
  if (!DAY_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** Returns today's date in `yyyy-mm-dd` form for the given timezone. */
export function todayDayString(timezone: string, now: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
    return `${get("year")}-${get("month")}-${get("day")}`;
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

/** Human-readable label for a `yyyy-mm-dd` day, rendered in the user's timezone. */
export function formatDayLabel(day: string, timezone: string): string {
  if (!isValidDayString(day)) return day;
  const [year, month, dayOfMonth] = day.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, dayOfMonth, 12));
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return day;
  }
}

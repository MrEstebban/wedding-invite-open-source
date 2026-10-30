import { event } from "@/config/event";

function parts(iso: string, options: Intl.DateTimeFormatOptions) {
  const formatted = new Intl.DateTimeFormat(event.locale, { timeZone: event.timeZone, ...options }).formatToParts(
    new Date(iso),
  );
  return Object.fromEntries(formatted.map((part) => [part.type, part.value]));
}

/** "31 de agosto, 2026" */
export function formatEventDate(iso: string = event.date): string {
  const { day, month, year } = parts(iso, { day: "numeric", month: "long", year: "numeric" });
  return `${day} de ${month}, ${year}`;
}

/** "31 · 08 · 2026" */
export function formatShortDate(iso: string = event.date): string {
  const { day, month, year } = parts(iso, { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${day} · ${month} · ${year}`;
}

export function formatDeadline(): string {
  return formatEventDate(event.rsvpDeadline);
}

export function isRsvpOpen(now: Date = new Date()): boolean {
  return now.getTime() <= new Date(event.rsvpDeadline).getTime();
}

/** Sortable local timestamp for the sheet, e.g. "2026-07-12 18:04:31". */
export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: event.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Guest model and its mapping to the Google Sheet.
 * Safe to import from client components: contains no secrets and no Node APIs.
 */

/** Sheet columns from left to right (A, B, C, ...). The order is the contract with the sheet. */
const COLUMN_ORDER = [
  "id",
  "token",
  "name",
  "greeting",
  "maxGuests",
  "status",
  "confirmedGuests",
  "attendeeNames",
  "phone",
  "comments",
  "confirmedAt",
  "link",
] as const;

export type ColumnKey = (typeof COLUMN_ORDER)[number];

export function columnIndex(key: ColumnKey): number {
  return COLUMN_ORDER.indexOf(key);
}

export function columnLetter(key: ColumnKey): string {
  return String.fromCharCode(65 + columnIndex(key));
}

export const LAST_COLUMN = columnLetter("link");
/** Row 1 holds the headers. */
export const FIRST_DATA_ROW = 2;

export type GuestStatus = "pending" | "attending" | "declined";

export const STATUS_LABELS: Record<GuestStatus, string> = {
  pending: "Pendiente",
  attending: "Confirmado",
  declined: "No asistirá",
};

const DEFAULT_GREETING = "Querido(a)";

export interface Guest {
  rowNumber: number;
  id: string;
  token: string;
  name: string;
  greeting: string;
  maxGuests: number;
  status: GuestStatus;
  confirmedGuests: number;
  attendeeNames: string;
  phone: string;
  comments: string;
  confirmedAt: string;
}

/** What the browser is allowed to see: no row number, internal id or token. */
export type PublicGuest = Omit<Guest, "rowNumber" | "id" | "token">;

function parseStatus(value: string): GuestStatus {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
  if (normalized === "confirmado") return "attending";
  if (normalized === "no asistira") return "declined";
  return "pending";
}

function parseCount(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function rowToGuest(row: string[], rowNumber: number): Guest {
  const cell = (key: ColumnKey) => (row[columnIndex(key)] ?? "").trim();
  return {
    rowNumber,
    id: cell("id"),
    token: cell("token"),
    name: cell("name"),
    greeting: cell("greeting") || DEFAULT_GREETING,
    // A missing or invalid maximum falls back to a single seat.
    maxGuests: Math.max(1, parseCount(cell("maxGuests"), 1)),
    status: parseStatus(cell("status")),
    confirmedGuests: parseCount(cell("confirmedGuests"), 0),
    attendeeNames: cell("attendeeNames"),
    phone: cell("phone"),
    comments: cell("comments"),
    confirmedAt: cell("confirmedAt"),
  };
}

export function toPublicGuest(guest: Guest): PublicGuest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rowNumber, id, token, ...publicGuest } = guest;
  return publicGuest;
}

export function peopleLabel(count: number): string {
  return `${count} ${count === 1 ? "persona" : "personas"}`;
}

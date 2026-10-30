import "server-only";
import { formatTimestamp } from "@/lib/dates";
import { FIRST_DATA_ROW, LAST_COLUMN, columnIndex, columnLetter, rowToGuest, STATUS_LABELS, type Guest } from "@/lib/guest";
import type { RsvpFields } from "@/lib/rsvp-schema";
import { readRange, writeRange } from "@/lib/sheets-client";
import { isWellFormedToken, tokensMatch } from "@/lib/token";

export async function getGuestByToken(token: string): Promise<Guest | null> {
  if (!isWellFormedToken(token)) return null;

  const rows = await readRange(`A${FIRST_DATA_ROW}:${LAST_COLUMN}`);
  const tokenColumn = columnIndex("token");
  for (const [index, row] of rows.entries()) {
    const candidate = (row[tokenColumn] ?? "").trim();
    if (candidate && tokensMatch(candidate, token)) {
      return rowToGuest(row, index + FIRST_DATA_ROW);
    }
  }
  return null;
}

/** Stops a guest's text from being interpreted as a formula if the sheet is exported to CSV. */
function neutralizeFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

/**
 * The sheet may have been sorted or edited since the guest was read, so the
 * row is re-checked against the token before writing.
 */
async function resolveRow(guest: Guest): Promise<number> {
  const [[current = ""] = []] = await readRange(`${columnLetter("token")}${guest.rowNumber}`);
  if (tokensMatch(current.trim(), guest.token)) return guest.rowNumber;

  const fresh = await getGuestByToken(guest.token);
  if (!fresh) throw new Error("Guest no longer exists in the sheet");
  return fresh.rowNumber;
}

export async function saveRsvp(guest: Guest, rsvp: RsvpFields): Promise<Guest> {
  const row = await resolveRow(guest);
  const updated: Guest = {
    ...guest,
    rowNumber: row,
    status: rsvp.attending ? "attending" : "declined",
    confirmedGuests: rsvp.attending ? rsvp.guests : 0,
    attendeeNames: rsvp.attending ? rsvp.names : "",
    phone: rsvp.phone,
    comments: rsvp.message,
    confirmedAt: formatTimestamp(new Date()),
  };

  // status → confirmedAt are contiguous columns (F:K).
  await writeRange(`${columnLetter("status")}${row}:${columnLetter("confirmedAt")}${row}`, [
    [
      STATUS_LABELS[updated.status],
      updated.confirmedGuests,
      neutralizeFormula(updated.attendeeNames),
      updated.phone,
      neutralizeFormula(updated.comments),
      updated.confirmedAt,
    ],
  ]);

  return updated;
}

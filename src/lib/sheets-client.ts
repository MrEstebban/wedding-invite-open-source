/**
 * Minimal Google Sheets v4 REST client authenticated with a service account.
 * Intentionally free of `server-only` so `scripts/generate-tokens.ts` can reuse it;
 * the app only imports it from server code (`lib/guests.ts`).
 */
import { JWT } from "google-auth-library";

const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

type CellValue = string | number;

let client: JWT | undefined;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

function getClient(): JWT {
  client ??= new JWT({
    email: requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    // Hosting providers store the key on one line with literal "\n".
    key: requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: SCOPES,
  });
  return client;
}

function spreadsheetUrl(): string {
  return `${SHEETS_API}/${encodeURIComponent(requiredEnv("GOOGLE_SHEET_ID"))}`;
}

/** Prefixes an A1 range (e.g. "B5") with the configured tab name. */
function tabRange(a1: string): string {
  const tab = process.env.GOOGLE_SHEET_TAB || "Invitados";
  return `'${tab.replace(/'/g, "''")}'!${a1}`;
}

export async function readRange(a1: string): Promise<string[][]> {
  const response = await getClient().request<{ values?: string[][] }>({
    url: `${spreadsheetUrl()}/values/${encodeURIComponent(tabRange(a1))}`,
    params: { valueRenderOption: "FORMATTED_VALUE" },
  });
  return response.data.values ?? [];
}

/** RAW input: values are stored as literal text, so formulas are never evaluated. */
export async function writeRange(a1: string, values: CellValue[][]): Promise<void> {
  await getClient().request({
    url: `${spreadsheetUrl()}/values/${encodeURIComponent(tabRange(a1))}`,
    method: "PUT",
    params: { valueInputOption: "RAW" },
    data: { values },
  });
}

export async function batchWrite(updates: { range: string; values: CellValue[][] }[]): Promise<void> {
  await getClient().request({
    url: `${spreadsheetUrl()}/values:batchUpdate`,
    method: "POST",
    data: {
      valueInputOption: "RAW",
      data: updates.map(({ range, values }) => ({ range: tabRange(range), values })),
    },
  });
}

/**
 * Fills in missing tokens and personal links in the guest sheet.
 *
 *   npm run tokens                     # assign tokens to rows that don't have one
 *   npm run tokens -- --rotate=12,15   # revoke and regenerate the tokens of guests 12 and 15
 *
 * Reads credentials from .env.local (same variables as the app).
 */
import { loadEnvConfig } from "@next/env";
import { FIRST_DATA_ROW, LAST_COLUMN, columnIndex, columnLetter, type ColumnKey } from "../src/lib/guest";
import { batchWrite, readRange } from "../src/lib/sheets-client";
import { TOKEN_PATTERN, generateToken } from "../src/lib/token";

loadEnvConfig(process.cwd());

function parseRotateIds(argv: string[]): Set<string> {
  const flag = argv.find((arg) => arg.startsWith("--rotate="));
  return new Set(flag ? flag.slice("--rotate=".length).split(",").map((id) => id.trim()).filter(Boolean) : []);
}

async function main() {
  const baseUrl = process.env.PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (!baseUrl) throw new Error("Missing environment variable PUBLIC_BASE_URL");

  const rotateIds = parseRotateIds(process.argv.slice(2));
  const rows = await readRange(`A${FIRST_DATA_ROW}:${LAST_COLUMN}`);
  const cell = (row: string[], key: ColumnKey) => (row[columnIndex(key)] ?? "").trim();

  const seenTokens = new Set<string>();
  const seenIds = new Set<string>();
  const updates: { range: string; values: string[][] }[] = [];
  let created = 0;

  rows.forEach((row, index) => {
    const rowNumber = index + FIRST_DATA_ROW;
    const id = cell(row, "id");
    if (!id && !cell(row, "name")) return; // blank row

    if (!id) console.warn(`⚠ Fila ${rowNumber}: sin ID.`);
    else if (seenIds.has(id)) console.warn(`⚠ Fila ${rowNumber}: el ID "${id}" está duplicado.`);
    seenIds.add(id);

    let token = cell(row, "token");
    const needsToken = !TOKEN_PATTERN.test(token) || seenTokens.has(token) || rotateIds.has(id);
    if (needsToken) {
      token = generateToken();
      created++;
    }
    seenTokens.add(token);

    const link = `${baseUrl}/invite/${token}`;
    if (needsToken || cell(row, "link") !== link) {
      updates.push(
        { range: `${columnLetter("token")}${rowNumber}`, values: [[token]] },
        { range: `${columnLetter("link")}${rowNumber}`, values: [[link]] },
      );
    }
  });

  if (updates.length > 0) await batchWrite(updates);
  console.log(`✔ ${rows.length} filas revisadas · ${created} tokens nuevos · ${updates.length / 2} filas actualizadas.`);
}

main().catch((error) => {
  console.error("✖", error instanceof Error ? error.message : error);
  process.exit(1);
});

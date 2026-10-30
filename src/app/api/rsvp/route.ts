import { NextResponse } from "next/server";
import { formatDeadline, isRsvpOpen } from "@/lib/dates";
import { toPublicGuest } from "@/lib/guest";
import { getGuestByToken, saveRsvp } from "@/lib/guests";
import { validateRsvp, type RsvpResponse } from "@/lib/rsvp-schema";
import { isWellFormedToken } from "@/lib/token";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8_000;
const NOT_FOUND_MESSAGE = "No encontramos tu invitación. Revisa el enlace que recibiste.";

function reply(body: RsvpResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Browsers always send Origin on cross-site POSTs; reject anything not coming from this site. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return reply({ error: "Origen no permitido." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return reply({ error: "Formato no válido." }, 415);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply({ error: "Solicitud demasiado grande." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ error: "Formato no válido." }, 400);
  }
  if (typeof body !== "object" || body === null) return reply({ error: "Formato no válido." }, 400);

  const { token, website, ...fields } = body as Record<string, unknown>;

  // Honeypot: humans never fill the hidden "website" field. Pretend success so bots move on.
  if (typeof website === "string" && website.trim() !== "") return reply({ ok: true });

  if (!isWellFormedToken(token)) return reply({ error: NOT_FOUND_MESSAGE }, 404);
  if (!isRsvpOpen()) {
    return reply({ error: `El plazo para confirmar terminó el ${formatDeadline()}.` }, 403);
  }

  try {
    const guest = await getGuestByToken(token);
    if (!guest) return reply({ error: NOT_FOUND_MESSAGE }, 404);

    // The maximum always comes from the sheet, never from the client.
    const result = validateRsvp(fields, guest.maxGuests);
    if (!result.success) return reply({ error: "Revisa los campos marcados.", errors: result.errors }, 400);

    const updated = await saveRsvp(guest, result.data);
    return reply({ ok: true, guest: toPublicGuest(updated) });
  } catch (error) {
    console.error("[rsvp] failed to save response", error);
    return reply({ error: "No pudimos guardar tu respuesta. Inténtalo de nuevo en unos minutos." }, 500);
  }
}

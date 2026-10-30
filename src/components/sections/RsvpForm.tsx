"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { peopleLabel, STATUS_LABELS, type PublicGuest } from "@/lib/guest";
import { validateRsvp, type RsvpField, type RsvpFieldErrors, type RsvpResponse } from "@/lib/rsvp-schema";

type Choice = "" | "yes" | "no";

type SubmitState = { kind: "idle" } | { kind: "submitting" } | { kind: "success" } | { kind: "error"; message: string };

interface RsvpFormProps {
  token: string;
  guest: PublicGuest;
  /** Whether the deadline has not passed yet (decided on the server). */
  open: boolean;
  deadline: string;
}

const FIELD_CLASS =
  "w-full rounded-lg bg-taupe/60 px-4 py-3 font-sans text-sm text-ink outline-none ring-sage placeholder:text-ink-soft/70 focus:ring-2 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-700/60";

function initialChoice(guest: PublicGuest): Choice {
  if (guest.status === "attending") return "yes";
  if (guest.status === "declined") return "no";
  return "";
}

function describeResponse(guest: PublicGuest): string {
  return guest.status === "attending"
    ? `${STATUS_LABELS.attending} · ${peopleLabel(guest.confirmedGuests)}`
    : STATUS_LABELS[guest.status];
}

function Field({ id, label, error, children }: { id: RsvpField; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="text-left">
      <label htmlFor={id} className="mb-1.5 block font-sans text-xs tracking-wide text-ink-soft">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 font-sans text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria props linking an input to its error message. */
function errorProps(id: RsvpField, errors: RsvpFieldErrors) {
  return errors[id] ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};
}

export function RsvpForm({ token, guest: initialGuest, open, deadline }: RsvpFormProps) {
  const [guest, setGuest] = useState(initialGuest);
  const [choice, setChoice] = useState<Choice>(() => initialChoice(initialGuest));
  // Clamp in case the couple lowered the maximum after the guest answered.
  const [guests, setGuests] = useState(
    Math.min(initialGuest.confirmedGuests || initialGuest.maxGuests, initialGuest.maxGuests),
  );
  const [names, setNames] = useState(initialGuest.attendeeNames);
  const [phone, setPhone] = useState(initialGuest.phone);
  const [message, setMessage] = useState(initialGuest.comments);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<RsvpFieldErrors>({});
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const responded = guest.status !== "pending";
  const seats = guest.maxGuests;

  if (!open) {
    return (
      <div className="mt-8 space-y-3 text-lg text-ink-soft">
        <p>El plazo para confirmar terminó el {deadline}.</p>
        {responded ? (
          <p>
            Tu respuesta: <strong className="font-semibold text-ink">{describeResponse(guest)}</strong>
          </p>
        ) : (
          <p>Si necesitas ayuda, comunícate directamente con los novios.</p>
        )}
      </div>
    );
  }

  if (state.kind === "success") {
    return (
      <div role="status" className="mt-8 space-y-4">
        {guest.status === "attending" ? (
          <>
            <p className="font-script text-4xl text-sage-dark">¡Gracias!</p>
            <p className="text-lg">
              Confirmaste la asistencia de {peopleLabel(guest.confirmedGuests)}. ¡Nos vemos pronto!
            </p>
          </>
        ) : (
          <>
            <p className="font-script text-4xl text-sage-dark">Te extrañaremos</p>
            <p className="text-lg">Gracias por avisarnos. Te tendremos presente en este día tan especial.</p>
          </>
        )}
        <p className="font-sans text-xs text-ink-soft">Puedes modificar tu respuesta hasta el {deadline}.</p>
        <button
          type="button"
          onClick={() => setState({ kind: "idle" })}
          className="font-sans text-sm text-sage-dark underline underline-offset-4"
        >
          Modificar respuesta
        </button>
      </div>
    );
  }

  async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    if (choice === "") {
      setErrors({ attending: "Cuéntanos si podrás acompañarnos." });
      return;
    }

    const attending = choice === "yes";
    const result = validateRsvp({ attending, guests: attending ? guests : 0, names, phone, message }, seats);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setState({ kind: "submitting" });
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, website, ...result.data }),
      });
      const body = (await response.json().catch(() => ({}))) as RsvpResponse;

      if (response.ok && body.guest) {
        setGuest(body.guest);
        setState({ kind: "success" });
        return;
      }
      if (body.errors) setErrors(body.errors);
      setState({ kind: "error", message: body.error ?? "No pudimos guardar tu respuesta. Inténtalo de nuevo." });
    } catch {
      setState({ kind: "error", message: "Sin conexión. Revisa tu internet e inténtalo de nuevo." });
    }
  }

  const submitting = state.kind === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="relative mt-8 space-y-4">
      <p className="text-lg text-ink-soft">
        Hemos reservado {seats} {seats === 1 ? "lugar" : "lugares"} en tu honor.
      </p>
      {responded && (
        <p className="rounded-lg bg-sage-light/40 px-4 py-3 font-sans text-xs text-sage-dark">
          Ya recibimos tu respuesta ({describeResponse(guest)}). Puedes actualizarla hasta el {deadline}.
        </p>
      )}

      <Field id="attending" label="Confirmación" error={errors.attending}>
        <select
          id="attending"
          value={choice}
          onChange={(e) => setChoice(e.target.value as Choice)}
          className={FIELD_CLASS}
          {...errorProps("attending", errors)}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          <option value="yes">Sí, asistiré</option>
          <option value="no">No podré asistir</option>
        </select>
      </Field>

      {choice === "yes" && (
        <>
          <Field id="guests" label="Número de asistentes" error={errors.guests}>
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className={FIELD_CLASS}
              {...errorProps("guests", errors)}
            >
              {Array.from({ length: seats }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>
                  {peopleLabel(count)}
                </option>
              ))}
            </select>
          </Field>

          <Field id="names" label="Nombre de los asistentes" error={errors.names}>
            <input
              id="names"
              type="text"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder={seats > 1 ? "Ej. Ana Pérez, Luis Pérez" : "Tu nombre completo"}
              autoComplete="name"
              maxLength={300}
              className={FIELD_CLASS}
              {...errorProps("names", errors)}
            />
          </Field>
        </>
      )}

      <Field id="phone" label="Teléfono (opcional)" error={errors.phone}>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          maxLength={25}
          className={FIELD_CLASS}
          {...errorProps("phone", errors)}
        />
      </Field>

      <Field id="message" label="Mensaje para los novios (opcional)" error={errors.message}>
        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          className={`${FIELD_CLASS} resize-none`}
          {...errorProps("message", errors)}
        />
      </Field>

      {/* Honeypot: invisible to people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">No completes este campo</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {state.kind === "error" && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 font-sans text-sm text-red-800">
          {state.message}
        </p>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-sage-dark px-8 py-3 font-sans text-sm text-cream transition hover:bg-sage disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Enviando…" : responded ? "Actualizar respuesta" : "Enviar"}
        </button>
      </div>
    </form>
  );
}

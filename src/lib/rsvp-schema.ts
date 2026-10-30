import { z } from "zod";
import type { PublicGuest } from "@/lib/guest";

/** Shared by the RSVP form (instant feedback) and the API route (source of truth). */

const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/;

export const rsvpFieldsSchema = z.object({
  attending: z.boolean(),
  guests: z.number().int().min(0),
  names: z.string().trim().max(300, "Máximo 300 caracteres."),
  phone: z
    .string()
    .trim()
    .max(25, "El teléfono es demasiado largo.")
    .refine((value) => value === "" || PHONE_PATTERN.test(value), "Introduce un teléfono válido."),
  message: z.string().trim().max(1000, "Máximo 1000 caracteres."),
});

export type RsvpFields = z.infer<typeof rsvpFieldsSchema>;
export type RsvpField = keyof RsvpFields;
export type RsvpFieldErrors = Partial<Record<RsvpField, string>>;

export interface RsvpResponse {
  ok?: boolean;
  guest?: PublicGuest;
  error?: string;
  errors?: RsvpFieldErrors;
}

type ValidationResult = { success: true; data: RsvpFields } | { success: false; errors: RsvpFieldErrors };

function isRsvpField(key: PropertyKey | undefined): key is RsvpField {
  return typeof key === "string" && key in rsvpFieldsSchema.shape;
}

export function validateRsvp(input: unknown, maxGuests: number): ValidationResult {
  const parsed = rsvpFieldsSchema.safeParse(input);
  if (!parsed.success) {
    const errors: RsvpFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (isRsvpField(key) && !errors[key]) errors[key] = issue.message;
    }
    return { success: false, errors };
  }

  const data = parsed.data;
  if (!data.attending) {
    return { success: true, data: { ...data, guests: 0, names: "" } };
  }

  const errors: RsvpFieldErrors = {};
  if (data.guests < 1) {
    errors.guests = "Indica cuántas personas asistirán.";
  } else if (data.guests > maxGuests) {
    errors.guests =
      maxGuests === 1
        ? "Tu invitación es para 1 persona."
        : `Tu invitación permite un máximo de ${maxGuests} personas.`;
  }
  if (!data.names) errors.names = "Indica el nombre de los asistentes.";

  return Object.keys(errors).length > 0 ? { success: false, errors } : { success: true, data };
}

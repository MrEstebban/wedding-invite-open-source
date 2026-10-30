import { randomBytes, timingSafeEqual } from "node:crypto";

/** 16 random bytes encoded as base64url = 22 characters, 128 bits of entropy. */
export const TOKEN_PATTERN = /^[A-Za-z0-9_-]{22}$/;

export function generateToken(): string {
  return randomBytes(16).toString("base64url");
}

/** Cheap format check so malformed URLs never reach Google Sheets. */
export function isWellFormedToken(value: unknown): value is string {
  return typeof value === "string" && TOKEN_PATTERN.test(value);
}

export function tokensMatch(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

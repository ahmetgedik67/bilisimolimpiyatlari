import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string) {
  return /^[a-z0-9][a-z0-9._-]{2,47}$/.test(value);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, salt, expectedHex] = encoded.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;
  const actual = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function localOpenId(username: string) {
  return `local:${normalizeUsername(username)}`;
}

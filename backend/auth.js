// Pure logic: validation and password hashing. No HTTP and no database code here.
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
export const MIN_PASSWORD_LENGTH = 8;

export class AuthError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export const normalize = (username) => String(username ?? "").trim().toLowerCase();

export function validateUsername(username) {
  if (!USERNAME_RE.test(username)) {
    throw new AuthError("Username must be 3-20 characters: letters, digits or underscore");
  }
}

export function validatePassword(password) {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    throw new AuthError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (!/\d/.test(password)) {
    throw new AuthError("Password must contain at least one digit");
  }
}

// Returns "salt$hash" (both hex), using scrypt.
export async function hashPassword(password, salt = randomBytes(16)) {
  const hash = await scryptAsync(password, salt, 32);
  return `${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split("$");
  const hash = await scryptAsync(password, Buffer.from(saltHex, "hex"), 32);
  return timingSafeEqual(hash, Buffer.from(hashHex, "hex"));
}

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import type { PasswordVerifier } from "../application/password-verifier";

const scrypt = promisify(scryptCallback);

export class ScryptPasswordService implements PasswordVerifier {
  async hash(password: string) {
    const salt = randomBytes(16).toString("hex");
    const key = (await scrypt(password, salt, 64)) as Buffer;

    return `scrypt:${salt}:${key.toString("hex")}`;
  }
  async verify(password: string, encoded: string) {
    const [algorithm, salt, hex] = encoded.split(":");

    if (algorithm !== "scrypt" || !salt || !hex) return false;

    const expected = Buffer.from(hex, "hex");
    const actual = (await scrypt(password, salt, expected.length)) as Buffer;

    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
}

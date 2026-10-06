import "server-only";

import { jwtVerify, SignJWT } from "jose";

import type { SessionUser, UserRole } from "../domain/user";

export const sessionCookieName = "rahro_session";
const secret = () => {
  const value = process.env.AUTH_SECRET;

  if (value) return new TextEncoder().encode(value);
  if (process.env.NODE_ENV !== "production")
    return new TextEncoder().encode("rahro-development-secret-change-before-production");

  throw new Error("AUTH_SECRET is required in production");
};

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({ email: user.email, name: user.displayName, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function verifySessionToken(token?: string): Promise<SessionUser | undefined> {
  if (!token) return;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });

    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.role !== "string"
    )
      return;

    return {
      id: payload.sub,
      email: payload.email,
      displayName: payload.name,
      role: payload.role as UserRole,
    };
  } catch {
    return undefined;
  }
}

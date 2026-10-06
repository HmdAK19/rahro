import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { SessionUser, UserRole } from "../domain/user";

import { sessionCookieName, verifySessionToken } from "./session";

const permissions: Record<UserRole, readonly string[]> = {
  admin: ["read", "manage"],
  operations_manager: ["read", "manage"],
  dispatcher: ["read", "manage"],
  viewer: ["read"],
};

export async function getPageSession(locale: string) {
  const user = await verifySessionToken((await cookies()).get(sessionCookieName)?.value);

  if (!user) redirect(`/${locale}/login`);

  return user;
}

export async function authorizeRequest(
  request: Request,
  permission: "read" | "manage",
): Promise<SessionUser | Response> {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookieName}=`))
    ?.slice(sessionCookieName.length + 1);
  const user = await verifySessionToken(token);

  if (!user) return Response.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  if (!permissions[user.role].includes(permission))
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });

  return user;
}

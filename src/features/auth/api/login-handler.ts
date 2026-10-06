import { NextResponse } from "next/server";
import * as yup from "yup";

import { InvalidCredentialsError } from "../application/authenticate-user";
import { loginSchema } from "../domain/login-schema";
import { getAuthContainer } from "../server/container";
import { createSessionToken, sessionCookieName } from "../server/session";

export async function loginResponse(request: Request) {
  try {
    const body = await loginSchema.validate(await request.json(), {
      abortEarly: false,
      strict: true,
    });

    const user = await getAuthContainer().authenticate.execute(body.email, body.password);
    const response = NextResponse.json({ user });
    response.cookies.set(sessionCookieName, await createSessionToken(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    if (error instanceof yup.ValidationError)
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });

    return NextResponse.json(
      { error: error instanceof InvalidCredentialsError ? error.message : "AUTHENTICATION_FAILED" },
      { status: error instanceof InvalidCredentialsError ? 401 : 500 },
    );
  }
}

export function logoutResponse() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

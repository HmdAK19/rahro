import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale, locales } from "@/core/i18n/config";

function preferredLocale(request: NextRequest) {
  const language = request.headers.get("accept-language")?.toLowerCase() ?? "";

  return language.includes("fa") ? "fa" : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"] };

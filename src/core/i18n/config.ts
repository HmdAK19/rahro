export const locales = ["fa", "en"] as const;

export type Locale = (typeof locales)[number];

export type Direction = "rtl" | "ltr";

export const defaultLocale: Locale = "fa";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function getDirection(locale: Locale): Direction {
  return locale === "fa" ? "rtl" : "ltr";
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "fa" ? "en" : "fa";
}

import type { Locale } from "./config";

const localeTags: Record<Locale, string> = { fa: "fa-IR", en: "en-US" };

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeTags[locale]).format(value);
}

export function formatTime(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTags[locale], { hour: "2-digit", minute: "2-digit" }).format(
    new Date(value),
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDirection, isLocale, locales } from "@/core/i18n/config";
import { ThemeRegistry } from "@/core/theme/theme-registry";

import "../globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

export const metadata: Metadata = {
  title: "راهرو | Rahro",
  description: "سامانه مدیریت هوشمند ناوگان و مرسوله",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={getDirection(locale)}>
      <body>
        <ThemeRegistry locale={locale}>{children}</ThemeRegistry>
      </body>
    </html>
  );
}

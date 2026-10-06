"use client";

import { type PropsWithChildren, useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

import { getDirection, type Locale } from "@/core/i18n/config";

import { createAppTheme } from "./create-app-theme";

export function ThemeRegistry({ children, locale }: PropsWithChildren<{ locale: Locale }>) {
  const direction = getDirection(locale);
  const theme = useMemo(() => createAppTheme(locale, direction), [direction, locale]);
  const options = useMemo(
    () => ({
      key: direction === "rtl" ? "mui-rtl" : "mui",
      stylisPlugins: direction === "rtl" ? [prefixer, rtlPlugin] : [prefixer],
    }),
    [direction],
  );

  return (
    <AppRouterCacheProvider options={options}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

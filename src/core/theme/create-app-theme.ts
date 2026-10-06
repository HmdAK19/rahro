import { createTheme } from "@mui/material/styles";

import type { Direction, Locale } from "@/core/i18n/config";

import { tokens } from "./tokens";

export function createAppTheme(locale: Locale, direction: Direction) {
  return createTheme({
    direction,
    cssVariables: true,
    palette: {
      mode: "light",
      primary: { main: tokens.color.primary, dark: tokens.color.primaryDark },
      secondary: { main: tokens.color.accent },
      background: { default: tokens.color.background, paper: tokens.color.surface },
      text: { primary: tokens.color.text, secondary: tokens.color.muted },
      divider: tokens.color.divider,
      warning: { main: tokens.color.warning },
      error: { main: tokens.color.error },
    },
    shape: { borderRadius: tokens.radius.md },
    typography: {
      fontFamily:
        locale === "fa" ? 'Tahoma, "Segoe UI", sans-serif' : 'Inter, "Segoe UI", sans-serif',
      fontSize: 15,
      htmlFontSize: 16,
      h1: {
        fontSize: "clamp(1.5rem, 2vw, 1.875rem)",
        lineHeight: 1.35,
        fontWeight: 800,
        letterSpacing: "-0.02em",
      },
      h2: { fontSize: "1.125rem", lineHeight: 1.5, fontWeight: 800 },
      h5: { fontSize: "1.75rem", lineHeight: 1.25, fontWeight: 900 },
      body1: { fontSize: "1rem", lineHeight: 1.75 },
      body2: { fontSize: ".9375rem", lineHeight: 1.7 },
      caption: { fontSize: ".8125rem", lineHeight: 1.6 },
      button: { fontSize: ".875rem", lineHeight: 1.5, fontWeight: 700, textTransform: "none" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { minHeight: "100vh" },
          "*": { boxSizing: "border-box" },
          a: { color: "inherit", textDecoration: "none" },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiCard: {
        styleOverrides: {
          root: { border: `1px solid ${tokens.color.divider}`, boxShadow: "none" },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: tokens.radius.sm, minHeight: 44, paddingInline: 16 },
          sizeSmall: { minHeight: 36, paddingInline: 12 },
        },
      },
      MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
      MuiInputBase: {
        styleOverrides: {
          root: { minHeight: 44, fontSize: ".9375rem" },
          input: { paddingBlock: 10 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { minHeight: 28, fontSize: ".8125rem", fontWeight: 700 },
          sizeSmall: { minHeight: 26 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { padding: "15px 18px", fontSize: ".875rem", lineHeight: 1.55 },
          head: {
            color: tokens.color.muted,
            fontSize: ".8125rem",
            fontWeight: 700,
            backgroundColor: "#F8FAF8",
          },
        },
      },
      MuiListItemButton: { styleOverrides: { root: { minHeight: 48 } } },
      MuiCardContent: {
        styleOverrides: { root: { padding: 20, "&:last-child": { paddingBottom: 20 } } },
      },
    },
  });
}

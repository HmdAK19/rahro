import type { SxProps, Theme } from "@mui/material";

export const authStyles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    p: 2,
    background: "radial-gradient(circle at top, #E7F4EC, #F5F7F5 55%)",
  } satisfies SxProps<Theme>,
  form: {
    width: "100%",
    maxWidth: 440,
    p: { xs: 3, sm: 5 },
    borderRadius: 4,
  } satisfies SxProps<Theme>,
  icon: { fontSize: 42 } satisfies SxProps<Theme>,
} as const;

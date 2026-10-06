import type { SxProps, Theme } from "@mui/material";

export const trackingStyles = {
  page: { py: { xs: 3, md: 6 } } satisfies SxProps<Theme>,
  liveError: { mb: 2 } satisfies SxProps<Theme>,
  hero: {
    bgcolor: "primary.dark",
    color: "white",
    borderRadius: { xs: 3, md: 5 },
    p: { xs: 3, md: 5 },
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    gap: 3,
    alignItems: { sm: "center" },
  } satisfies SxProps<Theme>,
  heroLabel: { color: "rgba(255,255,255,.65)" } satisfies SxProps<Theme>,
  heroMessage: { color: "rgba(255,255,255,.78)" } satisfies SxProps<Theme>,
  eta: { fontWeight: 800, p: 1 } satisfies SxProps<Theme>,
  content: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1.4fr .8fr" },
    gap: 2,
    mt: 2,
  } satisfies SxProps<Theme>,
  mapAlert: {
    position: "absolute",
    zIndex: 2,
    insetInline: 12,
    insetBlockStart: 12,
  } satisfies SxProps<Theme>,
  mapBadge: {
    position: "absolute",
    zIndex: 2,
    insetInlineEnd: 12,
    insetBlockStart: 12,
    fontWeight: 800,
  } satisfies SxProps<Theme>,
} as const;

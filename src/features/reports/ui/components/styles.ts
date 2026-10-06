import type { SxProps, Theme } from "@mui/material";

export const reportStyles = {
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", xl: "repeat(4,1fr)" },
    gap: 2,
    mb: 2,
  } satisfies SxProps<Theme>,
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", lg: "1fr 1.4fr" },
    gap: 2,
    mb: 2,
  } satisfies SxProps<Theme>,
  progress: { height: 8, borderRadius: 5 } satisfies SxProps<Theme>,
} as const;

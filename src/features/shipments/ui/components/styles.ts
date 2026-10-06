import type { SxProps, Theme } from "@mui/material";

export const shipmentStyles = {
  count: { ms: 1 } satisfies SxProps<Theme>,
  empty: { m: 2.5 } satisfies SxProps<Theme>,
  table: { minWidth: 980 } satisfies SxProps<Theme>,
  driverAvatar: { width: 34, height: 34, fontSize: 14 } satisfies SxProps<Theme>,
  dialogActions: { p: 2.5 } satisfies SxProps<Theme>,
} as const;

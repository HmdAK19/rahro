import type { SxProps, Theme } from "@mui/material";

export const fleetStyles = {
  map: {
    height: { xs: 320, md: 380 },
    position: "relative",
    bgcolor: "#EEF2EB",
    overflow: "hidden",
    backgroundImage:
      "linear-gradient(30deg, transparent 46%, rgba(255,255,255,.9) 47%, rgba(255,255,255,.9) 51%, transparent 52%), linear-gradient(-25deg, transparent 48%, rgba(255,255,255,.65) 49%, rgba(255,255,255,.65) 52%, transparent 53%)",
    backgroundSize: "170px 100px, 220px 130px",
  } satisfies SxProps<Theme>,
  marker: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    minWidth: 42,
    width: 42,
    height: 42,
    fontSize: 15,
    fontWeight: 800,
    borderRadius: "50% 50% 50% 10%",
    bgcolor: "background.paper",
    boxShadow: 3,
    p: 0,
    "&.selected": { outline: "5px solid rgba(255,255,255,.75)" },
  } satisfies SxProps<Theme>,
  legend: {
    position: "absolute",
    insetBlockEnd: 14,
    insetInlineStart: 16,
    bgcolor: "rgba(255,255,255,.94)",
    borderRadius: 2,
    px: 1.5,
    py: 1,
    display: "flex",
    gap: 2,
  } satisfies SxProps<Theme>,
  mapAlert: {
    position: "absolute",
    zIndex: 3,
    insetInline: 12,
    insetBlockStart: 12,
  } satisfies SxProps<Theme>,
  count: { ms: 1 } satisfies SxProps<Theme>,
  table: { minWidth: 800 } satisfies SxProps<Theme>,
  tableAvatar: { width: 36, height: 36 } satisfies SxProps<Theme>,
  popover: {
    position: "fixed",
    insetBlockEnd: 24,
    insetInlineEnd: 24,
    zIndex: 30,
    borderRadius: 3,
    p: 2,
    pe: 6,
    display: "flex",
    gap: 1.5,
    alignItems: "center",
    maxWidth: { xs: "calc(100vw - 100px)", sm: 440 },
  } satisfies SxProps<Theme>,
  popoverClose: {
    position: "absolute",
    insetInlineEnd: 6,
    insetBlockStart: 6,
  } satisfies SxProps<Theme>,
  popoverAvatar: {
    width: 44,
    height: 44,
    bgcolor: "success.light",
    color: "success.dark",
  } satisfies SxProps<Theme>,
  dialogActions: { p: 2.5 } satisfies SxProps<Theme>,
} as const;

export const createLegendDotStyle = (color: string): SxProps<Theme> => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  bgcolor: color,
});

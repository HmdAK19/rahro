import type { SxProps, Theme } from "@mui/material";

export const dashboardStyles = {
  layout: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: { xs: "76px minmax(0, 1fr)", md: "260px minmax(0, 1fr)" },
  } satisfies SxProps<Theme>,
  content: {
    p: { xs: 1.5, sm: 3, lg: 4 },
    minWidth: 0,
    width: "100%",
    maxWidth: 1720,
  } satisfies SxProps<Theme>,
  metrics: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" },
    gap: 2,
  } satisfies SxProps<Theme>,
  workspace: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", lg: "minmax(520px, 1.65fr) minmax(330px, .75fr)" },
    gap: 2,
  } satisfies SxProps<Theme>,
  sidebar: {
    bgcolor: "primary.dark",
    color: "common.white",
    minHeight: "100vh",
    position: "sticky",
    top: 0,
    height: "100vh",
    p: { xs: 1, md: 2.5 },
    display: "flex",
    flexDirection: "column",
  } satisfies SxProps<Theme>,
  brandAvatar: {
    width: 44,
    height: 44,
    bgcolor: "secondary.main",
    color: "primary.dark",
    fontSize: 18,
    fontWeight: 900,
  } satisfies SxProps<Theme>,
  desktopOnly: { display: { xs: "none", md: "block" } } satisfies SxProps<Theme>,
  sidebarCaption: { color: "rgba(255,255,255,.65)" } satisfies SxProps<Theme>,
  navList: { mt: 2.5 } satisfies SxProps<Theme>,
  navItem: {
    minHeight: 50,
    borderRadius: 2.5,
    mb: 0.75,
    color: "rgba(255,255,255,.74)",
    "&.Mui-selected": { bgcolor: "rgba(255,255,255,.10)", color: "white" },
  } satisfies SxProps<Theme>,
  navIcon: { color: "inherit", minWidth: { xs: 0, md: 44 } } satisfies SxProps<Theme>,
  sidebarFooter: { mt: "auto" } satisfies SxProps<Theme>,
  settingsItem: {
    minHeight: 50,
    borderRadius: 2.5,
    color: "rgba(255,255,255,.74)",
  } satisfies SxProps<Theme>,
  sidebarDivider: { borderColor: "rgba(255,255,255,.14)", my: 2 } satisfies SxProps<Theme>,
  userAvatar: { width: 42, height: 42 } satisfies SxProps<Theme>,
  userRole: { color: "rgba(255,255,255,.6)" } satisfies SxProps<Theme>,
  headerActions: { width: { xs: "100%", md: "auto" } } satisfies SxProps<Theme>,
  search: { flex: { xs: 1, md: "initial" }, width: { md: 320 } } satisfies SxProps<Theme>,
  newShipment: { display: { xs: "none", sm: "inline-flex" } } satisfies SxProps<Theme>,
  activityItem: { py: 1.1, px: 2.5, gap: 1.25 } satisfies SxProps<Theme>,
  simulatorCaption: { color: "rgba(255,255,255,.68)" } satisfies SxProps<Theme>,
  metricContent: { minHeight: 124, display: "flex", alignItems: "center" } satisfies SxProps<Theme>,
  connectionDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    bgcolor: "currentColor",
  } satisfies SxProps<Theme>,
} as const;

export const createActivityDotStyle = (color: string): SxProps<Theme> => ({
  width: 11,
  height: 11,
  borderRadius: "50%",
  bgcolor: color,
  flex: "0 0 auto",
});

export const createMetricIconStyle = (color: string): SxProps<Theme> => ({
  width: 48,
  height: 48,
  bgcolor: color,
  color: "white",
});

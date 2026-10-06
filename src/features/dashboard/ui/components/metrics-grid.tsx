import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import ScheduleRounded from "@mui/icons-material/ScheduleRounded";
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";

import type { Dictionary } from "@/core/i18n/dictionaries";

import { createMetricIconStyle, dashboardStyles } from "./styles";

export function MetricsGrid({ dictionary }: { dictionary: Dictionary }) {
  const metrics = [
    {
      label: dictionary.metrics.today,
      value: "۱۸۴",
      hint: dictionary.metrics.versusYesterday,
      icon: Inventory2Rounded,
      color: "secondary.main",
    },
    {
      label: dictionary.metrics.activeDrivers,
      value: "۲۸",
      hint: dictionary.metrics.outOfDrivers,
      icon: LocalShippingRounded,
      color: "success.main",
    },
    {
      label: dictionary.metrics.inTransit,
      value: "۴۷",
      hint: dictionary.metrics.averageTime,
      icon: ScheduleRounded,
      color: "warning.main",
    },
    {
      label: dictionary.metrics.attention,
      value: "۶",
      hint: dictionary.metrics.delayedCases,
      icon: ErrorOutlineRounded,
      color: "error.main",
    },
  ] as const;

  return (
    <Stack component="section" aria-label="metrics" sx={dashboardStyles.metrics}>
      {metrics.map(({ label, value, hint, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent sx={dashboardStyles.metricContent}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Avatar variant="rounded" sx={createMetricIconStyle(color)}>
                <Icon fontSize="medium" />
              </Avatar>
              <Stack gap={0.25}>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="h5">{value}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {hint}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

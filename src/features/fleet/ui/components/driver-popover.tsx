import CloseRounded from "@mui/icons-material/CloseRounded";
import { Avatar, IconButton, Paper, Stack, Typography } from "@mui/material";

import type { Locale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/dictionaries";
import { formatTime } from "@/core/i18n/formatters";

import type { Driver } from "../../domain/driver";

import { fleetStyles } from "./styles";

export function DriverPopover({
  driver,
  locale,
  dictionary,
  onClose,
}: {
  driver: Driver;
  locale: Locale;
  dictionary: Dictionary;
  onClose(): void;
}) {
  return (
    <Paper elevation={8} sx={fleetStyles.popover}>
      <IconButton
        size="small"
        aria-label={dictionary.common.close}
        onClick={onClose}
        sx={fleetStyles.popoverClose}
      >
        <CloseRounded fontSize="small" />
      </IconButton>
      <Avatar sx={fleetStyles.popoverAvatar}>{driver.name[0]}</Avatar>
      <Stack>
        <Typography variant="body1" fontWeight={800}>
          {driver.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {driver.vehicle} · {driver.plate}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {dictionary.fleet.lastLocation}: {formatTime(driver.updatedAt, locale)} ·{" "}
          {driver.source === "gps" ? dictionary.fleet.realGps : dictionary.fleet.simulator}
        </Typography>
      </Stack>
    </Paper>
  );
}

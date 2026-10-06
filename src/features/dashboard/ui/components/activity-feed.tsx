"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import type { Dictionary } from "@/core/i18n/dictionaries";
import { NavigationPendingIndicator } from "@/core/ui/navigation-pending-indicator";
import { SectionCard } from "@/core/ui/section-card";

import { createActivityDotStyle, dashboardStyles } from "./styles";

export function ActivityFeed({
  isSimulating,
  onToggleSimulation,
  dictionary,
}: {
  isSimulating: boolean;
  onToggleSimulation(): void;
  dictionary: Dictionary;
}) {
  const { locale } = useParams<{ locale: string }>();
  const events = [
    {
      title: dictionary.activity.delivered,
      detail: dictionary.activity.deliveredDetail,
      color: "success.main",
    },
    {
      title: dictionary.activity.delayed,
      detail: dictionary.activity.delayedDetail,
      color: "warning.main",
    },
    {
      title: dictionary.activity.online,
      detail: dictionary.activity.onlineDetail,
      color: "secondary.dark",
    },
    {
      title: dictionary.activity.registered,
      detail: dictionary.activity.registeredDetail,
      color: "text.disabled",
    },
  ] as const;

  return (
    <SectionCard>
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={2.5} py={2}>
        <Stack direction="row" gap={1}>
          <Typography variant="h2">{dictionary.activity.title}</Typography>
          <Chip label={dictionary.activity.realtime} size="small" color="success" />
        </Stack>
        <Button component={Link} href={`/${locale}/activity`} size="small" sx={{ gap: 0.75 }}>
          {dictionary.activity.viewAll}
          <NavigationPendingIndicator label={dictionary.common.loading} />
        </Button>
      </Stack>
      <Divider />
      <List disablePadding>
        {events.map((event, index) => (
          <ListItem key={event.title} sx={dashboardStyles.activityItem}>
            <Box sx={createActivityDotStyle(event.color)} />
            <ListItemText
              primary={event.title}
              secondary={`${event.detail} · ${dictionary.activity.times[index]}`}
              slotProps={{
                primary: { sx: { fontSize: 14, lineHeight: 1.55, fontWeight: 700 } },
                secondary: { sx: { fontSize: 12, lineHeight: 1.55, mt: 0.25 } },
              }}
            />
          </ListItem>
        ))}
      </List>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="primary.dark"
        color="white"
        m={2}
        p={1.5}
        borderRadius={2.5}
        gap={1}
      >
        <Stack>
          <Typography variant="body2" fontWeight={800}>
            {dictionary.fleet.simulatorTitle}
          </Typography>
          <Typography variant="caption" sx={dashboardStyles.simulatorCaption}>
            {dictionary.fleet.simulatorSubtitle}
          </Typography>
        </Stack>
        <Button size="small" color="secondary" variant="contained" onClick={onToggleSimulation}>
          {isSimulating ? dictionary.fleet.stop : dictionary.fleet.start}
        </Button>
      </Stack>
    </SectionCard>
  );
}

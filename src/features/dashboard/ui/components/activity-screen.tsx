import { Box, Chip, Divider, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

import type { Dictionary } from "@/core/i18n/dictionaries";
import { SectionCard } from "@/core/ui/section-card";

import { createActivityDotStyle, dashboardStyles } from "./styles";

export function ActivityScreen({ dictionary }: { dictionary: Dictionary }) {
  const events = [
    {
      title: dictionary.activity.delivered,
      detail: dictionary.activity.deliveredDetail,
      time: dictionary.activity.times[0],
      color: "success.main",
    },
    {
      title: dictionary.activity.delayed,
      detail: dictionary.activity.delayedDetail,
      time: dictionary.activity.times[1],
      color: "warning.main",
    },
    {
      title: dictionary.activity.online,
      detail: dictionary.activity.onlineDetail,
      time: dictionary.activity.times[2],
      color: "secondary.dark",
    },
    {
      title: dictionary.activity.registered,
      detail: dictionary.activity.registeredDetail,
      time: dictionary.activity.times[3],
      color: "text.disabled",
    },
  ] as const;

  return (
    <>
      <Stack direction="row" alignItems="center" gap={1} mb={3}>
        <Typography component="h1" variant="h1">
          {dictionary.activity.title}
        </Typography>
        <Chip label={dictionary.activity.realtime} size="small" color="success" />
      </Stack>
      <SectionCard>
        <List disablePadding>
          {events.map((event, index) => (
            <Box key={event.title}>
              {index > 0 && <Divider />}
              <ListItem sx={{ ...dashboardStyles.activityItem, py: 2 }}>
                <Box sx={createActivityDotStyle(event.color)} />
                <ListItemText
                  primary={event.title}
                  secondary={`${event.detail} · ${event.time}`}
                  slotProps={{
                    primary: { sx: { fontSize: 15, lineHeight: 1.55, fontWeight: 800 } },
                    secondary: { sx: { fontSize: 13, lineHeight: 1.7, mt: 0.5 } },
                  }}
                />
              </ListItem>
            </Box>
          ))}
        </List>
      </SectionCard>
    </>
  );
}

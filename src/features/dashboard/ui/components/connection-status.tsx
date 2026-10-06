import { Box, Stack, Typography } from "@mui/material";

import type { Dictionary } from "@/core/i18n/dictionaries";

import { dashboardStyles } from "./styles";

export function ConnectionStatus({
  status,
  dictionary,
}: {
  status: "connected" | "reconnecting";
  dictionary: Dictionary;
}) {
  const color = status === "connected" ? "success.main" : "warning.main";

  return (
    <Stack direction="row" alignItems="center" gap={0.75} mb={1.5} color={color}>
      <Box sx={dashboardStyles.connectionDot} />
      <Typography variant="caption">{dictionary.connection[status]}</Typography>
    </Stack>
  );
}

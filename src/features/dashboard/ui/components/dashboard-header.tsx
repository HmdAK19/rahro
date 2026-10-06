import { useRouter } from "next/navigation";
import AddRounded from "@mui/icons-material/AddRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import NotificationsNoneRounded from "@mui/icons-material/NotificationsNoneRounded";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import type { Locale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/dictionaries";

import { LanguageSwitcher } from "./language-switcher";
import { dashboardStyles } from "./styles";

export function DashboardHeader({
  onNewShipment,
  locale,
  dictionary,
}: {
  onNewShipment(): void;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace(`/${locale}/login`);
    router.refresh();
  };

  return (
    <Stack
      component="header"
      direction={{ xs: "column", md: "row" }}
      alignItems={{ md: "center" }}
      justifyContent="space-between"
      gap={2.5}
      mb={2.5}
    >
      <Box>
        <Typography variant="h1">{dictionary.header.greeting} 👋</Typography>
        <Typography variant="body1" color="text.secondary" mt={0.25}>
          {dictionary.header.subtitle}
        </Typography>
      </Box>
      <Stack direction="row" gap={1} alignItems="center" sx={dashboardStyles.headerActions}>
        <LanguageSwitcher locale={locale} dictionary={dictionary} />
        <IconButton aria-label={dictionary.header.notifications}>
          <Badge color="error" variant="dot">
            <NotificationsNoneRounded />
          </Badge>
        </IconButton>
        <IconButton
          aria-label={dictionary.auth.logout}
          title={dictionary.auth.logout}
          onClick={() => void logout()}
        >
          <LogoutRounded />
        </IconButton>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={onNewShipment}
          sx={dashboardStyles.newShipment}
        >
          {dictionary.header.newShipment}
        </Button>
      </Stack>
    </Stack>
  );
}

"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import DashboardRounded from "@mui/icons-material/DashboardRounded";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import type { Dictionary } from "@/core/i18n/dictionaries";
import { NavigationPendingIndicator } from "@/core/ui/navigation-pending-indicator";

import { dashboardStyles } from "./styles";

const items = [
  { key: "overview", icon: DashboardRounded, target: "" },
  { key: "shipments", icon: Inventory2Rounded, target: "/shipments" },
  { key: "drivers", icon: LocalShippingRounded, target: "/drivers" },
  { key: "reports", icon: BarChartRounded, target: "/reports" },
] as const;

export function Sidebar({ dictionary }: { dictionary: Dictionary }) {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();

  return (
    <Box component="aside" sx={dashboardStyles.sidebar}>
      <Stack direction="row" alignItems="center" gap={1.5} px={0.75} py={1}>
        <Avatar variant="rounded" sx={dashboardStyles.brandAvatar}>
          ر
        </Avatar>
        <Box sx={dashboardStyles.desktopOnly}>
          <Typography fontSize={23} lineHeight={1.3} fontWeight={900}>
            {dictionary.common.brand}
          </Typography>
          <Typography variant="caption" sx={dashboardStyles.sidebarCaption}>
            {dictionary.common.operationsCenter}
          </Typography>
        </Box>
      </Stack>
      <List sx={dashboardStyles.navList}>
        {items.map(({ key, icon: Icon, target }) => {
          const href = `/${locale}${target}`;
          const selected = pathname === href;

          return (
            <ListItemButton
              component={Link}
              key={key}
              selected={selected}
              href={href}
              sx={dashboardStyles.navItem}
            >
              <ListItemIcon sx={dashboardStyles.navIcon}>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={dictionary.nav[key]}
                slotProps={{ primary: { fontSize: 15, fontWeight: selected ? 800 : 600 } }}
                sx={dashboardStyles.desktopOnly}
              />
              <NavigationPendingIndicator label={dictionary.common.loading} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={dashboardStyles.sidebarFooter}>
        <ListItemButton sx={dashboardStyles.settingsItem}>
          <ListItemIcon sx={dashboardStyles.navIcon}>
            <SettingsRounded />
          </ListItemIcon>
          <ListItemText
            primary={dictionary.nav.settings}
            slotProps={{ primary: { fontSize: 15, fontWeight: 600 } }}
            sx={dashboardStyles.desktopOnly}
          />
        </ListItemButton>
        <Divider sx={dashboardStyles.sidebarDivider} />
        <Stack direction="row" alignItems="center" gap={1.25}>
          <Avatar sx={dashboardStyles.userAvatar}>م</Avatar>
          <Box sx={dashboardStyles.desktopOnly}>
            <Typography variant="body2" fontWeight={800}>
              مهدی کریمی
            </Typography>
            <Typography variant="caption" sx={dashboardStyles.userRole}>
              Operations manager
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

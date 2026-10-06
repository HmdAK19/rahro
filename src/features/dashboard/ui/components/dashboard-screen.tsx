"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Stack } from "@mui/material";

import type { Locale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/dictionaries";
import type { Driver } from "@/features/fleet/domain/driver";
import { DriverPopover } from "@/features/fleet/ui/components/driver-popover";
import { FleetMap } from "@/features/fleet/ui/components/fleet-map";
import { useLiveFleet } from "@/features/fleet/ui/hooks/use-live-fleet";

import { ActivityFeed } from "./activity-feed";
import { ConnectionStatus } from "./connection-status";
import { DashboardHeader } from "./dashboard-header";
import { MetricsGrid } from "./metrics-grid";
import { dashboardStyles } from "./styles";

export function DashboardScreen({
  locale,
  dictionary,
  initialDrivers,
}: {
  locale: Locale;
  dictionary: Dictionary;
  initialDrivers: readonly Driver[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>("DRV-101");
  const fleet = useLiveFleet(initialDrivers);
  const selected = fleet.drivers.find((driver) => driver.id === selectedId);

  return (
    <>
      <DashboardHeader
        onNewShipment={() => router.push(`/${locale}/shipments`)}
        locale={locale}
        dictionary={dictionary}
      />
      <ConnectionStatus status={fleet.connection} dictionary={dictionary} />
      <Stack gap={2}>
        <MetricsGrid dictionary={dictionary} />
        <Box sx={dashboardStyles.workspace}>
          <FleetMap
            drivers={fleet.drivers}
            selectedId={selectedId}
            onSelect={setSelectedId}
            dictionary={dictionary}
          />
          <ActivityFeed
            isSimulating={fleet.isSimulating}
            onToggleSimulation={fleet.toggleSimulation}
            dictionary={dictionary}
          />
        </Box>
      </Stack>
      {selected && (
        <DriverPopover
          driver={selected}
          locale={locale}
          dictionary={dictionary}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}

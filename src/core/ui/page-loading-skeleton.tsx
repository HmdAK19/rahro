import { Box, Card, Skeleton, Stack } from "@mui/material";

import { dashboardStyles } from "@/features/dashboard/ui/components/styles";
import { reportStyles } from "@/features/reports/ui/components/styles";

const metricCards = [0, 1, 2, 3] as const;
const rows = [0, 1, 2, 3, 4] as const;

function LoadingRegion({ children }: { children: React.ReactNode }) {
  return (
    <Box aria-busy="true" aria-live="polite">
      <Box
        component="span"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          p: 0,
          m: -1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Loading
      </Box>
      <Box aria-hidden="true">{children}</Box>
    </Box>
  );
}

function PageHeadingSkeleton({ actions = 1 }: { actions?: number }) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ md: "center" }}
      gap={2}
      mb={3}
    >
      <Stack gap={0.5}>
        <Skeleton variant="text" animation="wave" width={190} height={40} />
        <Skeleton variant="text" animation="wave" width={260} />
      </Stack>
      <Stack direction="row" gap={1}>
        {actions > 1 && <Skeleton variant="rounded" animation="wave" width={210} height={44} />}
        <Skeleton variant="rounded" animation="wave" width={118} height={44} />
      </Stack>
    </Stack>
  );
}

function TableCardSkeleton({ columns }: { columns: number }) {
  return (
    <Card sx={{ overflow: "hidden" }}>
      <Stack direction="row" justifyContent="space-between" p={2.5}>
        <Skeleton variant="text" animation="wave" width={170} height={30} />
        <Skeleton variant="rounded" animation="wave" width={105} height={36} />
      </Stack>
      {rows.map((row) => (
        <Stack
          key={row}
          direction="row"
          gap={{ xs: 1.5, md: 3 }}
          px={2.5}
          py={1.75}
          borderTop={1}
          borderColor="divider"
        >
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton
              key={column}
              variant="text"
              animation="wave"
              width={`${Math.max(10, 30 - column * 3)}%`}
            />
          ))}
        </Stack>
      ))}
    </Card>
  );
}

export function OverviewLoadingSkeleton() {
  return (
    <LoadingRegion>
      <PageHeadingSkeleton actions={2} />
      <Box sx={dashboardStyles.metrics}>
        {metricCards.map((card) => (
          <Card key={card}>
            <Stack direction="row" alignItems="center" gap={2} p={2.5} minHeight={124}>
              <Skeleton variant="rounded" animation="wave" width={48} height={48} />
              <Stack gap={0.5} flex={1}>
                <Skeleton variant="text" animation="wave" width="58%" />
                <Skeleton variant="text" animation="wave" width="36%" height={36} />
              </Stack>
            </Stack>
          </Card>
        ))}
      </Box>
      <Box sx={{ ...dashboardStyles.workspace, mt: 2 }}>
        <Card sx={{ p: 2.5 }}>
          <Skeleton variant="text" animation="wave" width={140} height={30} />
          <Skeleton variant="rounded" animation="wave" height={320} sx={{ mt: 2 }} />
        </Card>
        <Card sx={{ p: 2.5 }}>
          <Skeleton variant="text" animation="wave" width={130} height={30} />
          <Stack gap={2.25} mt={2.5}>
            {rows.slice(0, 4).map((row) => (
              <Stack key={row} direction="row" alignItems="center" gap={1.5}>
                <Skeleton variant="circular" animation="wave" width={32} height={32} />
                <Stack flex={1}>
                  <Skeleton variant="text" animation="wave" width={`${72 - row * 6}%`} />
                  <Skeleton variant="text" animation="wave" width="46%" />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Card>
      </Box>
    </LoadingRegion>
  );
}

export function ShipmentsLoadingSkeleton() {
  return (
    <LoadingRegion>
      <PageHeadingSkeleton actions={2} />
      <TableCardSkeleton columns={6} />
    </LoadingRegion>
  );
}

export function DriversLoadingSkeleton() {
  return (
    <LoadingRegion>
      <PageHeadingSkeleton />
      <TableCardSkeleton columns={6} />
    </LoadingRegion>
  );
}

export function ReportsLoadingSkeleton() {
  return (
    <LoadingRegion>
      <PageHeadingSkeleton />
      <Box sx={reportStyles.summaryGrid}>
        {metricCards.map((card) => (
          <Card key={card} sx={{ p: 2.5 }}>
            <Skeleton variant="text" animation="wave" width="54%" />
            <Skeleton variant="text" animation="wave" width="42%" height={42} sx={{ mt: 1 }} />
          </Card>
        ))}
      </Box>
      <Box sx={reportStyles.detailsGrid}>
        {metricCards.slice(0, 2).map((card) => (
          <Card key={card} sx={{ p: 2.5 }}>
            <Skeleton variant="text" animation="wave" width={180} height={30} />
            <Stack gap={2} mt={2.5}>
              {rows.slice(0, 4).map((row) => (
                <Skeleton key={row} variant="rounded" animation="wave" height={28} />
              ))}
            </Stack>
          </Card>
        ))}
      </Box>
      <TableCardSkeleton columns={4} />
    </LoadingRegion>
  );
}

export function ActivityLoadingSkeleton() {
  return (
    <LoadingRegion>
      <Stack direction="row" alignItems="center" gap={1} mb={3}>
        <Skeleton variant="text" animation="wave" width={190} height={40} />
        <Skeleton variant="rounded" animation="wave" width={64} height={28} />
      </Stack>
      <Card sx={{ overflow: "hidden" }}>
        {rows.slice(0, 4).map((row) => (
          <Stack
            key={row}
            direction="row"
            alignItems="center"
            gap={1.5}
            px={2.5}
            py={2}
            borderTop={row === 0 ? 0 : 1}
            borderColor="divider"
          >
            <Skeleton variant="circular" animation="wave" width={12} height={12} />
            <Stack flex={1} gap={0.5}>
              <Skeleton variant="text" animation="wave" width={`${50 + row * 6}%`} />
              <Skeleton variant="text" animation="wave" width={`${72 - row * 5}%`} />
            </Stack>
          </Stack>
        ))}
      </Card>
    </LoadingRegion>
  );
}

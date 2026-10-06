"use client";

import Link from "next/link";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import {
  Alert,
  Box,
  Button,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import type { Locale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/dictionaries";
import { formatNumber } from "@/core/i18n/formatters";
import { SectionCard } from "@/core/ui/section-card";
import type { ShipmentStatus } from "@/features/shipments/domain/shipment";

import type { TrackingSnapshot } from "../../domain/tracking-snapshot";
import { useLiveTracking } from "../hooks/use-live-tracking";

import { trackingStyles } from "./styles";
import { TrackingMap } from "./tracking-map";

const stepByStatus: Record<ShipmentStatus, number> = {
  ready: 0,
  assigned: 1,
  in_transit: 2,
  delayed: 2,
  delivered: 3,
};

export function TrackingScreen({
  locale,
  dictionary,
  initialSnapshot,
}: {
  locale: Locale;
  dictionary: Dictionary;
  initialSnapshot: TrackingSnapshot;
}) {
  const { snapshot, failed } = useLiveTracking(
    initialSnapshot.shipment.trackingCode,
    initialSnapshot,
  );
  const { shipment, driver } = snapshot;
  const activeStep = stepByStatus[shipment.status];
  const details = [
    [dictionary.tracking.receiver, shipment.customer],
    [dictionary.tracking.destination, shipment.address],
    [dictionary.tracking.driver, driver?.name ?? dictionary.tracking.noDriver],
    [
      dictionary.tracking.deliveryPrice,
      `${formatNumber(shipment.price, locale)} ${dictionary.common.toman}`,
    ],
  ];

  return (
    <Container maxWidth="lg" sx={trackingStyles.page}>
      <Stack
        component="header"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={{ xs: 3, md: 5 }}
      >
        <Link href={`/${locale}`}>
          <Typography color="primary" fontSize={{ xs: 22, md: 26 }} fontWeight={900}>
            {dictionary.common.brand}
          </Typography>
        </Link>
        <Button component={Link} href={`/${locale}`} startIcon={<ArrowBackRounded />}>
          {dictionary.nav.overview}
        </Button>
      </Stack>
      {failed && (
        <Alert severity="warning" sx={trackingStyles.liveError}>
          {dictionary.tracking.liveError}
        </Alert>
      )}
      <Box sx={trackingStyles.hero}>
        <Box>
          <Typography variant="caption" sx={trackingStyles.heroLabel}>
            {dictionary.tracking.shipmentCode}
          </Typography>
          <Typography component="h1" fontSize={{ xs: 25, md: 34 }} fontWeight={900} my={1}>
            {shipment.trackingCode}
          </Typography>
          <Typography sx={trackingStyles.heroMessage}>
            {shipment.status === "delivered"
              ? dictionary.tracking.deliveredMessage
              : dictionary.tracking.transitMessage}
          </Typography>
        </Box>
        <Chip
          label={shipment.eta}
          color={shipment.status === "delayed" ? "warning" : "secondary"}
          sx={trackingStyles.eta}
        />
      </Box>
      <Box sx={trackingStyles.content}>
        <Stack gap={2}>
          {driver && <TrackingMap driver={driver} dictionary={dictionary} />}
          <SectionCard>
            <CardContent>
              <Typography variant="h2" mb={3}>
                {dictionary.tracking.statusTitle}
              </Typography>
              <Stepper activeStep={activeStep} orientation="vertical">
                {dictionary.tracking.steps.map((label, index) => (
                  <Step key={label} completed={index <= activeStep}>
                    <StepLabel
                      optional={
                        <Typography variant="caption" color="text.secondary">
                          {index === 0
                            ? shipment.branch
                            : index === 1
                              ? (driver?.name ?? dictionary.tracking.pendingDriver)
                              : index === 2
                                ? shipment.address
                                : shipment.customer}
                        </Typography>
                      }
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </SectionCard>
        </Stack>
        <SectionCard>
          <CardContent>
            <Typography variant="h2" mb={2}>
              {dictionary.tracking.detailsTitle}
            </Typography>
            {details.map(([label, value]) => (
              <Box key={label}>
                <Stack py={1.5} gap={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {value}
                  </Typography>
                </Stack>
                <Divider />
              </Box>
            ))}
            <Typography
              mt={2}
              p={1.5}
              bgcolor="success.50"
              color="success.dark"
              borderRadius={2}
              variant="caption"
              display="block"
            >
              {dictionary.tracking.serverNote}
            </Typography>
            {driver && (
              <Typography mt={1.5} variant="caption" color="text.secondary" display="block">
                {dictionary.tracking.lastUpdated}:{" "}
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(driver.updatedAt))}
              </Typography>
            )}
          </CardContent>
        </SectionCard>
      </Box>
    </Container>
  );
}

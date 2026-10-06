import Link from "next/link";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlined from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import type { Locale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/dictionaries";
import { formatNumber } from "@/core/i18n/formatters";
import { SectionCard } from "@/core/ui/section-card";
import type { Driver } from "@/features/fleet/domain/driver";

import type { Shipment } from "../../domain/shipment";

import { shipmentStyles } from "./styles";

const statusColors = {
  ready: "default",
  assigned: "secondary",
  in_transit: "success",
  delayed: "warning",
  delivered: "info",
} as const;

export function ShipmentTable({
  shipments,
  drivers,
  locale,
  dictionary,
  onEdit,
  onDelete,
}: {
  shipments: readonly Shipment[];
  drivers: readonly Driver[];
  locale: Locale;
  dictionary: Dictionary;
  onEdit(shipment: Shipment): void;
  onDelete(shipment: Shipment): void;
}) {
  const headings = [
    dictionary.shipments.trackingCode,
    dictionary.shipments.customerDestination,
    dictionary.shipments.driver,
    dictionary.shipments.status,
    dictionary.shipments.eta,
    dictionary.shipments.price,
    dictionary.shipments.actions,
  ];

  return (
    <SectionCard id="shipments">
      <Stack direction="row" alignItems="center" p={2.5}>
        <Typography variant="h2">
          {dictionary.shipments.title}
          <Chip
            size="small"
            sx={shipmentStyles.count}
            label={`${formatNumber(shipments.length, locale)} ${dictionary.shipments.count}`}
          />
        </Typography>
      </Stack>
      {shipments.length === 0 ? (
        <Alert severity="info" sx={shipmentStyles.empty}>
          {dictionary.shipments.empty}
        </Alert>
      ) : (
        <TableContainer>
          <Table sx={shipmentStyles.table}>
            <TableHead>
              <TableRow>
                {headings.map((heading) => (
                  <TableCell key={heading}>{heading}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {shipments.map((shipment) => {
                const driver = drivers.find((item) => item.id === shipment.driverId);

                return (
                  <TableRow key={shipment.id} hover>
                    <TableCell>
                      <Typography
                        component={Link}
                        href={`/${locale}/track/${shipment.trackingCode}`}
                        color="primary"
                        variant="body2"
                        fontWeight={800}
                      >
                        {shipment.trackingCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {shipment.customer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {shipment.address}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {driver ? (
                        <Stack direction="row" gap={1.25} alignItems="center">
                          <Avatar sx={shipmentStyles.driverAvatar}>{driver.name[0]}</Avatar>
                          <Box>
                            <Typography variant="body2" display="block" fontWeight={700}>
                              {driver.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {driver.vehicle}
                            </Typography>
                          </Box>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="error">
                          {dictionary.shipments.unassigned}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={statusColors[shipment.status]}
                        label={dictionary.shipments.statuses[shipment.status]}
                      />
                    </TableCell>
                    <TableCell>{shipment.eta}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {formatNumber(shipment.price, locale)} {dictionary.common.toman}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row">
                        <Tooltip title={dictionary.shipments.edit}>
                          <IconButton
                            size="small"
                            onClick={() => onEdit(shipment)}
                            aria-label={dictionary.shipments.edit}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={dictionary.shipments.delete}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(shipment)}
                            aria-label={dictionary.shipments.delete}
                          >
                            <DeleteOutlineRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </SectionCard>
  );
}

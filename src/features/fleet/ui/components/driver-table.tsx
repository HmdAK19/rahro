import AddRounded from "@mui/icons-material/AddRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlined from "@mui/icons-material/EditOutlined";
import {
  Avatar,
  Button,
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

import type { Driver } from "../../domain/driver";

import { fleetStyles } from "./styles";

const colors = { online: "success", delivering: "warning", offline: "default" } as const;

export function DriverTable({
  drivers,
  locale,
  dictionary,
  onAdd,
  onEdit,
  onDelete,
}: {
  drivers: readonly Driver[];
  locale: Locale;
  dictionary: Dictionary;
  onAdd(): void;
  onEdit(driver: Driver): void;
  onDelete(driver: Driver): void;
}) {
  const headings = [
    dictionary.driverManagement.name,
    dictionary.driverManagement.phone,
    dictionary.driverManagement.vehicle,
    dictionary.driverManagement.plate,
    dictionary.driverManagement.status,
    dictionary.driverManagement.actions,
  ];

  return (
    <SectionCard id="drivers">
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={2.5}>
        <Typography variant="h2">
          {dictionary.driverManagement.title}
          <Chip
            size="small"
            sx={fleetStyles.count}
            label={`${formatNumber(drivers.length, locale)} ${dictionary.driverManagement.count}`}
          />
        </Typography>
        <Button variant="contained" startIcon={<AddRounded />} onClick={onAdd}>
          {dictionary.driverManagement.add}
        </Button>
      </Stack>
      <TableContainer>
        <Table sx={fleetStyles.table}>
          <TableHead>
            <TableRow>
              {headings.map((heading) => (
                <TableCell key={heading}>{heading}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" gap={1.25}>
                    <Avatar sx={fleetStyles.tableAvatar}>{driver.name[0]}</Avatar>
                    <Typography variant="body2" fontWeight={700}>
                      {driver.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>{driver.vehicle}</TableCell>
                <TableCell>{driver.plate}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={colors[driver.status]}
                    label={dictionary.driverManagement.statuses[driver.status]}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row">
                    <Tooltip title={dictionary.driverManagement.edit}>
                      <IconButton size="small" onClick={() => onEdit(driver)}>
                        <EditOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={dictionary.driverManagement.delete}>
                      <IconButton size="small" color="error" onClick={() => onDelete(driver)}>
                        <DeleteOutlineRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SectionCard>
  );
}

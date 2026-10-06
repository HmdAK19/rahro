"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import type { Dictionary } from "@/core/i18n/dictionaries";
import type { Driver } from "@/features/fleet/domain/driver";

import type { Shipment, ShipmentDraft, ShipmentStatus } from "../../domain/shipment";
import { shipmentDraftSchema } from "../../domain/shipment-validator";

import { shipmentStyles } from "./styles";

const emptyForm: ShipmentDraft = {
  trackingCode: "",
  customer: "",
  address: "",
  branch: "",
  driverId: null,
  status: "ready",
  eta: "",
  price: Number.NaN,
};
const toForm = (shipment?: Shipment): ShipmentDraft => (shipment ? { ...shipment } : emptyForm);

export function ShipmentDialog({
  open,
  shipment,
  drivers,
  dictionary,
  isBusy,
  errorCode,
  onClose,
  onSubmit,
}: {
  open: boolean;
  shipment?: Shipment;
  drivers: readonly Driver[];
  dictionary: Dictionary;
  isBusy: boolean;
  errorCode: string | null;
  onClose(): void;
  onSubmit(input: ShipmentDraft): Promise<boolean>;
}) {
  const { control, handleSubmit } = useForm<ShipmentDraft>({
    resolver: yupResolver(shipmentDraftSchema),
    defaultValues: toForm(shipment),
  });

  const submit = async (input: ShipmentDraft) => {
    if (await onSubmit(input)) onClose();
  };

  const message =
    errorCode === "TRACKING_CODE_ALREADY_EXISTS"
      ? dictionary.shipments.duplicateError
      : errorCode
        ? dictionary.shipments.requestError
        : null;

  return (
    <Dialog open={open} onClose={isBusy ? undefined : onClose} fullWidth maxWidth="sm">
      <Stack component="form" noValidate onSubmit={handleSubmit(submit)}>
        <DialogTitle>
          {shipment ? dictionary.shipments.edit : dictionary.shipments.create}
        </DialogTitle>
        <DialogContent>
          <Stack gap={2} pt={1}>
            {message && <Alert severity="error">{message}</Alert>}
            <Controller
              name="trackingCode"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  label={dictionary.shipments.trackingCode}
                  disabled={Boolean(shipment)}
                  error={fieldState.invalid}
                  helperText={fieldState.invalid ? dictionary.shipments.required : undefined}
                />
              )}
            />
            <Controller
              name="customer"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  label={dictionary.shipments.customer}
                  error={fieldState.invalid}
                  helperText={fieldState.invalid ? dictionary.shipments.required : undefined}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  multiline
                  minRows={2}
                  label={dictionary.shipments.address}
                  error={fieldState.invalid}
                  helperText={fieldState.invalid ? dictionary.shipments.required : undefined}
                />
              )}
            />
            <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
              <Controller
                name="branch"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={dictionary.shipments.branch}
                    error={fieldState.invalid}
                    helperText={fieldState.invalid ? dictionary.shipments.required : undefined}
                  />
                )}
              />
              <Controller
                name="eta"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={dictionary.shipments.eta}
                    error={fieldState.invalid}
                    helperText={fieldState.invalid ? dictionary.shipments.required : undefined}
                  />
                )}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
              <Controller
                name="driverId"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    select
                    fullWidth
                    label={dictionary.shipments.driver}
                    error={fieldState.invalid}
                    helperText={fieldState.invalid ? dictionary.shipments.required : undefined}
                  >
                    <MenuItem value="">{dictionary.shipments.unassigned}</MenuItem>
                    {drivers.map((driver) => (
                      <MenuItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    label={dictionary.shipments.status}
                    error={fieldState.invalid}
                    helperText={fieldState.invalid ? dictionary.shipments.required : undefined}
                  >
                    {(Object.keys(dictionary.shipments.statuses) as ShipmentStatus[]).map(
                      (status) => (
                        <MenuItem key={status} value={status}>
                          {dictionary.shipments.statuses[status]}
                        </MenuItem>
                      ),
                    )}
                  </TextField>
                )}
              />
            </Stack>
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={Number.isNaN(field.value) ? "" : field.value}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === "" ? Number.NaN : Number(event.target.value),
                    )
                  }
                  required
                  type="number"
                  label={dictionary.shipments.price}
                  error={fieldState.invalid}
                  helperText={fieldState.invalid ? dictionary.shipments.required : undefined}
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={shipmentStyles.dialogActions}>
          <Button onClick={onClose} disabled={isBusy}>
            {dictionary.shipments.cancel}
          </Button>
          <Button type="submit" variant="contained" loading={isBusy}>
            {shipment ? dictionary.shipments.save : dictionary.shipments.create}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}

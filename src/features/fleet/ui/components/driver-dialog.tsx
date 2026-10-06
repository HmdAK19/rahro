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

import type { Driver, DriverDraft, DriverStatus } from "../../domain/driver";
import { driverDraftSchema } from "../../domain/driver-validator";

import { fleetStyles } from "./styles";

const initial = (driver?: Driver): DriverDraft =>
  driver
    ? {
        name: driver.name,
        phone: driver.phone,
        vehicle: driver.vehicle,
        plate: driver.plate,
        status: driver.status,
        lat: driver.lat,
        lng: driver.lng,
      }
    : {
        name: "",
        phone: "",
        vehicle: "",
        plate: "",
        status: "offline",
        lat: 35.7219,
        lng: 51.3347,
      };

export function DriverDialog({
  driver,
  dictionary,
  isBusy,
  errorCode,
  onClose,
  onSubmit,
}: {
  driver?: Driver;
  dictionary: Dictionary;
  isBusy: boolean;
  errorCode: string | null;
  onClose(): void;
  onSubmit(input: DriverDraft): Promise<boolean>;
}) {
  const { control, handleSubmit } = useForm<DriverDraft>({
    resolver: yupResolver(driverDraftSchema),
    defaultValues: initial(driver),
  });

  const submit = async (input: DriverDraft) => {
    if (await onSubmit(input)) onClose();
  };

  const message =
    errorCode === "DRIVER_PHONE_ALREADY_EXISTS"
      ? dictionary.driverManagement.duplicatePhone
      : errorCode
        ? dictionary.driverManagement.requestError
        : null;

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={isBusy ? undefined : onClose}>
      <Stack component="form" noValidate onSubmit={handleSubmit(submit)}>
        <DialogTitle>
          {driver ? dictionary.driverManagement.edit : dictionary.driverManagement.add}
        </DialogTitle>
        <DialogContent>
          <Stack gap={2} pt={1}>
            {message && <Alert severity="error">{message}</Alert>}
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  label={dictionary.driverManagement.name}
                  error={fieldState.invalid}
                  helperText={fieldState.invalid ? dictionary.driverManagement.required : undefined}
                />
              )}
            />
            <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={dictionary.driverManagement.phone}
                    error={fieldState.invalid}
                    helperText={
                      fieldState.invalid ? dictionary.driverManagement.required : undefined
                    }
                  />
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
                    label={dictionary.driverManagement.status}
                    error={fieldState.invalid}
                    helperText={
                      fieldState.invalid ? dictionary.driverManagement.required : undefined
                    }
                  >
                    {(Object.keys(dictionary.driverManagement.statuses) as DriverStatus[]).map(
                      (status) => (
                        <MenuItem key={status} value={status}>
                          {dictionary.driverManagement.statuses[status]}
                        </MenuItem>
                      ),
                    )}
                  </TextField>
                )}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
              <Controller
                name="vehicle"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={dictionary.driverManagement.vehicle}
                    error={fieldState.invalid}
                    helperText={
                      fieldState.invalid ? dictionary.driverManagement.required : undefined
                    }
                  />
                )}
              />
              <Controller
                name="plate"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={dictionary.driverManagement.plate}
                    error={fieldState.invalid}
                    helperText={
                      fieldState.invalid ? dictionary.driverManagement.required : undefined
                    }
                  />
                )}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
              <Controller
                name="lat"
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
                    fullWidth
                    label={dictionary.driverManagement.latitude}
                    error={fieldState.invalid}
                    helperText={
                      fieldState.invalid ? dictionary.driverManagement.required : undefined
                    }
                  />
                )}
              />
              <Controller
                name="lng"
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
                    fullWidth
                    label={dictionary.driverManagement.longitude}
                    error={fieldState.invalid}
                    helperText={
                      fieldState.invalid ? dictionary.driverManagement.required : undefined
                    }
                  />
                )}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={fleetStyles.dialogActions}>
          <Button onClick={onClose} disabled={isBusy}>
            {dictionary.driverManagement.cancel}
          </Button>
          <Button type="submit" variant="contained" loading={isBusy}>
            {driver ? dictionary.driverManagement.save : dictionary.driverManagement.add}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}

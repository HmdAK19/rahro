import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";

import type { Dictionary } from "@/core/i18n/dictionaries";

export function DeleteDriverDialog({
  open,
  isBusy,
  errorCode,
  dictionary,
  onClose,
  onConfirm,
}: {
  open: boolean;
  isBusy: boolean;
  errorCode: string | null;
  dictionary: Dictionary;
  onClose(): void;
  onConfirm(): void;
}) {
  return (
    <Dialog open={open} onClose={isBusy ? undefined : onClose}>
      <DialogTitle>{dictionary.driverManagement.deleteTitle}</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          {errorCode && (
            <Alert severity="error">
              {errorCode === "DRIVER_HAS_ACTIVE_SHIPMENTS"
                ? dictionary.driverManagement.hasShipments
                : dictionary.driverManagement.requestError}
            </Alert>
          )}
          <DialogContentText>{dictionary.driverManagement.deleteConfirm}</DialogContentText>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isBusy}>
          {dictionary.driverManagement.cancel}
        </Button>
        <Button color="error" variant="contained" loading={isBusy} onClick={onConfirm}>
          {dictionary.driverManagement.delete}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

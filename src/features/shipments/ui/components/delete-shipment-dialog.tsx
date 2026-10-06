import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { Dictionary } from "@/core/i18n/dictionaries";

export function DeleteShipmentDialog({
  open,
  isBusy,
  dictionary,
  onClose,
  onConfirm,
}: {
  open: boolean;
  isBusy: boolean;
  dictionary: Dictionary;
  onClose(): void;
  onConfirm(): void;
}) {
  return (
    <Dialog open={open} onClose={isBusy ? undefined : onClose}>
      <DialogTitle>{dictionary.shipments.deleteTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dictionary.shipments.deleteConfirm}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isBusy}>
          {dictionary.shipments.cancel}
        </Button>
        <Button color="error" variant="contained" loading={isBusy} onClick={onConfirm}>
          {dictionary.shipments.delete}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

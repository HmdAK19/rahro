"use client";

import { useMemo, useState } from "react";
import AddRounded from "@mui/icons-material/AddRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import {
  Alert,
  Button,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { Locale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/dictionaries";
import { dashboardStyles } from "@/features/dashboard/ui/components/styles";
import type { Driver } from "@/features/fleet/domain/driver";

import type { Shipment, ShipmentDraft } from "../../domain/shipment";
import { useShipments } from "../hooks/use-shipments";

import { DeleteShipmentDialog } from "./delete-shipment-dialog";
import { ShipmentDialog } from "./shipment-dialog";
import { ShipmentTable } from "./shipment-table";

type Notice = "create" | "update" | "delete" | null;

export function ShipmentManagementScreen({
  locale,
  dictionary,
  initialDrivers,
  initialShipments,
}: {
  locale: Locale;
  dictionary: Dictionary;
  initialDrivers: readonly Driver[];
  initialShipments: readonly Shipment[];
}) {
  const shipmentState = useShipments(initialShipments);
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<{ open: boolean; shipment?: Shipment }>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<Shipment>();
  const [notice, setNotice] = useState<Notice>(null);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);

    return shipmentState.shipments.filter((shipment) =>
      `${shipment.trackingCode} ${shipment.customer} ${shipment.address}`
        .toLocaleLowerCase(locale)
        .includes(normalized),
    );
  }, [locale, query, shipmentState.shipments]);

  const submit = async (draft: ShipmentDraft) => {
    const success = editor.shipment
      ? await shipmentState.update(editor.shipment.id, draft)
      : await shipmentState.create(draft);

    if (success) setNotice(editor.shipment ? "update" : "create");

    return success;
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    if (await shipmentState.delete(pendingDelete.id)) {
      setPendingDelete(undefined);
      setNotice("delete");
    }
  };

  const noticeText =
    notice === "create"
      ? dictionary.shipments.createSuccess
      : notice === "update"
        ? dictionary.shipments.updateSuccess
        : dictionary.shipments.deleteSuccess;

  return (
    <>
      <Stack
        component="header"
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
        gap={2}
        mb={3}
      >
        <Typography component="h1" variant="h1">
          {dictionary.nav.shipments}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
          <TextField
            size="small"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dictionary.header.search}
            sx={dashboardStyles.search}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => {
              shipmentState.clearError();
              setEditor({ open: true });
            }}
          >
            {dictionary.header.newShipment}
          </Button>
        </Stack>
      </Stack>

      <ShipmentTable
        shipments={filtered}
        drivers={initialDrivers}
        locale={locale}
        dictionary={dictionary}
        onEdit={(shipment) => {
          shipmentState.clearError();
          setEditor({ open: true, shipment });
        }}
        onDelete={setPendingDelete}
      />

      {editor.open && (
        <ShipmentDialog
          key={editor.shipment?.id ?? "new"}
          open
          shipment={editor.shipment}
          drivers={initialDrivers}
          dictionary={dictionary}
          isBusy={shipmentState.isBusy}
          errorCode={shipmentState.errorCode}
          onClose={() => {
            shipmentState.clearError();
            setEditor({ open: false });
          }}
          onSubmit={submit}
        />
      )}
      <DeleteShipmentDialog
        open={Boolean(pendingDelete)}
        isBusy={shipmentState.isBusy}
        dictionary={dictionary}
        onClose={() => setPendingDelete(undefined)}
        onConfirm={() => void confirmDelete()}
      />
      <Snackbar open={notice !== null} autoHideDuration={3500} onClose={() => setNotice(null)}>
        <Alert severity="success" variant="filled" onClose={() => setNotice(null)}>
          {noticeText}
        </Alert>
      </Snackbar>
    </>
  );
}

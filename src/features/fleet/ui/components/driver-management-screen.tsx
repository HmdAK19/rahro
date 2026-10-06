"use client";

import { useState } from "react";
import { Alert, Snackbar, Typography } from "@mui/material";

import type { Locale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/dictionaries";

import type { Driver, DriverDraft } from "../../domain/driver";
import { useLiveFleet } from "../hooks/use-live-fleet";

import { DeleteDriverDialog } from "./delete-driver-dialog";
import { DriverDialog } from "./driver-dialog";
import { DriverTable } from "./driver-table";

type Notice = "create" | "update" | "delete" | null;

export function DriverManagementScreen({
  locale,
  dictionary,
  initialDrivers,
}: {
  locale: Locale;
  dictionary: Dictionary;
  initialDrivers: readonly Driver[];
}) {
  const fleet = useLiveFleet(initialDrivers);
  const [editor, setEditor] = useState<{ open: boolean; driver?: Driver }>({ open: false });
  const [pendingDelete, setPendingDelete] = useState<Driver>();
  const [notice, setNotice] = useState<Notice>(null);

  const submit = async (draft: DriverDraft) => {
    const success = editor.driver
      ? await fleet.updateDriver(editor.driver.id, draft)
      : await fleet.createDriver(draft);

    if (success) setNotice(editor.driver ? "update" : "create");

    return success;
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    if (await fleet.deleteDriver(pendingDelete.id)) {
      setPendingDelete(undefined);
      setNotice("delete");
    }
  };

  const noticeText =
    notice === "create"
      ? dictionary.driverManagement.createSuccess
      : notice === "update"
        ? dictionary.driverManagement.updateSuccess
        : dictionary.driverManagement.deleteSuccess;

  return (
    <>
      <Typography component="h1" variant="h1" mb={3}>
        {dictionary.nav.drivers}
      </Typography>
      <DriverTable
        drivers={fleet.drivers}
        locale={locale}
        dictionary={dictionary}
        onAdd={() => {
          fleet.clearManagementError();
          setEditor({ open: true });
        }}
        onEdit={(driver) => {
          fleet.clearManagementError();
          setEditor({ open: true, driver });
        }}
        onDelete={(driver) => {
          fleet.clearManagementError();
          setPendingDelete(driver);
        }}
      />

      {editor.open && (
        <DriverDialog
          key={editor.driver?.id ?? "new"}
          driver={editor.driver}
          dictionary={dictionary}
          isBusy={fleet.isManaging}
          errorCode={fleet.managementError}
          onClose={() => {
            fleet.clearManagementError();
            setEditor({ open: false });
          }}
          onSubmit={submit}
        />
      )}
      <DeleteDriverDialog
        open={Boolean(pendingDelete)}
        isBusy={fleet.isManaging}
        errorCode={fleet.managementError}
        dictionary={dictionary}
        onClose={() => {
          fleet.clearManagementError();
          setPendingDelete(undefined);
        }}
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

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRealtimeEvents } from "@/core/realtime/use-realtime-events";

import type { Shipment, ShipmentChanges, ShipmentDraft } from "../../domain/shipment";
import {
  HttpShipmentGateway,
  ShipmentRequestError,
} from "../../infrastructure/http-shipment-gateway";

const gateway = new HttpShipmentGateway();

export function useShipments(initial: readonly Shipment[]) {
  const [shipments, setShipments] = useState<readonly Shipment[]>(initial);
  const [isBusy, setIsBusy] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      setShipments(await gateway.list(signal));
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        setErrorCode(error instanceof ShipmentRequestError ? error.code : "UNKNOWN_ERROR");
    }
  }, []);
  useRealtimeEvents(
    useCallback(
      (event) => {
        if (event.type === "shipment.changed") void refresh();
      },
      [refresh],
    ),
  );
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void refresh(controller.signal), 0);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [refresh]);
  const actions = useMemo(
    () => ({
      async create(input: ShipmentDraft) {
        setIsBusy(true);
        setErrorCode(null);
        try {
          const created = await gateway.create(input);
          setShipments((items) => [created, ...items]);

          return true;
        } catch (error) {
          setErrorCode(error instanceof ShipmentRequestError ? error.code : "UNKNOWN_ERROR");

          return false;
        } finally {
          setIsBusy(false);
        }
      },
      async update(id: string, changes: ShipmentChanges) {
        setIsBusy(true);
        setErrorCode(null);
        try {
          const updated = await gateway.update(id, changes);
          setShipments((items) => items.map((item) => (item.id === id ? updated : item)));

          return true;
        } catch (error) {
          setErrorCode(error instanceof ShipmentRequestError ? error.code : "UNKNOWN_ERROR");

          return false;
        } finally {
          setIsBusy(false);
        }
      },
      async delete(id: string) {
        setIsBusy(true);
        setErrorCode(null);
        try {
          await gateway.delete(id);
          setShipments((items) => items.filter((item) => item.id !== id));

          return true;
        } catch (error) {
          setErrorCode(error instanceof ShipmentRequestError ? error.code : "UNKNOWN_ERROR");

          return false;
        } finally {
          setIsBusy(false);
        }
      },
      clearError() {
        setErrorCode(null);
      },
    }),
    [],
  );

  return { shipments, isBusy, errorCode, ...actions };
}

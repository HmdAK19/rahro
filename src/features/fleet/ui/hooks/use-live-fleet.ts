"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { type RealtimeConnection, useRealtimeEvents } from "@/core/realtime/use-realtime-events";

import type { Driver, DriverChanges, DriverDraft } from "../../domain/driver";
import { DriverRequestError, HttpDriverGateway } from "../../infrastructure/http-driver-gateway";
import { HttpLocationGateway } from "../../infrastructure/http-location-gateway";

const simulatedRoute = [
  [35.7219, 51.3347],
  [35.7241, 51.341],
  [35.7272, 51.348],
  [35.7301, 51.356],
  [35.7322, 51.365],
  [35.7314, 51.375],
  [35.7279, 51.385],
  [35.7248, 51.394],
] as const;
const gateway = new HttpLocationGateway();
const driverGateway = new HttpDriverGateway();

export function useLiveFleet(initialDrivers: readonly Driver[]) {
  const [drivers, setDrivers] = useState<readonly Driver[]>(initialDrivers);
  const [httpFailed, setHttpFailed] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [managementError, setManagementError] = useState<string | null>(null);
  const sequence = useRef(0);
  const routeIndex = useRef(0);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const snapshot = await gateway.getSnapshot(signal);
      setDrivers(snapshot.drivers);
      setHttpFailed(false);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setHttpFailed(true);
    }
  }, []);

  const realtimeConnection = useRealtimeEvents(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );
  const connection: RealtimeConnection =
    httpFailed || realtimeConnection === "reconnecting" ? "reconnecting" : "connected";
  useEffect(() => {
    const controller = new AbortController();
    const initial = window.setTimeout(() => void refresh(controller.signal), 0);
    const interval = window.setInterval(() => void refresh(controller.signal), 15_000);

    return () => {
      controller.abort();
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [refresh]);
  useEffect(() => {
    if (!isSimulating) return;

    const interval = window.setInterval(async () => {
      routeIndex.current = (routeIndex.current + 1) % simulatedRoute.length;
      sequence.current += 1;
      const [lat, lng] = simulatedRoute[routeIndex.current];

      try {
        await gateway.update({
          driverId: "DRV-101",
          lat,
          lng,
          accuracy: 8,
          capturedAt: new Date().toISOString(),
          sequenceNumber: sequence.current,
          source: "simulator",
        });
        await refresh();
      } catch {
        setHttpFailed(true);
      }
    }, 1800);

    return () => window.clearInterval(interval);
  }, [isSimulating, refresh]);
  const manage = async (operation: () => Promise<Driver | void>) => {
    setIsManaging(true);
    setManagementError(null);
    try {
      await operation();
      await refresh();

      return true;
    } catch (error) {
      setManagementError(error instanceof DriverRequestError ? error.code : "UNKNOWN_ERROR");

      return false;
    } finally {
      setIsManaging(false);
    }
  };

  return {
    drivers,
    connection,
    isSimulating,
    isManaging,
    managementError,
    clearManagementError: () => setManagementError(null),
    createDriver: (input: DriverDraft) => manage(() => driverGateway.create(input)),
    updateDriver: (id: string, changes: DriverChanges) =>
      manage(() => driverGateway.update(id, changes)),
    deleteDriver: (id: string) => manage(() => driverGateway.delete(id)),
    toggleSimulation: () => setIsSimulating((value) => !value),
  };
}

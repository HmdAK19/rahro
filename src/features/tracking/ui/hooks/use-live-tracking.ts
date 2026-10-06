"use client";

import { useCallback, useEffect, useState } from "react";

import { useRealtimeEvents } from "@/core/realtime/use-realtime-events";

import type { TrackingSnapshot } from "../../domain/tracking-snapshot";

const refreshInterval = 30_000;

export function useLiveTracking(code: string, initial: TrackingSnapshot) {
  const [snapshot, setSnapshot] = useState(initial);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const response = await fetch(`/api/tracking/${encodeURIComponent(code)}`, {
          cache: "no-store",
          signal,
        });

        if (!response.ok) throw new Error("TRACKING_REFRESH_FAILED");

        const next = (await response.json()) as TrackingSnapshot;
        setSnapshot(next);
        setFailed(false);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
      }
    },
    [code],
  );
  useRealtimeEvents(
    useCallback(
      (event) => {
        if (
          event.type === "driver.location.updated" &&
          event.driverId === snapshot.shipment.driverId
        )
          void refresh();
        if (
          event.type === "shipment.changed" &&
          (!event.trackingCode || event.trackingCode === code)
        )
          void refresh();
      },
      [code, refresh, snapshot.shipment.driverId],
    ),
  );
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setInterval(() => void refresh(controller.signal), refreshInterval);

    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [refresh]);

  return { snapshot, failed };
}

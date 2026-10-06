"use client";

import { useEffect, useState } from "react";

import type { RealtimeEvent } from "./realtime-event";

export type RealtimeConnection = "connected" | "reconnecting";

function getRealtimeUrl() {
  if (process.env.NEXT_PUBLIC_REALTIME_URL) return process.env.NEXT_PUBLIC_REALTIME_URL;

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

  return `${protocol}//${window.location.hostname}:3001/realtime`;
}

export function useRealtimeEvents(onEvent: (event: RealtimeEvent) => void): RealtimeConnection {
  const [connection, setConnection] = useState<RealtimeConnection>("reconnecting");

  useEffect(() => {
    let active = true;
    let socket: WebSocket | undefined;
    let retry: number | undefined;

    const connect = () => {
      if (!active) return;
      socket = new WebSocket(getRealtimeUrl());
      socket.onopen = () => setConnection("connected");
      socket.onmessage = ({ data }) => {
        try {
          const event = JSON.parse(String(data)) as RealtimeEvent | { type: "connection.ready" };

          if (event.type !== "connection.ready") onEvent(event);
        } catch {
          /* Ignore malformed gateway messages. */
        }
      };
      socket.onerror = () => socket?.close();
      socket.onclose = () => {
        if (!active) return;
        setConnection("reconnecting");
        retry = window.setTimeout(connect, 3_000);
      };
    };

    connect();

    return () => {
      active = false;
      if (retry) window.clearTimeout(retry);
      socket?.close();
    };
  }, [onEvent]);

  return connection;
}

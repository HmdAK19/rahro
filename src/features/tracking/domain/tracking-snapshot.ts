import type { Shipment } from "@/features/shipments/domain/shipment";

export interface PublicDriverLocation {
  readonly id: string;
  readonly name: string;
  readonly vehicle: string;
  readonly status: "online" | "delivering" | "offline";
  readonly lat: number;
  readonly lng: number;
  readonly updatedAt: string;
}

export interface TrackingSnapshot {
  readonly shipment: Shipment;
  readonly driver?: PublicDriverLocation;
}

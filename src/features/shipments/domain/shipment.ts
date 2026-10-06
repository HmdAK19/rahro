export type ShipmentStatus = "ready" | "assigned" | "in_transit" | "delayed" | "delivered";

export interface Shipment {
  readonly id: string;
  readonly trackingCode: string;
  readonly customer: string;
  readonly address: string;
  readonly branch: string;
  readonly driverId: string | null;
  readonly status: ShipmentStatus;
  readonly eta: string;
  readonly price: number;
}

export type ShipmentDraft = Omit<Shipment, "id">;

export type ShipmentChanges = Partial<Omit<Shipment, "id" | "trackingCode">>;

export class InvalidShipmentError extends Error {
  constructor() {
    super("SHIPMENT_PAYLOAD_INVALID");
  }
}

export class ShipmentNotFoundError extends Error {
  constructor() {
    super("SHIPMENT_NOT_FOUND");
  }
}

export class DuplicateTrackingCodeError extends Error {
  constructor() {
    super("TRACKING_CODE_ALREADY_EXISTS");
  }
}

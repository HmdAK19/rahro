export type DriverStatus = "online" | "delivering" | "offline";

export type LocationSource = "gps" | "simulator";

export interface Driver {
  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly vehicle: string;
  readonly plate: string;
  readonly status: DriverStatus;
  readonly lat: number;
  readonly lng: number;
  readonly accuracy: number;
  readonly updatedAt: string;
  readonly source: LocationSource;
}

export type DriverDraft = Omit<Driver, "id" | "updatedAt" | "source" | "accuracy">;

export type DriverChanges = Partial<Omit<DriverDraft, "lat" | "lng">> & {
  readonly lat?: number;
  readonly lng?: number;
};

export class InvalidDriverError extends Error {
  constructor() {
    super("DRIVER_PAYLOAD_INVALID");
  }
}

export class DuplicateDriverPhoneError extends Error {
  constructor() {
    super("DRIVER_PHONE_ALREADY_EXISTS");
  }
}

export class DriverHasShipmentsError extends Error {
  constructor() {
    super("DRIVER_HAS_ACTIVE_SHIPMENTS");
  }
}

import type { LocationSource } from "./driver";

export interface LocationInput {
  readonly driverId: string;
  readonly lat: number;
  readonly lng: number;
  readonly accuracy: number;
  readonly capturedAt: string;
  readonly sequenceNumber: number;
  readonly source: LocationSource;
}

export class InvalidLocationError extends Error {
  constructor() {
    super("LOCATION_PAYLOAD_INVALID");
  }
}

export class DriverNotFoundError extends Error {
  constructor() {
    super("DRIVER_NOT_FOUND");
  }
}

export class StaleLocationError extends Error {
  constructor() {
    super("STALE_LOCATION");
  }
}

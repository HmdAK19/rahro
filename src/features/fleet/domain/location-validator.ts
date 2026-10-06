import { InvalidLocationError, type LocationInput } from "./location";

export function parseLocationInput(value: unknown): LocationInput {
  if (!value || typeof value !== "object") throw new InvalidLocationError();

  const input = value as Record<string, unknown>;
  const valid =
    typeof input.driverId === "string" &&
    typeof input.lat === "number" &&
    typeof input.lng === "number" &&
    typeof input.accuracy === "number" &&
    typeof input.capturedAt === "string" &&
    !Number.isNaN(Date.parse(input.capturedAt)) &&
    typeof input.sequenceNumber === "number" &&
    Number.isInteger(input.sequenceNumber) &&
    (input.source === "gps" || input.source === "simulator") &&
    input.lat >= -90 &&
    input.lat <= 90 &&
    input.lng >= -180 &&
    input.lng <= 180 &&
    input.accuracy >= 0;

  if (!valid) throw new InvalidLocationError();

  return input as unknown as LocationInput;
}

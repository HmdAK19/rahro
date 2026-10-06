import type { LocationInput } from "../domain/location";
import type { FleetSnapshot } from "../domain/location-repository";

export interface LocationGateway {
  getSnapshot(signal?: AbortSignal): Promise<FleetSnapshot>;
  update(input: LocationInput): Promise<void>;
}

export class HttpLocationGateway implements LocationGateway {
  async getSnapshot(signal?: AbortSignal): Promise<FleetSnapshot> {
    const response = await fetch("/api/locations", { cache: "no-store", signal });

    if (!response.ok) throw new Error("FLEET_REQUEST_FAILED");

    return response.json() as Promise<FleetSnapshot>;
  }
  async update(input: LocationInput): Promise<void> {
    const response = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) throw new Error("LOCATION_UPDATE_FAILED");
  }
}

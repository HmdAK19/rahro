import type { Driver } from "./driver";
import type { LocationInput } from "./location";

export interface FleetSnapshot {
  readonly drivers: readonly Driver[];
  readonly lastEventId: number;
}

export interface LocationRepository {
  getSnapshot(): Promise<FleetSnapshot>;
  updateLocation(input: LocationInput): Promise<Driver>;
}

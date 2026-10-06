import type { RealtimeEventPublisher } from "@/core/realtime/realtime-event";

import type { Driver } from "../domain/driver";
import type { LocationInput } from "../domain/location";
import type { LocationRepository } from "../domain/location-repository";

export class UpdateDriverLocation {
  constructor(
    private readonly repository: LocationRepository,
    private readonly events: RealtimeEventPublisher,
  ) {}
  async execute(input: LocationInput): Promise<Driver> {
    const driver = await this.repository.updateLocation(input);
    await this.events.publish({
      type: "driver.location.updated",
      driverId: driver.id,
      occurredAt: driver.updatedAt,
    });

    return driver;
  }
}

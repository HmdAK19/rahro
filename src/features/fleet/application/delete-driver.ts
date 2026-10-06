import type { RealtimeEventPublisher } from "@/core/realtime/realtime-event";

import { DriverHasShipmentsError } from "../domain/driver";
import type { DriverAssignmentReader } from "../domain/driver-assignment-reader";
import type { DriverRepository } from "../domain/driver-repository";

export class DeleteDriver {
  constructor(
    private readonly drivers: DriverRepository,
    private readonly assignments: DriverAssignmentReader,
    private readonly events: RealtimeEventPublisher,
  ) {}
  async execute(id: string) {
    if (await this.assignments.hasActiveShipments(id)) throw new DriverHasShipmentsError();
    await this.drivers.delete(id);
    await this.events.publish({
      type: "driver.changed",
      driverId: id,
      occurredAt: new Date().toISOString(),
    });
  }
}

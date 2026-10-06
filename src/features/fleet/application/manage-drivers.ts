import type { RealtimeEventPublisher } from "@/core/realtime/realtime-event";

import type { DriverChanges, DriverDraft } from "../domain/driver";
import type { DriverRepository } from "../domain/driver-repository";

export class ManageDrivers {
  constructor(
    private readonly repository: DriverRepository,
    private readonly events: RealtimeEventPublisher,
  ) {}
  async list() {
    return this.repository.findAll();
  }
  async create(input: DriverDraft) {
    const driver = await this.repository.create(input);
    await this.changed(driver.id);

    return driver;
  }
  async update(id: string, changes: DriverChanges) {
    const driver = await this.repository.update(id, changes);
    await this.changed(driver.id);

    return driver;
  }
  async delete(id: string) {
    await this.repository.delete(id);
    await this.changed(id);
  }
  private changed(driverId: string) {
    return this.events.publish({
      type: "driver.changed",
      driverId,
      occurredAt: new Date().toISOString(),
    });
  }
}

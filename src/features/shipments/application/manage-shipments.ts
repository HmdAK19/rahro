import type { RealtimeEventPublisher } from "@/core/realtime/realtime-event";

import type { ShipmentChanges, ShipmentDraft } from "../domain/shipment";
import type { ShipmentRepository } from "../domain/shipment-repository";

export class ManageShipments {
  constructor(
    private readonly repository: ShipmentRepository,
    private readonly events: RealtimeEventPublisher,
  ) {}
  async list() {
    return this.repository.findAll();
  }
  async create(input: ShipmentDraft) {
    const shipment = await this.repository.create(input);
    await this.changed(shipment.id, shipment.trackingCode);

    return shipment;
  }
  async update(id: string, changes: ShipmentChanges) {
    const shipment = await this.repository.update(id, changes);
    await this.changed(shipment.id, shipment.trackingCode);

    return shipment;
  }
  async delete(id: string) {
    await this.repository.delete(id);
    await this.changed(id);
  }
  private changed(shipmentId: string, trackingCode?: string) {
    return this.events.publish({
      type: "shipment.changed",
      shipmentId,
      trackingCode,
      occurredAt: new Date().toISOString(),
    });
  }
}

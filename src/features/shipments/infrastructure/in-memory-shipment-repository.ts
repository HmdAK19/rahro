import {
  DuplicateTrackingCodeError,
  type Shipment,
  type ShipmentChanges,
  type ShipmentDraft,
  ShipmentNotFoundError,
} from "../domain/shipment";
import type { ShipmentRepository } from "../domain/shipment-repository";

import { initialShipments } from "./shipment-seed";

export class InMemoryShipmentRepository implements ShipmentRepository {
  private readonly shipments = new Map<string, Shipment>(
    initialShipments.map((shipment) => [shipment.id, shipment]),
  );
  async findAll() {
    return Array.from(this.shipments.values());
  }
  async findById(id: string) {
    return this.shipments.get(id);
  }
  async findByTrackingCode(code: string) {
    return Array.from(this.shipments.values()).find((shipment) => shipment.trackingCode === code);
  }
  async create(input: ShipmentDraft) {
    if (await this.findByTrackingCode(input.trackingCode)) throw new DuplicateTrackingCodeError();

    const shipment = { ...input, id: crypto.randomUUID() };
    this.shipments.set(shipment.id, shipment);

    return shipment;
  }
  async update(id: string, changes: ShipmentChanges) {
    const current = await this.findById(id);

    if (!current) throw new ShipmentNotFoundError();

    const updated = { ...current, ...changes };
    this.shipments.set(id, updated);

    return updated;
  }
  async delete(id: string) {
    if (!this.shipments.delete(id)) throw new ShipmentNotFoundError();
  }
}

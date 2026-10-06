import type { Shipment, ShipmentChanges, ShipmentDraft } from "./shipment";

export interface ShipmentRepository {
  findAll(): Promise<readonly Shipment[]>;
  findById(id: string): Promise<Shipment | undefined>;
  findByTrackingCode(code: string): Promise<Shipment | undefined>;
  create(input: ShipmentDraft): Promise<Shipment>;
  update(id: string, changes: ShipmentChanges): Promise<Shipment>;
  delete(id: string): Promise<void>;
}

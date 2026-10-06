import type { GetFleetSnapshot } from "@/features/fleet/application/get-fleet-snapshot";
import type { ShipmentRepository } from "@/features/shipments/domain/shipment-repository";

import type { TrackingSnapshot } from "../domain/tracking-snapshot";

export class GetTrackingSnapshot {
  constructor(
    private readonly shipments: ShipmentRepository,
    private readonly fleet: GetFleetSnapshot,
  ) {}

  async execute(code: string): Promise<TrackingSnapshot | undefined> {
    const shipment = await this.shipments.findByTrackingCode(code);

    if (!shipment) return undefined;

    const assignedDriver = (await this.fleet.execute()).drivers.find(
      (driver) => driver.id === shipment.driverId,
    );
    const driver = assignedDriver && {
      id: assignedDriver.id,
      name: assignedDriver.name,
      vehicle: assignedDriver.vehicle,
      status: assignedDriver.status,
      lat: assignedDriver.lat,
      lng: assignedDriver.lng,
      updatedAt: assignedDriver.updatedAt,
    };

    return { shipment, driver };
  }
}

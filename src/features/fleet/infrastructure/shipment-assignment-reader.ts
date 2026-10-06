import { getShipmentContainer } from "@/features/shipments/server/container";

import type { DriverAssignmentReader } from "../domain/driver-assignment-reader";

export class ShipmentAssignmentReader implements DriverAssignmentReader {
  async hasActiveShipments(driverId: string) {
    return (await getShipmentContainer().repository.findAll()).some(
      (shipment) => shipment.driverId === driverId && shipment.status !== "delivered",
    );
  }
}

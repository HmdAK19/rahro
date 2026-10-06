import { getDatabasePool } from "@/core/database/pool";
import { RedisEventPublisher } from "@/core/realtime/redis-event-publisher";

import { DeleteDriver } from "../application/delete-driver";
import { GetFleetSnapshot } from "../application/get-fleet-snapshot";
import { ManageDrivers } from "../application/manage-drivers";
import { UpdateDriverLocation } from "../application/update-driver-location";
import type { DriverRepository } from "../domain/driver-repository";
import type { LocationRepository } from "../domain/location-repository";
import { initialDrivers } from "../infrastructure/fleet-seed";
import { InMemoryLocationRepository } from "../infrastructure/in-memory-location-repository";
import { PostgresFleetRepository } from "../infrastructure/postgres-fleet-repository";
import { ShipmentAssignmentReader } from "../infrastructure/shipment-assignment-reader";

type FleetRepository = DriverRepository & LocationRepository;
type Container = {
  getFleetSnapshot: GetFleetSnapshot;
  updateDriverLocation: UpdateDriverLocation;
  manageDrivers: ManageDrivers;
  deleteDriver: DeleteDriver;
  mode: "memory" | "postgres";
};
const globalContainer = globalThis as typeof globalThis & { __rahroContainer?: Container };

export function getFleetContainer(): Container {
  const mode = process.env.DATABASE_URL ? "postgres" : "memory";

  if (
    !globalContainer.__rahroContainer?.manageDrivers ||
    !globalContainer.__rahroContainer?.deleteDriver ||
    globalContainer.__rahroContainer.mode !== mode
  ) {
    const repository: FleetRepository =
      mode === "postgres"
        ? new PostgresFleetRepository(getDatabasePool())
        : new InMemoryLocationRepository(initialDrivers);
    const events = new RedisEventPublisher();
    globalContainer.__rahroContainer = {
      getFleetSnapshot: new GetFleetSnapshot(repository),
      updateDriverLocation: new UpdateDriverLocation(repository, events),
      manageDrivers: new ManageDrivers(repository, events),
      deleteDriver: new DeleteDriver(repository, new ShipmentAssignmentReader(), events),
      mode,
    };
  }

  return globalContainer.__rahroContainer;
}

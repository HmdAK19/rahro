import { getDatabasePool } from "@/core/database/pool";
import { RedisEventPublisher } from "@/core/realtime/redis-event-publisher";

import { ManageShipments } from "../application/manage-shipments";
import type { ShipmentRepository } from "../domain/shipment-repository";
import { InMemoryShipmentRepository } from "../infrastructure/in-memory-shipment-repository";
import { PostgresShipmentRepository } from "../infrastructure/postgres-shipment-repository";

type ShipmentContainer = {
  repository: ShipmentRepository;
  manageShipments: ManageShipments;
  mode: "memory" | "postgres";
};
const globalContainer = globalThis as typeof globalThis & {
  __rahroShipmentContainer?: ShipmentContainer;
};

export function getShipmentContainer(): ShipmentContainer {
  const mode = process.env.DATABASE_URL ? "postgres" : "memory";

  if (
    !globalContainer.__rahroShipmentContainer ||
    globalContainer.__rahroShipmentContainer.mode !== mode
  ) {
    const repository: ShipmentRepository =
      mode === "postgres"
        ? new PostgresShipmentRepository(getDatabasePool())
        : new InMemoryShipmentRepository();
    globalContainer.__rahroShipmentContainer = {
      repository,
      manageShipments: new ManageShipments(repository, new RedisEventPublisher()),
      mode,
    };
  }

  return globalContainer.__rahroShipmentContainer;
}

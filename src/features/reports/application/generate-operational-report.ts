import type { GetFleetSnapshot } from "@/features/fleet/application/get-fleet-snapshot";
import type { Shipment, ShipmentStatus } from "@/features/shipments/domain/shipment";
import type { ShipmentRepository } from "@/features/shipments/domain/shipment-repository";

import type { OperationalReport } from "../domain/operational-report";

const statuses: readonly ShipmentStatus[] = [
  "ready",
  "assigned",
  "in_transit",
  "delayed",
  "delivered",
];
const percentage = (count: number, total: number) =>
  total === 0 ? 0 : Math.round((count / total) * 100);

export class GenerateOperationalReport {
  constructor(
    private readonly shipments: ShipmentRepository,
    private readonly fleet: GetFleetSnapshot,
  ) {}

  async execute(): Promise<OperationalReport> {
    const [shipments, fleet] = await Promise.all([this.shipments.findAll(), this.fleet.execute()]);
    const total = shipments.length;
    const delivered = shipments.filter((item) => item.status === "delivered").length;
    const delayed = shipments.filter((item) => item.status === "delayed").length;
    const revenue = shipments
      .filter((item) => item.status === "delivered")
      .reduce((sum, item) => sum + item.price, 0);
    const branches = new Map<string, Shipment[]>();

    for (const shipment of shipments)
      branches.set(shipment.branch, [...(branches.get(shipment.branch) ?? []), shipment]);

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        total,
        active: total - delivered,
        delivered,
        delayed,
        revenue,
        completionRate: percentage(delivered, total),
      },
      byStatus: statuses.map((status) => {
        const count = shipments.filter((item) => item.status === status).length;

        return { status, count, percentage: percentage(count, total) };
      }),
      byBranch: Array.from(branches, ([branch, items]) => ({
        branch,
        total: items.length,
        delivered: items.filter((item) => item.status === "delivered").length,
        delayed: items.filter((item) => item.status === "delayed").length,
        revenue: items
          .filter((item) => item.status === "delivered")
          .reduce((sum, item) => sum + item.price, 0),
      })).sort((a, b) => b.total - a.total),
      byDriver: fleet.drivers
        .map((driver) => {
          const assigned = shipments.filter((item) => item.driverId === driver.id);

          return {
            driverId: driver.id,
            driverName: driver.name,
            assigned: assigned.length,
            delivered: assigned.filter((item) => item.status === "delivered").length,
            active: assigned.filter((item) => item.status !== "delivered").length,
          };
        })
        .sort((a, b) => b.delivered - a.delivered || b.assigned - a.assigned),
    };
  }
}

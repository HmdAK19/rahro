import type { Pool } from "pg";

import {
  DuplicateTrackingCodeError,
  type Shipment,
  type ShipmentChanges,
  type ShipmentDraft,
  ShipmentNotFoundError,
  type ShipmentStatus,
} from "../domain/shipment";
import type { ShipmentRepository } from "../domain/shipment-repository";

type Row = {
  id: string;
  tracking_code: string;
  customer: string;
  address: string;
  branch_name: string;
  driver_id: string | null;
  status: ShipmentStatus;
  eta: string;
  price: string;
};
const map = (row: Row): Shipment => ({
  id: row.id,
  trackingCode: row.tracking_code,
  customer: row.customer,
  address: row.address,
  branch: row.branch_name,
  driverId: row.driver_id,
  status: row.status,
  eta: row.eta,
  price: Number(row.price),
});
const duplicate = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "23505";

export class PostgresShipmentRepository implements ShipmentRepository {
  constructor(private readonly pool: Pool) {}
  async findAll() {
    const result = await this.pool.query<Row>(
      "SELECT id, tracking_code, customer, address, branch_name, driver_id, status, eta, price FROM shipments ORDER BY created_at DESC",
    );

    return result.rows.map(map);
  }
  async findById(id: string) {
    const result = await this.pool.query<Row>(
      "SELECT id, tracking_code, customer, address, branch_name, driver_id, status, eta, price FROM shipments WHERE id=$1",
      [id],
    );

    return result.rows[0] ? map(result.rows[0]) : undefined;
  }
  async findByTrackingCode(code: string) {
    const result = await this.pool.query<Row>(
      "SELECT id, tracking_code, customer, address, branch_name, driver_id, status, eta, price FROM shipments WHERE tracking_code=$1",
      [code],
    );

    return result.rows[0] ? map(result.rows[0]) : undefined;
  }
  async create(input: ShipmentDraft) {
    try {
      const result = await this.pool.query<Row>(
        "INSERT INTO shipments(id,tracking_code,customer,address,branch_name,driver_id,status,eta,price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id,tracking_code,customer,address,branch_name,driver_id,status,eta,price",
        [
          crypto.randomUUID(),
          input.trackingCode,
          input.customer,
          input.address,
          input.branch,
          input.driverId,
          input.status,
          input.eta,
          input.price,
        ],
      );

      return map(result.rows[0]);
    } catch (error) {
      if (duplicate(error)) throw new DuplicateTrackingCodeError();

      throw error;
    }
  }
  async update(id: string, changes: ShipmentChanges) {
    const entries = Object.entries(changes);
    const columns: Record<string, string> = {
      customer: "customer",
      address: "address",
      branch: "branch_name",
      driverId: "driver_id",
      status: "status",
      eta: "eta",
      price: "price",
    };
    const sets = entries.map(([key], index) => `${columns[key]}=$${index + 2}`);
    const result = await this.pool.query<Row>(
      `UPDATE shipments SET ${sets.join(",")}, updated_at=now() WHERE id=$1 RETURNING id,tracking_code,customer,address,branch_name,driver_id,status,eta,price`,
      [id, ...entries.map(([, value]) => value)],
    );

    if (!result.rows[0]) throw new ShipmentNotFoundError();

    return map(result.rows[0]);
  }
  async delete(id: string) {
    const result = await this.pool.query("DELETE FROM shipments WHERE id=$1", [id]);

    if (!result.rowCount) throw new ShipmentNotFoundError();
  }
}

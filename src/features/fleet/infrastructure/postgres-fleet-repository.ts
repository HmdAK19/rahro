import type { Pool, PoolClient } from "pg";

import {
  type Driver,
  type DriverChanges,
  type DriverDraft,
  type DriverStatus,
  DuplicateDriverPhoneError,
  type LocationSource,
} from "../domain/driver";
import type { DriverRepository } from "../domain/driver-repository";
import { DriverNotFoundError, type LocationInput, StaleLocationError } from "../domain/location";
import type { FleetSnapshot, LocationRepository } from "../domain/location-repository";

type Row = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  status: DriverStatus;
  latitude: number;
  longitude: number;
  accuracy: number;
  location_updated_at: Date;
  location_source: LocationSource;
};
const map = (row: Row): Driver => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  vehicle: row.vehicle,
  plate: row.plate,
  status: row.status,
  lat: Number(row.latitude),
  lng: Number(row.longitude),
  accuracy: Number(row.accuracy),
  updatedAt: new Date(row.location_updated_at).toISOString(),
  source: row.location_source,
});
const select =
  "SELECT id,name,phone,vehicle,plate,status,latitude,longitude,accuracy,location_updated_at,location_source FROM drivers";
const duplicate = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "23505";

export class PostgresFleetRepository implements DriverRepository, LocationRepository {
  constructor(private readonly pool: Pool) {}
  async findAll() {
    const result = await this.pool.query<Row>(`${select} ORDER BY created_at`);

    return result.rows.map(map);
  }
  async findById(id: string) {
    const result = await this.pool.query<Row>(`${select} WHERE id=$1`, [id]);

    return result.rows[0] ? map(result.rows[0]) : undefined;
  }
  async getSnapshot(): Promise<FleetSnapshot> {
    const [drivers, event] = await Promise.all([
      this.findAll(),
      this.pool.query<{ id: string }>("SELECT COALESCE(MAX(id),0)::text id FROM location_events"),
    ]);

    return { drivers, lastEventId: Number(event.rows[0].id) };
  }
  async create(input: DriverDraft) {
    try {
      const result = await this.pool.query<Row>(
        "INSERT INTO drivers(id,name,phone,vehicle,plate,status,latitude,longitude) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id,name,phone,vehicle,plate,status,latitude,longitude,accuracy,location_updated_at,location_source",
        [
          crypto.randomUUID(),
          input.name,
          input.phone,
          input.vehicle,
          input.plate,
          input.status,
          input.lat,
          input.lng,
        ],
      );

      return map(result.rows[0]);
    } catch (error) {
      if (duplicate(error)) throw new DuplicateDriverPhoneError();

      throw error;
    }
  }
  async update(id: string, changes: DriverChanges) {
    const entries = Object.entries(changes);
    const columns: Record<string, string> = {
      name: "name",
      phone: "phone",
      vehicle: "vehicle",
      plate: "plate",
      status: "status",
      lat: "latitude",
      lng: "longitude",
    };
    const sets = entries.map(([key], index) => `${columns[key]}=$${index + 2}`);

    try {
      const result = await this.pool.query<Row>(
        `UPDATE drivers SET ${sets.join(",")},updated_at=now() WHERE id=$1 RETURNING id,name,phone,vehicle,plate,status,latitude,longitude,accuracy,location_updated_at,location_source`,
        [id, ...entries.map(([, value]) => value)],
      );

      if (!result.rows[0]) throw new DriverNotFoundError();

      return map(result.rows[0]);
    } catch (error) {
      if (duplicate(error)) throw new DuplicateDriverPhoneError();

      throw error;
    }
  }
  async delete(id: string) {
    const result = await this.pool.query("DELETE FROM drivers WHERE id=$1", [id]);

    if (!result.rowCount) throw new DriverNotFoundError();
  }
  async updateLocation(input: LocationInput) {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const result = await this.persistLocation(client, input);
      await client.query("COMMIT");

      return result;
    } catch (error) {
      await client.query("ROLLBACK");

      throw error;
    } finally {
      client.release();
    }
  }
  private async persistLocation(client: PoolClient, input: LocationInput) {
    const result = await client.query<Row>(
      "UPDATE drivers SET latitude=$2,longitude=$3,accuracy=$4,location_updated_at=$5,location_sequence=$6,location_source=$7,status='delivering',updated_at=now() WHERE id=$1 AND location_sequence<$6 RETURNING id,name,phone,vehicle,plate,status,latitude,longitude,accuracy,location_updated_at,location_source",
      [
        input.driverId,
        input.lat,
        input.lng,
        input.accuracy,
        input.capturedAt,
        input.sequenceNumber,
        input.source,
      ],
    );

    if (!result.rows[0]) {
      const exists = await client.query("SELECT 1 FROM drivers WHERE id=$1", [input.driverId]);

      if (!exists.rowCount) throw new DriverNotFoundError();

      throw new StaleLocationError();
    }
    await client.query(
      "INSERT INTO location_events(driver_id,latitude,longitude,accuracy,captured_at,sequence_number,source) VALUES($1,$2,$3,$4,$5,$6,$7)",
      [
        input.driverId,
        input.lat,
        input.lng,
        input.accuracy,
        input.capturedAt,
        input.sequenceNumber,
        input.source,
      ],
    );

    return map(result.rows[0]);
  }
}

import {
  type Driver,
  type DriverChanges,
  type DriverDraft,
  DuplicateDriverPhoneError,
} from "../domain/driver";
import type { DriverRepository } from "../domain/driver-repository";
import { DriverNotFoundError, type LocationInput, StaleLocationError } from "../domain/location";
import type { FleetSnapshot, LocationRepository } from "../domain/location-repository";

export class InMemoryLocationRepository implements LocationRepository, DriverRepository {
  private readonly drivers: Map<string, Driver>;
  private readonly sequences = new Map<string, number>();
  private lastEventId = 0;

  constructor(seed: readonly Driver[]) {
    this.drivers = new Map(seed.map((driver) => [driver.id, driver]));
  }
  async getSnapshot(): Promise<FleetSnapshot> {
    return { drivers: Array.from(this.drivers.values()), lastEventId: this.lastEventId };
  }
  async findAll() {
    return Array.from(this.drivers.values());
  }
  async findById(id: string) {
    return this.drivers.get(id);
  }
  async create(input: DriverDraft) {
    if ((await this.findAll()).some((driver) => driver.phone === input.phone))
      throw new DuplicateDriverPhoneError();

    const driver: Driver = {
      ...input,
      id: crypto.randomUUID(),
      accuracy: 0,
      updatedAt: new Date().toISOString(),
      source: "simulator",
    };
    this.drivers.set(driver.id, driver);
    this.lastEventId += 1;

    return driver;
  }
  async update(id: string, changes: DriverChanges) {
    const current = this.drivers.get(id);

    if (!current) throw new DriverNotFoundError();
    if (
      changes.phone &&
      (await this.findAll()).some((driver) => driver.id !== id && driver.phone === changes.phone)
    )
      throw new DuplicateDriverPhoneError();

    const updated = { ...current, ...changes, updatedAt: new Date().toISOString() };
    this.drivers.set(id, updated);
    this.lastEventId += 1;

    return updated;
  }
  async delete(id: string) {
    if (!this.drivers.delete(id)) throw new DriverNotFoundError();
    this.sequences.delete(id);
    this.lastEventId += 1;
  }
  async updateLocation(input: LocationInput): Promise<Driver> {
    const driver = this.drivers.get(input.driverId);

    if (!driver) throw new DriverNotFoundError();
    if (input.sequenceNumber <= (this.sequences.get(input.driverId) ?? -1))
      throw new StaleLocationError();

    const updated: Driver = {
      ...driver,
      lat: input.lat,
      lng: input.lng,
      accuracy: input.accuracy,
      source: input.source,
      status: "delivering",
      updatedAt: input.capturedAt,
    };
    this.drivers.set(input.driverId, updated);
    this.sequences.set(input.driverId, input.sequenceNumber);
    this.lastEventId += 1;

    return updated;
  }
}

import type { FleetSnapshot, LocationRepository } from "../domain/location-repository";

export class GetFleetSnapshot {
  constructor(private readonly repository: LocationRepository) {}
  async execute(): Promise<FleetSnapshot> {
    return this.repository.getSnapshot();
  }
}

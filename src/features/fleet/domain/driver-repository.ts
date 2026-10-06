import type { Driver, DriverChanges, DriverDraft } from "./driver";

export interface DriverRepository {
  findAll(): Promise<readonly Driver[]>;
  findById(id: string): Promise<Driver | undefined>;
  create(input: DriverDraft): Promise<Driver>;
  update(id: string, changes: DriverChanges): Promise<Driver>;
  delete(id: string): Promise<void>;
}

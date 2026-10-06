export interface DriverAssignmentReader {
  hasActiveShipments(driverId: string): Promise<boolean>;
}

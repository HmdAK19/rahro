import type { ShipmentStatus } from "@/features/shipments/domain/shipment";

export interface ReportSummary {
  readonly total: number;
  readonly active: number;
  readonly delivered: number;
  readonly delayed: number;
  readonly revenue: number;
  readonly completionRate: number;
}

export interface StatusReportItem {
  readonly status: ShipmentStatus;
  readonly count: number;
  readonly percentage: number;
}

export interface BranchReportItem {
  readonly branch: string;
  readonly total: number;
  readonly delivered: number;
  readonly delayed: number;
  readonly revenue: number;
}

export interface DriverReportItem {
  readonly driverId: string;
  readonly driverName: string;
  readonly assigned: number;
  readonly delivered: number;
  readonly active: number;
}

export interface OperationalReport {
  readonly generatedAt: string;
  readonly summary: ReportSummary;
  readonly byStatus: readonly StatusReportItem[];
  readonly byBranch: readonly BranchReportItem[];
  readonly byDriver: readonly DriverReportItem[];
}

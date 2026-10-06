import { getFleetContainer } from "@/features/fleet/server/container";
import { getShipmentContainer } from "@/features/shipments/server/container";

import { GenerateOperationalReport } from "../application/generate-operational-report";

export function getReportsContainer() {
  return {
    generateOperationalReport: new GenerateOperationalReport(
      getShipmentContainer().repository,
      getFleetContainer().getFleetSnapshot,
    ),
  };
}

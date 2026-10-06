import { getFleetContainer } from "@/features/fleet/server/container";
import { getShipmentContainer } from "@/features/shipments/server/container";

import { GetTrackingSnapshot } from "../application/get-tracking-snapshot";

export function getTrackingContainer() {
  return {
    getTrackingSnapshot: new GetTrackingSnapshot(
      getShipmentContainer().repository,
      getFleetContainer().getFleetSnapshot,
    ),
  };
}

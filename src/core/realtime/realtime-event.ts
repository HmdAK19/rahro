export type RealtimeEvent =
  | {
      readonly type: "driver.location.updated";
      readonly driverId: string;
      readonly occurredAt: string;
    }
  | { readonly type: "driver.changed"; readonly driverId: string; readonly occurredAt: string }
  | {
      readonly type: "shipment.changed";
      readonly shipmentId: string;
      readonly trackingCode?: string;
      readonly occurredAt: string;
    };

export interface RealtimeEventPublisher {
  publish(event: RealtimeEvent): Promise<void>;
}

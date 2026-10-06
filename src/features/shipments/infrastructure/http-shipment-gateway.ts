import type { Shipment, ShipmentChanges, ShipmentDraft } from "../domain/shipment";

export class ShipmentRequestError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

export interface ShipmentGateway {
  list(signal?: AbortSignal): Promise<readonly Shipment[]>;
  create(input: ShipmentDraft): Promise<Shipment>;
  update(id: string, changes: ShipmentChanges): Promise<Shipment>;
  delete(id: string): Promise<void>;
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => ({ error: "UNKNOWN_ERROR" }))) as {
      error?: string;
    };

    throw new ShipmentRequestError(body.error ?? "UNKNOWN_ERROR");
  }

  return response.json() as Promise<T>;
}

export class HttpShipmentGateway implements ShipmentGateway {
  list(signal?: AbortSignal) {
    return fetch("/api/shipments", { cache: "no-store", signal }).then((response) =>
      parse<readonly Shipment[]>(response),
    );
  }
  create(input: ShipmentDraft) {
    return fetch("/api/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then((response) => parse<Shipment>(response));
  }
  update(id: string, changes: ShipmentChanges) {
    return fetch(`/api/shipments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    }).then((response) => parse<Shipment>(response));
  }
  async delete(id: string) {
    const response = await fetch(`/api/shipments/${id}`, { method: "DELETE" });

    if (!response.ok) throw new ShipmentRequestError("DELETE_FAILED");
  }
}

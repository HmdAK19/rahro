import {
  DuplicateTrackingCodeError,
  InvalidShipmentError,
  ShipmentNotFoundError,
} from "../domain/shipment";
import { parseShipmentChanges, parseShipmentDraft } from "../domain/shipment-validator";
import { getShipmentContainer } from "../server/container";

const errorResponse = (error: unknown) => {
  const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
  const status =
    error instanceof InvalidShipmentError
      ? 400
      : error instanceof ShipmentNotFoundError
        ? 404
        : error instanceof DuplicateTrackingCodeError
          ? 409
          : 500;

  return Response.json({ error: message }, { status });
};

export async function listShipmentsResponse() {
  return Response.json(await getShipmentContainer().manageShipments.list(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function createShipmentResponse(request: Request) {
  try {
    return Response.json(
      await getShipmentContainer().manageShipments.create(parseShipmentDraft(await request.json())),
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function updateShipmentResponse(request: Request, id: string) {
  try {
    return Response.json(
      await getShipmentContainer().manageShipments.update(
        id,
        parseShipmentChanges(await request.json()),
      ),
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function deleteShipmentResponse(id: string) {
  try {
    await getShipmentContainer().manageShipments.delete(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}

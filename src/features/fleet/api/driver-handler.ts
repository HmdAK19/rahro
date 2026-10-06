import {
  DriverHasShipmentsError,
  DuplicateDriverPhoneError,
  InvalidDriverError,
} from "../domain/driver";
import { parseDriverChanges, parseDriverDraft } from "../domain/driver-validator";
import { DriverNotFoundError } from "../domain/location";
import { getFleetContainer } from "../server/container";

const errorResponse = (error: unknown) => {
  const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
  const status =
    error instanceof InvalidDriverError
      ? 400
      : error instanceof DriverNotFoundError
        ? 404
        : error instanceof DuplicateDriverPhoneError || error instanceof DriverHasShipmentsError
          ? 409
          : 500;

  return Response.json({ error: message }, { status });
};

export async function listDriversResponse() {
  return Response.json(await getFleetContainer().manageDrivers.list(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function createDriverResponse(request: Request) {
  try {
    return Response.json(
      await getFleetContainer().manageDrivers.create(parseDriverDraft(await request.json())),
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function updateDriverResponse(request: Request, id: string) {
  try {
    return Response.json(
      await getFleetContainer().manageDrivers.update(id, parseDriverChanges(await request.json())),
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function deleteDriverResponse(id: string) {
  try {
    await getFleetContainer().deleteDriver.execute(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}

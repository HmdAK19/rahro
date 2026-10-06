import { DriverNotFoundError, InvalidLocationError } from "../domain/location";
import { parseLocationInput } from "../domain/location-validator";
import { getFleetContainer } from "../server/container";

export async function getLocationsResponse(): Promise<Response> {
  return Response.json(await getFleetContainer().getFleetSnapshot.execute(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function updateLocationResponse(request: Request): Promise<Response> {
  try {
    const input = parseLocationInput(await request.json());

    return Response.json(await getFleetContainer().updateDriverLocation.execute(input), {
      status: 202,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    const status =
      error instanceof InvalidLocationError
        ? 400
        : error instanceof DriverNotFoundError
          ? 404
          : 409;

    return Response.json({ error: message }, { status });
  }
}

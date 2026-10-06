import { authorizeRequest } from "@/features/auth/server/authorization";
import {
  getLocationsResponse,
  updateLocationResponse,
} from "@/features/fleet/api/location-handler";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await authorizeRequest(request, "read");

  return auth instanceof Response ? auth : getLocationsResponse();
}

export async function POST(request: Request) {
  const auth = await authorizeRequest(request, "manage");

  return auth instanceof Response ? auth : updateLocationResponse(request);
}

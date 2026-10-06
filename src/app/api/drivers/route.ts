import { authorizeRequest } from "@/features/auth/server/authorization";
import { createDriverResponse, listDriversResponse } from "@/features/fleet/api/driver-handler";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await authorizeRequest(request, "read");

  return auth instanceof Response ? auth : listDriversResponse();
}

export async function POST(request: Request) {
  const auth = await authorizeRequest(request, "manage");

  return auth instanceof Response ? auth : createDriverResponse(request);
}

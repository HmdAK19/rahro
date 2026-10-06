import { authorizeRequest } from "@/features/auth/server/authorization";
import {
  createShipmentResponse,
  listShipmentsResponse,
} from "@/features/shipments/api/shipment-handler";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await authorizeRequest(request, "read");

  return auth instanceof Response ? auth : listShipmentsResponse();
}

export async function POST(request: Request) {
  const auth = await authorizeRequest(request, "manage");

  return auth instanceof Response ? auth : createShipmentResponse(request);
}

import { authorizeRequest } from "@/features/auth/server/authorization";
import {
  deleteShipmentResponse,
  updateShipmentResponse,
} from "@/features/shipments/api/shipment-handler";

export async function PATCH(request: Request, context: RouteContext<"/api/shipments/[id]">) {
  const auth = await authorizeRequest(request, "manage");

  return auth instanceof Response
    ? auth
    : updateShipmentResponse(request, (await context.params).id);
}

export async function DELETE(request: Request, context: RouteContext<"/api/shipments/[id]">) {
  const auth = await authorizeRequest(request, "manage");

  return auth instanceof Response ? auth : deleteShipmentResponse((await context.params).id);
}

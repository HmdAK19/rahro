import { authorizeRequest } from "@/features/auth/server/authorization";
import { deleteDriverResponse, updateDriverResponse } from "@/features/fleet/api/driver-handler";

export async function PATCH(request: Request, context: RouteContext<"/api/drivers/[id]">) {
  const auth = await authorizeRequest(request, "manage");

  return auth instanceof Response ? auth : updateDriverResponse(request, (await context.params).id);
}

export async function DELETE(request: Request, context: RouteContext<"/api/drivers/[id]">) {
  const auth = await authorizeRequest(request, "manage");

  return auth instanceof Response ? auth : deleteDriverResponse((await context.params).id);
}

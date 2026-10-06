import { getTrackingResponse } from "@/features/tracking/api/tracking-handler";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: RouteContext<"/api/tracking/[code]">) {
  const { code } = await params;

  return getTrackingResponse(code);
}

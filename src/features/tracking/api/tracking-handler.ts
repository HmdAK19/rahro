import { getTrackingContainer } from "../server/container";

export async function getTrackingResponse(code: string): Promise<Response> {
  const snapshot = await getTrackingContainer().getTrackingSnapshot.execute(code);

  if (!snapshot) return Response.json({ error: "SHIPMENT_NOT_FOUND" }, { status: 404 });

  return Response.json(snapshot, { headers: { "Cache-Control": "no-store" } });
}

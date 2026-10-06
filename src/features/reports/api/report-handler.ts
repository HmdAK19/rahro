import { getReportsContainer } from "../server/container";

export async function operationalReportResponse() {
  return Response.json(await getReportsContainer().generateOperationalReport.execute(), {
    headers: { "Cache-Control": "no-store" },
  });
}

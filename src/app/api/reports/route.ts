import { authorizeRequest } from "@/features/auth/server/authorization";
import { operationalReportResponse } from "@/features/reports/api/report-handler";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await authorizeRequest(request, "read");

  return auth instanceof Response ? auth : operationalReportResponse();
}

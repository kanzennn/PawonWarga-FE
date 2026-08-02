import { apiFetch } from "@/lib/api-client";
import { USE_MOCK_API } from "@/lib/api/config";
import { endpoints } from "@/lib/api/endpoints";
import { mockResponse, withQuery } from "@/lib/api/http";
import { mapDashboardOverview } from "@/lib/api/mappers";
import { buildDashboardOverview } from "@/lib/api/mock/dashboard.mock";
import type { DashboardOverview, DashboardOverviewDto, DashboardQuery } from "@/lib/api/types";

export async function getDashboardOverview(
  query: DashboardQuery = {},
  token?: string,
): Promise<DashboardOverview> {
  const dto = USE_MOCK_API
    ? await mockResponse(buildDashboardOverview)
    : await apiFetch<DashboardOverviewDto>(
        withQuery(endpoints.dashboard.overview, {
          range: query.range,
          from: query.from,
          to: query.to,
        }),
        { token },
      );

  return mapDashboardOverview(dto);
}

"use client";

import { useAuth } from "@/context/auth-context";
import { useApiQuery, type ApiQueryState } from "@/hooks/use-api-query";
import { getDashboardOverview } from "@/lib/api/dashboard";
import type { DashboardOverview, DashboardQuery } from "@/lib/api/types";

export function useDashboardOverview(
  query: DashboardQuery = {},
): ApiQueryState<DashboardOverview> {
  const { token } = useAuth();

  return useApiQuery(
    () => getDashboardOverview(query, token ?? undefined),
    [query.range, query.from, query.to, query.platform, token],
  );
}

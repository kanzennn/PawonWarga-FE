"use client";

import { useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { useApiMutation, type ApiMutationState } from "@/hooks/use-api-mutation";
import { useApiQuery, type ApiQueryState } from "@/hooks/use-api-query";
import { generateReport, getReportTemplates, getReports } from "@/lib/api/reports";
import type { ReportDocument, ReportTemplate } from "@/lib/business-logic";
import type { GenerateReportInput, ReportListResult } from "@/lib/api/types";

export function useReports(): ApiQueryState<ReportListResult> {
  const { token } = useAuth();

  return useApiQuery(() => getReports(token ?? undefined), [token]);
}

export function useReportTemplates(): ApiQueryState<ReportTemplate[]> {
  const { token } = useAuth();

  return useApiQuery(() => getReportTemplates(token ?? undefined), [token]);
}

export function useReportGenerator(): ApiMutationState<GenerateReportInput, ReportDocument> {
  const { token } = useAuth();

  const action = useCallback(
    (input: GenerateReportInput) => generateReport(input, token ?? undefined),
    [token],
  );

  return useApiMutation(action);
}

import { apiFetch } from "@/lib/api-client";
import { USE_MOCK_API } from "@/lib/api/config";
import { endpoints } from "@/lib/api/endpoints";
import { mockResponse } from "@/lib/api/http";
import { mapReportDocument, mapReportList, mapReportTemplate } from "@/lib/api/mappers";
import {
  buildReportDocument,
  buildReportList,
  buildReportTemplates,
} from "@/lib/api/mock/reports.mock";
import type { ReportDocument, ReportTemplate } from "@/lib/business-logic";
import type {
  GenerateReportInput,
  GenerateReportRequestDto,
  ReportDocumentDto,
  ReportListResponseDto,
  ReportListResult,
  ReportTemplateDto,
} from "@/lib/api/types";

export async function getReports(token?: string): Promise<ReportListResult> {
  const dto = USE_MOCK_API
    ? await mockResponse(buildReportList)
    : await apiFetch<ReportListResponseDto>(endpoints.reports.list, { token });

  return mapReportList(dto);
}

export async function getReportTemplates(token?: string): Promise<ReportTemplate[]> {
  const dto = USE_MOCK_API
    ? await mockResponse(buildReportTemplates)
    : await apiFetch<ReportTemplateDto[]>(endpoints.reports.templates, { token });

  return dto.map(mapReportTemplate);
}

export async function generateReport(
  input: GenerateReportInput,
  token?: string,
): Promise<ReportDocument> {
  const payload: GenerateReportRequestDto = {
    type: input.type,
    date_range: input.dateRange,
    format: input.format,
    template_id: input.templateId,
  };

  const dto = USE_MOCK_API
    ? await mockResponse(() => buildReportDocument(input))
    : await apiFetch<ReportDocumentDto>(endpoints.reports.generate, {
        method: "POST",
        token,
        body: JSON.stringify(payload),
      });

  return mapReportDocument(dto);
}

export async function getReport(id: string, token?: string): Promise<ReportDocument> {
  const dto = USE_MOCK_API
    ? await mockResponse(() =>
        buildReportDocument({
          type: "Executive Summary",
          dateRange: "1 - 31 Mei 2025",
          format: "PDF",
          templateId: "executive-brief",
        }),
      )
    : await apiFetch<ReportDocumentDto>(endpoints.reports.detail(id), { token });

  return mapReportDocument(dto);
}

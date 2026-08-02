import { generateReportDocument, reportTemplates } from "@/lib/business-logic";
import { reportEngagementStats, reports } from "@/lib/data/dummy-data";
import { toReportDocumentDto, toReportTemplateDto } from "@/lib/api/mock/to-dto";
import type {
  GenerateReportInput,
  ReportDocumentDto,
  ReportListResponseDto,
  ReportTemplateDto,
} from "@/lib/api/types";

export function buildReportList(): ReportListResponseDto {
  const scheduled = reports.filter((item) => item.status === "Scheduled").length;

  return {
    items: reports,
    stats: {
      total: { value: String(reports.length), change: "Dummy data" },
      scheduled: { value: String(scheduled), change: "Stable" },
      downloads: reportEngagementStats.downloads,
      shared: reportEngagementStats.shared,
    },
  };
}

export function buildReportTemplates(): ReportTemplateDto[] {
  return reportTemplates.map(toReportTemplateDto);
}

export function buildReportDocument(input: GenerateReportInput): ReportDocumentDto {
  return toReportDocumentDto(
    generateReportDocument({
      type: input.type,
      dateRange: input.dateRange,
      format: input.format,
      templateId: input.templateId,
    }),
  );
}

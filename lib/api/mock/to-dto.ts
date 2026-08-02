// The mocks build data with lib/business-logic.ts, which returns app-shaped
// (camelCase) objects. These helpers push them back into wire shape so the
// mock path goes through lib/api/mappers.ts exactly like a real response does.
import type { PlatformDatum } from "@/lib/types";
import type { ReportDocument, ReportTemplate } from "@/lib/business-logic";
import type {
  PlatformDatumDto,
  ReportDocumentDto,
  ReportTemplateDto,
} from "@/lib/api/types";

export function toPlatformDatumDto(item: PlatformDatum): PlatformDatumDto {
  return {
    name: item.name,
    value: item.value,
    positive: item.positive,
    negative: item.negative,
    neutral: item.neutral,
    mention_count: item.mentionCount,
  };
}

export function toReportTemplateDto(template: ReportTemplate): ReportTemplateDto {
  return {
    id: template.id,
    name: template.name,
    best_for: template.bestFor,
    tone: template.tone,
    layout: template.layout,
    sections: template.sections,
  };
}

export function toReportDocumentDto(document: ReportDocument): ReportDocumentDto {
  return {
    id: document.id,
    title: document.title,
    type: document.type,
    status: document.status,
    date: document.date,
    pages: document.pages,
    format: document.format,
    template: toReportTemplateDto(document.template),
    highlights: document.highlights,
    prepared_for: document.preparedFor,
    period: document.period,
    metrics: document.metrics,
    sections: document.sections,
    appendix: document.appendix,
  };
}

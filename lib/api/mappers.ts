// Wire (snake_case) -> app (camelCase) conversion. Every response from
// lib/api/* passes through here, including mocked ones, so the mapping path is
// exercised long before the real backend exists. When PawonWarga-BE ships a
// field under a different name, this file is the only thing that changes.
import type { PlatformDatum } from "@/lib/types";
import type { ReportDocument, ReportTemplate } from "@/lib/business-logic";
import type {
  AiInsight,
  AiInsightDto,
  DashboardOverview,
  DashboardOverviewDto,
  KeywordListResponseDto,
  KeywordListResult,
  MentionListResponseDto,
  MentionListResult,
  Pagination,
  PaginationDto,
  PlatformDatumDto,
  ReportDocumentDto,
  ReportListResponseDto,
  ReportListResult,
  ReportTemplateDto,
  SentimentOverview,
  SentimentOverviewDto,
} from "@/lib/api/types";

export function mapPlatformDatum(dto: PlatformDatumDto): PlatformDatum {
  return {
    name: dto.name,
    value: dto.value,
    positive: dto.positive,
    negative: dto.negative,
    neutral: dto.neutral,
    mentionCount: dto.mention_count,
  };
}

export function mapPagination(dto: PaginationDto): Pagination {
  return {
    page: dto.page,
    perPage: dto.per_page,
    total: dto.total,
    totalPages: dto.total_pages,
  };
}

export function mapDashboardOverview(dto: DashboardOverviewDto): DashboardOverview {
  return {
    headline: {
      positiveShare: dto.headline.positive_share,
      totalConversations: dto.headline.total_conversations,
      description: dto.headline.description,
    },
    summary: {
      totalMentions: dto.summary.total_mentions,
      positive: dto.summary.positive,
      negative: dto.summary.negative,
      neutral: dto.summary.neutral,
    },
    trend: dto.trend,
    topicDistribution: dto.topic_distribution,
    topicTotal: dto.topic_total,
    keywordCloud: dto.keyword_cloud,
    recentMentions: dto.recent_mentions,
    drivers: dto.drivers,
    dataSources: dto.data_sources,
    lastUpdated: dto.last_updated,
  };
}

export function mapMentionList(dto: MentionListResponseDto): MentionListResult {
  return {
    items: dto.items,
    pagination: mapPagination(dto.pagination),
    metrics: {
      liveMentions: dto.metrics.live_mentions,
      totalEngagement: dto.metrics.total_engagement,
      totalComments: dto.metrics.total_comments,
      uniqueAuthors: dto.metrics.unique_authors,
      flaggedIssues: dto.metrics.flagged_issues,
    },
    platformVolume: dto.platform_volume.map(mapPlatformDatum),
    totalUnfiltered: dto.total_unfiltered,
    platforms: dto.platforms,
  };
}

export function mapSentimentOverview(dto: SentimentOverviewDto): SentimentOverview {
  return {
    score: dto.score,
    scoreMax: dto.score_max,
    description: dto.description,
    summary: dto.summary,
    distribution: dto.distribution,
    trend: dto.trend,
    trendInsights: dto.trend_insights,
    byPlatform: dto.by_platform.map(mapPlatformDatum),
    byCategory: dto.by_category,
    categoryNote: dto.category_note,
  };
}

export function mapKeywordList(dto: KeywordListResponseDto): KeywordListResult {
  return {
    items: dto.items,
    stats: dto.stats,
    alerts: dto.alerts,
  };
}

export function mapAiInsight(dto: AiInsightDto): AiInsight {
  return {
    score: dto.score,
    scoreNote: dto.score_note,
    confidence: dto.confidence,
    headline: dto.headline,
    summary: dto.summary,
    findings: dto.findings,
    recommendations: dto.recommendations,
    stats: {
      confidence: dto.stats.confidence,
      generatedInsights: dto.stats.generated_insights,
      detectedIssues: dto.stats.detected_issues,
      resolvedSignals: dto.stats.resolved_signals,
    },
  };
}

export function mapReportTemplate(dto: ReportTemplateDto): ReportTemplate {
  return {
    id: dto.id,
    name: dto.name,
    bestFor: dto.best_for,
    tone: dto.tone,
    layout: dto.layout,
    sections: dto.sections,
  };
}

export function mapReportList(dto: ReportListResponseDto): ReportListResult {
  return {
    items: dto.items,
    stats: dto.stats,
  };
}

export function mapReportDocument(dto: ReportDocumentDto): ReportDocument {
  return {
    id: dto.id,
    title: dto.title,
    type: dto.type,
    status: dto.status,
    date: dto.date,
    pages: dto.pages,
    format: dto.format,
    template: mapReportTemplate(dto.template),
    highlights: dto.highlights,
    preparedFor: dto.prepared_for,
    period: dto.period,
    metrics: dto.metrics,
    sections: dto.sections,
    appendix: dto.appendix,
  };
}

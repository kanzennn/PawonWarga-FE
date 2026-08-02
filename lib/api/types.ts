// Wire shapes (`*Dto`) mirror the JSON PawonWarga-BE is expected to return —
// snake_case, matching the convention already used by /auth/* (phone_number,
// profile_picture). App-facing shapes are camelCase and are what hooks and
// pages consume. lib/api/mappers.ts is the only place that converts between
// the two, so a backend contract change is a one-file fix.
import type {
  CategorySentiment,
  DataSourceStatus,
  Keyword,
  LocationSentiment,
  Mention,
  MetricValue,
  MonitoringPreference,
  PlatformDatum,
  ReportListItem,
  SentimentDistributionSlice,
  SentimentDriver,
  SentimentTrendPoint,
  SettingsIntegration,
  TopicSlice,
  TrendInsight,
  WordCloudWord,
} from "@/lib/types";
import type {
  KeywordAlert,
  KeywordStats,
  MentionMetrics,
  ReportDocument,
  ReportMetricBlock,
  ReportSection,
  ReportTemplate,
} from "@/lib/business-logic";

// Types whose field names are already identical on both sides — no mapping
// needed, aliased so services can still name the wire side explicitly.
export type MentionDto = Mention;
export type KeywordDto = Keyword;
export type SentimentTrendPointDto = SentimentTrendPoint;
export type SentimentDistributionSliceDto = SentimentDistributionSlice;
export type CategorySentimentDto = CategorySentiment;
export type LocationSentimentDto = LocationSentiment;
export type ReportListItemDto = ReportListItem;
export type SettingsIntegrationDto = SettingsIntegration;
export type WordCloudWordDto = WordCloudWord;

// Domain shapes that happen to be identical on the wire are re-exported so a
// consumer can import everything it needs from lib/api/types.
export type {
  DataSourceStatus,
  MetricValue,
  MonitoringPreference,
  SentimentDriver,
  TopicSlice,
  TrendInsight,
};

export interface MetricValueDto {
  value: string;
  change: string;
}

export interface PlatformDatumDto {
  name: string;
  value: number;
  positive: number;
  negative: number;
  neutral: number;
  mention_count?: number | null;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginationDto {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/* ---------------------------------------------------------------- dashboard */

export interface DashboardQuery {
  /** Backend-defined range key, e.g. "this_month" or "2025-05-01..2025-05-31". */
  range?: string;
}

export type SentimentDriverDto = SentimentDriver;
export type DataSourceStatusDto = DataSourceStatus;

export interface DashboardOverview {
  headline: {
    positiveShare: string;
    totalConversations: string;
    description: string;
  };
  summary: {
    totalMentions: MetricValue;
    positive: MetricValue;
    negative: MetricValue;
    neutral: MetricValue;
  };
  trend: SentimentTrendPoint[];
  topicDistribution: TopicSlice[];
  topicTotal: string;
  keywordCloud: WordCloudWord[];
  recentMentions: Mention[];
  drivers: SentimentDriver[];
  dataSources: DataSourceStatus[];
  lastUpdated: string;
}

export interface DashboardOverviewDto {
  headline: {
    positive_share: string;
    total_conversations: string;
    description: string;
  };
  summary: {
    total_mentions: MetricValueDto;
    positive: MetricValueDto;
    negative: MetricValueDto;
    neutral: MetricValueDto;
  };
  trend: SentimentTrendPointDto[];
  topic_distribution: TopicSlice[];
  topic_total: string;
  keyword_cloud: WordCloudWordDto[];
  recent_mentions: MentionDto[];
  drivers: SentimentDriverDto[];
  data_sources: DataSourceStatusDto[];
  last_updated: string;
}

/* --------------------------------------------------------------- monitoring */

export interface MentionQuery {
  query?: string;
  platform?: string;
  sentiment?: string;
  page?: number;
  perPage?: number;
}

export interface MentionListResult {
  items: Mention[];
  pagination: Pagination;
  /** Aggregated over the whole filtered set, not just the current page. */
  metrics: MentionMetrics;
  platformVolume: PlatformDatum[];
  /** Total before filters, for the "showing X of Y" label. */
  totalUnfiltered: number;
  /** Platform names available in the filter dropdown. */
  platforms: string[];
}

export interface MentionListResponseDto {
  items: MentionDto[];
  pagination: PaginationDto;
  metrics: {
    live_mentions: number;
    total_engagement: number;
    unique_authors: number;
    flagged_issues: number;
  };
  platform_volume: PlatformDatumDto[];
  total_unfiltered: number;
  platforms: string[];
}

/* ---------------------------------------------------------------- sentiment */

export interface SentimentQuery {
  range?: string;
}

export interface SentimentOverview {
  score: number;
  scoreMax: number;
  description: string;
  summary: {
    positive: MetricValue;
    negative: MetricValue;
    neutral: MetricValue;
    analyzed: MetricValue;
  };
  distribution: SentimentDistributionSlice[];
  trend: SentimentTrendPoint[];
  trendInsights: TrendInsight[];
  byPlatform: PlatformDatum[];
  byCategory: CategorySentiment[];
  categoryNote: string;
}

export interface SentimentOverviewDto {
  score: number;
  score_max: number;
  description: string;
  summary: {
    positive: MetricValueDto;
    negative: MetricValueDto;
    neutral: MetricValueDto;
    analyzed: MetricValueDto;
  };
  distribution: SentimentDistributionSliceDto[];
  trend: SentimentTrendPointDto[];
  trend_insights: TrendInsight[];
  by_platform: PlatformDatumDto[];
  by_category: CategorySentimentDto[];
  category_note: string;
}

/* ----------------------------------------------------------------- keywords */

export interface KeywordQuery {
  query?: string;
  sentiment?: string;
}

export interface KeywordListResult {
  items: Keyword[];
  stats: KeywordStats;
  alerts: KeywordAlert[];
}

export interface KeywordListResponseDto {
  items: KeywordDto[];
  stats: {
    tracked: number;
    rising: number;
    negative: number;
    volume: number;
  };
  alerts: KeywordAlert[];
}

/* ----------------------------------------------------------------------- ai */

export interface AiInsight {
  score: number;
  scoreNote: string;
  confidence: number;
  headline: string;
  summary: string;
  findings: string[];
  recommendations: string[];
  stats: {
    confidence: MetricValue;
    generatedInsights: MetricValue;
    detectedIssues: MetricValue;
    resolvedSignals: MetricValue;
  };
}

export interface AiInsightDto {
  score: number;
  score_note: string;
  confidence: number;
  headline: string;
  summary: string;
  findings: string[];
  recommendations: string[];
  stats: {
    confidence: MetricValueDto;
    generated_insights: MetricValueDto;
    detected_issues: MetricValueDto;
    resolved_signals: MetricValueDto;
  };
}

/* ------------------------------------------------------------------ reports */

export interface ReportListResult {
  items: ReportListItem[];
  stats: {
    total: MetricValue;
    scheduled: MetricValue;
    downloads: MetricValue;
    shared: MetricValue;
  };
}

export interface ReportListResponseDto {
  items: ReportListItemDto[];
  stats: {
    total: MetricValueDto;
    scheduled: MetricValueDto;
    downloads: MetricValueDto;
    shared: MetricValueDto;
  };
}

export interface GenerateReportInput {
  type: string;
  dateRange: string;
  format: string;
  templateId: string;
}

export interface GenerateReportRequestDto {
  type: string;
  date_range: string;
  format: string;
  template_id: string;
}

export interface ReportTemplateDto {
  id: string;
  name: string;
  best_for: string;
  tone: string;
  layout: string;
  sections: string[];
}

export interface ReportDocumentDto {
  id: string;
  title: string;
  type: string;
  status: ReportListItem["status"];
  date: string;
  pages: number;
  format: string;
  template: ReportTemplateDto;
  highlights: string[];
  prepared_for: string;
  period: string;
  metrics: ReportMetricBlock[];
  sections: ReportSection[];
  appendix: string[];
}

export type { ReportDocument, ReportTemplate };

/* ----------------------------------------------------------------- settings */

export type MonitoringPreferenceDto = MonitoringPreference;

export interface UpdatePreferenceInput {
  key: string;
  checked: boolean;
}

export interface UpdatePreferenceRequestDto {
  key: string;
  checked: boolean;
}

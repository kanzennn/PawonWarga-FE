import {
  dashboardDataSources,
  dashboardHeadline,
  dashboardKeywordCloud,
  dashboardLastUpdated,
  dashboardSummary,
  mentions,
  sentimentDrivers,
  sentimentTrend,
  topicDistribution,
} from "@/lib/data/dummy-data";
import type { DashboardOverviewDto } from "@/lib/api/types";

const RECENT_MENTIONS_LIMIT = 4;

// Takes no range: the dummy dataset covers a single period. The real
// GET /dashboard/overview is expected to honour the `range` query param.
export function buildDashboardOverview(): DashboardOverviewDto {
  return {
    headline: {
      positive_share: dashboardHeadline.positiveShare,
      total_conversations: dashboardHeadline.totalConversations,
      description: dashboardHeadline.description,
    },
    summary: {
      total_mentions: dashboardSummary.totalMentions,
      positive: dashboardSummary.positive,
      negative: dashboardSummary.negative,
      neutral: dashboardSummary.neutral,
    },
    // Dummy data only has percentages — mirror them into the *_count fields
    // too (not real totals, just enough for the Percentage/Total toggle to
    // have something to render in mock mode).
    trend: sentimentTrend.map((point) => ({
      ...point,
      positive_count: point.positive,
      neutral_count: point.neutral,
      negative_count: point.negative,
    })),
    topic_distribution: topicDistribution,
    topic_total: dashboardHeadline.totalConversations,
    keyword_cloud: dashboardKeywordCloud,
    recent_mentions: mentions.slice(0, RECENT_MENTIONS_LIMIT),
    drivers: sentimentDrivers,
    data_sources: dashboardDataSources,
    last_updated: dashboardLastUpdated,
  };
}

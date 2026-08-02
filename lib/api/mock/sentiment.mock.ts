import {
  categorySentiment,
  locationSentiment,
  platformData,
  sentimentCategoryNote,
  sentimentDistribution,
  sentimentScore,
  sentimentSummary,
  sentimentTrend,
  sentimentTrendInsights,
} from "@/lib/data/dummy-data";
import { toPlatformDatumDto } from "@/lib/api/mock/to-dto";
import type { LocationSentimentDto, SentimentOverviewDto } from "@/lib/api/types";

// Range-agnostic for the same reason as the dashboard mock.
export function buildSentimentOverview(): SentimentOverviewDto {
  return {
    score: sentimentScore.score,
    score_max: sentimentScore.scoreMax,
    description: sentimentScore.description,
    summary: {
      positive: sentimentSummary.positive,
      negative: sentimentSummary.negative,
      neutral: sentimentSummary.neutral,
      analyzed: sentimentSummary.analyzed,
    },
    distribution: sentimentDistribution,
    trend: sentimentTrend,
    trend_insights: sentimentTrendInsights,
    by_platform: platformData.map(toPlatformDatumDto),
    by_category: categorySentiment,
    category_note: sentimentCategoryNote,
  };
}

// Seeded for the regional view that isn't built yet — the endpoint and the
// service wrapper already exist so the page can be added without new plumbing.
export function buildSentimentLocations(): LocationSentimentDto[] {
  return locationSentiment;
}

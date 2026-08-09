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
    // Dummy data only has percentages — mirror them into the *_count fields
    // too (not real totals, just enough for the Percentage/Total toggle to
    // have something to render in mock mode).
    trend: sentimentTrend.map((point) => ({
      ...point,
      positive_count: point.positive,
      neutral_count: point.neutral,
      negative_count: point.negative,
    })),
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

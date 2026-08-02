import { buildKeywordAlerts, filterKeywords, keywordStats } from "@/lib/business-logic";
import { keywords } from "@/lib/data/dummy-data";
import type { KeywordListResponseDto, KeywordQuery } from "@/lib/api/types";

export function buildKeywordList(query: KeywordQuery = {}): KeywordListResponseDto {
  const filtered = filterKeywords(keywords, {
    query: query.query,
    sentiment: query.sentiment,
  });

  const stats = keywordStats(filtered);

  return {
    items: filtered,
    stats: {
      tracked: stats.tracked,
      rising: stats.rising,
      negative: stats.negative,
      volume: stats.volume,
    },
    alerts: buildKeywordAlerts(filtered),
  };
}

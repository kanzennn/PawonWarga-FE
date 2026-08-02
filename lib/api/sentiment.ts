import { apiFetch } from "@/lib/api-client";
import { USE_MOCK_API } from "@/lib/api/config";
import { endpoints } from "@/lib/api/endpoints";
import { mockResponse, withQuery } from "@/lib/api/http";
import { mapSentimentOverview } from "@/lib/api/mappers";
import { buildSentimentLocations, buildSentimentOverview } from "@/lib/api/mock/sentiment.mock";
import type { LocationSentiment } from "@/lib/types";
import type {
  LocationSentimentDto,
  SentimentOverview,
  SentimentOverviewDto,
  SentimentQuery,
} from "@/lib/api/types";

export async function getSentimentOverview(
  query: SentimentQuery = {},
  token?: string,
): Promise<SentimentOverview> {
  const dto = USE_MOCK_API
    ? await mockResponse(buildSentimentOverview)
    : await apiFetch<SentimentOverviewDto>(
        withQuery(endpoints.sentiment.overview, {
          range: query.range,
          from: query.from,
          to: query.to,
        }),
        { token },
      );

  return mapSentimentOverview(dto);
}

// No page consumes this yet — it backs the regional breakdown that
// lib/data/dummy-data.ts already seeds via locationSentiment.
export async function getSentimentLocations(
  query: SentimentQuery = {},
  token?: string,
): Promise<LocationSentiment[]> {
  if (USE_MOCK_API) {
    return mockResponse(buildSentimentLocations);
  }

  return apiFetch<LocationSentimentDto[]>(
    withQuery(endpoints.sentiment.locations, { range: query.range }),
    { token },
  );
}

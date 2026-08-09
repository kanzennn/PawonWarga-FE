"use client";

import { useAuth } from "@/context/auth-context";
import { useApiQuery, type ApiQueryState } from "@/hooks/use-api-query";
import { getSentimentLocations, getSentimentOverview } from "@/lib/api/sentiment";
import type { LocationSentiment } from "@/lib/types";
import type { SentimentOverview, SentimentQuery } from "@/lib/api/types";

export function useSentimentOverview(
  query: SentimentQuery = {},
): ApiQueryState<SentimentOverview> {
  const { token } = useAuth();

  return useApiQuery(
    () => getSentimentOverview(query, token ?? undefined),
    [query.range, query.from, query.to, query.platform, token],
  );
}

export function useSentimentLocations(
  query: SentimentQuery = {},
): ApiQueryState<LocationSentiment[]> {
  const { token } = useAuth();

  return useApiQuery(
    () => getSentimentLocations(query, token ?? undefined),
    [query.range, token],
  );
}

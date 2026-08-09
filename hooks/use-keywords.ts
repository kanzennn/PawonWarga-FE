"use client";

import { useAuth } from "@/context/auth-context";
import { useApiQuery, type ApiQueryState } from "@/hooks/use-api-query";
import { getKeywords } from "@/lib/api/keywords";
import type { KeywordListResult, KeywordQuery } from "@/lib/api/types";

export function useKeywords(query: KeywordQuery = {}): ApiQueryState<KeywordListResult> {
  const { token } = useAuth();

  return useApiQuery(
    () => getKeywords(query, token ?? undefined),
    [query.query, query.sentiment, query.from, query.to, query.platform, token],
  );
}

"use client";

import { useAuth } from "@/context/auth-context";
import { useApiQuery, type ApiQueryState } from "@/hooks/use-api-query";
import { getMentions } from "@/lib/api/mentions";
import type { MentionListResult, MentionQuery } from "@/lib/api/types";

export function useMentions(query: MentionQuery = {}): ApiQueryState<MentionListResult> {
  const { token } = useAuth();

  return useApiQuery(
    () => getMentions(query, token ?? undefined),
    [
      query.query,
      query.platform,
      query.sentiment,
      query.from,
      query.to,
      query.page,
      query.perPage,
      query.sort,
      token,
    ],
  );
}

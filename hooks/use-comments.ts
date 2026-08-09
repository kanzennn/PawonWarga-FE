"use client";

import { useAuth } from "@/context/auth-context";
import { useApiQuery, type ApiQueryState } from "@/hooks/use-api-query";
import { getComments } from "@/lib/api/mentions";
import type { CommentListResult, CommentQuery } from "@/lib/api/types";

const EMPTY_COMMENTS: CommentListResult = {
  items: [],
  pagination: { page: 1, perPage: 20, total: 0, totalPages: 1 },
};

// mentionId is null while the mention detail modal is closed — skips the
// fetch entirely rather than calling the API with nothing to look up.
export function useComments(
  mentionId: number | string | null,
  query: CommentQuery = {},
): ApiQueryState<CommentListResult> {
  const { token } = useAuth();

  return useApiQuery(
    () =>
      mentionId == null
        ? Promise.resolve(EMPTY_COMMENTS)
        : getComments(mentionId, query, token ?? undefined),
    [mentionId, query.page, query.perPage, token],
  );
}

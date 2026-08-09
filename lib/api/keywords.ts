import { apiFetch } from "@/lib/api-client";
import { USE_MOCK_API } from "@/lib/api/config";
import { endpoints } from "@/lib/api/endpoints";
import { mockResponse, withQuery } from "@/lib/api/http";
import { mapKeywordList } from "@/lib/api/mappers";
import { buildKeywordList } from "@/lib/api/mock/keywords.mock";
import type { KeywordListResponseDto, KeywordListResult, KeywordQuery } from "@/lib/api/types";

export async function getKeywords(
  query: KeywordQuery = {},
  token?: string,
): Promise<KeywordListResult> {
  const dto = USE_MOCK_API
    ? await mockResponse(() => buildKeywordList(query))
    : await apiFetch<KeywordListResponseDto>(
        withQuery(endpoints.keywords.list, {
          q: query.query,
          sentiment: query.sentiment,
          from: query.from,
          to: query.to,
          platform: query.platform,
        }),
        { token },
      );

  return mapKeywordList(dto);
}

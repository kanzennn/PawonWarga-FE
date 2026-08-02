import { apiFetch, ApiError } from "@/lib/api-client";
import { USE_MOCK_API } from "@/lib/api/config";
import { endpoints } from "@/lib/api/endpoints";
import { mockResponse, withQuery } from "@/lib/api/http";
import { mapMentionList } from "@/lib/api/mappers";
import { buildMentionList, findMention } from "@/lib/api/mock/mentions.mock";
import type { Mention } from "@/lib/types";
import type { MentionDto, MentionListResponseDto, MentionListResult, MentionQuery } from "@/lib/api/types";

export async function getMentions(
  query: MentionQuery = {},
  token?: string,
): Promise<MentionListResult> {
  const dto = USE_MOCK_API
    ? await mockResponse(() => buildMentionList(query))
    : await apiFetch<MentionListResponseDto>(
        withQuery(endpoints.mentions.list, {
          q: query.query,
          platform: query.platform,
          sentiment: query.sentiment,
          from: query.from,
          to: query.to,
          page: query.page,
          per_page: query.perPage,
        }),
        { token },
      );

  return mapMentionList(dto);
}

export async function getMention(id: number | string, token?: string): Promise<Mention> {
  if (USE_MOCK_API) {
    const mention = await mockResponse(() => findMention(id));
    if (!mention) {
      throw new ApiError(`Mention ${id} tidak ditemukan.`, 404);
    }
    return mention;
  }

  return apiFetch<MentionDto>(endpoints.mentions.detail(id), { token });
}

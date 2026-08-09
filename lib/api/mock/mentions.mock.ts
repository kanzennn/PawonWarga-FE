import { DEFAULT_PAGE_SIZE } from "@/lib/api/config";
import {
  aggregatePlatformVolume,
  filterMentions,
  summarizeMentions,
} from "@/lib/business-logic";
import { mentions, platformData } from "@/lib/data/dummy-data";
import { toPlatformDatumDto } from "@/lib/api/mock/to-dto";
import type { CommentListResponseDto, CommentQuery, MentionListResponseDto, MentionQuery } from "@/lib/api/types";

export function buildMentionList(query: MentionQuery = {}): MentionListResponseDto {
  const filtered = filterMentions(mentions, {
    query: query.query,
    platform: query.platform,
    sentiment: query.sentiment,
  });

  const perPage = Math.max(1, query.perPage ?? DEFAULT_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages);
  const offset = (page - 1) * perPage;

  // Metrics and platform volume are aggregated over the whole filtered set
  // rather than the current page — the real endpoint must do the same.
  const metrics = summarizeMentions(filtered);

  return {
    items: filtered.slice(offset, offset + perPage),
    pagination: {
      page,
      per_page: perPage,
      total: filtered.length,
      total_pages: totalPages,
    },
    metrics: {
      live_mentions: metrics.liveMentions,
      total_engagement: metrics.totalEngagement,
      total_comments: metrics.totalComments,
      unique_authors: metrics.uniqueAuthors,
      flagged_issues: metrics.flaggedIssues,
    },
    platform_volume: aggregatePlatformVolume(filtered).map(toPlatformDatumDto),
    total_unfiltered: mentions.length,
    platforms: platformData.map((item) => item.name),
  };
}

export function findMention(id: number | string) {
  return mentions.find((item) => String(item.id) === String(id)) ?? null;
}

// No dummy comment dataset exists yet — mock mode reports "no comments"
// rather than fabricating data, same spirit as this file's other stubs.
export function buildCommentList(query: CommentQuery = {}): CommentListResponseDto {
  return {
    items: [],
    pagination: { page: query.page ?? 1, per_page: query.perPage ?? DEFAULT_PAGE_SIZE, total: 0, total_pages: 1 },
  };
}

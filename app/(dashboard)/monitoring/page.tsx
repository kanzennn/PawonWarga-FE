"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Filter, MessageCircle, Radio, Search, UsersRound } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { ErrorState, LoadingState } from "@/components/ui/DataState";
import { useDateRange } from "@/context/date-range-context";
import { useMention } from "@/context/mention-context";
import { usePlatform } from "@/context/platform-context";
import { useMentions } from "@/hooks/use-mentions";
import { USE_MOCK_API } from "@/lib/api/config";
import { formatStatCount, platformMeta } from "@/lib/business-logic";
import type { MentionListResult, MentionQuery } from "@/lib/api/types";

type MonitoringFilters = Required<Pick<MentionQuery, "query" | "sentiment" | "sort">>;

const INITIAL_FILTERS: MonitoringFilters = {
  query: "",
  sentiment: "All Sentiments",
  sort: "newest",
};

export default function SocialMonitoringPage() {
  const [draftFilters, setDraftFilters] = useState<MonitoringFilters>(INITIAL_FILTERS);
  const [filters, setFilters] = useState<MonitoringFilters>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const { range } = useDateRange();
  const { platform } = usePlatform();

  // Any filter, platform, or date-range change invalidates the current
  // page — jump back to page 1 rather than risk landing past the end of a
  // shorter result set. Adjusted during render (not an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes.
  const filterKey = `${filters.query}|${platform ?? ""}|${filters.sentiment}|${filters.sort}|${range.from ?? ""}|${range.to ?? ""}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  let effectivePage = page;
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
    effectivePage = 1;
  }

  const { data, isLoading, error, refetch } = useMentions({
    ...filters,
    platform: platform ?? undefined,
    from: range.from ?? undefined,
    to: range.to ?? undefined,
    page: effectivePage,
  });

  const updateDraftFilter = (key: keyof MonitoringFilters, value: string) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    setFilters(draftFilters);
  };

  return (
    <div className="min-w-0 pb-24 lg:pb-0">
      <PageHeading
        title="Social Monitoring"
        subtitle="Monitor public conversations about MBG in real-time across platforms."
      />

      {isLoading ? (
        <LoadingState message="Memuat percakapan publik..." />
      ) : !data ? (
        <ErrorState message={error ?? "Data mention tidak tersedia."} onRetry={refetch} />
      ) : (
        <MonitoringContent
          data={data}
          draftFilters={draftFilters}
          onDraftChange={updateDraftFilter}
          onApply={applyFilters}
          page={effectivePage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

interface MonitoringContentProps {
  data: MentionListResult;
  draftFilters: MonitoringFilters;
  onDraftChange: (key: keyof MonitoringFilters, value: string) => void;
  onApply: (event: React.FormEvent) => void;
  page: number;
  onPageChange: (page: number) => void;
}

function MonitoringContent({
  data,
  draftFilters,
  onDraftChange,
  onApply,
  page,
  onPageChange,
}: MonitoringContentProps) {
  const { selectMention } = useMention();
  const { items: filteredMentions, metrics, platformVolume, pagination } = data;

  const rangeStart = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.perPage + 1;
  const rangeEnd = Math.min(pagination.page * pagination.perPage, pagination.total);

  // "Total Mentions" and each platform's "% of total conversations" /
  // "N mentions" are counts (posts + comments), not engagement — item.value
  // (likes+comments+shares) only drives the bar's relative width via the
  // same percentage below.
  const totalPlatformMentions = platformVolume.reduce(
    (total, item) => total + item.mentionCount,
    0,
  );

  return (
    <>
      <div className="mb-5 grid gap-4 xl:grid-cols-4">
        <StatCard
          icon={Radio}
          label="Total Posts"
          value={formatStatCount(metrics.liveMentions)}
          change="Filtered"
        />
        <StatCard
          icon={MessageCircle}
          label="Total Comments"
          value={formatStatCount(metrics.totalComments)}
          change="Comments"
        />
        <StatCard
          icon={UsersRound}
          label="Unique Authors"
          value={formatStatCount(metrics.uniqueAuthors)}
          change="Authors"
          tone="info"
        />
        <StatCard
          icon={Filter}
          label="Flagged Issues"
          value={formatStatCount(metrics.flaggedIssues)}
          change="Negative"
          tone="danger"
        />
      </div>

      <Card className="mb-5 p-5">
        <form
          className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_160px_170px_150px]"
          onSubmit={onApply}
        >
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-[#dce8df] bg-white px-4 text-[#6d7e75]">
            <Search size={18} />
            <input
              value={draftFilters.query}
              onChange={(event) => onDraftChange("query", event.target.value)}
              className="w-full border-0 bg-transparent text-[#10231c] outline-none"
              placeholder="Search MBG mentions..."
            />
          </label>
          <select
            value={draftFilters.sentiment}
            onChange={(event) => onDraftChange("sentiment", event.target.value)}
            className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold text-[#10231c] outline-none"
          >
            <option value="All Sentiments">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
          <select
            value={draftFilters.sort}
            onChange={(event) => onDraftChange("sort", event.target.value)}
            className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold text-[#10231c] outline-none"
            aria-label="Sort by"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="engagement">Most Engagement</option>
          </select>
          <button
            type="submit"
            className="h-12 rounded-2xl bg-[#052d22] px-5 font-black text-white"
          >
            Apply Filter
          </button>
        </form>
      </Card>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card title="Live Social Mentions" className="p-6">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dce8df] bg-[#f8fbf5] px-4 py-3">
              <div>
                <p className="m-0 text-sm font-black text-[#10231c]">
                  Real-time public conversations
                </p>
                <p className="m-0 mt-1 text-xs font-bold text-[#6d7e75]">
                  Showing {rangeStart}-{rangeEnd} of {pagination.total}{" "}
                  {USE_MOCK_API ? "dummy" : "public"} conversations
                </p>
              </div>

              <span className="inline-flex h-8 items-center rounded-full bg-[#e1f8d9] px-3 text-xs font-black text-[#15803d]">
                Live Monitoring
              </span>
            </div>

            <div className="grid gap-3">
              {filteredMentions.map((item) => {
                const meta = platformMeta[item.platform] || {
                  label: item.platform?.[0] || "?",
                  bg: "bg-[#052d22]",
                  text: "text-white",
                };

                const sentimentRing =
                  item.sentiment === "positive"
                    ? "ring-[#bdeeb2]"
                    : item.sentiment === "negative"
                      ? "ring-[#ffc8c8]"
                      : "ring-[#ffe6a8]";

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => selectMention(item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectMention(item);
                      }
                    }}
                    className="group grid w-full cursor-pointer gap-4 rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#cfe4d4] hover:bg-white hover:shadow-[0_14px_35px_rgba(11,68,45,0.08)] md:grid-cols-[48px_minmax(0,1fr)_132px]"
                  >
                    <div className="flex items-start gap-3 md:block">
                      <span
                        className={[
                          "grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-black ring-4 ring-offset-0",
                          meta.bg,
                          meta.text,
                          sentimentRing,
                        ].join(" ")}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <b className="truncate text-sm font-black text-[#10231c]">
                          {item.user}
                        </b>

                        <span className="h-1 w-1 rounded-full bg-[#9aaa9f]" />

                        <span className="text-xs font-bold text-[#6d7e75]">
                          {item.platform}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[#9aaa9f]" />

                        <span className="text-xs font-bold text-[#6d7e75]">
                          {item.location}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[#9aaa9f]" />

                        <span className="text-xs font-bold text-[#6d7e75]">
                          {item.time}
                        </span>
                      </div>

                      <p className="m-0 line-clamp-2 text-sm font-semibold leading-6 text-[#10231c]">
                        {item.text}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#dce8df] pt-3 md:flex-col md:items-end md:justify-center md:border-t-0 md:pt-0">
                      <Badge tone={item.sentiment}>{item.sentiment}</Badge>

                      <div className="rounded-full bg-[#f0f6ed] px-3 py-1.5 text-xs font-black text-[#10231c]">
                        {item.engagement || "12.4K"}
                      </div>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="flex items-center gap-1 text-xs font-black text-[#07513b] hover:underline"
                          aria-label={`Buka postingan asli di ${item.platform}`}
                        >
                          <ExternalLink size={13} />
                          Lihat postingan
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}

              {!filteredMentions.length && (
                <div className="rounded-2xl border border-dashed border-[#cbdccd] bg-[#fbfdf8] p-6 text-center">
                  <b className="text-[#10231c]">Tidak ada mention yang cocok.</b>
                  <p className="m-0 mt-2 text-sm leading-6 text-[#6d7e75]">
                    Ubah keyword, platform, atau sentimen untuk melihat percakapan lain.
                  </p>
                </div>
              )}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dce8df] pt-4">
                <p className="m-0 text-xs font-bold text-[#6d7e75]">
                  Page {pagination.page} of {pagination.totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={pagination.page <= 1}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-[#dce8df] bg-white text-[#07513b] transition hover:bg-[#f8fbf5] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-[#dce8df] bg-white text-[#07513b] transition hover:bg-[#f8fbf5] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                    aria-label="Next page"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Platform Volume" className="p-6">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-[#dce8df] bg-[linear-gradient(135deg,#f8fbf5,#ffffff)] p-4">
              <p className="m-0 text-sm font-bold text-[#6d7e75]">
                Total Mentions
              </p>
              <h3 className="m-0 mt-1 text-[28px] font-black tracking-[-0.5px] text-[#10231c]">
                {totalPlatformMentions.toLocaleString()}
              </h3>
              <p className="m-0 mt-1 text-xs font-bold text-[#6d7e75]">
                Across all monitored platforms
              </p>
            </div>

            <div className="grid gap-3">
              {platformVolume.map((item, index) => {
                const percentage = totalPlatformMentions
                  ? Math.round((item.mentionCount / totalPlatformMentions) * 100)
                  : 0;

                const platformColor =
                  item.name === "X" || item.name === "X / Twitter"
                    ? "bg-[#061a16] text-white"
                    : item.name === "Instagram"
                      ? "bg-[#fce7f3] text-[#be185d]"
                      : item.name === "TikTok"
                        ? "bg-[#111827] text-white"
                        : item.name === "News"
                          ? "bg-[#dbeafe] text-[#1d4ed8]"
                          : item.name === "YouTube"
                            ? "bg-[#fee2e2] text-[#dc2626]"
                            : "bg-[#e4f8d6] text-[#07513b]";

                return (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_32px_rgba(11,68,45,0.08)]"
                  >
                    <div className="mb-3 grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3">
                      <span
                        className={[
                          "grid h-[38px] w-[38px] place-items-center rounded-xl text-xs font-black",
                          platformColor,
                        ].join(" ")}
                      >
                        {item.name.slice(0, 2)}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <b className="truncate text-sm font-black text-[#10231c]">
                            {item.name}
                          </b>

                          <span className="rounded-full bg-[#e1f8d9] px-2 py-0.5 text-[10px] font-black text-[#15803d]">
                            #{index + 1}
                          </span>
                        </div>

                        <p className="m-0 mt-0.5 text-xs font-bold text-[#6d7e75]">
                          {percentage}% of total conversations
                        </p>
                      </div>

                      <div className="text-right">
                        <b className="block text-sm font-black text-[#10231c]">
                          {item.mentionCount.toLocaleString()}
                        </b>
                        <small className="font-bold text-[#6d7e75]">
                          mentions
                        </small>
                      </div>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-[#edf4eb]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#13834f,#67c74a)]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-7 max-w-xl lg:-mt-[78px]">
      <h1 className="m-0 text-[28px] font-black tracking-[-0.7px] text-[#10231c]">
        {title}
      </h1>
      <p className="mt-1 text-[15px] text-[#6d7e75]">{subtitle}</p>
    </div>
  );
}

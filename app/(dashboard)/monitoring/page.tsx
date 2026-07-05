"use client";

import { useMemo, useState } from "react";
import { Filter, MessageCircle, Radio, Search, UsersRound } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { useMention } from "@/context/mention-context";
import { mentions, platformData } from "@/lib/data/dummy-data";
import {
  aggregatePlatformVolume,
  filterMentions,
  formatCompact,
  platformMeta,
  summarizeMentions,
  type MentionFilters,
} from "@/lib/business-logic";

export default function SocialMonitoringPage() {
  const { selectMention } = useMention();
  const [draftFilters, setDraftFilters] = useState<MentionFilters>({
    query: "",
    platform: "All Platforms",
    sentiment: "All Sentiments",
  });
  const [filters, setFilters] = useState<MentionFilters>(draftFilters);

  const filteredMentions = useMemo(
    () => filterMentions(mentions, filters),
    [filters],
  );
  const metrics = useMemo(
    () => summarizeMentions(filteredMentions),
    [filteredMentions],
  );
  const platformVolume = useMemo(
    () => aggregatePlatformVolume(filteredMentions),
    [filteredMentions],
  );
  const totalPlatformValue = platformVolume.reduce(
    (total, item) => total + item.value,
    0,
  );

  const updateDraftFilter = (key: keyof MentionFilters, value: string) => {
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
        subtitle="Pantau percakapan publik tentang MBG secara real-time dari berbagai platform."
      />

      <div className="mb-5 grid gap-4 xl:grid-cols-4">
        <StatCard
          icon={Radio}
          label="Live Mentions"
          value={String(metrics.liveMentions)}
          change="Filtered"
        />
        <StatCard
          icon={MessageCircle}
          label="Total Comments"
          value={formatCompact(metrics.totalEngagement)}
          change="Engagement"
        />
        <StatCard
          icon={UsersRound}
          label="Unique Authors"
          value={String(metrics.uniqueAuthors)}
          change="Authors"
          tone="info"
        />
        <StatCard
          icon={Filter}
          label="Flagged Issues"
          value={String(metrics.flaggedIssues)}
          change="Negative"
          tone="danger"
        />
      </div>

      <Card className="mb-5 p-5">
        <form
          className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_180px_150px]"
          onSubmit={applyFilters}
        >
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-[#dce8df] bg-white px-4 text-[#6d7e75]">
            <Search size={18} />
            <input
              value={draftFilters.query}
              onChange={(event) => updateDraftFilter("query", event.target.value)}
              className="w-full border-0 bg-transparent text-[#10231c] outline-none"
              placeholder="Search MBG mentions..."
            />
          </label>
          <select
            value={draftFilters.platform}
            onChange={(event) => updateDraftFilter("platform", event.target.value)}
            className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold text-[#10231c] outline-none"
          >
            <option value="All Platforms">All Platforms</option>
            {platformData.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={draftFilters.sentiment}
            onChange={(event) =>
              updateDraftFilter("sentiment", event.target.value)
            }
            className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold text-[#10231c] outline-none"
          >
            <option value="All Sentiments">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
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
                  Showing {filteredMentions.length} of {mentions.length} dummy
                  conversations
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
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectMention(item)}
                    className="group grid w-full gap-4 rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#cfe4d4] hover:bg-white hover:shadow-[0_14px_35px_rgba(11,68,45,0.08)] md:grid-cols-[48px_minmax(0,1fr)_132px]"
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
                    </div>
                  </button>
                );
              })}

              {!filteredMentions.length && (
                <div className="rounded-2xl border border-dashed border-[#cbdccd] bg-[#fbfdf8] p-6 text-center">
                  <b className="text-[#10231c]">Tidak ada mention yang cocok.</b>
                  <p className="m-0 mt-2 text-sm leading-6 text-[#6d7e75]">
                    Ubah keyword, platform, atau sentimen untuk melihat dummy
                    conversation lain.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card title="Platform Volume" className="p-6">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-[#dce8df] bg-[linear-gradient(135deg,#f8fbf5,#ffffff)] p-4">
              <p className="m-0 text-sm font-bold text-[#6d7e75]">
                Total Mentions
              </p>
              <h3 className="m-0 mt-1 text-[28px] font-black tracking-[-0.5px] text-[#10231c]">
                {totalPlatformValue.toLocaleString()}
              </h3>
              <p className="m-0 mt-1 text-xs font-bold text-[#6d7e75]">
                Across all monitored platforms
              </p>
            </div>

            <div className="grid gap-3">
              {platformVolume.map((item, index) => {
                const percentage = totalPlatformValue
                  ? Math.round((item.value / totalPlatformValue) * 100)
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
                          {item.value.toLocaleString()}
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
    </div>
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

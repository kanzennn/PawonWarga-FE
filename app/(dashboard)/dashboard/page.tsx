"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  MessageCircle,
  RefreshCcw,
  SmilePlus,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import WordCloud from "@/components/ui/WordCloud";
import { ErrorState, LoadingState } from "@/components/ui/DataState";
import { useMention } from "@/context/mention-context";
import { useDashboardOverview } from "@/hooks/use-dashboard";
import type { DashboardOverview } from "@/lib/api/types";

// Badge styling per data source code — presentation only, so it stays in the
// page rather than travelling over the wire.
const sourceMeta: Record<string, { bg: string; text: string }> = {
  X: { bg: "bg-[#061a16]", text: "text-white" },
  IG: { bg: "bg-[#fce7f3]", text: "text-[#be185d]" },
  TT: { bg: "bg-[#111827]", text: "text-white" },
  N: { bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]" },
  YT: { bg: "bg-[#fee2e2]", text: "text-[#dc2626]" },
};

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboardOverview();

  return (
    <div className="min-w-0 pb-16 lg:pb-0">
      <div className="mb-5 max-w-xl lg:-mt-[72px] 2xl:-mt-[72px]">
        <h1 className="m-0 text-[26px] font-black text-[#10231c]">
          Dashboard
        </h1>
        <p className="mt-1 text-[15px] text-[#6d7e75]">
          Monitor public sentiment and conversations about the MBG program.
        </p>
      </div>

      {isLoading ? (
        <LoadingState message="Memuat ringkasan dashboard..." />
      ) : !data ? (
        <ErrorState message={error ?? "Data dashboard tidak tersedia."} onRetry={refetch} />
      ) : (
        <DashboardContent overview={data} onRefresh={refetch} />
      )}
    </div>
  );
}

interface DashboardContentProps {
  overview: DashboardOverview;
  onRefresh: () => void;
}

function DashboardContent({ overview, onRefresh }: DashboardContentProps) {
  const {
    headline,
    summary,
    trend,
    topicDistribution,
    topicTotal,
    keywordCloud,
    recentMentions,
    drivers,
    dataSources,
    lastUpdated,
  } = overview;

  const [activeDistribution, setActiveDistribution] = useState<number | null>(
    null,
  );
  const [trendChartRef, trendChartWidth] =
    useMeasuredWidth<HTMLDivElement>(640);
  const [donutChartRef, donutChartWidth] =
    useMeasuredWidth<HTMLDivElement>(260);
  const { selectMention } = useMention();
  const donutSize = Math.min(donutChartWidth, 260);

  return (
    <div className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
      <main className="grid min-w-0 gap-4">
        <div className="grid min-w-0 gap-4">
          <div className="relative min-h-[150px] overflow-hidden rounded-[18px] border border-[#dce8df] bg-[radial-gradient(circle_at_84%_76%,rgba(123,214,88,0.24),transparent_34%),linear-gradient(135deg,#04392b,#05281f)] p-5 text-white shadow-[0_14px_36px_rgba(11,68,45,0.08)]">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <h3 className="m-0 text-[15px] font-black">
                Public Sentiment Overview
              </h3>

              <span className="inline-flex h-[30px] items-center gap-2 rounded-full bg-[#3ea84e]/40 px-3 text-xs font-black text-[#dcffc4]">
                <Bot size={14} />
                AI Insight Active
              </span>
            </div>

            <h2 className="relative z-10 my-3 max-w-xs text-[38px] font-black leading-none text-[#b9fb7d]">
              {headline.positiveShare} Positive
            </h2>

            <p className="relative z-10 m-0 max-w-[360px] text-sm font-medium leading-relaxed text-white/90">
              {headline.description}
            </p>

            <div className="absolute -bottom-24 -right-10 h-[220px] w-[220px] rounded-full border border-[#beff96]/20 before:absolute before:inset-7 before:rounded-full before:border before:border-[#beff96]/20 after:absolute after:inset-14 after:rounded-full after:border after:border-[#beff96]/20" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid min-w-0 gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <StatCard
                  icon={MessageCircle}
                  label="Total Mentions"
                  value={summary.totalMentions.value}
                  change={summary.totalMentions.change}
                />

                <StatCard
                  icon={SmilePlus}
                  label="Positive Sentiment"
                  value={summary.positive.value}
                  change={summary.positive.change}
                />

                <StatCard
                  icon={ThumbsDown}
                  label="Negative Sentiment"
                  value={summary.negative.value}
                  change={summary.negative.change}
                  tone="danger"
                />

                <StatCard
                  icon={ThumbsUp}
                  label="Neutral Sentiment"
                  value={summary.neutral.value}
                  change={summary.neutral.change}
                  tone="neutral"
                />
              </div>

              <Card
                title="Sentiment Trend"
                className="p-5"
                action={
                  <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#dce8df] bg-white px-4 text-sm font-extrabold text-[#10231c] shadow-sm">
                    This Month
                  </button>
                }
              >
                <div className="mb-4 mt-1 flex flex-wrap gap-x-6 gap-y-2 text-sm font-extrabold">
                  <Legend color="text-[#67c74a]" label="Positive" />
                  <Legend color="text-[#f4b21b]" label="Neutral" />
                  <Legend color="text-[#0c2033]" label="Negative" />
                </div>

                <div ref={trendChartRef} className="h-[286px] w-full">
                  <LineChart
                    data={trend}
                    width={trendChartWidth}
                    height={286}
                    margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="#e6e9e5"
                      strokeDasharray="0"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="day"
                      axisLine={{ stroke: "#d9ded8" }}
                      tickLine={false}
                      tick={{ fill: "#5f6d66", fontSize: 12 }}
                      dy={8}
                    />

                    <YAxis
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={(value) => `${value}%`}
                      axisLine={{ stroke: "#d9ded8" }}
                      tickLine={false}
                      tick={{ fill: "#5f6d66", fontSize: 12 }}
                      width={44}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="positive"
                      stroke="#67c74a"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#ffffff" }}
                      activeDot={{ r: 6 }}
                    />

                    <Line
                      type="monotone"
                      dataKey="neutral"
                      stroke="#f4ad16"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#ffffff" }}
                      activeDot={{ r: 6 }}
                    />

                    <Line
                      type="monotone"
                      dataKey="negative"
                      stroke="#0c2033"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#ffffff" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </div>
              </Card>
            </div>

            <Card title="Topic Distribution" className="p-5">
              <div className="flex h-full flex-col gap-4">
                <p className="m-0 text-sm font-bold leading-relaxed text-[#6d7e75]">
                  Distribution of the most discussed MBG sentiment categories
                  based on public conversations.
                </p>

                <div
                  ref={donutChartRef}
                  className="relative mx-auto h-[230px] w-full max-w-[260px]"
                >
                  <div className="grid h-full w-full place-items-center">
                    <PieChart width={donutSize} height={230}>
                      <Pie
                        data={topicDistribution}
                        dataKey="value"
                        innerRadius={62}
                        outerRadius={96}
                        paddingAngle={2}
                        onMouseEnter={(_, index) =>
                          setActiveDistribution(index)
                        }
                        onMouseLeave={() => setActiveDistribution(null)}
                      >
                        {topicDistribution.map((item) => (
                          <Cell
                            key={item.name}
                            fill={item.color}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        content={<DonutTooltip />}
                        wrapperStyle={{
                          outline: "none",
                          zIndex: 50,
                        }}
                        position={{ x: 170, y: 12 }}
                      />
                    </PieChart>
                  </div>

                  <div
                    className={[
                      "pointer-events-none absolute inset-0 grid place-content-center text-center transition-opacity duration-150",
                      activeDistribution === null
                        ? "opacity-100"
                        : "opacity-20",
                    ].join(" ")}
                  >
                    <b className="text-[26px] font-black leading-none text-[#10231c]">
                      {topicTotal}
                    </b>
                    <span className="mt-2 text-sm text-[#6d7e75]">
                      Total Mentions
                    </span>
                  </div>
                </div>

                <div className="grid gap-2.5">
                  {topicDistribution.map((item) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-[#dce8df] bg-[#f8fbf5] px-3.5 py-2.5 text-sm font-bold text-[#5f6d66]"
                    >
                      <span className="flex items-center gap-3">
                        <i
                          className="h-3.5 w-3.5 rounded-[5px]"
                          style={{ background: item.color }}
                        />
                        {item.name}
                      </span>

                      <b className="font-black text-[#10231c]">
                        {item.value}%
                      </b>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
          <Card
            title="Top Keywords"
            className="p-5"
            action={
              <button className="h-9 rounded-xl border border-[#dce8df] bg-white px-3.5 text-sm font-extrabold text-[#10231c]">
                View All
              </button>
            }
          >
            <WordCloud words={keywordCloud} />
          </Card>

          <Card
            title="Recent Conversations"
            className="p-5"
            action={
              <button className="h-9 rounded-xl border border-[#dce8df] bg-white px-3.5 text-sm font-extrabold text-[#10231c]">
                View All
              </button>
            }
          >
            <div className="overflow-x-auto">
              <div className="grid min-w-[760px] grid-cols-[70px_130px_minmax(250px,1fr)_110px_100px_70px] items-center gap-3 rounded-xl bg-[#f4f5f1] px-3.5 py-3 text-xs font-black text-[#6d7e75]">
                <span>Platform</span>
                <span>Account</span>
                <span>Post Snippet</span>
                <span>Sentiment</span>
                <span>Engagement</span>
                <span>Time</span>
              </div>

              {recentMentions.map((item) => (
                <button
                  key={item.id}
                  className="grid min-w-[760px] w-full grid-cols-[70px_130px_minmax(250px,1fr)_110px_100px_70px] items-center gap-3 border-0 border-b border-[#dce8df] bg-transparent px-3.5 py-3.5 text-left transition-colors hover:bg-[#fbfdf8]"
                  onClick={() => selectMention(item)}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#061a16] font-black text-white">
                    {item.platform[0]}
                  </span>
                  <b className="text-[#10231c]">{item.user}</b>
                  <p className="m-0 leading-relaxed text-[#10231c]">
                    {item.text}
                  </p>
                  <Badge tone={item.sentiment}>{item.sentiment}</Badge>
                  <span className="text-[#10231c]">
                    {item.engagement || "12.4K"}
                  </span>
                  <span className="text-[#6d7e75]">{item.time}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <aside className="grid self-start gap-4 xl:grid-cols-2 2xl:grid-cols-1">
        <Card
          title="Top Sentiment Drivers"
          className="p-5"
          action={
            <button className="h-9 rounded-xl border border-[#dce8df] bg-white px-3.5 text-sm font-extrabold text-[#10231c]">
              View All
            </button>
          }
        >
          <div className="grid gap-2.5">
            {drivers.map((item, index) => {
              const barColor =
                item.tone === "positive"
                  ? "bg-[#13834f]"
                  : item.tone === "negative"
                    ? "bg-[#e54848]"
                    : "bg-[#f4b21b]";

              const rankClass =
                item.tone === "positive"
                  ? "bg-[#e1f8d9] text-[#15803d]"
                  : item.tone === "negative"
                    ? "bg-[#ffe5e5] text-[#d63838]"
                    : "bg-[#fff3ce] text-[#a66d00]";

              return (
                <div
                  key={item.name}
                  className="rounded-xl border border-[#dce8df] bg-[#fbfdf8] p-3"
                >
                  <div className="mb-2.5 grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2.5">
                    <span
                      className={[
                        "grid h-[30px] w-[30px] place-items-center rounded-lg text-sm font-black",
                        rankClass,
                      ].join(" ")}
                    >
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <b className="block truncate text-[13px] text-[#10231c]">
                        {item.name}
                      </b>
                      <small className="font-bold text-[#6d7e75]">
                        {item.value} mentions
                      </small>
                    </div>

                    <Badge tone={item.tone}>{item.label}</Badge>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#e8efe8]">
                    <div
                      className={["h-full rounded-full", barColor].join(" ")}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card
          title="Data Sources"
          className="p-5"
          action={
            <button className="h-9 rounded-xl border border-[#dce8df] bg-white px-3.5 text-sm font-extrabold text-[#10231c]">
              View All
            </button>
          }
        >
          <div className="grid gap-2.5">
            {dataSources.map((item) => {
              const meta = sourceMeta[item.code] || {
                bg: "bg-[#071a16]",
                text: "text-white",
              };

              return (
                <div
                  key={item.code}
                  className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-[#dce8df] bg-[#fbfdf8] p-3"
                >
                  <span
                    className={[
                      "grid h-[34px] w-[34px] place-items-center rounded-lg text-[11px] font-black",
                      meta.bg,
                      meta.text,
                    ].join(" ")}
                  >
                    {item.code}
                  </span>

                  <div className="min-w-0">
                    <b className="block text-sm font-black text-[#10231c]">
                      {item.value}
                    </b>
                    <small className="block truncate font-bold text-[#6d7e75]">
                      {item.label}
                    </small>
                  </div>

                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-[11px] font-black",
                      item.active
                        ? "bg-[#e1f8d9] text-[#15803d]"
                        : "bg-[#ffe5e5] text-[#d63838]",
                    ].join(" ")}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 rounded-xl border border-[#dce8df] bg-[#f8fbf5] p-3">
            <div className="flex items-center justify-between gap-3 text-[#6d7e75]">
              <div>
                <small className="block font-bold">Last updated</small>
                <b className="text-sm text-[#10231c]">{lastUpdated}</b>
              </div>

              <button
                onClick={onRefresh}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[#dce8df] bg-white text-[#07513b]"
              >
                <RefreshCcw size={15} />
              </button>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${color}`}>
      <span className="h-1.5 w-5 rounded-full bg-current" />
      <span className="text-[#10231c]">{label}</span>
    </span>
  );
}

function useMeasuredWidth<T extends HTMLElement>(fallbackWidth: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallbackWidth);

  useEffect(() => {
    if (!ref.current) return;

    const updateWidth = () => {
      const nextWidth = Math.round(
        ref.current?.getBoundingClientRect().width || 0,
      );

      if (nextWidth > 0) {
        setWidth(nextWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, []);

  return [ref, width] as const;
}

interface DonutTooltipPayloadItem {
  payload: { name: string; value: number; color: string };
}

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: DonutTooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-xl border border-[#dce8df] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(11,68,45,0.12)]">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        <p className="m-0 text-sm font-black text-[#10231c]">{item.name}</p>
      </div>
      <p className="m-0 mt-1 text-sm font-bold text-[#6d7e75]">
        {item.value}% dari total percakapan
      </p>
    </div>
  );
}

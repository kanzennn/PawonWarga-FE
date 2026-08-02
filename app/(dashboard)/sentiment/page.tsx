"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  Frown,
  Meh,
  MessageCircle,
  Smile,
} from "lucide-react";

import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { ErrorState, LoadingState } from "@/components/ui/DataState";
import { useSentimentOverview } from "@/hooks/use-sentiment";
import type { SentimentOverview } from "@/lib/api/types";

export default function SentimentAnalysisPage() {
  const { data, isLoading, error, refetch } = useSentimentOverview();

  return (
    <div className="min-w-0 pb-24 lg:pb-0">
      <PageHeading
        title="Sentiment Analysis"
        subtitle="Analisis detail sentimen positif, negatif, dan netral terhadap program MBG."
      />

      {isLoading ? (
        <LoadingState message="Memuat analisis sentimen..." />
      ) : !data ? (
        <ErrorState message={error ?? "Data sentimen tidak tersedia."} onRetry={refetch} />
      ) : (
        <SentimentContent overview={data} />
      )}
    </div>
  );
}

function SentimentContent({ overview }: { overview: SentimentOverview }) {
  const {
    score,
    scoreMax,
    description,
    summary,
    distribution,
    trend,
    trendInsights,
    byPlatform,
    byCategory,
    categoryNote,
  } = overview;

  const totalSentiment = distribution.reduce((total, item) => total + item.value, 0);

  return (
    <>
      <section className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_repeat(4,minmax(170px,1fr))]">
        <div className="relative overflow-hidden rounded-[22px] border border-[#dce8df] bg-[radial-gradient(circle_at_90%_20%,rgba(185,251,125,0.28),transparent_30%),linear-gradient(135deg,#04392b,#05281f)] p-6 text-white shadow-[0_18px_50px_rgba(11,68,45,0.08)] xl:min-h-[180px]">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="m-0 text-sm font-bold text-white/80">
                Overall Sentiment Score
              </p>
              <h2 className="m-0 mt-3 text-[46px] font-black leading-none tracking-[-2px] text-[#b9fb7d]">
                {score}/{scoreMax}
              </h2>
            </div>

            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#3ea84e]/40 text-[#dcffc4]">
              <Activity size={24} />
            </span>
          </div>

          <p className="relative z-10 mt-4 max-w-sm text-sm font-medium leading-6 text-white/85">
            {description}
          </p>

          <div className="absolute -bottom-20 -right-16 h-[220px] w-[220px] rounded-full border border-[#beff96]/20 before:absolute before:inset-8 before:rounded-full before:border before:border-[#beff96]/20 after:absolute after:inset-16 after:rounded-full after:border after:border-[#beff96]/20" />
        </div>

        <StatCard icon={Smile} label="Positive" value={summary.positive.value} change={summary.positive.change} />
        <StatCard
          icon={Frown}
          label="Negative"
          value={summary.negative.value}
          change={summary.negative.change}
          tone="danger"
        />
        <StatCard
          icon={Meh}
          label="Neutral"
          value={summary.neutral.value}
          change={summary.neutral.change}
          tone="neutral"
        />
        <StatCard
          icon={MessageCircle}
          label="Analyzed Mentions"
          value={summary.analyzed.value}
          change={summary.analyzed.change}
          tone="info"
        />
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        <Card title="Sentiment Distribution" className="p-6">
          <div className="relative mx-auto h-[240px] w-full max-w-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  innerRadius={62}
                  outerRadius={102}
                  paddingAngle={3}
                >
                  {distribution.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<SentimentTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <b className="text-[26px] font-black leading-none text-[#10231c]">
                {score}/{scoreMax}
              </b>
              <span className="mt-1 text-xs font-bold text-[#6d7e75]">
                Score
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-7">
            {distribution.map((item) => {
              const width = totalSentiment
                ? Math.round((item.value / totalSentiment) * 100)
                : 0;

              return (
                <div
                  key={item.name}
                  className="rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-black text-[#10231c]">
                      <i
                        className="h-3 w-3 rounded"
                        style={{ background: item.color }}
                      />
                      {item.name}
                    </span>

                    <b className="text-sm font-black text-[#10231c]">
                      {item.value}%
                    </b>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#edf4eb]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${width}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card
          title="Sentiment Over Time"
          className="p-7"
          action={
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-[#dce8df] bg-white text-[#07513b] shadow-sm transition hover:bg-[#f8fbf5]">
              <ArrowUpRight size={17} />
            </button>
          }
        >
          <div className="mb-4 flex flex-wrap items-center gap-6 text-sm font-black">
            <Legend color="text-[#67c74a]" label="Positive" />
            <Legend color="text-[#0c2033]" label="Negative" />
            <Legend color="text-[#f4b21b]" label="Neutral" />
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trend}
                margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
              >
                <CartesianGrid stroke="#e6e9e5" vertical={false} />

                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={{ stroke: "#d9ded8" }}
                  tick={{ fill: "#5f6d66", fontSize: 13 }}
                  dy={8}
                />

                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tickLine={false}
                  axisLine={{ stroke: "#d9ded8" }}
                  tick={{ fill: "#5f6d66", fontSize: 13 }}
                  width={48}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="#67c74a"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="#0c2033"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke="#f4b21b"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {trendInsights.map((item) => (
              <MiniInsight
                key={item.label}
                label={item.label}
                value={item.value}
                desc={item.desc}
                tone={item.tone}
              />
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card title="Sentiment by Platform" className="p-7">
          <div className="mb-5 flex flex-wrap items-center gap-5 text-sm font-black">
            <Legend color="text-[#67c74a]" label="Positive" />
            <Legend color="text-[#f4b21b]" label="Neutral" />
            <Legend color="text-[#0c2033]" label="Negative" />
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={byPlatform} margin={{ top: 8, right: 10 }}>
              <CartesianGrid stroke="#e6e9e5" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: "#d9ded8" }}
                tick={{ fill: "#5f6d66", fontSize: 13 }}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                axisLine={{ stroke: "#d9ded8" }}
                tick={{ fill: "#5f6d66", fontSize: 13 }}
              />
              <Tooltip />
              <Bar dataKey="positive" stackId="a" fill="#67c74a" />
              <Bar dataKey="neutral" stackId="a" fill="#f4b21b" />
              <Bar
                dataKey="negative"
                stackId="a"
                fill="#0c2033"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Sentiment by Category" className="p-7">
          <div className="mb-5 rounded-2xl border border-[#dce8df] bg-[#f8fbf5] p-4">
            <p className="m-0 text-sm font-bold leading-6 text-[#6d7e75]">
              {categoryNote}
            </p>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={byCategory}
              layout="vertical"
              margin={{ left: 24, right: 12 }}
            >
              <CartesianGrid stroke="#e6e9e5" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: "#5f6d66", fontSize: 12 }}
              />
              <YAxis
                dataKey="category"
                type="category"
                width={120}
                tick={{ fontSize: 12, fill: "#5f6d66" }}
              />
              <Tooltip />
              <Bar dataKey="positive" fill="#67c74a" radius={[0, 8, 8, 0]} />
              <Bar dataKey="negative" fill="#0c2033" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </section>
    </>
  );
}

function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-7 max-w-xl lg:-mt-[78px]">
      <h1 className="m-0 text-[28px] font-black tracking-[-0.7px] text-[#10231c]">{title}</h1>
      <p className="mt-1 text-[15px] text-[#6d7e75]">{subtitle}</p>
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

interface SentimentTooltipPayloadItem {
  payload: { name: string; value: number; color: string };
}

function SentimentTooltip({ active, payload }: { active?: boolean; payload?: SentimentTooltipPayloadItem[] }) {
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
        {item.value}% sentiment share
      </p>
    </div>
  );
}

function MiniInsight({
  label,
  value,
  desc,
  tone = "positive",
}: {
  label: string;
  value: string;
  desc: string;
  tone?: "positive" | "neutral" | "info";
}) {
  const toneClass =
    tone === "positive"
      ? "bg-[#e1f8d9] text-[#15803d]"
      : tone === "neutral"
        ? "bg-[#fff3ce] text-[#a66d00]"
        : "bg-[#e8f1ff] text-[#2674cf]";

  return (
    <div className="rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-4">
      <span
        className={[
          "mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-black",
          toneClass,
        ].join(" ")}
      >
        {label}
      </span>
      <b className="block text-lg font-black text-[#10231c]">{value}</b>
      <p className="m-0 mt-1 text-xs font-bold leading-5 text-[#6d7e75]">
        {desc}
      </p>
    </div>
  );
}

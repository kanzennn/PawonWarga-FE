"use client";

import { useState } from "react";
import {
  AlertTriangle,
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import WordCloud from "@/components/ui/WordCloud";
import { useMention } from "@/context/mention-context";
import { mentions, sentimentTrend } from "@/lib/data/dummy-data";

const distribution = [
  { name: "Food Quality", value: 28, color: "#064e3b" },
  { name: "School Distribution", value: 22, color: "#3fa76d" },
  { name: "Nutrition", value: 18, color: "#91dc68" },
  { name: "Government Policy", value: 14, color: "#d8bf62" },
  { name: "Budget Transparency", value: 10, color: "#f3b21b" },
  { name: "Public Complaints", value: 8, color: "#0f2336" },
];

const keywords = [
  { text: "makan bergizi", value: 64 },
  { text: "sekolah", value: 52 },
  { text: "gizi anak", value: 38 },
  { text: "distribusi", value: 34 },
  { text: "kualitas makanan", value: 31 },
  { text: "anggaran", value: 28 },
  { text: "pemerintah", value: 22 },
  { text: "siswa", value: 21 },
  { text: "menu sekolah", value: 19 },
  { text: "transparansi", value: 17 },
  { text: "keterlambatan", value: 16 },
  { text: "evaluasi", value: 14 },
  { text: "pengawasan", value: 13 },
  { text: "nutrisi", value: 12 },
];

const drivers = [
  {
    name: "Manfaat gizi anak",
    value: "42.1K",
    tone: "positive",
    label: "Positive",
  },
  {
    name: "Distribusi MBG",
    value: "31.8K",
    tone: "negative",
    label: "Negative",
  },
  {
    name: "Kualitas makanan",
    value: "24.7K",
    tone: "negative",
    label: "Negative",
  },
  {
    name: "Dukungan sekolah",
    value: "18.3K",
    tone: "positive",
    label: "Positive",
  },
  {
    name: "Evaluasi anggaran",
    value: "15.6K",
    tone: "neutral",
    label: "Neutral",
  },
] as const;

const dataSources = [
  { name: "X", value: "45.2K" },
  { name: "IG", value: "32.1K" },
  { name: "TT", value: "21.4K" },
  { name: "N", value: "18.7K" },
  { name: "YT", value: "11.0K" },
];

const alerts = [
  {
    title: "Food quality complaints increased by 12%",
    desc: "vs last week",
  },
  {
    title: "Distribution delay discussion rising in East Java",
    desc: "+24% vs last week",
  },
  {
    title: "Budget transparency keyword trending",
    desc: "+18% vs last week",
  },
];

export default function DashboardPage() {
  const [activeDistribution, setActiveDistribution] = useState<number | null>(null);
  const { selectMention } = useMention();

  return (
    <div className="min-w-0 pb-24 lg:pb-0">
      <div className="mb-7 max-w-xl lg:-mt-[78px] 2xl:-mt-[78px]">
        <h1 className="m-0 text-[28px] font-black tracking-[-0.7px] text-[#10231c]">
          Dashboard
        </h1>
        <p className="mt-1 text-[15px] text-[#6d7e75]">
          Monitor public sentiment and conversations about the MBG program.
        </p>
      </div>

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_290px]">
        <main className="grid min-w-0 gap-4">
          <div className="grid min-w-0 gap-4">
            <div className="relative min-h-[164px] overflow-hidden rounded-[22px] border border-[#dce8df] bg-[radial-gradient(circle_at_82%_72%,rgba(123,214,88,0.24),transparent_35%),linear-gradient(135deg,#04392b,#05281f)] p-6 text-white shadow-[0_18px_50px_rgba(11,68,45,0.08)]">
              <div className="relative z-10 flex items-center justify-between gap-4">
                <h3 className="m-0 text-[15px] font-black">
                  Public Sentiment Overview
                </h3>

                <span className="inline-flex h-[32px] items-center gap-2 rounded-full bg-[#3ea84e]/40 px-3 text-sm font-black text-[#dcffc4]">
                  <Bot size={14} />
                  AI Insight Active
                </span>
              </div>

              <h2 className="relative z-10 my-4 max-w-xs text-[42px] font-black leading-[0.95] tracking-[-2px] text-[#b9fb7d]">
                72.4% Positive
              </h2>

              <p className="relative z-10 m-0 max-w-[360px] text-sm font-medium leading-relaxed text-white/90">
                Based on 128,430 public conversations about the MBG program.
              </p>

              <div className="absolute -bottom-20 -right-14 h-[210px] w-[210px] rounded-full border border-[#beff96]/20 before:absolute before:inset-7 before:rounded-full before:border before:border-[#beff96]/20 after:absolute after:inset-14 after:rounded-full after:border after:border-[#beff96]/20" />
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="grid min-w-0 gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <StatCard
                    icon={MessageCircle}
                    label="Total Mentions"
                    value="128,430"
                    change="▲ 18.2%"
                  />

                  <StatCard
                    icon={SmilePlus}
                    label="Positive Sentiment"
                    value="72.4%"
                    change="▲ 6.8%"
                  />

                  <StatCard
                    icon={ThumbsDown}
                    label="Negative Sentiment"
                    value="18.7%"
                    change="▼ 3.2%"
                    tone="danger"
                  />

                  <StatCard
                    icon={ThumbsUp}
                    label="Neutral Sentiment"
                    value="8.9%"
                    change="▲ 1.1%"
                    tone="neutral"
                  />
                </div>

                <Card
                  title="Sentiment Trend"
                  className="min-h-[430px] p-7"
                  action={
                    <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#dce8df] bg-white px-5 text-[15px] font-extrabold text-[#10231c] shadow-sm">
                      This Month
                    </button>
                  }
                >
                  <div className="mb-5 mt-2 flex flex-wrap gap-8 text-[15px] font-extrabold">
                    <Legend color="text-[#67c74a]" label="Positive" />
                    <Legend color="text-[#f4b21b]" label="Neutral" />
                    <Legend color="text-[#0c2033]" label="Negative" />
                  </div>

                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={sentimentTrend}
                      margin={{ top: 8, right: 10, left: -10, bottom: 0 }}
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
                        tick={{ fill: "#5f6d66", fontSize: 14 }}
                        dy={8}
                      />

                      <YAxis
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        tickFormatter={(value) => `${value}%`}
                        axisLine={{ stroke: "#d9ded8" }}
                        tickLine={false}
                        tick={{ fill: "#5f6d66", fontSize: 14 }}
                        width={48}
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
                  </ResponsiveContainer>
                </Card>
              </div>

              <Card title="Topic Distribution" className="min-h-full p-7">
                <div className="flex h-full flex-col gap-7">
                  <p className="m-0 text-sm font-bold leading-relaxed text-[#6d7e75]">
                    Distribution of the most discussed MBG sentiment categories
                    based on public conversations.
                  </p>

                  <div className="relative mx-auto h-[280px] w-full max-w-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distribution}
                          dataKey="value"
                          innerRadius={72}
                          outerRadius={118}
                          paddingAngle={2}
                          onMouseEnter={(_, index) =>
                            setActiveDistribution(index)
                          }
                          onMouseLeave={() => setActiveDistribution(null)}
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

                        <Tooltip
                          content={<DonutTooltip />}
                          wrapperStyle={{
                            outline: "none",
                            zIndex: 50,
                          }}
                          position={{ x: 170, y: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div
                      className={[
                        "pointer-events-none absolute inset-0 grid place-content-center text-center transition-opacity duration-150",
                        activeDistribution === null
                          ? "opacity-100"
                          : "opacity-20",
                      ].join(" ")}
                    >
                      <b className="text-[26px] font-black leading-none text-[#10231c]">
                        128,430
                      </b>
                      <span className="mt-2 text-sm text-[#6d7e75]">
                        Total Mentions
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {distribution.map((item) => (
                      <div
                        key={item.name}
                        className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-[#dce8df] bg-[#f8fbf5] px-4 py-3 text-sm text-[#5f6d66]"
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

          <div className="grid gap-4 xl:grid-cols-[330px_minmax(0,1fr)]">
            <Card
              title="Top Keywords"
              action={
                <button className="h-9 rounded-xl border border-[#dce8df] bg-white px-3.5 font-extrabold text-[#10231c]">
                  View All
                </button>
              }
            >
              <WordCloud words={keywords} />
            </Card>

            <Card
              title="Recent Conversations"
              action={
                <button className="h-9 rounded-xl border border-[#dce8df] bg-white px-3.5 font-extrabold text-[#10231c]">
                  View All
                </button>
              }
            >
              <div className="overflow-x-auto">
                <div className="grid min-w-[760px] grid-cols-[70px_120px_minmax(250px,1fr)_110px_100px_70px] items-center gap-3 rounded-xl bg-[#f4f5f1] px-3.5 py-3 text-xs font-black text-[#6d7e75]">
                  <span>Platform</span>
                  <span>Account</span>
                  <span>Post Snippet</span>
                  <span>Sentiment</span>
                  <span>Engagement</span>
                  <span>Time</span>
                </div>

                {mentions.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    className="grid min-w-[760px] w-full grid-cols-[70px_120px_minmax(250px,1fr)_110px_100px_70px] items-center gap-3 border-0 border-b border-[#dce8df] bg-transparent px-3.5 py-3.5 text-left hover:bg-[#fbfdf8]"
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

          <Card title="Issue Alerts">
            <div className="grid lg:grid-cols-3">
              {alerts.map((item, index) => (
                <div
                  key={item.title}
                  className={[
                    "grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3.5 border-[#dce8df] px-4 py-3 lg:grid-cols-[48px_minmax(0,1fr)_105px]",
                    index < alerts.length - 1
                      ? "border-b lg:border-b-0 lg:border-r"
                      : "",
                  ].join(" ")}
                >
                  <div className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-[#fff3cd] text-[#f4b21b]">
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <h4 className="m-0 mb-1 text-sm font-black leading-snug text-[#10231c]">
                      {item.title}
                    </h4>
                    <p className="m-0 text-xs text-[#6d7e75]">{item.desc}</p>
                  </div>
                  <svg
                    className="hidden w-full text-[#f4b21b] lg:block"
                    viewBox="0 0 100 35"
                  >
                    <polyline
                      points="0,28 12,25 23,27 34,20 45,23 57,16 70,18 83,9 100,12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </Card>
        </main>

        <aside className="grid self-start gap-4 xl:grid-cols-3 2xl:grid-cols-1">
          

          <Card
            title="Top Sentiment Drivers"
            className="p-4"
            action={
              <button className="h-9 rounded-xl border border-[#dce8df] bg-white px-3.5 text-sm font-extrabold text-[#10231c]">
                View All
              </button>
            }
          >
            <div className="grid gap-2.5">
              {drivers.map((item, index) => {
                const progressWidth = [92, 78, 66, 52, 42][index] || 40;

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
                    className="rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-3"
                  >
                    <div className="mb-2.5 grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2.5">
                      <span
                        className={[
                          "grid h-[30px] w-[30px] place-items-center rounded-xl text-sm font-black",
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
                        style={{ width: `${progressWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card
            title="Data Sources"
            className="p-4"
            action={
              <button className="h-9 rounded-xl border border-[#dce8df] bg-white px-3.5 text-sm font-extrabold text-[#10231c]">
                View All
              </button>
            }
          >
            <div className="grid gap-2.5">
              {dataSources.map((item) => {
                const sourceMeta: Record<string, { label: string; bg: string; text: string }> = {
                  X: {
                    label: "X / Twitter",
                    bg: "bg-[#061a16]",
                    text: "text-white",
                  },
                  IG: {
                    label: "Instagram",
                    bg: "bg-[#fce7f3]",
                    text: "text-[#be185d]",
                  },
                  TT: {
                    label: "TikTok",
                    bg: "bg-[#111827]",
                    text: "text-white",
                  },
                  N: {
                    label: "News",
                    bg: "bg-[#dbeafe]",
                    text: "text-[#1d4ed8]",
                  },
                  YT: {
                    label: "YouTube",
                    bg: "bg-[#fee2e2]",
                    text: "text-[#dc2626]",
                  },
                };

                const meta = sourceMeta[item.name] || {
                  label: item.name,
                  bg: "bg-[#071a16]",
                  text: "text-white",
                };

                return (
                  <div
                    key={item.name}
                    className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-3"
                  >
                    <span
                      className={[
                        "grid h-[34px] w-[34px] place-items-center rounded-xl text-[11px] font-black",
                        meta.bg,
                        meta.text,
                      ].join(" ")}
                    >
                      {item.name}
                    </span>

                    <div className="min-w-0">
                      <b className="block text-sm font-black text-[#10231c]">
                        {item.value}
                      </b>
                      <small className="block truncate font-bold text-[#6d7e75]">
                        {meta.label}
                      </small>
                    </div>

                    <span className="rounded-full bg-[#e1f8d9] px-2.5 py-1 text-[11px] font-black text-[#15803d]">
                      Active
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 rounded-2xl border border-[#dce8df] bg-[#f8fbf5] p-3">
              <div className="flex items-center justify-between gap-3 text-[#6d7e75]">
                <div>
                  <small className="block font-bold">Last updated</small>
                  <b className="text-sm text-[#10231c]">15 menit yang lalu</b>
                </div>

                <button className="grid h-9 w-9 place-items-center rounded-xl border border-[#dce8df] bg-white text-[#07513b]">
                  <RefreshCcw size={15} />
                </button>
              </div>
            </div>
          </Card>
        </aside>
      </div>
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

interface DonutTooltipPayloadItem {
  payload: { name: string; value: number; color: string };
}

function DonutTooltip({ active, payload }: { active?: boolean; payload?: DonutTooltipPayloadItem[] }) {
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

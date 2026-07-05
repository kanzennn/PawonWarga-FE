"use client";

import { useMemo, useState } from "react";
import { Hash, Search, TrendingUp, TriangleAlert } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import WordCloud from "@/components/ui/WordCloud";
import { keywords } from "@/lib/data/dummy-data";
import {
  buildKeywordAlerts,
  filterKeywords,
  formatCompact,
  keywordStats,
  type KeywordFilters,
} from "@/lib/business-logic";

export default function KeywordSentimentPage() {
  const [filters, setFilters] = useState<KeywordFilters>({
    query: "",
    sentiment: "All Sentiments",
  });

  const filteredKeywords = useMemo(
    () => filterKeywords(keywords, filters),
    [filters],
  );
  const stats = useMemo(() => keywordStats(filteredKeywords), [filteredKeywords]);
  const chartKeywords = useMemo(
    () =>
      filteredKeywords
        .slice(0, 8)
        .map((item) => ({ name: item.text, value: item.value })),
    [filteredKeywords],
  );
  const alerts = useMemo(
    () => buildKeywordAlerts(filteredKeywords),
    [filteredKeywords],
  );

  const updateFilter = (key: keyof KeywordFilters, value: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  return (
    <div className="min-w-0 pb-24 lg:pb-0">
      <PageHeading title="Keyword Sentiment" subtitle="Lihat kata kunci yang paling memengaruhi sentimen publik tentang MBG." />

      <div className="mb-5 grid gap-4 xl:grid-cols-4">
        <StatCard icon={Hash} label="Tracked Keywords" value={String(stats.tracked)} change="Filtered" />
        <StatCard icon={TrendingUp} label="Rising Keywords" value={String(stats.rising)} change="Growth >= 12%" tone="info" />
        <StatCard icon={TriangleAlert} label="Negative Keywords" value={String(stats.negative)} change="Risk terms" tone="danger" />
        <StatCard icon={Search} label="Search Volume" value={formatCompact(stats.volume)} change="Mentions" />
      </div>

      <Card className="mb-5 p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px]">
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-[#dce8df] bg-white px-4 text-[#6d7e75]">
            <Search size={18} />
            <input
              value={filters.query}
              onChange={(event) => updateFilter("query", event.target.value)}
              className="w-full border-0 bg-transparent text-[#10231c] outline-none"
              placeholder="Search keyword..."
            />
          </label>
          <select
            value={filters.sentiment}
            onChange={(event) => updateFilter("sentiment", event.target.value)}
            className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold text-[#10231c] outline-none"
          >
            <option value="All Sentiments">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card title="Keyword Cloud" className="p-7">
          {filteredKeywords.length ? (
            <WordCloud words={filteredKeywords} />
          ) : (
            <EmptyState message="Tidak ada keyword yang cocok dengan filter." />
          )}
        </Card>

        <Card title="Keyword Ranking" className="p-7">
          <div className="grid gap-4">
            {filteredKeywords.slice(0, 7).map((item, index) => (
              <div key={item.text} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#dce8df] pb-3 last:border-0 last:pb-0">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#eef7ea] text-sm font-black text-[#07513b]">{index + 1}</span>
                <div className="min-w-0">
                  <b className="block truncate text-[#10231c]">{item.text}</b>
                  <small className="text-[#6d7e75]">{item.mentions} mentions • {item.growth}</small>
                </div>
                <Badge tone={item.sentiment}>{item.sentiment}</Badge>
              </div>
            ))}
            {!filteredKeywords.length && (
              <EmptyState message="Ranking kosong untuk kombinasi filter ini." />
            )}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
        <Card title="Keyword Mention Volume" className="p-7">
          {chartKeywords.length ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartKeywords} margin={{ left: -20, bottom: 20 }}>
                <CartesianGrid stroke="#e6e9e5" vertical={false} />
                <XAxis dataKey="name" angle={-12} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#67c74a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Tidak ada volume keyword untuk ditampilkan." />
          )}
        </Card>

        <Card title="Keyword Alerts" className="p-7">
          <div className="grid gap-3">
            {alerts.map(({ title, desc }) => (
              <div key={title} className="rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-4">
                <b className="text-[#10231c]">{title}</b>
                <p className="m-0 mt-2 leading-7 text-[#6d7e75]">{desc}</p>
              </div>
            ))}
            {!alerts.length && (
              <EmptyState message="Tidak ada alert keyword dari hasil filter saat ini." />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cbdccd] bg-[#fbfdf8] p-6 text-center">
      <b className="text-[#10231c]">{message}</b>
      <p className="m-0 mt-2 text-sm leading-6 text-[#6d7e75]">
        Coba ubah kata kunci atau pilihan sentimen.
      </p>
    </div>
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

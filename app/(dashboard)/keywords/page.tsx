"use client";

import { useMemo, useState } from "react";
import { Hash, Search, TrendingUp, TriangleAlert } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import WordCloud from "@/components/ui/WordCloud";
import { ErrorState, LoadingState } from "@/components/ui/DataState";
import { useDateRange } from "@/context/date-range-context";
import { usePlatform } from "@/context/platform-context";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useKeywords } from "@/hooks/use-keywords";
import { formatCompact } from "@/lib/business-logic";
import type { KeywordListResult, KeywordQuery } from "@/lib/api/types";

type KeywordFilters = Required<Pick<KeywordQuery, "query" | "sentiment">>;

export default function KeywordSentimentPage() {
  const [filters, setFilters] = useState<KeywordFilters>({
    query: "",
    sentiment: "All Sentiments",
  });
  const { range } = useDateRange();
  const { platform } = usePlatform();

  // The input stays bound to `filters.query`, only the request is debounced.
  const debouncedQuery = useDebouncedValue(filters.query);
  const { data, isLoading, error, refetch } = useKeywords({
    query: debouncedQuery,
    sentiment: filters.sentiment,
    from: range.from ?? undefined,
    to: range.to ?? undefined,
    platform: platform ?? undefined,
  });

  const updateFilter = (key: keyof KeywordFilters, value: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  return (
    <div className="min-w-0 pb-24 lg:pb-0">
      <PageHeading title="Keyword Sentiment" subtitle="See which keywords most influence public sentiment about MBG." />

      {isLoading ? (
        <LoadingState message="Loading keywords..." />
      ) : !data ? (
        <ErrorState message={error ?? "Keyword data unavailable."} onRetry={refetch} />
      ) : (
        <KeywordContent data={data} filters={filters} onFilterChange={updateFilter} />
      )}
    </div>
  );
}

interface KeywordContentProps {
  data: KeywordListResult;
  filters: KeywordFilters;
  onFilterChange: (key: keyof KeywordFilters, value: string) => void;
}

function KeywordContent({ data, filters, onFilterChange }: KeywordContentProps) {
  const { items, stats, alerts } = data;

  const chartKeywords = useMemo(
    () => items.slice(0, 8).map((item) => ({ name: item.text, value: item.value })),
    [items],
  );

  return (
    <>
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
              onChange={(event) => onFilterChange("query", event.target.value)}
              className="w-full border-0 bg-transparent text-[#10231c] outline-none"
              placeholder="Search keyword..."
            />
          </label>
          <select
            value={filters.sentiment}
            onChange={(event) => onFilterChange("sentiment", event.target.value)}
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
          {items.length ? (
            <WordCloud words={items} />
          ) : (
            <EmptyState message="No keywords match the filter." />
          )}
        </Card>

        <Card title="Keyword Ranking" className="p-7">
          <div className="grid gap-4">
            {items.slice(0, 7).map((item, index) => (
              <div key={item.text} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#dce8df] pb-3 last:border-0 last:pb-0">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#eef7ea] text-sm font-black text-[#07513b]">{index + 1}</span>
                <div className="min-w-0">
                  <b className="block truncate text-[#10231c]">{item.text}</b>
                  <small className="text-[#6d7e75]">{item.mentions} mentions • {item.growth}</small>
                </div>
                <Badge tone={item.sentiment}>{item.sentiment}</Badge>
              </div>
            ))}
            {!items.length && (
              <EmptyState message="No ranking for this filter combination." />
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
            <EmptyState message="No keyword volume to display." />
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
              <EmptyState message="No keyword alerts from the current filter." />
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cbdccd] bg-[#fbfdf8] p-6 text-center">
      <b className="text-[#10231c]">{message}</b>
      <p className="m-0 mt-2 text-sm leading-6 text-[#6d7e75]">
        Try adjusting the keyword or sentiment filter.
      </p>
    </div>
  );
}

function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-7 max-w-xl">
      <h1 className="m-0 text-[28px] font-black tracking-[-0.7px] text-[#10231c]">{title}</h1>
      <p className="mt-1 text-[15px] text-[#6d7e75]">{subtitle}</p>
    </div>
  );
}

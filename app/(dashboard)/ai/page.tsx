"use client";

import { Bot, CheckCircle2, FileText, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { ErrorState, LoadingState } from "@/components/ui/DataState";
import { useAiInsight } from "@/hooks/use-ai-insight";
import type { AiInsight } from "@/lib/api/types";

export default function AISummaryPage() {
  const { data: insight, isLoading, error, refetch } = useAiInsight();

  return (
    <div className="min-w-0 pb-24 lg:pb-0">
      <PageHeading title="AI Summary" subtitle="Ringkasan otomatis, temuan utama, isu prioritas, dan rekomendasi komunikasi publik." />

      {isLoading ? (
        <LoadingState message="Memuat ringkasan AI..." />
      ) : !insight ? (
        <ErrorState message={error ?? "Ringkasan AI tidak tersedia."} onRetry={refetch} />
      ) : (
        <AiSummaryContent insight={insight} />
      )}
    </div>
  );
}

function AiSummaryContent({ insight }: { insight: AiInsight }) {
  return (
    <>
      <div className="mb-5 grid gap-4 xl:grid-cols-4">
        <StatCard icon={Bot} label="AI Confidence" value={insight.stats.confidence.value} change={insight.stats.confidence.change} />
        <StatCard icon={Sparkles} label="Generated Insights" value={insight.stats.generatedInsights.value} change={insight.stats.generatedInsights.change} tone="info" />
        <StatCard icon={ShieldAlert} label="Detected Issues" value={insight.stats.detectedIssues.value} change={insight.stats.detectedIssues.change} tone="danger" />
        <StatCard icon={CheckCircle2} label="Resolved Signals" value={insight.stats.resolvedSignals.value} change={insight.stats.resolvedSignals.change} />
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card title="Generated Executive Summary" className="p-7">
          <div className="rounded-[26px] bg-[radial-gradient(circle_at_90%_15%,rgba(185,251,125,0.18),transparent_28%),linear-gradient(135deg,#04392b,#05281f)] p-7 text-white">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#dcffc4]/20 text-[#dcffc4]"><Bot size={26} /></div>
            <h2 className="m-0 text-3xl font-black tracking-[-1px] text-[#b9fb7d]">{insight.headline}</h2>
            <p className="mt-4 max-w-3xl leading-8 text-white/90">
              {insight.summary}
            </p>
          </div>
        </Card>

        <Card title="AI Priority Score" className="p-7">
          <div className="grid place-items-center rounded-[24px] bg-[#f6faf5] p-8 text-center">
            <span className="text-[72px] font-black leading-none text-[#07513b]">{insight.score}</span>
            <b className="mt-2 text-[#10231c]">Public Trust Score</b>
            <p className="m-0 mt-3 text-sm leading-6 text-[#6d7e75]">{insight.scoreNote}</p>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card title="Key Findings" className="p-7">
          <div className="grid gap-4">
            {insight.findings.map((item) => (
              <div key={item} className="grid grid-cols-[42px_minmax(0,1fr)] gap-4 rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e4f8d6] text-[#07513b]"><Lightbulb size={20} /></span>
                <p className="m-0 leading-7 text-[#10231c]">{item}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="AI Recommendations" className="p-7">
          <div className="grid gap-4">
            {insight.recommendations.map((item) => (
              <div key={item} className="grid grid-cols-[42px_minmax(0,1fr)] gap-4 rounded-2xl border border-[#dce8df] bg-white p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#052d22] text-white"><FileText size={20} /></span>
                <p className="m-0 leading-7 text-[#10231c]">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
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

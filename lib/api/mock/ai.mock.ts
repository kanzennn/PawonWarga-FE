import { generateExecutiveInsight } from "@/lib/business-logic";
import { aiInsightStats, aiScoreNote } from "@/lib/data/dummy-data";
import type { AiInsightDto } from "@/lib/api/types";

export function buildAiInsight(): AiInsightDto {
  const insight = generateExecutiveInsight();

  return {
    score: insight.score,
    score_note: aiScoreNote,
    confidence: insight.confidence,
    headline: insight.headline,
    summary: insight.summary,
    findings: insight.findings,
    recommendations: insight.recommendations,
    stats: {
      confidence: { value: `${insight.confidence}%`, change: "Stable" },
      generated_insights: aiInsightStats.generatedInsights,
      detected_issues: aiInsightStats.detectedIssues,
      resolved_signals: aiInsightStats.resolvedSignals,
    },
  };
}

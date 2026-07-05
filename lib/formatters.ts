import type { Sentiment } from "@/lib/types";

export const compactNumber = (value: number) =>
  Intl.NumberFormat("id-ID", { notation: "compact" }).format(value);

export const percent = (value: number) => `${value}%`;

export const sentimentLabel = (sentiment: Sentiment) =>
  ({ positive: "Positive", negative: "Negative", neutral: "Neutral" })[sentiment] ?? sentiment;

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

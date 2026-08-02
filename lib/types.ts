export type Sentiment = "positive" | "negative" | "neutral";

export interface SentimentTrendPoint {
  day: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface PlatformDatum {
  name: string;
  value: number;
  positive: number;
  negative: number;
  neutral: number;
  mentionCount?: number | null;
}

export interface SentimentDistributionSlice {
  name: string;
  value: number;
  color: string;
}

export interface Mention {
  id: number;
  platform: string;
  user: string;
  text: string;
  sentiment: Sentiment;
  engagement: string;
  time: string;
  location: string;
  category: string;
  risk: "Low" | "Medium" | "High";
}

export interface Keyword {
  text: string;
  value: number;
  sentiment: Sentiment;
  growth: string;
  mentions: string;
}

export interface CategorySentiment {
  category: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface LocationSentiment {
  name: string;
  score: number;
  sentiment: Sentiment;
  mentions: string;
}

export interface ReportListItem {
  id: string;
  title: string;
  type: string;
  status: "Ready" | "Scheduled" | "Draft";
  date: string;
  pages: number;
}

export interface SettingsIntegration {
  name: string;
  status: "Operational" | "Not Operational";
  count: string;
}

export interface WordCloudWord {
  text: string;
  value: number;
}

// A headline number plus its period-over-period delta, as rendered by StatCard.
export interface MetricValue {
  value: string;
  change: string;
}

export interface TopicSlice {
  name: string;
  value: number;
  color: string;
}

export interface SentimentDriver {
  name: string;
  value: string;
  tone: Sentiment;
  label: string;
  /** 0-100, drives the progress bar width. */
  progress: number;
}

export interface DataSourceStatus {
  /** Short badge code rendered in the tile, e.g. "X", "IG", "TT". */
  code: string;
  label: string;
  value: string;
  active: boolean;
}

export interface TrendInsight {
  label: string;
  value: string;
  desc: string;
  tone: "positive" | "neutral" | "info";
}

export interface MonitoringPreference {
  key: string;
  title: string;
  desc: string;
  checked: boolean;
}

// Mirrors PawonWarga-BE's model.User JSON shape (internal/model/user.go).
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

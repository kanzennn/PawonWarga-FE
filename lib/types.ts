export type Sentiment = "positive" | "negative" | "neutral";

// positive/neutral/negative's meaning differs by page: Dashboard's
// "Sentiment Trend" chart uses raw mention counts per point; Sentiment
// Analysis's "Sentiment Over Time" chart uses each point's percentage
// share (0-100) — matches the backend's /dashboard/overview vs
// /sentiment/overview response shapes. The *Count fields are the raw
// mention counts for that same point — only present on /sentiment/overview
// (backs its Percentage/Total toggle); absent on /dashboard/overview, whose
// positive/neutral/negative are already raw counts.
export interface SentimentTrendPoint {
  day: string;
  positive: number;
  neutral: number;
  negative: number;
  positiveCount?: number;
  neutralCount?: number;
  negativeCount?: number;
}

export interface PlatformDatum {
  name: string;
  value: number;
  positive: number;
  negative: number;
  neutral: number;
  mentionCount: number;
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
  /** Link to the original post on its source platform — "" if none was captured. */
  url: string;
}

export interface Comment {
  id: number;
  user: string;
  text: string;
  sentiment: Sentiment;
  engagement: string;
  time: string;
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

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

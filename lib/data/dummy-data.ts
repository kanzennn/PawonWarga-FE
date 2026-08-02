import type {
  CategorySentiment,
  DataSourceStatus,
  Keyword,
  LocationSentiment,
  Mention,
  MetricValue,
  MonitoringPreference,
  PlatformDatum,
  ReportListItem,
  SentimentDistributionSlice,
  SentimentDriver,
  SentimentTrendPoint,
  SettingsIntegration,
  TopicSlice,
  TrendInsight,
  WordCloudWord,
} from "@/lib/types";

export const sentimentTrend: SentimentTrendPoint[] = [
  { day: "1 Mei", positive: 68, neutral: 32, negative: 18 },
  { day: "5 Mei", positive: 74, neutral: 27, negative: 15 },
  { day: "10 Mei", positive: 79, neutral: 31, negative: 14 },
  { day: "15 Mei", positive: 71, neutral: 26, negative: 16 },
  { day: "20 Mei", positive: 76, neutral: 25, negative: 18 },
  { day: "25 Mei", positive: 82, neutral: 24, negative: 12 },
  { day: "31 Mei", positive: 77, neutral: 28, negative: 13 },
];

export const platformData: PlatformDatum[] = [
  { name: "X", value: 45200, positive: 62, negative: 22, neutral: 16 },
  { name: "Instagram", value: 32100, positive: 75, negative: 14, neutral: 11 },
  { name: "TikTok", value: 21400, positive: 69, negative: 20, neutral: 11 },
  { name: "News", value: 18700, positive: 54, negative: 24, neutral: 22 },
  { name: "YouTube", value: 11000, positive: 71, negative: 17, neutral: 12 },
];

export const sentimentDistribution: SentimentDistributionSlice[] = [
  { name: "Positive", value: 72.4, color: "#67c74a" },
  { name: "Negative", value: 18.7, color: "#0c2033" },
  { name: "Neutral", value: 8.9, color: "#f4b21b" },
];

export const mentions: Mention[] = [
  {
    id: 1,
    platform: "X",
    user: "@publicvoice",
    text: "Program MBG membantu anak sekolah mendapat makanan bergizi. Semoga terus diperluas ke seluruh daerah.",
    sentiment: "positive",
    engagement: "12.4K",
    time: "10:24",
    location: "Jawa Barat",
    category: "Nutrition",
    risk: "Low",
  },
  {
    id: 2,
    platform: "Instagram",
    user: "@dailyupdate",
    text: "Anak-anak senang dengan menu makan gratis hari ini. Semoga terus berjalan lancar.",
    sentiment: "positive",
    engagement: "8.2K",
    time: "11:10",
    location: "Jawa Timur",
    category: "School Access",
    risk: "Low",
  },
  {
    id: 3,
    platform: "TikTok",
    user: "@info.kita",
    text: "Di beberapa sekolah makanan datang terlambat, anak-anak sudah lapar.",
    sentiment: "negative",
    engagement: "5.6K",
    time: "12:45",
    location: "DKI Jakarta",
    category: "Distribution",
    risk: "High",
  },
  {
    id: 4,
    platform: "News",
    user: "Nasional Update",
    text: "Pemerintah evaluasi kualitas makanan dalam program MBG di beberapa daerah.",
    sentiment: "neutral",
    engagement: "3.1K",
    time: "13:20",
    location: "Jawa Tengah",
    category: "Food Quality",
    risk: "Medium",
  },
  {
    id: 5,
    platform: "X",
    user: "@educationwatch",
    text: "Kualitas makanan di sekolah harus jadi prioritas utama. Pengawasan perlu ditingkatkan.",
    sentiment: "negative",
    engagement: "2.8K",
    time: "14:02",
    location: "Bali",
    category: "Food Quality",
    risk: "High",
  },
  {
    id: 6,
    platform: "YouTube",
    user: "Komentar Publik",
    text: "MBG bagus, tapi standar menu dan kebersihan harus sama di semua sekolah.",
    sentiment: "neutral",
    engagement: "1.9K",
    time: "15:25",
    location: "Sulawesi Selatan",
    category: "Food Quality",
    risk: "Medium",
  },
];

export const keywords: Keyword[] = [
  { text: "makan bergizi", value: 64, sentiment: "positive", growth: "+18%", mentions: "42.1K" },
  { text: "sekolah", value: 52, sentiment: "positive", growth: "+12%", mentions: "35.6K" },
  { text: "gizi anak", value: 38, sentiment: "positive", growth: "+9%", mentions: "28.9K" },
  { text: "distribusi", value: 34, sentiment: "negative", growth: "+24%", mentions: "24.7K" },
  { text: "kualitas makanan", value: 31, sentiment: "negative", growth: "+12%", mentions: "22.2K" },
  { text: "anggaran", value: 28, sentiment: "neutral", growth: "+18%", mentions: "19.5K" },
  { text: "pemerintah", value: 22, sentiment: "neutral", growth: "+6%", mentions: "15.8K" },
  { text: "siswa", value: 21, sentiment: "positive", growth: "+5%", mentions: "14.6K" },
  { text: "menu sekolah", value: 19, sentiment: "positive", growth: "+3%", mentions: "12.9K" },
  { text: "transparansi", value: 17, sentiment: "neutral", growth: "+11%", mentions: "10.1K" },
  { text: "keterlambatan", value: 16, sentiment: "negative", growth: "+20%", mentions: "9.8K" },
  { text: "evaluasi", value: 14, sentiment: "neutral", growth: "+7%", mentions: "8.7K" },
];

export const categorySentiment: CategorySentiment[] = [
  { category: "Food Quality", positive: 42, negative: 39, neutral: 19 },
  { category: "Distribution", positive: 35, negative: 47, neutral: 18 },
  { category: "Nutrition", positive: 78, negative: 9, neutral: 13 },
  { category: "Budget", positive: 31, negative: 28, neutral: 41 },
  { category: "School Access", positive: 73, negative: 12, neutral: 15 },
];

export const locationSentiment: LocationSentiment[] = [
  { name: "Jawa Barat", score: 82, sentiment: "positive", mentions: "24.5K" },
  { name: "Jawa Timur", score: 78, sentiment: "positive", mentions: "21.8K" },
  { name: "DKI Jakarta", score: 61, sentiment: "neutral", mentions: "18.2K" },
  { name: "Jawa Tengah", score: 74, sentiment: "positive", mentions: "17.9K" },
  { name: "Bali", score: 58, sentiment: "negative", mentions: "8.4K" },
];

export const reports: ReportListItem[] = [
  { id: "RPT-001", title: "Executive Summary MBG Mei 2025", type: "Executive Summary", status: "Ready", date: "31 Mei 2025", pages: 18 },
  { id: "RPT-002", title: "Negative Sentiment Alert", type: "Issue Alert", status: "Scheduled", date: "Setiap Senin", pages: 8 },
  { id: "RPT-003", title: "Keyword Sentiment Report", type: "Keyword Report", status: "Ready", date: "25 Mei 2025", pages: 14 },
  { id: "RPT-004", title: "Platform Sentiment Breakdown", type: "Sentiment Report", status: "Draft", date: "20 Mei 2025", pages: 12 },
];

export const settingsIntegrations: SettingsIntegration[] = [
  { name: "X / Twitter", status: "Operational", count: "45.2K mentions" },
  { name: "Instagram", status: "Operational", count: "32.1K mentions" },
  { name: "TikTok", status: "Operational", count: "21.4K mentions" },
  { name: "YouTube", status: "Operational", count: "11.0K mentions" },
  { name: "News API", status: "Operational", count: "18.7K articles" },
];

export const monitoringPreferences: MonitoringPreference[] = [
  {
    key: "negativeAlert",
    title: "Negative sentiment alert",
    desc: "Notify when negative sentiment rises above threshold.",
    checked: true,
  },
  {
    key: "dailySummary",
    title: "Daily AI summary",
    desc: "Receive daily summary of MBG public conversations.",
    checked: true,
  },
  {
    key: "keywordSpike",
    title: "Keyword spike detection",
    desc: "Detect sudden increase in monitored keywords.",
    checked: true,
  },
  {
    key: "weeklyReport",
    title: "Weekly report email",
    desc: "Send scheduled sentiment report every Monday.",
    checked: false,
  },
];

export const dashboardHeadline = {
  positiveShare: "72.4%",
  totalConversations: "128,430",
  description: "Based on 128,430 public conversations about the MBG program.",
};

export const dashboardSummary: Record<
  "totalMentions" | "positive" | "negative" | "neutral",
  MetricValue
> = {
  totalMentions: { value: "128,430", change: "▲ 18.2%" },
  positive: { value: "72.4%", change: "▲ 6.8%" },
  negative: { value: "18.7%", change: "▼ 3.2%" },
  neutral: { value: "8.9%", change: "▲ 1.1%" },
};

export const topicDistribution: TopicSlice[] = [
  { name: "Food Quality", value: 28, color: "#064e3b" },
  { name: "School Distribution", value: 22, color: "#3fa76d" },
  { name: "Nutrition", value: 18, color: "#91dc68" },
  { name: "Government Policy", value: 14, color: "#d8bf62" },
  { name: "Budget Transparency", value: 10, color: "#f3b21b" },
  { name: "Public Complaints", value: 8, color: "#0f2336" },
];

export const dashboardKeywordCloud: WordCloudWord[] = [
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

export const sentimentDrivers: SentimentDriver[] = [
  { name: "Manfaat gizi anak", value: "42.1K", tone: "positive", label: "Positive", progress: 92 },
  { name: "Distribusi MBG", value: "31.8K", tone: "negative", label: "Negative", progress: 78 },
  { name: "Kualitas makanan", value: "24.7K", tone: "negative", label: "Negative", progress: 66 },
  { name: "Dukungan sekolah", value: "18.3K", tone: "positive", label: "Positive", progress: 52 },
  { name: "Evaluasi anggaran", value: "15.6K", tone: "neutral", label: "Neutral", progress: 42 },
];

export const dashboardDataSources: DataSourceStatus[] = [
  { code: "X", label: "X / Twitter", value: "45.2K", active: true },
  { code: "IG", label: "Instagram", value: "32.1K", active: true },
  { code: "TT", label: "TikTok", value: "21.4K", active: true },
];

export const dashboardLastUpdated = "15 menit yang lalu";

export const sentimentScore = {
  score: 81,
  scoreMax: 100,
  description:
    "Public sentiment remains healthy with positive conversations leading across most monitored platforms.",
};

export const sentimentSummary: Record<
  "positive" | "negative" | "neutral" | "analyzed",
  MetricValue
> = {
  positive: { value: "72.4%", change: "▲ 6.8%" },
  negative: { value: "18.7%", change: "▼ 3.2%" },
  neutral: { value: "8.9%", change: "▲ 1.1%" },
  analyzed: { value: "128K", change: "▲ 18.2%" },
};

export const sentimentTrendInsights: TrendInsight[] = [
  {
    label: "Peak positive",
    value: "82%",
    desc: "Highest positive sentiment this month",
    tone: "positive",
  },
  {
    label: "Lowest negative",
    value: "12%",
    desc: "Negative discussion decreased",
    tone: "neutral",
  },
  {
    label: "Trend status",
    value: "Stable",
    desc: "Overall sentiment is under control",
    tone: "info",
  },
];

export const sentimentCategoryNote =
  "Positive sentiment is strongest in nutrition and school access categories, while negative sentiment mostly appears in quality and distribution discussions.";

export const aiInsightStats: Record<
  "generatedInsights" | "detectedIssues" | "resolvedSignals",
  MetricValue
> = {
  generatedInsights: { value: "48", change: "▲ 12" },
  detectedIssues: { value: "7", change: "▲ 3" },
  resolvedSignals: { value: "21", change: "▲ 8" },
};

export const aiScoreNote =
  "Skor gabungan dari sentimen, reach, issue velocity, dan stabilitas percakapan.";

export const reportEngagementStats: Record<"downloads" | "shared", MetricValue> = {
  downloads: { value: "1.2K", change: "▲ 19%" },
  shared: { value: "186", change: "▲ 12%" },
};

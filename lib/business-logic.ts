import {
  categorySentiment,
  keywords,
  mentions,
  platformData,
  sentimentDistribution,
} from "@/lib/data/dummy-data";
import type { Keyword, Mention, PlatformDatum, ReportListItem, Sentiment } from "@/lib/types";

export interface PlatformMeta {
  label: string;
  bg: string;
  text: string;
}

export const platformMeta: Record<string, PlatformMeta> = {
  X: { label: "X", bg: "bg-[#061a16]", text: "text-white" },
  Instagram: { label: "IG", bg: "bg-[#fce7f3]", text: "text-[#be185d]" },
  TikTok: { label: "TT", bg: "bg-[#111827]", text: "text-white" },
  News: { label: "N", bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]" },
  YouTube: { label: "YT", bg: "bg-[#fee2e2]", text: "text-[#dc2626]" },
};

const sentimentCopy: Record<Sentiment, string> = {
  positive: "positif",
  negative: "negatif",
  neutral: "netral",
};

export interface ReportTemplate {
  id: string;
  name: string;
  bestFor: string;
  tone: string;
  layout: string;
  sections: string[];
}

export const reportTemplates: ReportTemplate[] = [
  {
    id: "executive-brief",
    name: "Executive Brief",
    bestFor: "Pimpinan / stakeholder",
    tone: "Strategis",
    layout: "1 halaman ringkasan + rekomendasi",
    sections: [
      "Executive Snapshot",
      "Public Trust Score",
      "Key Sentiment Drivers",
      "Strategic Recommendations",
    ],
  },
  {
    id: "sentiment-deep-dive",
    name: "Sentiment Deep Dive",
    bestFor: "Tim analis komunikasi",
    tone: "Analitis",
    layout: "Analisis tren, platform, dan kategori",
    sections: [
      "Sentiment Overview",
      "Trend Analysis",
      "Platform Breakdown",
      "Category Risk",
      "Analyst Notes",
    ],
  },
  {
    id: "issue-alert",
    name: "Issue Alert Memo",
    bestFor: "Respons cepat isu negatif",
    tone: "Taktis",
    layout: "Isu prioritas + tindakan cepat",
    sections: [
      "Issue Summary",
      "Risk Signal",
      "Evidence From Mentions",
      "Response Plan",
    ],
  },
  {
    id: "keyword-brief",
    name: "Keyword Intelligence Brief",
    bestFor: "Optimasi narasi publik",
    tone: "Naratif",
    layout: "Keyword, growth, dan framing pesan",
    sections: [
      "Keyword Ranking",
      "Narrative Opportunity",
      "Risk Keywords",
      "Message Guidance",
    ],
  },
];

export function parseCompactNumber(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  const normalized = String(value || "").trim().toUpperCase();
  const numeric = Number.parseFloat(normalized.replace(/[^\d.]/g, ""));

  if (Number.isNaN(numeric)) return 0;
  if (normalized.includes("K")) return Math.round(numeric * 1000);
  if (normalized.includes("M")) return Math.round(numeric * 1000000);
  return numeric;
}

export function formatCompact(value: number): string {
  return Intl.NumberFormat("id-ID", {
    maximumFractionDigits: value >= 10000 ? 1 : 0,
    notation: "compact",
  }).format(value);
}

export interface MentionFilters {
  query?: string;
  platform?: string;
  sentiment?: string;
}

export function filterMentions(items: Mention[] = mentions, filters: MentionFilters = {}): Mention[] {
  const query = (filters.query || "").trim().toLowerCase();
  const platform = filters.platform || "All Platforms";
  const sentiment = (filters.sentiment || "All Sentiments").toLowerCase();

  return items.filter((item) => {
    const searchable = [
      item.user,
      item.text,
      item.platform,
      item.location,
      item.sentiment,
      item.category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesQuery = !query || searchable.includes(query);
    const matchesPlatform =
      platform === "All Platforms" || item.platform === platform;
    const matchesSentiment =
      sentiment === "all sentiments" || item.sentiment === sentiment;

    return matchesQuery && matchesPlatform && matchesSentiment;
  });
}

export interface MentionMetrics {
  liveMentions: number;
  totalEngagement: number;
  uniqueAuthors: number;
  flaggedIssues: number;
}

export function summarizeMentions(items: Mention[] = mentions): MentionMetrics {
  const totalEngagement = items.reduce(
    (total, item) => total + parseCompactNumber(item.engagement),
    0,
  );
  const uniqueAuthors = new Set(items.map((item) => item.user)).size;
  const flaggedIssues = items.filter((item) => item.sentiment === "negative");

  return {
    liveMentions: items.length,
    totalEngagement,
    uniqueAuthors,
    flaggedIssues: flaggedIssues.length,
  };
}

export function aggregatePlatformVolume(items: Mention[] = mentions): PlatformDatum[] {
  if (items.length === mentions.length) {
    return platformData.map((item) => ({ ...item, mentionCount: null }));
  }

  const totals = platformData.map((platform) => {
    const platformMentions = items.filter((item) => item.platform === platform.name);
    const engagement = platformMentions.reduce(
      (total, item) => total + parseCompactNumber(item.engagement),
      0,
    );

    return {
      ...platform,
      value: platformMentions.length ? engagement : 0,
      mentionCount: platformMentions.length,
    };
  });

  return totals.filter((item) => item.value > 0 || items.length === mentions.length);
}

export interface KeywordFilters {
  query?: string;
  sentiment?: string;
}

export function filterKeywords(items: Keyword[] = keywords, filters: KeywordFilters = {}): Keyword[] {
  const query = (filters.query || "").trim().toLowerCase();
  const sentiment = (filters.sentiment || "All Sentiments").toLowerCase();

  return items.filter((item) => {
    const matchesQuery = !query || item.text.toLowerCase().includes(query);
    const matchesSentiment =
      sentiment === "all sentiments" || item.sentiment === sentiment;
    return matchesQuery && matchesSentiment;
  });
}

export interface KeywordStats {
  tracked: number;
  rising: number;
  negative: number;
  volume: number;
}

export function keywordStats(items: Keyword[] = keywords): KeywordStats {
  return {
    tracked: items.length,
    rising: items.filter((item) => Number.parseInt(item.growth, 10) >= 12).length,
    negative: items.filter((item) => item.sentiment === "negative").length,
    volume: items.reduce((total, item) => total + parseCompactNumber(item.mentions), 0),
  };
}

export interface KeywordAlert {
  title: string;
  desc: string;
}

export function buildKeywordAlerts(items: Keyword[] = keywords): KeywordAlert[] {
  return items
    .filter(
      (item) =>
        item.sentiment === "negative" ||
        item.text.includes("transparansi") ||
        Number.parseInt(item.growth, 10) >= 18,
    )
    .slice(0, 4)
    .map((item) => {
      const growth = item.growth.replace("+", "");
      const sentiment = sentimentCopy[item.sentiment] || item.sentiment;

      return {
        title: item.text,
        desc: `Percakapan ${sentiment} naik ${growth} dalam periode monitoring terakhir.`,
      };
    });
}

export interface ExecutiveInsight {
  score: number;
  confidence: number;
  headline: string;
  summary: string;
  findings: string[];
  recommendations: string[];
}

export function generateExecutiveInsight(): ExecutiveInsight {
  const topPositive = keywords.find((item) => item.sentiment === "positive");
  const topRisk = keywords.find((item) => item.sentiment === "negative");
  const categoryRisk = [...categorySentiment].sort(
    (a, b) => b.negative - a.negative,
  )[0];

  return {
    score: 81,
    confidence: 92,
    headline: "MBG sentiment remains positive.",
    summary:
      "Percakapan publik tentang program MBG masih didominasi sentimen positif. Dukungan publik muncul karena manfaat gizi anak, akses makanan di sekolah, dan persepsi bantuan bagi keluarga. Risiko utama berada pada kualitas makanan, distribusi, dan transparansi anggaran.",
    findings: [
      `Sentimen positif didorong oleh narasi ${topPositive?.text || "gizi anak"} dan akses makanan sekolah.`,
      `Isu prioritas yang perlu dimonitor adalah ${topRisk?.text || "distribusi"} karena pertumbuhan percakapan negatifnya tinggi.`,
      `${categoryRisk.category} menjadi kategori dengan tekanan negatif terbesar (${categoryRisk.negative}%).`,
    ],
    recommendations: [
      "Publikasikan ringkasan standar kualitas makanan dan mekanisme audit vendor.",
      "Buat respons cepat untuk wilayah dengan keluhan distribusi tinggi.",
      "Angkat cerita positif dari sekolah dan keluarga penerima manfaat untuk menjaga sentimen publik.",
    ],
  };
}

function getTemplateById(templateId: string): ReportTemplate {
  return (
    reportTemplates.find((template) => template.id === templateId) ||
    reportTemplates[0]
  );
}

export interface ReportFormValues {
  type: string;
  dateRange: string;
  format: string;
  templateId?: string;
}

export interface ReportPreview {
  id: string;
  title: string;
  type: string;
  // Widened from "Draft" so a document fetched back from GET /reports/{id}
  // (which can already be Ready or Scheduled) fits the same shape.
  status: ReportListItem["status"];
  date: string;
  pages: number;
  format: string;
  template: ReportTemplate;
  highlights: string[];
}

export function generateReportPreview({
  type,
  dateRange,
  format,
  templateId = "executive-brief",
}: ReportFormValues): ReportPreview {
  const positiveShare =
    sentimentDistribution.find((item) => item.name === "Positive")?.value || 0;
  const negativeShare =
    sentimentDistribution.find((item) => item.name === "Negative")?.value || 0;
  const topKeyword = keywords[0];
  const topPlatform = [...platformData].sort((a, b) => b.value - a.value)[0];
  const issueKeyword = keywords.find((item) => item.sentiment === "negative");
  const template = getTemplateById(templateId);
  const pagesByType: Record<string, number> = {
    "Executive Summary": 18,
    "Sentiment Report": 24,
    "Keyword Sentiment Report": 16,
    "Issue Alert Report": 8,
  };

  return {
    id: `RPT-D${String(Date.now()).slice(-4)}`,
    title: `${type} - ${dateRange}`,
    type,
    status: "Draft",
    date: "Generated now",
    pages: pagesByType[type] || 12,
    format,
    template,
    highlights: [
      `${positiveShare}% sentimen publik berada di area positif.`,
      `${negativeShare}% percakapan perlu dimonitor sebagai risiko reputasi.`,
      `${topPlatform.name} menjadi sumber volume terbesar dengan ${topPlatform.value.toLocaleString()} percakapan.`,
      `"${topKeyword.text}" adalah keyword paling kuat, sementara "${issueKeyword?.text}" perlu respons cepat.`,
    ],
  };
}

export interface ReportSection {
  title: string;
  body: string;
  bullets: string[];
}

export interface ReportMetricBlock {
  label: string;
  value: string;
}

export interface ReportDocument extends ReportPreview {
  preparedFor: string;
  period: string;
  metrics: ReportMetricBlock[];
  sections: ReportSection[];
  appendix: string[];
}

export function generateReportDocument({
  type,
  dateRange,
  format,
  templateId = "executive-brief",
}: ReportFormValues): ReportDocument {
  const preview = generateReportPreview({ type, dateRange, format, templateId });
  const insight = generateExecutiveInsight();
  const topPlatform = [...platformData].sort((a, b) => b.value - a.value)[0];
  const topNegativeKeywords = keywords
    .filter((item) => item.sentiment === "negative")
    .slice(0, 3);
  const topMentions = mentions.slice(0, 3);
  const categoryRisk = [...categorySentiment].sort(
    (a, b) => b.negative - a.negative,
  )[0];

  const metricBlocks: ReportMetricBlock[] = [
    { label: "Positive Sentiment", value: "72.4%" },
    { label: "Negative Sentiment", value: "18.7%" },
    { label: "Total Conversations", value: "128,430" },
    { label: "AI Confidence", value: `${insight.confidence}%` },
  ];

  const sectionsByTemplate: Record<string, ReportSection[]> = {
    "executive-brief": [
      {
        title: "Executive Snapshot",
        body: insight.summary,
        bullets: preview.highlights.slice(0, 3),
      },
      {
        title: "Public Trust Score",
        body: "Skor kepercayaan publik berada pada level sehat dan masih didukung oleh dominasi sentimen positif.",
        bullets: [
          `Public Trust Score berada di angka ${insight.score}/100.`,
          `${metricBlocks[0].value} percakapan masuk kategori positif.`,
          `AI confidence untuk ringkasan ini berada di ${insight.confidence}%.`,
        ],
      },
      {
        title: "Key Sentiment Drivers",
        body: "Penggerak utama sentimen berasal dari manfaat gizi, akses sekolah, dan isu operasional yang perlu ditangani cepat.",
        bullets: [
          `Keyword positif teratas: ${keywords.find((item) => item.sentiment === "positive")?.text}.`,
          `Keyword risiko teratas: ${topNegativeKeywords[0]?.text}.`,
          `Platform volume terbesar: ${topPlatform.name}.`,
        ],
      },
      {
        title: "Strategic Recommendations",
        body: "Prioritas komunikasi perlu menjaga narasi manfaat sambil menjawab isu operasional yang mulai naik.",
        bullets: insight.recommendations,
      },
    ],
    "sentiment-deep-dive": [
      {
        title: "Sentiment Overview",
        body: `Sentimen publik pada periode ${dateRange} masih sehat, tetapi tekanan negatif terkonsentrasi pada kategori ${categoryRisk.category}.`,
        bullets: [
          `Platform volume terbesar: ${topPlatform.name}.`,
          `Kategori risiko tertinggi: ${categoryRisk.category} (${categoryRisk.negative}% negatif).`,
          "Sentimen positif masih dipimpin oleh nutrisi dan akses sekolah.",
        ],
      },
      {
        title: "Trend Analysis",
        body: "Tren percakapan menunjukkan sentimen positif tetap memimpin, sementara isu negatif bergerak naik pada topik operasional.",
        bullets: [
          "Puncak sentimen positif muncul saat narasi manfaat gizi anak menguat.",
          "Percakapan negatif meningkat ketika distribusi dan kualitas makanan dibahas.",
          "Sentimen netral didorong oleh pemberitaan evaluasi dan anggaran.",
        ],
      },
      {
        title: "Platform Breakdown",
        body: "Volume percakapan terbesar berasal dari kanal sosial cepat, sehingga respons publik perlu disiapkan lintas platform.",
        bullets: platformData
          .slice(0, 4)
          .map((item) => `${item.name}: ${item.value.toLocaleString()} conversations`),
      },
      {
        title: "Category Risk",
        body: "Kategori risiko membantu tim komunikasi memilih isu mana yang perlu dijawab lebih dulu.",
        bullets: categorySentiment.map(
          (item) =>
            `${item.category}: ${item.positive}% positive, ${item.negative}% negative, ${item.neutral}% neutral`,
        ),
      },
      {
        title: "Analyst Notes",
        body: "Tim analis perlu memprioritaskan pemantauan percakapan lintas platform dan eskalasi isu negatif yang berulang.",
        bullets: topMentions.map((item) => `${item.platform}: ${item.text}`),
      },
    ],
    "issue-alert": [
      {
        title: "Issue Summary",
        body: `Isu utama yang perlu respons cepat adalah ${topNegativeKeywords[0]?.text || "distribusi"} dan kualitas layanan lapangan.`,
        bullets: topNegativeKeywords.map(
          (item) => `${item.text}: ${item.growth} growth, ${item.mentions} mentions`,
        ),
      },
      {
        title: "Risk Signal",
        body: "Sinyal risiko muncul ketika keyword negatif tumbuh bersamaan dengan mention lintas platform.",
        bullets: [
          `${topNegativeKeywords[0]?.text}: perlu respons kualitas dan distribusi.`,
          `${categoryRisk.category}: kategori dengan tekanan negatif terbesar.`,
          "Respons perlu memakai data wilayah, waktu kejadian, dan tindakan korektif.",
        ],
      },
      {
        title: "Evidence From Mentions",
        body: "Contoh percakapan publik membantu tim melihat konteks narasi yang sedang berkembang.",
        bullets: topMentions.map((item) => `${item.platform} - ${item.location}: ${item.text}`),
      },
      {
        title: "Response Plan",
        body: "Gunakan respons publik yang singkat, faktual, dan menyebut langkah korektif yang dapat diverifikasi.",
        bullets: [
          "Konfirmasi wilayah dan titik distribusi yang terdampak.",
          "Publikasikan tindakan korektif dan waktu penyelesaian.",
          "Siapkan Q&A untuk kanal sosial dan media berita.",
        ],
      },
    ],
    "keyword-brief": [
      {
        title: "Keyword Ranking",
        body: "Keyword utama menunjukkan publik masih memberi perhatian besar pada manfaat program dan operasional lapangan.",
        bullets: keywords
          .slice(0, 5)
          .map((item) => `${item.text}: ${item.mentions}, ${item.growth}`),
      },
      {
        title: "Narrative Opportunity",
        body: "Keyword positif dapat dipakai untuk memperkuat cerita manfaat program secara konsisten.",
        bullets: keywords
          .filter((item) => item.sentiment === "positive")
          .slice(0, 4)
          .map((item) => `${item.text}: gunakan sebagai angle komunikasi manfaat.`),
      },
      {
        title: "Risk Keywords",
        body: "Keyword risiko perlu dipantau karena berpotensi membentuk persepsi publik terhadap kualitas implementasi.",
        bullets: topNegativeKeywords.map(
          (item) => `${item.text}: ${item.growth} growth dan ${item.mentions} mentions`,
        ),
      },
      {
        title: "Message Guidance",
        body: "Narasi komunikasi perlu menguatkan manfaat gizi anak sembari menjawab keyword risiko secara konkret.",
        bullets: [
          "Gunakan narasi manfaat untuk keyword positif.",
          "Gunakan data audit dan SLA distribusi untuk keyword negatif.",
          "Gunakan bahasa netral dan informatif untuk isu anggaran.",
        ],
      },
    ],
  };

  return {
    ...preview,
    preparedFor: "MBG Insight Team",
    period: dateRange,
    metrics: metricBlocks,
    sections:
      sectionsByTemplate[preview.template.id] || sectionsByTemplate["executive-brief"],
    appendix: [
      "Data pada prototype ini menggunakan dummy conversations.",
      "Template dapat dikembangkan menjadi export dokumen, Excel, atau PowerPoint pada tahap backend/export berikutnya.",
    ],
  };
}

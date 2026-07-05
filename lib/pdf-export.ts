import type { ReportDocument, ReportSection } from "@/lib/business-logic";

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const MARGIN = 28;
const HEADER_H = 142;
const HEADER_INSET = 18;
const FOOTER_Y = 26;
const FONT_REGULAR = "F1";
const FONT_BOLD = "F2";

const palette = {
  ink: "#10231c",
  muted: "#5f7368",
  subtle: "#f6faf5",
  panel: "#fbfdf8",
  border: "#dce8df",
  dark: "#04392b",
  card: "#225848",
  lime: "#b9fb7d",
  white: "#ffffff",
};

interface PdfPage {
  commands: string[];
  compact: boolean;
  y: number;
}

interface TextOptions {
  color?: string;
  font?: string;
  size?: number;
  lineHeight?: number;
  maxChars?: number;
}

interface RectOptions {
  fill?: string;
  stroke?: string;
  lineWidth?: number;
  radius?: number;
}

function sanitizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapePdfText(value: unknown): string {
  return sanitizeText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function rgb(hex: string): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;

  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

function wrapText(text: string, maxChars: number): string[] {
  const words = sanitizeText(text).split(" ").filter(Boolean);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;

    if (nextLine.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = nextLine;
    }
  });

  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function createPage({ compact = false }: { compact?: boolean } = {}): PdfPage {
  return {
    commands: [],
    compact,
    y: compact ? PAGE_HEIGHT - 92 : PAGE_HEIGHT - HEADER_H - 52,
  };
}

function roundedPath(x: number, y: number, width: number, height: number, radius = 8): string {
  const r = Math.min(radius, width / 2, height / 2);
  const k = 0.5522847498;

  return [
    `${x + r} ${y} m`,
    `${x + width - r} ${y} l`,
    `${x + width - r + k * r} ${y} ${x + width} ${y + r - k * r} ${x + width} ${y + r} c`,
    `${x + width} ${y + height - r} l`,
    `${x + width} ${y + height - r + k * r} ${x + width - r + k * r} ${y + height} ${x + width - r} ${y + height} c`,
    `${x + r} ${y + height} l`,
    `${x + r - k * r} ${y + height} ${x} ${y + height - r + k * r} ${x} ${y + height - r} c`,
    `${x} ${y + r} l`,
    `${x} ${y + r - k * r} ${x + r - k * r} ${y} ${x + r} ${y} c`,
    "h",
  ].join("\n");
}

function roundedRect(page: PdfPage, x: number, y: number, width: number, height: number, options: RectOptions = {}) {
  const commands = ["q", roundedPath(x, y, width, height, options.radius || 8)];

  if (options.fill && options.stroke) {
    commands.push(`${rgb(options.fill)} rg`);
    commands.push(`${rgb(options.stroke)} RG`);
    commands.push(`${options.lineWidth || 0.8} w`);
    commands.push("B");
  } else if (options.fill) {
    commands.push(`${rgb(options.fill)} rg`);
    commands.push("f");
  } else if (options.stroke) {
    commands.push(`${rgb(options.stroke)} RG`);
    commands.push(`${options.lineWidth || 0.8} w`);
    commands.push("S");
  }

  commands.push("Q");
  page.commands.push(commands.join("\n"));
}

function rect(page: PdfPage, x: number, y: number, width: number, height: number, fill: string) {
  page.commands.push(`q ${rgb(fill)} rg ${x} ${y} ${width} ${height} re f Q`);
}

function line(page: PdfPage, x1: number, y1: number, x2: number, y2: number, color: string = palette.border, width = 0.7) {
  page.commands.push(
    `q ${rgb(color)} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S Q`,
  );
}

function text(page: PdfPage, value: unknown, x: number, y: number, options: TextOptions = {}) {
  const color = rgb(options.color || palette.ink);
  const font = options.font || FONT_REGULAR;
  const size = options.size || 8;

  page.commands.push(
    `BT ${color} rg /${font} ${size} Tf ${x} ${y} Td (${escapePdfText(value)}) Tj ET`,
  );
}

function addWrapped(page: PdfPage, value: string, x: number, y: number, options: TextOptions = {}): number {
  const size = options.size || 8;
  const lineHeight = options.lineHeight || size + 4;
  const lines = wrapText(value, options.maxChars || 96);
  let currentY = y;

  lines.forEach((lineText) => {
    text(page, lineText, x, currentY, options);
    currentY -= lineHeight;
  });

  return currentY;
}

function contentX() {
  return MARGIN;
}

function contentW() {
  return PAGE_WIDTH - MARGIN * 2;
}

function drawHeader(page: PdfPage, report: ReportDocument) {
  rect(page, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, palette.white);

  if (page.compact) {
    roundedRect(page, MARGIN, PAGE_HEIGHT - 58, PAGE_WIDTH - MARGIN * 2, 36, {
      fill: palette.dark,
      radius: 12,
    });
    text(page, report.template.name.toUpperCase(), MARGIN + 16, PAGE_HEIGHT - 38, {
      size: 6.5,
      font: FONT_BOLD,
      color: palette.lime,
    });
    text(page, report.title, MARGIN + 154, PAGE_HEIGHT - 39, {
      size: 9,
      font: FONT_BOLD,
      color: palette.white,
    });
    return;
  }

  roundedRect(page, MARGIN, PAGE_HEIGHT - HEADER_H, PAGE_WIDTH - MARGIN * 2, HEADER_H - 8, {
    fill: palette.dark,
    radius: 16,
  });

  text(page, report.template.name.toUpperCase(), MARGIN + 18, PAGE_HEIGHT - 44, {
    size: 7.2,
    font: FONT_BOLD,
    color: palette.lime,
  });
  addWrapped(page, report.title, MARGIN + 18, PAGE_HEIGHT - 68, {
    size: 19,
    font: FONT_BOLD,
    color: palette.white,
    maxChars: 54,
    lineHeight: 22,
  });

  drawMetricCards(page, report);
}

function drawMetricCards(page: PdfPage, report: ReportDocument) {
  const cardY = PAGE_HEIGHT - HEADER_H + 22;
  const cardGap = 8;
  const cardW =
    (PAGE_WIDTH - MARGIN * 2 - HEADER_INSET * 2 - cardGap * 3) / 4;

  report.metrics.forEach((item, index) => {
    const x = MARGIN + HEADER_INSET + index * (cardW + cardGap);

    roundedRect(page, x, cardY, cardW, 46, {
      fill: palette.card,
      radius: 9,
    });
    text(page, item.label, x + 10, cardY + 30, {
      size: 6.4,
      font: FONT_BOLD,
      color: "#d6ead0",
    });
    text(page, item.value, x + 10, cardY + 12, {
      size: 14,
      font: FONT_BOLD,
      color: palette.lime,
    });
  });
}

function drawMetaBar(page: PdfPage, report: ReportDocument) {
  const x = contentX();
  const y = PAGE_HEIGHT - HEADER_H - 22;
  const width = contentW();
  const colW = width / 3;

  roundedRect(page, x, y - 46, width, 46, {
    fill: palette.panel,
    stroke: palette.border,
    radius: 10,
  });

  ([
    ["Prepared for", report.preparedFor],
    ["Period", report.period],
    ["Template", report.template.name],
  ] as const).forEach(([label, value], index) => {
    const colX = x + 14 + index * colW;

    text(page, label, colX, y - 18, {
      size: 6.8,
      font: FONT_BOLD,
      color: palette.muted,
    });
    text(page, value, colX, y - 32, {
      size: 8.5,
      font: FONT_BOLD,
      color: palette.ink,
    });
  });

  page.y = y - 68;
}

function setupPage(page: PdfPage, report: ReportDocument) {
  drawHeader(page, report);

  if (!page.compact) {
    drawMetaBar(page, report);
  }
}

function estimateSectionHeight(section: ReportSection): number {
  const bodyLines = wrapText(section.body, 100);
  const bulletLines = section.bullets.flatMap((item) => wrapText(item, 94));

  return 44 + bodyLines.length * 12 + bulletLines.length * 18 + 20;
}

function ensurePage(pages: PdfPage[], report: ReportDocument, neededHeight: number): PdfPage {
  let page = pages[pages.length - 1];

  if (page.y - neededHeight < 58) {
    page = createPage({ compact: true });
    pages.push(page);
    setupPage(page, report);
  }

  return page;
}

function drawSectionCard(pages: PdfPage[], report: ReportDocument, section: ReportSection) {
  const height = estimateSectionHeight(section);
  const page = ensurePage(pages, report, height);
  const x = contentX();
  const width = contentW();
  const y = page.y - height;

  roundedRect(page, x, y, width, height, {
    fill: palette.white,
    stroke: palette.border,
    radius: 12,
  });

  text(page, section.title, x + 14, page.y - 22, {
    size: 12,
    font: FONT_BOLD,
  });

  let currentY = page.y - 42;
  currentY = addWrapped(page, section.body, x + 14, currentY, {
    size: 8,
    color: palette.muted,
    maxChars: 102,
    lineHeight: 12,
  });
  currentY -= 6;

  section.bullets.forEach((item) => {
    const lines = wrapText(item, 94);
    const bulletHeight = Math.max(20, lines.length * 10 + 9);

    roundedRect(page, x + 14, currentY - bulletHeight + 9, width - 28, bulletHeight, {
      fill: palette.white,
      stroke: palette.border,
      lineWidth: 0.45,
      radius: 7,
    });
    lines.forEach((lineText, lineIndex) => {
      text(page, `${lineIndex === 0 ? "- " : "  "}${lineText}`, x + 26, currentY - lineIndex * 10, {
        size: 7.3,
        font: lineIndex === 0 ? FONT_BOLD : FONT_REGULAR,
        color: palette.ink,
      });
    });
    currentY -= bulletHeight + 6;
  });

  page.y = y - 14;
}

function drawAppendix(pages: PdfPage[], report: ReportDocument) {
  const section: ReportSection = {
    title: "Appendix",
    body: "Additional notes for interpreting this report.",
    bullets: report.appendix,
  };

  drawSectionCard(pages, report, section);
}

function drawPageNumbers(pages: PdfPage[]) {
  pages.forEach((page, index) => {
    line(page, MARGIN, FOOTER_Y, PAGE_WIDTH - MARGIN, FOOTER_Y, palette.border, 0.6);
    text(page, `Page ${index + 1} of ${pages.length}`, PAGE_WIDTH - 88, 12, {
      size: 6.5,
      color: palette.muted,
    });
  });
}

function buildReportPages(report: ReportDocument): PdfPage[] {
  const pages = [createPage()];

  setupPage(pages[0], report);
  report.sections.forEach((section) => drawSectionCard(pages, report, section));
  drawAppendix(pages, report);
  drawPageNumbers(pages);

  return pages;
}

function buildPdf(pages: PdfPage[]): string {
  const objects: string[] = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push(
    `<< /Type /Pages /Kids [${pages
      .map((_, index) => `${3 + index * 2} 0 R`)
      .join(" ")}] /Count ${pages.length} >>`,
  );

  pages.forEach((page, index) => {
    const pageObjectId = 3 + index * 2;
    const contentObjectId = pageObjectId + 1;
    const content = page.commands.join("\n");

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >> /Contents ${contentObjectId} 0 R >>`,
    );
    objects.push(`<< /Length ${content.length + 1} >>\nstream\n${content}\nendstream`);
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

export function downloadReportPdf(report: ReportDocument, fileName = "mbg-report.pdf") {
  const pdf = buildPdf(buildReportPages(report));
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");

  link.href = url;
  link.download = fileName;
  window.document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function createReportPdfBlob(report: ReportDocument): Blob {
  return new Blob([buildPdf(buildReportPages(report))], {
    type: "application/pdf",
  });
}

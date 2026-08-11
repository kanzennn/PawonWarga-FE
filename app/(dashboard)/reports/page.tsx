"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock, Download, FileText, Plus, Send, Settings2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { ErrorState, LoadingState } from "@/components/ui/DataState";
import { useReportGenerator, useReportTemplates, useReports } from "@/hooks/use-reports";
import { downloadReportPdf } from "@/lib/pdf-export";
import type { ReportDocument, ReportTemplate } from "@/lib/business-logic";
import type { ReportListItem } from "@/lib/types";
import type { GenerateReportInput, ReportListResult } from "@/lib/api/types";

export default function ReportsPage() {
  const { data: reportData, isLoading: isReportsLoading, error: reportsError, refetch } = useReports();
  const {
    data: templates,
    isLoading: isTemplatesLoading,
    error: templatesError,
    refetch: refetchTemplates,
  } = useReportTemplates();

  const isLoading = isReportsLoading || isTemplatesLoading;
  const error = reportsError ?? templatesError;

  const retry = () => {
    refetch();
    refetchTemplates();
  };

  return (
    <div className="min-w-0 pb-24 lg:pb-0">
      <PageHeading title="Reports" subtitle="Create, schedule, and manage MBG sentiment analysis reports." />

      {isLoading ? (
        <LoadingState message="Loading reports..." />
      ) : !reportData || !templates?.length ? (
        <ErrorState message={error ?? "Report data unavailable."} onRetry={retry} />
      ) : (
        <ReportsContent reportData={reportData} templates={templates} />
      )}
    </div>
  );
}

interface ReportsContentProps {
  reportData: ReportListResult;
  templates: ReportTemplate[];
}

function ReportsContent({ reportData, templates }: ReportsContentProps) {
  const [reportList, setReportList] = useState<ReportListItem[]>(reportData.items);
  const [form, setForm] = useState<GenerateReportInput>({
    type: "Executive Summary",
    dateRange: "1 - 31 Mei 2025",
    format: "PDF",
    templateId: templates[0].id,
  });
  const [document, setDocument] = useState<ReportDocument | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  const { mutate: generate, isPending, error: generateError } = useReportGenerator();

  // Renders the first preview as soon as the page has its templates, matching
  // the old behaviour where the document was built synchronously on mount.
  const didAutoGenerate = useRef(false);
  useEffect(() => {
    if (didAutoGenerate.current) return;
    didAutoGenerate.current = true;

    generate(form).then(setDocument).catch(() => {
      // `generateError` from the mutation drives the message.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduledCount = useMemo(
    () => reportList.filter((item) => item.status === "Scheduled").length,
    [reportList],
  );

  const updateForm = (key: keyof GenerateReportInput, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  };

  const generatePreview = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const nextDocument = await generate(form);
      setDocument(nextDocument);
      setActiveSection(0);
      setReportList((currentReports) => [nextDocument, ...currentReports]);
    } catch {
      // Error surfaces through `generateError`.
    }
  };

  const regeneratePreview = async () => {
    try {
      setDocument(await generate(form));
      setActiveSection(0);
    } catch {
      // Error surfaces through `generateError`.
    }
  };

  const downloadPdf = () => {
    if (!document) return;

    const safeName = document.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    downloadReportPdf(document, `${safeName || "mbg-report"}.pdf`);
  };

  const scrollToSection = (index: number) => {
    setActiveSection(index);
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <div className="mb-5 grid gap-4 xl:grid-cols-4">
        <StatCard icon={FileText} label="Total Reports" value={String(reportList.length)} change={reportData.stats.total.change} />
        <StatCard icon={CalendarClock} label="Scheduled" value={String(scheduledCount)} change={reportData.stats.scheduled.change} tone="info" />
        <StatCard icon={Download} label="Downloads" value={reportData.stats.downloads.value} change={reportData.stats.downloads.change} />
        <StatCard icon={Send} label="Shared" value={reportData.stats.shared.value} change={reportData.stats.shared.change} tone="neutral" />
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card
          title="Recent Reports"
          className="p-7"
          action={<button onClick={regeneratePreview} disabled={isPending} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#052d22] px-4 font-black text-white disabled:opacity-60"><Plus size={17} /> New Preview</button>}
        >
          <div className="overflow-x-auto">
            <div className="grid min-w-[760px] grid-cols-[120px_minmax(260px,1fr)_170px_120px_90px_120px] gap-3 rounded-2xl bg-[#f4f5f1] px-4 py-3 text-xs font-black text-[#6d7e75]">
              <span>ID</span><span>Report Name</span><span>Type</span><span>Status</span><span>Pages</span><span>Date</span>
            </div>
            {reportList.map((item) => (
              <div key={item.id} className="grid min-w-[760px] grid-cols-[120px_minmax(260px,1fr)_170px_120px_90px_120px] items-center gap-3 border-b border-[#dce8df] px-4 py-4 last:border-0">
                <b className="text-[#10231c]">{item.id}</b>
                <span className="font-bold text-[#10231c]">{item.title}</span>
                <span className="text-[#6d7e75]">{item.type}</span>
                <Badge tone={item.status === "Ready" ? "positive" : item.status === "Draft" ? "neutral" : "negative"}>{item.status}</Badge>
                <span className="text-[#10231c]">{item.pages}</span>
                <span className="text-[#6d7e75]">{item.date}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Generate Report" className="p-7">
          <form className="grid gap-4" onSubmit={generatePreview}>
            <label className="grid gap-2 text-sm font-black text-[#10231c]">Report Type
              <select
                value={form.type}
                onChange={(event) => updateForm("type", event.target.value)}
                className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold outline-none"
              >
                <option value="Executive Summary">Executive Summary</option>
                <option value="Sentiment Report">Sentiment Report</option>
                <option value="Keyword Sentiment Report">Keyword Sentiment Report</option>
                <option value="Issue Alert Report">Issue Alert Report</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-black text-[#10231c]">Date Range
              <select
                value={form.dateRange}
                onChange={(event) => updateForm("dateRange", event.target.value)}
                className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold outline-none"
              >
                <option value="1 - 31 Mei 2025">1 - 31 Mei 2025</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-black text-[#10231c]">Format
              <select
                value={form.format}
                onChange={(event) => updateForm("format", event.target.value)}
                className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold outline-none"
              >
                <option value="PDF">PDF</option><option value="Excel">Excel</option><option value="PowerPoint">PowerPoint</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-black text-[#10231c]">Report Template
              <select
                value={form.templateId}
                onChange={(event) => updateForm("templateId", event.target.value)}
                className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold outline-none"
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={isPending} className="mt-2 h-12 rounded-2xl bg-[#052d22] font-black text-white disabled:opacity-60">
              {isPending ? "Generating..." : "Generate Preview"}
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={!document}
              className="h-12 rounded-2xl border border-[#dce8df] bg-white font-black text-[#10231c] disabled:opacity-60"
            >
              Download PDF
            </button>
          </form>

          {generateError && (
            <p className="m-0 mt-4 rounded-xl bg-[#ffe5e5] px-4 py-3 text-sm font-bold text-[#d63838]">
              {generateError}
            </p>
          )}

          {document && (
            <div className="mt-5 rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <b className="text-[#10231c]">Preview: {document.format}</b>
                <Badge tone="neutral">{document.pages} pages</Badge>
              </div>
              <p className="m-0 text-sm font-bold leading-6 text-[#6d7e75]">
                {document.title}
              </p>
              <p className="m-0 mt-2 text-sm font-black text-[#10231c]">
                Template: {document.template.name}
              </p>
              <div className="mt-4 grid gap-2">
                {document.highlights.map((item) => (
                  <p key={item} className="m-0 rounded-xl bg-white px-3 py-2 text-sm leading-6 text-[#10231c]">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-4">
        {templates.map((template) => (
          <Card key={template.id} className={[
            "p-5 transition",
            form.templateId === template.id
              ? "border-[#67c74a] ring-2 ring-[#bdeeb2]"
              : "",
          ].join(" ")}>
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e4f8d6] text-[#07513b]"><Settings2 size={21} /></div>
              <button
                onClick={() => updateForm("templateId", template.id)}
                className="rounded-xl border border-[#dce8df] bg-white px-3 py-1.5 text-xs font-black text-[#10231c]"
              >
                Use
              </button>
            </div>
            <h3 className="mb-2 mt-4 text-lg font-black text-[#10231c]">{template.name}</h3>
            <p className="m-0 text-sm font-bold leading-6 text-[#6d7e75]">{template.layout}</p>
            <div className="mt-4 grid gap-2">
              <Badge tone="neutral">{template.tone}</Badge>
              <small className="font-bold text-[#6d7e75]">{template.bestFor}</small>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Report Document Template" className="mt-5 p-7">
        {!document ? (
          <LoadingState message="Preparing report document..." />
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-[#dce8df] bg-white">
            <div className="bg-[radial-gradient(circle_at_90%_20%,rgba(185,251,125,0.2),transparent_32%),linear-gradient(135deg,#04392b,#05281f)] p-7 text-white">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-sm font-black uppercase tracking-[0.18em] text-[#b9fb7d]">
                    {document.template.name}
                  </p>
                  <h2 className="m-0 mt-2 text-3xl font-black tracking-[-1px]">
                    {document.title}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="positive">{document.format}</Badge>
                  <button
                    onClick={downloadPdf}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-[#052d22]"
                  >
                    <Download size={16} />
                    Download PDF
                  </button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                {document.metrics.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/10 p-4">
                    <small className="font-bold text-white/75">{item.label}</small>
                    <b className="mt-1 block text-2xl font-black text-[#b9fb7d]">{item.value}</b>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 p-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="rounded-2xl bg-[#f6faf5] p-4">
                <b className="text-[#10231c]">Template Structure</b>
                <div className="mt-4 grid gap-2">
                  {document.sections.map((section, index) => (
                    <button
                      key={section.title}
                      type="button"
                      onClick={() => scrollToSection(index)}
                      className={[
                        "grid grid-cols-[24px_minmax(0,1fr)] gap-2 rounded-xl px-2 py-2 text-left text-sm font-bold transition",
                        activeSection === index
                          ? "bg-[#e1f8d9] text-[#10231c]"
                          : "text-[#6d7e75] hover:bg-white",
                      ].join(" ")}
                    >
                      <b className="text-[#07513b]">{index + 1}</b>
                      {section.title}
                    </button>
                  ))}
                </div>
              </aside>

              <main className="grid gap-5">
                <div className="rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-5">
                  <div className="grid gap-3 md:grid-cols-3">
                    <Info label="Prepared for" value={document.preparedFor} />
                    <Info label="Period" value={document.period} />
                    <Info label="Output" value={document.format} />
                  </div>
                </div>

                {document.sections.map((section, index) => (
                  <section
                    key={section.title}
                    ref={(node) => {
                      sectionRefs.current[index] = node;
                    }}
                    className={[
                      "scroll-mt-6 rounded-2xl border p-5 transition",
                      activeSection === index
                        ? "border-[#67c74a] bg-[#fbfdf8] ring-2 ring-[#bdeeb2]"
                        : "border-[#dce8df]",
                    ].join(" ")}
                  >
                    <h3 className="m-0 text-xl font-black text-[#10231c]">{section.title}</h3>
                    <p className="m-0 mt-3 leading-7 text-[#6d7e75]">{section.body}</p>
                    <div className="mt-4 grid gap-2">
                      {section.bullets.map((item) => (
                        <p key={item} className="m-0 rounded-xl bg-[#f6faf5] px-4 py-3 text-sm font-semibold leading-6 text-[#10231c]">
                          {item}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}

                <div className="rounded-2xl border border-dashed border-[#cbdccd] bg-[#fbfdf8] p-5">
                  <b className="text-[#10231c]">Appendix</b>
                  <div className="mt-3 grid gap-2">
                    {document.appendix.map((item) => (
                      <p key={item} className="m-0 text-sm leading-6 text-[#6d7e75]">{item}</p>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <span className="grid gap-1 text-sm font-bold text-[#6d7e75]">
      {label}
      <b className="text-base text-[#10231c]">{value}</b>
    </span>
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

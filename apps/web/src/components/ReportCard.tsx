import { RiCalendarLine, RiDropLine } from "react-icons/ri";
import { useCallback, useEffect, useState } from "react";
import ReadingChart from "./ReadingChart.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";

export interface Report {
  type: string;
  from?: string;
  to?: string;
  date?: string;
  readings: Array<{ id: string; date: string; slot: string; value: number }>;
  highest: number | null;
  lowest: number | null;
  average: number | null;
  count: number;
}

const SLOT_LABELS: Record<string, string> = {
  MORNING: "Morning (fasting)",
  AFTER_BREAKFAST: "After breakfast",
  AFTER_LUNCH: "After lunch",
  AFTER_DINNER: "After dinner",
};

interface ReportCardProps {
  title: string;
  fetchReport: (date: string) => Promise<Report>;
}

function formatRange(report: Report | null, fallbackDate: string) {
  if (!report) return fallbackDate;
  if (report.from && report.to) {
    const fromStr = new Date(report.from).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    const toStr = new Date(report.to).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    return `${fromStr} – ${toStr}`;
  }
  if (report.date) {
    return new Date(report.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }
  return fallbackDate;
}

export default function ReportCard({ title, fetchReport }: ReportCardProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = useCallback(
    async (selectedDate: string) => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchReport(selectedDate);
        const actualReport = (data as { report?: Report } | null)?.report || (data as Report | null);
        setReport(actualReport);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report");
        setReport(null);
      } finally {
        setLoading(false);
      }
    },
    [fetchReport]
  );

  useEffect(() => {
    void loadReport(date);
  }, [loadReport, date]);

  const readingsList = Array.isArray(report?.readings) ? report.readings : [];
  const hasNoReadings = !report || report.count === 0 || readingsList.length === 0;

  return (
    <Card className="border-landing-border bg-landing-panel text-landing-text shadow-sm">
      <CardHeader className="flex-row items-start justify-between gap-5 border-b border-landing-border pb-5">
        <div>
          <CardTitle className="text-2xl tracking-[-0.04em]">{title}</CardTitle>
          <p className="mt-2 text-sm text-landing-muted flex items-center gap-2">
            <RiDropLine className="size-4 text-landing-accent animate-pulse" aria-hidden="true" />
            <span>Range: {formatRange(report, date)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-landing-muted">
          <RiCalendarLine className="size-4 text-landing-accent" />
          <span className="sr-only">Report date</span>
          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-9 w-36 px-2 text-xs"
          />
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        {loading && !report ? (
          <p className="py-10 text-sm text-landing-muted text-center animate-pulse">Loading report…</p>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : !report ? (
          <p className="py-10 text-sm text-landing-muted text-center">Select a date to view the report.</p>
        ) : hasNoReadings ? (
          <div className="rounded-xl border border-dashed border-landing-border px-6 py-12 text-center bg-landing-bg/30">
            <RiDropLine className="mx-auto size-9 text-landing-accent/40 animate-pulse" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-landing-text">No readings in this period.</p>
            <p className="mt-1 text-sm text-landing-muted">Add a reading to start seeing your pattern.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-4">
              <Stat
                label="Highest"
                value={report.highest !== null && report.highest !== undefined ? `${report.highest} mg/dl` : "—"}
              />
              <Stat
                label="Lowest"
                value={report.lowest !== null && report.lowest !== undefined ? `${report.lowest} mg/dl` : "—"}
              />
              <Stat
                label="Average"
                value={report.average !== null && report.average !== undefined ? `${report.average} mg/dl` : "—"}
              />
              <Stat label="Total Readings" value={String(report.count ?? readingsList.length)} />
            </div>
            <div className="mt-8 rounded-xl border border-landing-border bg-landing-bg/40 p-4">
              <ReadingChart readings={readingsList} />
            </div>
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-landing-text mb-3">Readings in this period</h4>
              <div className="divide-y divide-landing-border rounded-xl border border-landing-border bg-landing-bg/40 overflow-hidden">
                {readingsList.map((reading) => (
                  <div key={reading.id} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-landing-panel/50">
                    <span className="text-landing-muted">{SLOT_LABELS[reading.slot] || reading.slot}</span>
                    <span className="font-semibold text-landing-text">{reading.value} mg/dl</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-landing-border bg-landing-bg/40 p-4">
      <p className="text-xs text-landing-muted font-medium">{label}</p>
      <p className="mt-2 text-xl font-bold tracking-tight text-landing-text">{value}</p>
    </div>
  );
}

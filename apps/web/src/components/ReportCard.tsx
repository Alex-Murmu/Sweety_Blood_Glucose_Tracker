import { CalendarDays, ChartNoAxesCombined } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ReadingChart from "./ReadingChart.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";

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

export default function ReportCard({ title, fetchReport }: ReportCardProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = useCallback(async (selectedDate: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchReport(selectedDate);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report");
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [fetchReport]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadReport(date);
  }, [loadReport, date]);

  return (
    <Card className="border-landing-border bg-landing-panel text-landing-text">
      <CardHeader className="flex-row items-start justify-between gap-5 border-b border-landing-border">
        <div>
          <CardTitle className="text-2xl tracking-[-0.04em]">{title}</CardTitle>
          <p className="mt-2 text-sm text-landing-muted">A focused view of your recorded glucose.</p>
        </div>
        <label className="flex items-center gap-2 text-xs text-landing-muted">
          <CalendarDays className="size-4 text-landing-accent" />
          <span className="sr-only">Report date</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-9 rounded-md border border-landing-border bg-landing-bg px-2 text-landing-text outline-none focus:ring-2 focus:ring-landing-accent" />
        </label>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        {loading && !report ? <p className="py-10 text-sm text-landing-muted">Loading report…</p> : error ? <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div> : !report ? <p className="py-10 text-sm text-landing-muted">Select a date to view the report.</p> : report.count === 0 ? (
          <div className="rounded-xl border border-dashed border-landing-border px-6 py-10 text-center">
            <ChartNoAxesCombined className="mx-auto size-6 text-landing-muted" />
            <p className="mt-3 text-sm font-medium">No readings in this period.</p>
            <p className="mt-1 text-sm text-landing-muted">Add a reading to start seeing your pattern.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-4">
              <Stat label="Highest" value={`${report.highest} mg/dl`} />
              <Stat label="Lowest" value={`${report.lowest} mg/dl`} />
              <Stat label="Average" value={`${report.average} mg/dl`} />
              <Stat label="Count" value={String(report.count)} />
            </div>
            <div className="mt-8 rounded-xl border border-landing-border bg-landing-bg/40 p-4">
              <ReadingChart readings={report.readings} />
            </div>
            <div className="mt-8">
              <h4 className="text-sm font-medium">Readings in this period</h4>
              <div className="mt-3 divide-y divide-landing-border rounded-xl border border-landing-border">
                {report.readings.map((reading) => <div key={reading.id} className="flex items-center justify-between px-4 py-3 text-sm"><span className="text-landing-muted">{SLOT_LABELS[reading.slot] || reading.slot}</span><span className="font-medium">{reading.value} mg/dl</span></div>)}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-landing-border bg-landing-bg/40 p-4"><p className="text-xs text-landing-muted">{label}</p><p className="mt-2 text-lg font-semibold tracking-tight">{value}</p></div>;
}

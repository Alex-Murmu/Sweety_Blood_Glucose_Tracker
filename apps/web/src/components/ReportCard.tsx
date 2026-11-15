import { useState, useEffect, useCallback } from "react";

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

  const loadReport = useCallback(async (d: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchReport(d);
      setReport(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load report";
      setError(message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [fetchReport]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReport(date);
  }, [loadReport, date]);

  if (loading && !report) {
    return (
      <div style={styles.card}>
        <h3>{title}</h3>
        <p>Loading…</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={styles.card}>
        <h3>{title}</h3>
        <div style={styles.field}>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
          />
        </div>
        {error && <div style={styles.error}>{error}</div>}
        {!error && <p>Select a date to view the report.</p>}
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <div style={styles.field}>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />
      </div>
      {error && <div style={styles.error}>{error}</div>}
      {report.count === 0 ? (
        <p style={styles.empty}>No readings in this period.</p>
      ) : (
        <>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Highest</div>
              <div style={styles.statValue}>{report.highest} mg/dl</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Lowest</div>
              <div style={styles.statValue}>{report.lowest} mg/dl</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Average</div>
              <div style={styles.statValue}>{report.average} mg/dl</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Count</div>
              <div style={styles.statValue}>{report.count}</div>
            </div>
          </div>
          <h4 style={styles.subheading}>Readings</h4>
          <ul style={styles.list}>
            {report.readings.map((r) => (
              <li key={r.id} style={styles.item}>
                {SLOT_LABELS[r.slot] || r.slot}: {r.value} mg/dl
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 600 },
  input: { padding: 8, fontSize: 14 },
  error: { color: "red", fontSize: 14, marginBottom: 12 },
  empty: { color: "#666", fontSize: 14 },
  stats: { display: "flex", gap: 16, marginBottom: 20 },
  stat: { padding: 12, background: "#f8fafc", borderRadius: 6, minWidth: 90 },
  statLabel: { fontSize: 12, color: "#64748b", textTransform: "uppercase" },
  statValue: { fontSize: 18, fontWeight: 700 },
  subheading: { marginTop: 0, fontSize: 16 },
  list: { listStyle: "none", padding: 0 },
  item: { padding: 8, borderBottom: "1px solid #f1f5f9" },
};

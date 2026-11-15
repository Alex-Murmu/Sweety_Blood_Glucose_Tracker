import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartReading = { date: string; value: number };

export default function ReadingChart({ readings = [] }: { readings?: ChartReading[] }) {
  const safeReadings = Array.isArray(readings) ? readings : [];

  if (safeReadings.length === 0) {
    return (
      <div className="flex h-[260px] w-full items-center justify-center text-sm text-landing-muted">
        No readings to display on chart.
      </div>
    );
  }

  const data = safeReadings.map((reading) => ({
    date: new Date(reading.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: reading.value,
  }));

  return (
    <div style={{ width: "100%", height: 280 }} aria-label="Blood glucose readings chart">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--landing-border)" />
          <XAxis dataKey="date" stroke="var(--landing-muted)" />
          <YAxis stroke="var(--landing-muted)" />
          <Tooltip contentStyle={{ backgroundColor: "var(--landing-panel-strong)", borderColor: "var(--landing-border)", color: "var(--landing-text)" }} />
          <Line type="monotone" dataKey="value" stroke="var(--landing-accent)" strokeWidth={2} dot={{ fill: "var(--landing-accent)", stroke: "var(--landing-accent)" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

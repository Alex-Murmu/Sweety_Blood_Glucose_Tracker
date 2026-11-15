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

export default function ReadingChart({ readings }: { readings: ChartReading[] }) {
  const data = readings.map((reading) => ({
    date: new Date(reading.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: reading.value,
  }));

  return (
    <div style={{ width: "100%", height: 280 }} aria-label="Blood glucose readings chart">
      <ResponsiveContainer>
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

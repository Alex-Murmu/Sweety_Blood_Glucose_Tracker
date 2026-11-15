import { useState } from "react";
import ReportCard from "../components/ReportCard.tsx";
import { api } from "../api.ts";
import type { Report } from "../components/ReportCard.tsx";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("daily");

  const tabs = [
    { key: "daily", label: "Daily" },
    { key: "month-to-date", label: "Month-to-Date" },
    { key: "monthly", label: "Monthly (previous)" },
  ];

  const fetchers: Record<string, (date: string) => Promise<Report>> = {
    daily: (d) => api.dailyReport(d),
    "month-to-date": (d) => api.monthToDateReport(d),
    monthly: (d) => api.monthlyReport(d),
  };

  const titles: Record<string, string> = {
    daily: "Daily Report",
    "month-to-date": "Month-to-Date Report",
    monthly: "Monthly Report",
  };

  return (
    <div style={styles.container}>
      <h1>Reports</h1>
      <div style={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              ...styles.tabButton,
              ...(activeTab === t.key ? styles.tabActive : {}),
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ReportCard
        title={titles[activeTab]}
        fetchReport={fetchers[activeTab]}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" },
  tabs: { display: "flex", gap: 12, marginBottom: 24 },
  tabButton: {
    padding: "8px 16px",
    fontSize: 14,
    cursor: "pointer",
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: 4,
  },
  tabActive: {
    background: "#2563eb",
    color: "#fff",
    borderColor: "#2563eb",
  },
};

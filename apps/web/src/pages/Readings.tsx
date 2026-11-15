import { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import ReadingList from "../components/ReadingList.tsx";

export default function Readings() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>My Readings</h1>
        <div style={styles.actions}>
          <label style={styles.dateLabel}>Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.dateInput}
          />
        </div>
      </header>

      <div style={styles.welcome}>
        {user ? `Hello, {user.name}` : "Hello"}
      </div>

      <div style={styles.card}>
        <ReadingList selectedDate={selectedDate} />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  actions: { display: "flex", alignItems: "center", gap: 12 },
  dateLabel: { fontSize: 14, fontWeight: 600 },
  dateInput: { padding: 8, fontSize: 14 },
  welcome: { fontSize: 18, marginBottom: 20, color: "#334155" },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};

import { useState, useEffect, useCallback } from "react";
import { api } from "../api.ts";
import ReadingForm from "./ReadingForm.tsx";

type Slot = "MORNING" | "AFTER_BREAKFAST" | "AFTER_LUNCH" | "AFTER_DINNER";

interface Reading {
  id: string;
  date: string;
  slot: Slot;
  value: number;
}

const SLOT_LABELS: Record<Slot, string> = {
  MORNING: "Morning (fasting)",
  AFTER_BREAKFAST: "After breakfast",
  AFTER_LUNCH: "After lunch",
  AFTER_DINNER: "After dinner",
};

export interface ReadingListProps {
  selectedDate: string;
}

export default function ReadingList({ selectedDate }: ReadingListProps) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReadings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getReadings(selectedDate);
      setReadings(data.readings || []);
    } catch {
      setReadings([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReadings();
  }, [fetchReadings]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this reading?")) return;
    try {
      await api.deleteReading(id);
      setReadings((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      alert(message);
    }
  }

  return (
    <div style={styles.card}>
      <h3>Readings for {new Date(selectedDate).toDateString()}</h3>
      {loading ? (
        <p>Loading…</p>
      ) : readings.length === 0 ? (
        <p style={styles.empty}>No readings for this date yet.</p>
      ) : (
        <ul style={styles.list}>
          {readings.map((r) => (
            <li key={r.id} style={styles.item}>
              <span style={styles.slot}>{SLOT_LABELS[r.slot]}</span>
              <span style={styles.value}>{r.value} mg/dl</span>
              <div style={styles.actions}>
                <button
                  onClick={() => setEditingId(r.id)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(r.id)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {editingId && (
        <ReadingForm
          onSuccess={() => {
            setEditingId(null);
            fetchReadings();
          }}
          initialDate={selectedDate}
          editingId={editingId}
          initialSlot={readings.find((r) => r.id === editingId)?.slot}
          initialValue={readings.find((r) => r.id === editingId)?.value}
        />
      )}
      {!editingId && (
        <ReadingForm
          onSuccess={() => fetchReadings()}
          initialDate={selectedDate}
        />
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
  },
  empty: { color: "#666", fontSize: 14 },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottom: "1px solid #eee",
  },
  slot: { fontWeight: 600 },
  value: { fontSize: 16 },
  actions: { display: "flex", gap: 8 },
  editButton: {
    padding: "4px 10px",
    fontSize: 12,
    cursor: "pointer",
    background: "#e2e8f0",
    border: "none",
    borderRadius: 4,
  },
  deleteButton: {
    padding: "4px 10px",
    fontSize: 12,
    cursor: "pointer",
    background: "#fee2e2",
    border: "none",
    borderRadius: 4,
    color: "#dc2626",
  },
};

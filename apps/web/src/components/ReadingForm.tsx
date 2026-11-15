import { useState, useCallback } from "react";
import { api } from "../api.ts";

type Slot = "MORNING" | "AFTER_BREAKFAST" | "AFTER_LUNCH" | "AFTER_DINNER";

const SLOTS: { key: Slot; label: string }[] = [
  { key: "MORNING", label: "Morning (fasting)" },
  { key: "AFTER_BREAKFAST", label: "After breakfast" },
  { key: "AFTER_LUNCH", label: "After lunch" },
  { key: "AFTER_DINNER", label: "After dinner" },
];

export interface ReadingFormProps {
  onSuccess: () => void;
  initialDate?: string;
  editingId?: string;
  initialSlot?: Slot;
  initialValue?: number;
}

export default function ReadingForm({
  onSuccess,
  initialDate,
  editingId,
  initialSlot,
  initialValue,
}: ReadingFormProps) {
  const [date, setDate] = useState(initialDate || new Date().toISOString().split("T")[0]);
  const [slot, setSlot] = useState<Slot>(initialSlot || "MORNING");
  const [value, setValue] = useState(initialValue?.toString() || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      const val = Number(value);
      if (!value || !Number.isInteger(val) || val < 40 || val > 600) {
        setError(
          val < 40 || val > 600
            ? "Value must be between 40 and 600 mg/dl."
            : "Please enter a glucose value."
        );
        setLoading(false);
        return;
      }

      const dateStr = `${date}T00:00:00.000Z`;

      try {
        if (editingId) {
          await api.updateReading(editingId, { date: dateStr, slot, value: val });
        } else {
          await api.createReading({ date: dateStr, slot, value: val });
        }
        onSuccess();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save reading";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [date, slot, value, editingId, onSuccess]
  );

  return (
    <div style={styles.card}>
      <h3>{editingId ? "Edit Reading" : "Add Reading"}</h3>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label>Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label>Time slot</label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value as Slot)}
            style={styles.input}
          >
            {SLOTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label>Value (mg/dl)</label>
          <input
            type="number"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Saving…" : editingId ? "Update" : "Add"}
        </button>
      </form>
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
  form: { display: "flex", flexDirection: "column", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600 },
  input: { padding: 8, fontSize: 14 },
  button: {
    padding: 10,
    fontSize: 14,
    cursor: "pointer",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 4,
  },
  error: { color: "red", fontSize: 14, marginBottom: 8 },
};

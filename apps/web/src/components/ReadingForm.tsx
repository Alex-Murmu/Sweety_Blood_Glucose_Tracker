import { Plus, Save } from "lucide-react";
import { useCallback, useState } from "react";
import { api } from "../api.ts";
import { Button } from "./ui/button.js";

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

export default function ReadingForm({ onSuccess, initialDate, editingId, initialSlot, initialValue }: ReadingFormProps) {
  const [date, setDate] = useState(initialDate || new Date().toISOString().split("T")[0]);
  const [slot, setSlot] = useState<Slot>(initialSlot || "MORNING");
  const [value, setValue] = useState(initialValue?.toString() || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const val = Number(value);
    if (!value) {
      setError("Please enter a glucose value.");
      setLoading(false);
      return;
    }
    if (!Number.isInteger(val) || val < 40 || val > 600) {
      setError("Value must be between 40 and 600 mg/dl.");
      setLoading(false);
      return;
    }
    try {
      const dateStr = `${date}T00:00:00.000Z`;
      if (editingId) await api.updateReading(editingId, { date: dateStr, slot, value: val });
      else await api.createReading({ date: dateStr, slot, value: val });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save reading");
    } finally {
      setLoading(false);
    }
  }, [date, slot, value, editingId, onSuccess]);

  return (
    <div className="border-t border-landing-border bg-landing-bg/40 p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-lg bg-landing-accent/15 text-landing-accent">
          {editingId ? <Save className="size-4" /> : <Plus className="size-4" />}
        </span>
        <div>
          <h3 className="font-medium">{editingId ? "Edit reading" : "Add a reading"}</h3>
          <p className="text-xs text-landing-muted">Keep the moment and the number together.</p>
        </div>
      </div>
      {error && <div role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</div>}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1.2fr_0.8fr_auto] md:items-end">
        <label className="space-y-2 text-xs font-medium text-landing-muted">
          <span>Date</span>
          <input id="reading-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="h-10 w-full rounded-md border border-landing-border bg-landing-panel px-3 text-sm text-landing-text outline-none focus:ring-2 focus:ring-landing-accent" />
        </label>
        <label className="space-y-2 text-xs font-medium text-landing-muted">
          <span>Time slot</span>
          <select id="reading-slot" value={slot} onChange={(e) => setSlot(e.target.value as Slot)} className="h-10 w-full rounded-md border border-landing-border bg-landing-panel px-3 text-sm text-landing-text outline-none focus:ring-2 focus:ring-landing-accent">
            {SLOTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </label>
        <label className="space-y-2 text-xs font-medium text-landing-muted">
          <span>Value (mg/dl)</span>
          <input id="reading-value" type="number" required value={value} onChange={(e) => setValue(e.target.value)} className="h-10 w-full rounded-md border border-landing-border bg-landing-panel px-3 text-sm text-landing-text outline-none focus:ring-2 focus:ring-landing-accent" />
        </label>
        <Button type="submit" disabled={loading} className="h-10 bg-landing-accent text-landing-bg hover:bg-landing-accent-strong">{loading ? "Saving…" : editingId ? "Update" : "Add"}</Button>
      </form>
    </div>
  );
}

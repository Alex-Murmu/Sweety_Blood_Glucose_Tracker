import { RiAddLine, RiSaveLine } from "react-icons/ri";
import { useCallback, useState } from "react";
import { api } from "../api.ts";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Select } from "./ui/select.tsx";

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
    },
    [date, slot, value, editingId, onSuccess]
  );

  return (
    <div className="border-t border-landing-border bg-landing-bg/40 p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-lg bg-landing-accent/15 text-landing-accent">
          {editingId ? <RiSaveLine className="size-4" /> : <RiAddLine className="size-4" />}
        </span>
        <div>
          <h3 className="font-medium text-landing-text">{editingId ? "Edit reading" : "Add a reading"}</h3>
          <p className="text-xs text-landing-muted">Keep the moment and the glucose value together.</p>
        </div>
      </div>
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1.2fr_0.8fr_auto] md:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="reading-date">Date</Label>
          <Input
            id="reading-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reading-slot">Time slot</Label>
          <Select
            id="reading-slot"
            value={slot}
            onChange={(e) => setSlot(e.target.value as Slot)}
          >
            {SLOTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reading-value">Value (mg/dl)</Label>
          <Input
            id="reading-value"
            type="number"
            required
            placeholder="e.g. 110"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-10 px-5 gap-1.5"
        >
          {loading ? (
            "Saving…"
          ) : editingId ? (
            <>
              <RiSaveLine className="size-4" />
              <span>Update</span>
            </>
          ) : (
            <>
              <RiAddLine className="size-4" />
              <span>Add</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

import { RiAddLine, RiCalendarLine, RiCloseLine, RiSaveLine } from "react-icons/ri";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api.ts";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Select } from "./ui/select.tsx";
import { Badge } from "./ui/badge.tsx";

type Slot = "MORNING" | "AFTER_BREAKFAST" | "AFTER_LUNCH" | "AFTER_DINNER";

const SLOTS: { key: Slot; label: string }[] = [
  { key: "MORNING", label: "Morning (fasting)" },
  { key: "AFTER_BREAKFAST", label: "After breakfast" },
  { key: "AFTER_LUNCH", label: "After lunch" },
  { key: "AFTER_DINNER", label: "After dinner" },
];

export interface ReadingFormProps {
  onSuccess: (updatedDate?: string) => void;
  onCancel?: () => void;
  initialDate?: string;
  editingId?: string;
  initialSlot?: Slot;
  initialValue?: number;
}

export default function ReadingForm({
  onSuccess,
  onCancel,
  initialDate,
  editingId,
  initialSlot,
  initialValue,
}: ReadingFormProps) {
  const [date, setDate] = useState(
    initialDate ? (initialDate.includes("T") ? initialDate.split("T")[0] : initialDate) : new Date().toISOString().split("T")[0]
  );
  const [slot, setSlot] = useState<Slot>(initialSlot || "MORNING");
  const [value, setValue] = useState(initialValue?.toString() || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate.includes("T") ? initialDate.split("T")[0] : initialDate);
    }
    if (initialSlot) {
      setSlot(initialSlot);
    }
    if (initialValue !== undefined) {
      setValue(String(initialValue));
    }
  }, [initialDate, initialSlot, initialValue]);

  useEffect(() => {
    if (editingId) {
      if (typeof formRef.current?.scrollIntoView === "function") {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      valueInputRef.current?.focus();
      valueInputRef.current?.select();
    }
  }, [editingId]);

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
        onSuccess(date);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save reading");
      } finally {
        setLoading(false);
      }
    },
    [date, slot, value, editingId, onSuccess]
  );

  return (
    <div
      ref={formRef}
      className={`border-t border-landing-border p-5 sm:p-6 transition-colors ${
        editingId ? "bg-landing-panel-strong/60 ring-1 ring-landing-accent/30" : "bg-landing-bg/40"
      }`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg bg-landing-accent/15 text-landing-accent">
            {editingId ? <RiSaveLine className="size-4" /> : <RiAddLine className="size-4" />}
          </span>
          <div>
            <h3 className="font-semibold text-landing-text flex items-center gap-2">
              <span>{editingId ? "Edit reading" : "Add a reading"}</span>
              {editingId && (
                <Badge variant="outline" className="text-xs text-landing-accent border-landing-accent/30 font-normal">
                  {SLOTS.find((s) => s.key === slot)?.label || slot}
                </Badge>
              )}
            </h3>
            <p className="text-xs text-landing-muted">
              {editingId
                ? "Modify the date, slot, or blood glucose value for this entry."
                : "Keep the moment and the glucose value together."}
            </p>
          </div>
        </div>
        {editingId && onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="gap-1.5 text-landing-muted hover:text-landing-text"
          >
            <RiCloseLine className="size-4" />
            <span>Cancel</span>
          </Button>
        )}
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
          <Label htmlFor="reading-date" className="flex items-center gap-1.5 text-white font-medium">
            <RiCalendarLine className="size-3.5 text-white shrink-0" aria-hidden="true" />
            <span>Date</span>
          </Label>
          <Input
            id="reading-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-white"
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
            ref={valueInputRef}
            id="reading-value"
            type="number"
            required
            placeholder="e.g. 110"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {editingId && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-10 px-4"
            >
              Cancel
            </Button>
          )}
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
        </div>
      </form>
    </div>
  );
}

import { RiDeleteBinLine, RiEditLine } from "react-icons/ri";
import { useCallback, useEffect, useState } from "react";
import { api } from "../api.ts";
import ReadingForm from "./ReadingForm.tsx";
import { Button } from "./ui/button.tsx";
import { Badge } from "./ui/badge.tsx";

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

function formatDisplayDate(dateStr: string) {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    const date = new Date(y, m - 1, d);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  return dateStr;
}

interface ReadingListProps {
  selectedDate: string;
  onDateChange?: (date: string) => void;
}

export default function ReadingList({ selectedDate, onDateChange }: ReadingListProps) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const editingReading = readings.find((reading) => reading.id === editingId);

  const fetchReadings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getReadings(selectedDate, page);
      setReadings(data.readings || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setReadings([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, page]);

  useEffect(() => {
    void fetchReadings();
  }, [fetchReadings]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this reading?")) return;
    try {
      await api.deleteReading(id);
      setReadings((prev) => prev.filter((reading) => reading.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-landing-border px-5 py-5 sm:px-6">
        <div>
          <h2 className="font-semibold text-landing-text">Readings for {formatDisplayDate(selectedDate)}</h2>
          <p className="mt-1 text-xs text-landing-muted">Up to four recorded moments each day.</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-xs">
          {readings.length} / 4 logged
        </Badge>
      </div>
      <div className="p-5 sm:p-6">
        {loading ? (
          <p className="py-8 text-sm text-landing-muted text-center animate-pulse">Loading readings…</p>
        ) : readings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-landing-border px-6 py-10 text-center bg-landing-bg/30">
            <p className="text-sm font-medium text-landing-text">No readings for this date yet.</p>
            <p className="mt-2 text-sm text-landing-muted">Add your first reading below.</p>
          </div>
        ) : (
          <div className="divide-y divide-landing-border rounded-xl border border-landing-border bg-landing-bg/40 overflow-hidden">
            {readings.map((reading) => {
              const isEditing = editingId === reading.id;
              return (
                <div
                  key={reading.id}
                  className={`flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition-all ${
                    isEditing
                      ? "bg-landing-panel-strong/80 ring-2 ring-landing-accent/60"
                      : "hover:bg-landing-panel/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-landing-text">{SLOT_LABELS[reading.slot]}</p>
                      {isEditing && (
                        <Badge
                          variant="outline"
                          className="text-[11px] text-landing-accent border-landing-accent/40 bg-landing-accent/10"
                        >
                          Editing now
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-landing-muted">Recorded for {formatDisplayDate(selectedDate)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-semibold tracking-tight text-landing-text">
                      {reading.value}{" "}
                      <span className="text-xs font-normal text-landing-muted">mg/dl</span>
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant={isEditing ? "default" : "ghost"}
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setEditingId(isEditing ? null : reading.id)}
                      >
                        <RiEditLine className="size-3.5" />
                        <span>{isEditing ? "Cancel" : "Edit"}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                        onClick={() => handleDelete(reading.id)}
                      >
                        <RiDeleteBinLine className="size-3.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-landing-muted">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {editingId && editingReading ? (
        <ReadingForm
          key={editingId}
          onSuccess={(updatedDate) => {
            setEditingId(null);
            fetchReadings();
            if (updatedDate && updatedDate !== selectedDate && onDateChange) {
              onDateChange(updatedDate);
            }
          }}
          onCancel={() => setEditingId(null)}
          initialDate={
            editingReading.date.includes("T")
              ? editingReading.date.split("T")[0]
              : editingReading.date
          }
          editingId={editingId}
          initialSlot={editingReading.slot}
          initialValue={editingReading.value}
        />
      ) : (
        <ReadingForm
          key="new"
          onSuccess={(newDate) => {
            fetchReadings();
            if (newDate && newDate !== selectedDate && onDateChange) {
              onDateChange(newDate);
            }
          }}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
}

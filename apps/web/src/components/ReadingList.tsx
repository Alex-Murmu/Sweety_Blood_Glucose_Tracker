import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api } from "../api.ts";
import ReadingForm from "./ReadingForm.tsx";
import { Button } from "./ui/button.js";

type Slot = "MORNING" | "AFTER_BREAKFAST" | "AFTER_LUNCH" | "AFTER_DINNER";
interface Reading { id: string; date: string; slot: Slot; value: number }

const SLOT_LABELS: Record<Slot, string> = {
  MORNING: "Morning (fasting)",
  AFTER_BREAKFAST: "After breakfast",
  AFTER_LUNCH: "After lunch",
  AFTER_DINNER: "After dinner",
};

export default function ReadingList({ selectedDate }: { selectedDate: string }) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  // The request synchronizes this list with the selected date and pagination state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
          <h2 className="font-medium">Readings for {new Date(selectedDate).toDateString()}</h2>
          <p className="mt-1 text-xs text-landing-muted">Up to four moments each day.</p>
        </div>
        <span className="rounded-full border border-landing-border px-3 py-1 text-xs text-landing-muted">{readings.length} logged</span>
      </div>
      <div className="p-5 sm:p-6">
        {loading ? <p className="py-8 text-sm text-landing-muted">Loading readings…</p> : readings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-landing-border px-6 py-10 text-center">
            <p className="text-sm font-medium">No readings for this date yet.</p>
            <p className="mt-2 text-sm text-landing-muted">Add your first moment below.</p>
          </div>
        ) : (
          <div className="divide-y divide-landing-border rounded-xl border border-landing-border">
            {readings.map((reading) => (
              <div key={reading.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
                <div>
                  <p className="text-sm font-medium">{SLOT_LABELS[reading.slot]}</p>
                  <p className="mt-1 text-xs text-landing-muted">Recorded for {selectedDate}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-semibold tracking-tight">{reading.value} <span className="text-xs font-normal text-landing-muted">mg/dl</span></p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-landing-muted hover:bg-landing-panel-strong hover:text-landing-text" onClick={() => setEditingId(reading.id)}><Pencil className="mr-1.5 size-3.5" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-300 hover:bg-red-400/10 hover:text-red-200" onClick={() => handleDelete(reading.id)}><Trash2 className="mr-1.5 size-3.5" /> Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {totalPages > 1 && <div className="mt-4 flex items-center justify-center gap-4 text-sm text-landing-muted">
          <Button variant="outline" size="sm" disabled={page === 1} className="border-landing-border bg-transparent text-landing-text hover:bg-landing-panel" onClick={() => setPage((value) => value - 1)}>Previous</Button>
          <span>Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} className="border-landing-border bg-transparent text-landing-text hover:bg-landing-panel" onClick={() => setPage((value) => value + 1)}>Next</Button>
        </div>}
      </div>
      {editingId && <ReadingForm onSuccess={() => { setEditingId(null); fetchReadings(); }} initialDate={selectedDate} editingId={editingId} initialSlot={readings.find((reading) => reading.id === editingId)?.slot} initialValue={readings.find((reading) => reading.id === editingId)?.value} />}
      {!editingId && <ReadingForm onSuccess={fetchReadings} initialDate={selectedDate} />}
    </div>
  );
}

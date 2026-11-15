import { CalendarDays, HeartPulse } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../components/ui/card.js";
import ReadingList from "../components/ReadingList.tsx";
import { useAuth } from "../context/AuthContext.tsx";

export default function Readings() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-6 border-b border-landing-border pb-8 md:flex-row md:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm text-landing-accent"><HeartPulse className="size-4" /> Daily rhythm</div>
          <h1 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Your readings</h1>
          <p className="mt-3 text-base text-landing-muted">Hello, {user?.name}. Keep today&apos;s story close.</p>
        </div>
        <label className="flex items-center gap-3 text-sm text-landing-muted">
          <CalendarDays className="size-4 text-landing-accent" />
          <span className="sr-only">Choose date</span>
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="h-10 rounded-md border border-landing-border bg-landing-panel px-3 text-landing-text outline-none focus:ring-2 focus:ring-landing-accent" />
        </label>
      </div>
      <Card className="border-landing-border bg-landing-panel text-landing-text">
        <CardContent className="p-0">
          <ReadingList selectedDate={selectedDate} />
        </CardContent>
      </Card>
    </section>
  );
}

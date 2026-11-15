import { RiCalendarLine, RiHeartPulseLine } from "react-icons/ri";
import { useState } from "react";
import { Card, CardContent } from "../components/ui/card.tsx";
import { Input } from "../components/ui/input.tsx";
import ReadingList from "../components/ReadingList.tsx";
import { useAuth } from "../context/AuthContext.tsx";

export default function Readings() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-6 border-b border-landing-border pb-8 md:flex-row md:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm text-landing-accent font-medium">
            <RiHeartPulseLine className="size-4" />
            <span>Daily rhythm</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl text-landing-text">
            Your readings
          </h1>
          <p className="mt-3 text-base text-landing-muted">
            Hello, {user?.name}. Keep today&apos;s glucose story close and clear.
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-landing-border bg-landing-panel px-3 py-1.5 text-white shadow-xs">
          <RiCalendarLine className="size-4 text-white shrink-0" aria-hidden="true" />
          <span className="sr-only">Choose date</span>
          <Input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-8 w-36 border-0 bg-transparent px-1 text-xs text-white focus-visible:ring-0"
          />
        </div>
      </div>
      <Card className="border-landing-border bg-landing-panel text-landing-text shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <ReadingList selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </CardContent>
      </Card>
    </section>
  );
}

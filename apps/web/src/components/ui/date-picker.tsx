import * as React from "react";
import { format } from "date-fns";
import { RiCalendarLine } from "react-icons/ri";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.tsx";
import { Calendar } from "./calendar.tsx";
import { cn } from "../../lib/utils.js";

export interface DatePickerProps {
  date: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  className?: string;
  size?: "sm" | "default";
}

export function DatePicker({ date, onDateChange, className, size = "default" }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Safely parse YYYY-MM-DD into a local Date without UTC shift
  const selectedDate = React.useMemo(() => {
    if (!date) return new Date();
    const [y, m, d] = date.split("-").map(Number);
    if (!y || !m || !d) return new Date();
    return new Date(y, m - 1, d);
  }, [date]);

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const y = newDate.getFullYear();
      const m = String(newDate.getMonth() + 1).padStart(2, "0");
      const d = String(newDate.getDate()).padStart(2, "0");
      onDateChange(`${y}-${m}-${d}`);
      setOpen(false);
    }
  };

  const formattedLabel = React.useMemo(() => {
    try {
      return format(selectedDate, "EEE, MMM d, yyyy");
    } catch {
      return date;
    }
  }, [selectedDate, date]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg border border-landing-border bg-landing-panel px-3 text-white shadow-xs transition-colors hover:border-landing-accent/50 hover:bg-landing-panel-strong cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent",
            size === "sm" ? "h-8 text-xs py-1" : "h-10 text-sm py-2",
            className
          )}
          aria-label={`Selected date: ${formattedLabel}. Click to open calendar.`}
        >
          <RiCalendarLine className={cn("text-white shrink-0", size === "sm" ? "size-3.5" : "size-4")} aria-hidden="true" />
          <span className="font-medium whitespace-nowrap">{formattedLabel}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border border-landing-border bg-landing-panel shadow-2xl rounded-2xl" align="end">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={(d) => {
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);
            return d > endOfToday;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

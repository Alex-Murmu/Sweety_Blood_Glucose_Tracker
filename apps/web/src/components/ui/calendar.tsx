import * as React from "react";
import { RiArrowDownSLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "../../lib/utils.js";
import { buttonVariants } from "./button.tsx";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-landing-panel text-landing-text group/calendar p-3 rounded-xl [--cell-size:2.25rem]",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-10",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 select-none p-0 text-white hover:bg-landing-panel-strong hover:text-white aria-disabled:opacity-40",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 select-none p-0 text-white hover:bg-landing-panel-strong hover:text-white aria-disabled:opacity-40",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-8 w-full items-center justify-center font-semibold text-sm text-white",
          defaultClassNames.month_caption
        ),
        month_grid: cn("w-full border-collapse mt-2", defaultClassNames.month_grid),
        weekdays: cn("flex justify-between border-b border-landing-border pb-1.5 mb-1", defaultClassNames.weekdays),
        weekday: cn(
          "text-landing-muted text-xs font-medium w-8 text-center select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-1 justify-between", defaultClassNames.week),
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          defaultClassNames.day
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal text-white hover:bg-landing-accent hover:text-white transition-colors aria-selected:opacity-100 rounded-md"
        ),
        selected:
          "bg-landing-accent text-white font-bold hover:bg-landing-accent hover:text-white focus:bg-landing-accent focus:text-white",
        today: "border border-landing-accent/50 text-landing-accent font-semibold",
        outside: "text-landing-muted/40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-landing-muted/30 opacity-40 cursor-not-allowed",
        range_middle:
          "aria-selected:bg-landing-panel-strong aria-selected:text-landing-text",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <RiArrowLeftSLine className="size-4 text-white" />;
          }
          if (orientation === "right") {
            return <RiArrowRightSLine className="size-4 text-white" />;
          }
          return <RiArrowDownSLine className="size-4 text-white" />;
        },
      }}
      {...props}
    />
  );
}


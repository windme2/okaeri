"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { popoverMotion, popoverPanel, usePopover } from "./popover";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_FMT = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", calendar: "gregory" });
const LABEL_FMT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", calendar: "gregory" });
const SHORT_FMT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", calendar: "gregory" });

/** "YYYY-MM-DD" <-> local Date, without timezone drift. */
const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const fromISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const startOfToday = () => {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
};
const monthOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

function monthCells(view: Date): (Date | null)[] {
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  return [
    ...Array.from({ length: view.getDay() }, () => null),
    ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
  ];
}

/* ------------------------------------------------------------------ */

type DayState = { selected: boolean; edge?: "start" | "end"; inRange: boolean };

/** One month grid. "today" and the visible month are set when it opens (an event), never during render. */
function Calendar({
  today,
  initialMonth,
  dayState,
  onPick,
  onHover,
}: {
  today: Date;
  initialMonth: Date;
  dayState: (d: Date) => DayState;
  onPick: (d: Date) => void;
  onHover?: (d: Date | null) => void;
}) {
  const [view, setView] = useState(initialMonth);
  const shift = (n: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1));

  return (
    <div onMouseLeave={() => onHover?.(null)}>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="font-display text-sm font-semibold">{MONTH_FMT.format(view)}</span>
        <span className="flex gap-1">
          <button
            type="button"
            onClick={() => shift(-1)}
            disabled={view <= monthOf(today)}
            aria-label="Previous month"
            className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100"
          >
            <ChevronRight className="size-4" />
          </button>
        </span>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-slate-400">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="pb-2">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
        {monthCells(view).map((d, i) => {
          if (!d) return <span key={i} />;
          const past = d < today;
          const isToday = d.getTime() === today.getTime();
          const { selected, edge, inRange } = dayState(d);
          // the soft band that joins a range; half-width on the start/end days
          const band = edge === "start" ? "left-1/2 right-0" : edge === "end" ? "left-0 right-1/2" : inRange ? "inset-x-0" : "";
          return (
            <span key={i} className="relative grid place-items-center">
              {band && <span className={`absolute inset-y-0 bg-brand-50 ${band}`} />}
              <button
                type="button"
                disabled={past}
                onClick={() => onPick(d)}
                onMouseEnter={() => onHover?.(d)}
                aria-pressed={selected}
                aria-label={LABEL_FMT.format(d)}
                className={`relative grid size-9 place-items-center rounded-full tabular-nums transition ${
                  selected
                    ? "bg-brand-600 font-semibold text-white"
                    : past
                      ? "text-slate-300"
                      : inRange || edge
                        ? "text-brand-800 hover:bg-brand-100"
                        : "hover:bg-brand-50"
                } ${isToday && !selected ? "font-semibold text-brand-600" : ""}`}
              >
                {d.getDate()}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}

const panelMotion = popoverMotion;
const panelClass = popoverPanel.replace("p-2", "p-4");

/* ------------------------------------------------------------------ */

type SingleProps = { value: string; onChange: (iso: string) => void; placeholder?: string; className?: string };

/** Single-date popover calendar. Past dates are disabled. */
export function DatePicker({ value, onChange, placeholder = "Add date", className = "" }: SingleProps) {
  const { open, setOpen, rootRef } = usePopover();
  const [today, setToday] = useState<Date | null>(null);
  const selected = value ? fromISO(value) : null;

  const toggle = () => {
    if (!open) setToday(startOfToday());
    setOpen(!open);
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`w-full text-left outline-none ${selected ? "" : "font-normal text-slate-400"} ${className}`}
      >
        {selected ? LABEL_FMT.format(selected) : placeholder}
      </button>
      <AnimatePresence>
        {open && today && (
          <motion.div role="dialog" aria-label="Choose date" {...panelMotion} className={`${panelClass} w-72`}>
            <Calendar
              today={today}
              initialMonth={monthOf(selected ?? today)}
              dayState={(d) => ({ selected: selected?.getTime() === d.getTime(), inRange: false })}
              onPick={(d) => {
                onChange(toISO(d));
                setOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type DateRange = { start: string; end: string };
type RangeProps = {
  value: DateRange;
  onChange: (r: DateRange) => void;
  startLabel?: string;
  endLabel?: string;
  className?: string;
};

/** Start and end in one calendar: first click picks the start, second the end, with a band between. */
export function DateRangePicker({ value, onChange, startLabel = "Start", endLabel = "End", className = "" }: RangeProps) {
  const { open, setOpen, rootRef } = usePopover();
  const [today, setToday] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const start = value.start ? fromISO(value.start) : null;
  const end = value.end ? fromISO(value.end) : null;
  const picking: "start" | "end" = start && !end ? "end" : "start";

  const toggle = () => {
    if (!open) setToday(startOfToday());
    setOpen(!open);
  };

  const pick = (d: Date) => {
    if (picking === "start" || !start || d <= start) {
      onChange({ start: toISO(d), end: "" });
    } else {
      onChange({ start: value.start, end: toISO(d) });
      setOpen(false);
    }
  };

  // while choosing the end date, preview the range up to the hovered day
  const rangeEnd = end ?? (picking === "end" && hover && start && hover > start ? hover : null);
  const dayState = (d: Date): DayState => {
    const t = d.getTime();
    const isStart = start?.getTime() === t;
    const isEnd = rangeEnd?.getTime() === t;
    return {
      selected: isStart || (isEnd && !!end),
      edge: isStart && rangeEnd ? "start" : isEnd ? "end" : undefined,
      inRange: !!(start && rangeEnd && d > start && d < rangeEnd),
    };
  };

  const label = start ? `${SHORT_FMT.format(start)} to ${end ? SHORT_FMT.format(end) : "?"}` : null;

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`w-full truncate text-left outline-none ${label ? "" : "font-normal text-slate-400"} ${className}`}
      >
        {label ?? "Add dates"}
      </button>
      <AnimatePresence>
        {open && today && (
          <motion.div
            role="dialog"
            aria-label={`Choose ${startLabel.toLowerCase()} and ${endLabel.toLowerCase()} dates`}
            {...panelMotion}
            className={`${panelClass} w-80`}
          >
            <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
              {(["start", "end"] as const).map((k) => {
                const d = k === "start" ? start : end;
                return (
                  <span
                    key={k}
                    className={`rounded-xl px-3 py-2 ring-1 transition ${picking === k ? "bg-brand-50 ring-brand-200" : "ring-slate-200"}`}
                  >
                    <span className="block text-slate-500">{k === "start" ? startLabel : endLabel}</span>
                    <span className="font-semibold text-ink">{d ? SHORT_FMT.format(d) : "Select"}</span>
                  </span>
                );
              })}
            </div>
            <Calendar today={today} initialMonth={monthOf(start ?? today)} dayState={dayState} onPick={pick} onHover={setHover} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeftRight, BedDouble, CalendarRange, Calendar, Car, Plane, Search, Sparkles, Star, Ticket, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { findDeals, sortDeals, type Deal, type SearchQuery, type SearchResult, type SearchTab, type SortKey } from "@/lib/deals";
import { placeImage } from "@/lib/places";
import { onSearchRequest } from "@/lib/search-bus";
import { useBooking } from "./booking";
import { DatePicker, DateRangePicker } from "./date-picker";
import { PlaceInput, Select } from "./fields";
import { Money } from "./prefs";

const TABS: { id: SearchTab; icon: typeof Plane }[] = [
  { id: "Flights", icon: Plane },
  { id: "Hotels", icon: BedDouble },
  { id: "Cars", icon: Car },
  { id: "Experiences", icon: Ticket },
];

type Field =
  | { kind: "place"; key: string; label: string; placeholder: string }
  | { kind: "range"; start: string; end: string; label: string; startLabel: string; endLabel: string }
  | { kind: "date"; key: string; label: string }
  | { kind: "select"; key: string; label: string; options: string[]; icon: typeof Users };

const FIELDS: Record<SearchTab, Field[]> = {
  Flights: [
    { kind: "place", key: "from", label: "From", placeholder: "City or airport" },
    { kind: "place", key: "to", label: "To", placeholder: "Where to?" },
    { kind: "range", start: "depart", end: "return", label: "Travel dates", startLabel: "Depart", endLabel: "Return" },
    { kind: "select", key: "travelers", label: "Travelers", options: ["1 Adult", "2 Adults", "2 Adults, 1 Child", "Family (4)"], icon: Users },
  ],
  Hotels: [
    { kind: "place", key: "city", label: "Destination", placeholder: "City or area" },
    { kind: "range", start: "checkin", end: "checkout", label: "Stay dates", startLabel: "Check-in", endLabel: "Check-out" },
    { kind: "select", key: "guests", label: "Guests", options: ["1 Guest · 1 Room", "2 Guests · 1 Room", "4 Guests · 2 Rooms"], icon: Users },
  ],
  Cars: [
    { kind: "place", key: "pickup", label: "Pick-up", placeholder: "City or airport" },
    { kind: "place", key: "dropoff", label: "Drop-off", placeholder: "Same as pick-up" },
    { kind: "range", start: "pickdate", end: "dropdate", label: "Rental dates", startLabel: "Pick-up", endLabel: "Drop-off" },
    { kind: "select", key: "car", label: "Car type", options: ["Any", "Compact", "SUV", "Convertible", "Electric"], icon: Car },
  ],
  Experiences: [
    { kind: "place", key: "where", label: "Destination", placeholder: "Where are you going?" },
    { kind: "date", key: "date", label: "Date" },
    { kind: "select", key: "type", label: "Type", options: ["All experiences", "Food & drink", "Outdoor", "Culture & history", "Wellness"], icon: Sparkles },
  ],
};

const DEFAULTS: Record<string, string> = {
  from: "bkk",
  to: "tyo",
  travelers: "2 Adults",
  city: "kyo",
  guests: "2 Guests · 1 Room",
  pickup: "rek",
  car: "Any",
  where: "dps",
  type: "All experiences",
};

const SORTS: Record<SearchTab, { key: SortKey; label: string }[]> = {
  Flights: [
    { key: "best", label: "Best" },
    { key: "price", label: "Cheapest" },
    { key: "fast", label: "Fastest" },
  ],
  Hotels: [
    { key: "best", label: "Best" },
    { key: "price", label: "Cheapest" },
    { key: "rating", label: "Top rated" },
  ],
  Cars: [
    { key: "best", label: "Best" },
    { key: "price", label: "Cheapest" },
    { key: "rating", label: "Top rated" },
  ],
  Experiences: [
    { key: "best", label: "Best" },
    { key: "price", label: "Cheapest" },
    { key: "rating", label: "Top rated" },
  ],
};

function buildQuery(tab: SearchTab, v: Record<string, string>): SearchQuery {
  switch (tab) {
    case "Flights":
      return { tab, from: v.from, to: v.to, start: v.depart, end: v.return, option: v.travelers };
    case "Hotels":
      return { tab, place: v.city, start: v.checkin, end: v.checkout, option: v.guests };
    case "Cars":
      return { tab, place: v.pickup, dropoff: v.dropoff, start: v.pickdate, end: v.dropdate, option: v.car };
    case "Experiences":
      return { tab, place: v.where, start: v.date, option: v.type };
  }
}

/** "2 Adults, 1 Child" → 3, "Family (4)" → 4 */
const partySize = (s = "") => (s.match(/\d+/g) ?? ["1"]).map(Number).reduce((a, b) => a + b, 0) || 1;

const ease = [0.16, 1, 0.3, 1] as const;

type Outcome = { tab: SearchTab; query: SearchQuery; result: SearchResult } | { error: string };

export function SearchPanel() {
  const [tab, setTab] = useState<SearchTab>("Flights");
  const [values, setValues] = useState<Record<string, string>>(DEFAULTS);
  const [swapTurns, setSwapTurns] = useState(0);
  const [searching, setSearching] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [sort, setSort] = useState<SortKey>("best");

  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const swap = () => {
    setSwapTurns((t) => t + 1);
    setValues((p) => ({ ...p, from: p.to, to: p.from }));
  };

  const rootRef = useRef<HTMLDivElement>(null);

  const runSearch = (t: SearchTab, v: Record<string, string>) => {
    const query = buildQuery(t, v);
    const result = findDeals(query);
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setSort("best");
      setOutcome(typeof result === "string" ? { error: result } : { tab: t, query, result });
    }, 700);
  };

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(tab, values);
  };

  // other sections (the destinations map) can fill in the form and search
  const latest = useRef({ runSearch, values });
  useEffect(() => {
    latest.current = { runSearch, values };
  });
  useEffect(
    () =>
      onSearchRequest(({ tab: t, values: v }) => {
        const next = { ...latest.current.values, ...v };
        setValues(next);
        setTab(t);
        latest.current.runSearch(t, next);
        setSwapTurns((n) => n + 2); // remount place inputs so their text matches; even count keeps the swap icon still
        rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }),
    [],
  );

  const fields = FIELDS[tab];

  return (
    <motion.div
      ref={rootRef}
      className="scroll-mt-28"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.1, ease }}
    >
      {/* Tabs */}
      {/* phones: four equal tabs with the icon above the label so they fit without scrolling */}
      <div className="flex w-full sm:w-fit">
        <div className="grid w-full grid-cols-4 gap-1 rounded-t-3xl bg-white/80 p-2 pb-0 backdrop-blur-xl sm:flex sm:w-auto">
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setOutcome(null);
              }}
              className={`relative flex flex-col items-center gap-1 rounded-t-2xl px-1 py-2.5 text-[11px] font-semibold transition-colors sm:flex-row sm:gap-2 sm:px-6 sm:py-3 sm:text-sm ${
                tab === id ? "text-brand-700" : "text-slate-500 hover:text-ink"
              }`}
            >
              {tab === id && (
                <motion.span
                  layoutId="search-tab"
                  className="absolute inset-0 rounded-t-2xl bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <Icon className="relative size-4" />
              <span className="relative">{id}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={search} className="relative rounded-3xl rounded-t-none bg-white p-4 shadow-lift sm:rounded-tr-3xl ring-1 ring-brand-100/60 sm:p-5">
        <div className="relative z-20">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease }}
              className="grid gap-3 md:grid-cols-2 lg:flex lg:items-stretch"
            >
              {fields.map((f, i) => (
                <div key={f.kind === "range" ? f.start : f.key} className={`relative ${f.kind === "range" ? "lg:flex-[1.3]" : "lg:flex-1"}`}>
                  <FieldBox field={f} values={values} set={set} swapTurns={swapTurns} />
                  {tab === "Flights" && i === 0 && (
                    <motion.button
                      type="button"
                      onClick={swap}
                      animate={{ rotate: swapTurns * 180 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute -bottom-5 left-1/2 z-10 grid size-9 -translate-x-1/2 place-items-center rounded-full bg-white text-brand-600 shadow-md ring-1 ring-brand-100 md:bottom-auto md:left-auto md:-right-5 md:top-1/2 md:-translate-y-1/2 md:translate-x-0"
                      aria-label="Swap origin and destination"
                    >
                      <ArrowLeftRight className="size-4" />
                    </motion.button>
                  )}
                </div>
              ))}
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={searching}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-8 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 disabled:cursor-wait md:col-span-2 lg:h-auto"
              >
                {searching ? (
                  <motion.span
                    className="size-5 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  />
                ) : (
                  <Search className="size-4" />
                )}
                Search
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence initial={false}>
          {outcome && (
            <motion.div
              key={"error" in outcome ? "error" : JSON.stringify(outcome.query)}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease }}
              className="overflow-hidden"
            >
              {"error" in outcome ? (
                <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{outcome.error}</p>
              ) : (
                <Results outcome={outcome} sort={sort} setSort={setSort} travelers={partySize(values.travelers)} onClose={() => setOutcome(null)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}

function FieldBox({
  field,
  values,
  set,
  swapTurns,
}: {
  field: Field;
  values: Record<string, string>;
  set: (k: string, v: string) => void;
  swapTurns: number;
}) {
  const box =
    "group flex h-full flex-col justify-center rounded-2xl border border-slate-200/80 bg-mist/60 px-4 py-3 transition hover:border-brand-200 focus-within:border-brand-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100";
  const label = <span className="text-xs font-medium text-slate-500">{field.label}</span>;
  const text = "text-sm font-semibold text-ink";

  return (
    <div className={box}>
      {label}
      <div className="mt-1 flex items-center gap-2">
        {field.kind === "place" && (
          // remount on swap so the typed text follows the new value
          <PlaceInput key={`${field.key}-${swapTurns}`} value={values[field.key] ?? ""} onChange={(v) => set(field.key, v)} placeholder={field.placeholder} />
        )}
        {field.kind === "range" && (
          <>
            <CalendarRange className="size-4 shrink-0 text-brand-500" />
            <DateRangePicker
              value={{ start: values[field.start] ?? "", end: values[field.end] ?? "" }}
              onChange={(r) => {
                set(field.start, r.start);
                set(field.end, r.end);
              }}
              startLabel={field.startLabel}
              endLabel={field.endLabel}
              className={text}
            />
          </>
        )}
        {field.kind === "date" && (
          <>
            <Calendar className="size-4 shrink-0 text-brand-500" />
            <DatePicker value={values[field.key] ?? ""} onChange={(v) => set(field.key, v)} className={text} />
          </>
        )}
        {field.kind === "select" && (
          <Select value={values[field.key] || field.options[0]} options={field.options} onChange={(v) => set(field.key, v)} icon={field.icon} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Results({
  outcome,
  sort,
  setSort,
  travelers,
  onClose,
}: {
  outcome: { tab: SearchTab; query: SearchQuery; result: SearchResult };
  sort: SortKey;
  setSort: (s: SortKey) => void;
  travelers: number;
  onClose: () => void;
}) {
  const { tab, result } = outcome;
  // top 6 for the chosen sort, but never hide the deals labelled Cheapest / Fastest / Top rated
  const sorted = sortDeals(result.deals, sort);
  const labelled = sorted.slice(6).filter((d) => d.badge);
  const deals = [...sorted.slice(0, 6 - labelled.length), ...labelled];
  const noun = { Flights: "flights", Hotels: "stays", Cars: "cars", Experiences: "experiences" }[tab];

  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <p className="font-display text-lg font-semibold text-ink">{result.summary}</p>
          <p className="text-xs text-slate-500">
            {result.deals.length} {noun} found · showing the top {deals.length}
          </p>
        </div>
        <div className="flex gap-1 rounded-full bg-mist p-1">
          {SORTS[tab].map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={`relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                sort === s.key ? "text-white" : "text-slate-600 hover:text-ink"
              }`}
            >
              {sort === s.key && (
                <motion.span layoutId="deal-sort" className="absolute inset-0 rounded-full bg-brand-600" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={onClose} aria-label="Close results" className="grid size-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-ink">
          <X className="size-4" />
        </button>
      </div>

      <motion.ul layout className="mt-4 grid gap-3 lg:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {deals.map((d, i) => (
            <motion.li
              key={d.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, delay: i * 0.03, ease }}
            >
              <DealRow deal={d} tab={tab} result={result} travelers={travelers} date={outcome.query.start} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      <p className="mt-3 text-[11px] text-slate-400">Demo results based on distance, dates and destination. Prices are not live.</p>
    </div>
  );
}

const KIND = { Flights: "flight", Hotels: "stay", Cars: "car", Experiences: "experience" } as const;

function DealRow({
  deal,
  tab,
  result,
  travelers,
  date,
}: {
  deal: Deal;
  tab: SearchTab;
  result: SearchResult;
  travelers: number;
  date?: string;
}) {
  const { open } = useBooking();
  const t = deal.timeline;

  return (
    <div className="flex h-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-brand-200 hover:shadow-soft">
      <span
        className="grid size-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
        style={{ background: `linear-gradient(135deg, hsl(${deal.hue} 70% 55%), hsl(${deal.hue + 25} 70% 42%))` }}
        aria-hidden
      >
        {deal.initials}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-ink">{deal.title}</p>
          {deal.badge && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{deal.badge}</span>}
        </div>
        {t ? (
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <span className="font-semibold tabular-nums text-ink">
              {t.depart} → {t.arrive}
              {t.plusDays > 0 && <sup className="ml-0.5 text-[10px] text-rose-500">+{t.plusDays}</sup>}
            </span>
            <span className="text-xs text-slate-500">
              {t.duration} · {t.stops}
            </span>
          </p>
        ) : null}
        <p className="mt-1 truncate text-xs text-slate-500">
          {deal.rating && (
            <span className="mr-2 inline-flex items-center gap-0.5 font-semibold text-ink">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {deal.rating}
            </span>
          )}
          {deal.details.join(" · ")}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <Money usd={deal.price} className="block font-display text-lg font-bold text-brand-700" />
        <span className="block text-[11px] text-slate-400">{deal.priceNote}</span>
        <button
          type="button"
          onClick={() =>
            open({
              title: tab === "Flights" && t ? `${deal.title} · ${t.route}` : deal.title,
              subtitle: tab === "Flights" && t ? `${t.depart} → ${t.arrive} · ${t.stops}` : `${result.summary} · ${deal.priceNote}`,
              price: deal.price,
              image: placeImage(result.destination),
              perPerson: deal.perPerson,
              travelers,
              kind: KIND[tab],
              from: result.origin?.id,
              to: result.destination?.id,
              date,
              time: t?.depart,
              carrier: deal.title,
            })
          }
          className="mt-2 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
        >
          Book
        </button>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Calendar, Check, Minus, Plus, ShieldCheck, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { img } from "@/lib/data";
import { BoardingPass, DownloadButton, useDownloadImage } from "./boarding-pass";
import { DatePicker } from "./date-picker";
import { useScrollLock } from "./popover";
import { Money, toDisplay, useCurrency } from "./prefs";

export type BookingItem = {
  title: string;
  subtitle: string;
  /** USD */
  price: number;
  /** false for a whole stay or rental: the price doesn't multiply by travelers. Defaults to true. */
  perPerson?: boolean;
  travelers?: number;
  /** what the confirmation ticket should look like */
  kind?: "flight" | "package" | "stay" | "car" | "experience" | "plan";
  /** place ids for the route on the ticket */
  from?: string;
  to?: string;
  /** ISO date picked in the search, used as the default departure */
  date?: string;
  /** departure time for flights, e.g. "08:40" */
  time?: string;
  /** airline, hotel or rental company */
  carrier?: string;
  /** plan name for pricing-plan bookings */
  cabin?: string;
  image: string;
};

type Ctx = { open: (item: BookingItem) => void };
const BookingContext = createContext<Ctx | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<BookingItem | null>(null);
  const open = useCallback((i: BookingItem) => setItem(i), []);
  return (
    <BookingContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>{item && <BookingModal key={item.title} item={item} onClose={() => setItem(null)} />}</AnimatePresence>
    </BookingContext.Provider>
  );
}

const ease = [0.16, 1, 0.3, 1] as const;

/** Label for the price line when it isn't multiplied by travelers. */
const TOTAL_LABEL: Partial<Record<NonNullable<BookingItem["kind"]>, string>> = {
  plan: "Travel style add-on",
  car: "Total for your rental",
  stay: "Total for your stay",
};

function BookingModal({ item, onClose }: { item: BookingItem; onClose: () => void }) {
  const [travelers, setTravelers] = useState(item.travelers ?? 2);
  const perPerson = item.perPerson ?? true;
  const [date, setDate] = useState(item.date ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [ref, setRef] = useState("");

  useScrollLock();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const passRef = useRef<HTMLDivElement>(null);
  const { busy: saving, download } = useDownloadImage();
  // work in the shown currency from the rounded unit price, so the lines add up to the total
  const [currency] = useCurrency();
  const unit = toDisplay(item.price, currency);
  const subtotal = perPerson ? unit * travelers : unit;
  const taxes = Math.round(subtotal * 0.07);

  const confirm = () => {
    setStatus("loading");
    setTimeout(() => {
      setRef("OK-" + Math.random().toString(36).slice(2, 8).toUpperCase());
      setStatus("done");
    }, 1400);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${item.title}`}
    >
      <motion.button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
      />
      <motion.div
        className="relative w-full max-w-lg rounded-t-3xl bg-white shadow-lift sm:rounded-3xl"
        initial={{ y: 60, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.55, ease }}
      >
        <div className="relative h-40 overflow-hidden rounded-t-3xl">
          <Image src={img(item.image, 900)} alt="" fill sizes="512px" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-brand-950/80 via-brand-950/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
          <div className="absolute bottom-4 left-6 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">{item.subtitle}</p>
            <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status !== "done" ? (
            <motion.div
              key="form"
              className="space-y-5 p-6"
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-brand-100 bg-mist px-4 py-3 transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
                  <span className="text-xs text-slate-500">Departure</span>
                  <span className="relative mt-1 flex items-center justify-between gap-2">
                    <DatePicker value={date} onChange={setDate} placeholder="Pick a date" className="text-sm font-medium" />
                    <Calendar className="pointer-events-none size-4 shrink-0 text-brand-500" />
                  </span>
                </div>
                <div className="rounded-2xl border border-brand-100 bg-mist px-4 py-3">
                  <span className="text-xs text-slate-500">Travelers</span>
                  <div className="mt-1 flex items-center justify-between">
                    <button
                      onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                      className="grid size-6 place-items-center rounded-full bg-white text-brand-600 shadow-sm transition hover:bg-brand-50 active:scale-90"
                      aria-label="Fewer travelers"
                    >
                      <Minus className="size-3" />
                    </button>
                    <motion.span key={travelers} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-sm font-semibold tabular-nums">
                      {travelers}
                    </motion.span>
                    <button
                      onClick={() => setTravelers((t) => Math.min(9, t + 1))}
                      className="grid size-6 place-items-center rounded-full bg-white text-brand-600 shadow-sm transition hover:bg-brand-50 active:scale-90"
                      aria-label="More travelers"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </div>

              <dl className="space-y-2 rounded-2xl bg-brand-50/60 p-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <dt>
                    {perPerson ? (
                      <>
                        <Money local={unit} /> × {travelers} traveler{travelers > 1 && "s"}
                      </>
                    ) : (
                      TOTAL_LABEL[item.kind ?? "stay"] ?? "Total"
                    )}
                  </dt>
                  <dd>
                    <Money local={subtotal} />
                  </dd>
                </div>
                <div className="flex justify-between text-slate-600">
                  <dt>Taxes & fees</dt>
                  <dd>
                    <Money local={taxes} />
                  </dd>
                </div>
                <div className="flex justify-between border-t border-brand-100 pt-2 text-base font-semibold text-ink">
                  <dt>Total</dt>
                  <dd>
                    <Money local={subtotal + taxes} />
                  </dd>
                </div>
              </dl>

              <button
                onClick={confirm}
                disabled={status === "loading"}
                className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-brand-600 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 disabled:cursor-wait"
              >
                {status === "loading" ? (
                  <motion.span
                    className="size-5 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  />
                ) : (
                  "Confirm booking"
                )}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="size-3.5 text-brand-500" /> Free cancellation up to 14 days before departure
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              className="px-6 pb-6 pt-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="mb-4 flex items-center gap-3">
                <motion.span
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-500 text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                >
                  <Check className="size-5" strokeWidth={3} />
                </motion.span>
                <div>
                  <h4 className="font-display text-lg font-semibold leading-tight">You&apos;re going!</h4>
                  <p className="text-xs text-slate-500">Here&apos;s your pass. Save it for the trip.</p>
                </div>
              </div>

              <motion.div
                ref={passRef}
                className="bg-white p-1"
                initial={{ opacity: 0, y: 24, rotateX: 12 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
              >
                <BoardingPass item={item} travelers={perPerson ? travelers : item.travelers ?? travelers} date={date} reference={ref} total={subtotal + taxes} />
              </motion.div>

              <div className="mt-5 flex gap-3">
                <DownloadButton busy={saving} onClick={() => download(passRef.current, `okaeri-pass-${ref}.png`)} />
                <button
                  type="button"
                  onClick={onClose}
                  className="h-12 rounded-2xl px-5 text-sm font-semibold text-brand-700 ring-1 ring-brand-100 transition hover:bg-brand-50"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

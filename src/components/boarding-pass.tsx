"use client";

import { Download, Plane } from "lucide-react";
import { useState } from "react";
import { getPlace } from "@/lib/places";
import type { BookingItem } from "./booking";
import { fromISO } from "./date-picker";
import { Money } from "./prefs";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", calendar: "gregory" });

const LABEL: Record<NonNullable<BookingItem["kind"]>, string> = {
  flight: "Boarding pass",
  package: "Boarding pass",
  stay: "Stay voucher",
  car: "Rental voucher",
  experience: "Experience pass",
  plan: "Travel pass",
};

/** Small deterministic hash so seat, gate and barcode stay the same for a booking reference. */
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function Barcode({ code }: { code: string }) {
  let h = hash(code);
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 150) {
    h = (h * 1103515245 + 12345) >>> 0;
    const w = 1 + (h % 3);
    bars.push({ x, w });
    x += w + 1 + ((h >>> 8) % 3);
  }
  return (
    <svg viewBox="0 0 150 40" className="h-10 w-36" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="40" fill="#0b1736" />
      ))}
    </svg>
  );
}

export function BoardingPass({
  item,
  travelers,
  date,
  reference,
  total,
}: {
  item: BookingItem;
  travelers: number;
  date: string;
  reference: string;
  /** already in the shown currency */
  total: number;
}) {
  const kind = item.kind ?? "package";
  const from = getPlace(item.from ?? (kind === "flight" || kind === "package" ? "bkk" : undefined));
  const to = getPlace(item.to);
  const h = hash(reference);
  const isFlight = kind === "flight" || kind === "package";
  const seat = `${10 + (h % 30)}${"ABCDEF"[h % 6]}`;
  const gate = `${"ABCD"[(h >>> 3) % 4]}${1 + ((h >>> 5) % 12)}`;
  const boarding = item.time ?? `${String(7 + ((h >>> 7) % 15)).padStart(2, "0")}:${(h >>> 11) % 2 ? "30" : "05"}`;
  const when = date ? DATE_FMT.format(fromISO(date)) : "Flexible";

  const fields: [string, string][] = [
    ["Passengers", `${travelers}`],
    ["Date", when],
    ...(isFlight
      ? ([
          ["Boarding", boarding],
          ["Seat · Gate", `${seat} · ${gate}`],
        ] as [string, string][])
      : kind === "plan"
        ? ([["Cabin", item.cabin ?? "Any"]] as [string, string][])
        : ([["Provider", item.carrier ?? "Okaeri partner"]] as [string, string][])),
  ];

  return (
    <div className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-brand-100">
      {/* main */}
      <div className="relative bg-linear-to-br from-brand-600 via-brand-700 to-brand-900 px-6 pb-6 pt-5 text-white">
        <div className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="size-5 -rotate-12" fill="currentColor" aria-hidden>
              <path d="M22 2 2 9.5l7.5 3L22 2Z" />
              <path d="m22 2-12.5 10.5V20l3.6-4.4L17 19 22 2Z" opacity=".7" />
            </svg>
            <span className="font-display text-lg font-semibold tracking-tight">okaeri</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">{LABEL[kind]}</span>
        </div>

        <div className="relative mt-6">
          {from && to ? (
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-4xl font-bold leading-none tracking-tight">{from.code}</p>
                <p className="mt-1 text-xs text-white/70">{from.city}</p>
              </div>
              <div className="mb-3 flex flex-1 items-center gap-2 text-white/60">
                <span className="h-px flex-1 border-t border-dashed border-white/40" />
                <Plane className="size-4 text-white" />
                <span className="h-px flex-1 border-t border-dashed border-white/40" />
              </div>
              <div className="text-right">
                <p className="font-display text-4xl font-bold leading-none tracking-tight">{to.code}</p>
                <p className="mt-1 text-xs text-white/70">{to.city}</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-white/70">{kind === "plan" ? "Plan" : to ? to.city : "Booking"}</p>
              <p className="font-display text-3xl font-bold leading-tight tracking-tight">{item.title}</p>
            </div>
          )}
          {from && to && <p className="mt-4 truncate text-sm font-medium text-white/90">{item.title}</p>}
        </div>

        <dl className="relative mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          {fields.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-[10px] uppercase tracking-wider text-white/60">{k}</dt>
              <dd className="truncate text-sm font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* perforation */}
      <div className="relative h-0 border-t-2 border-dashed border-brand-100">
        <span className="absolute -left-3 -top-3 size-6 rounded-full bg-white" />
        <span className="absolute -right-3 -top-3 size-6 rounded-full bg-white" />
      </div>

      {/* stub */}
      <div className="flex items-center justify-between gap-4 bg-white px-6 py-4">
        <div>
          <Barcode code={reference} />
          <p className="mt-1 font-mono text-xs font-semibold tracking-[0.2em] text-ink">{reference}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">Total paid</p>
          <Money local={total} className="font-display text-xl font-bold text-brand-700" />
        </div>
      </div>
    </div>
  );
}

/** Saves an element as a PNG (rendered at 3× for sharp text). */
export function useDownloadImage() {
  const [busy, setBusy] = useState(false);
  const download = async (node: HTMLElement | null, fileName: string) => {
    if (!node) return;
    setBusy(true);
    try {
      const { toPng } = await import("html-to-image");
      const url = await toPng(node, { pixelRatio: 3, cacheBust: true, backgroundColor: "#ffffff" });
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    } finally {
      setBusy(false);
    }
  };
  return { busy, download };
}

export function DownloadButton({ busy, onClick }: { busy: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 disabled:cursor-wait disabled:opacity-80"
    >
      <Download className="size-4" />
      {busy ? "Preparing…" : "Download pass"}
    </button>
  );
}

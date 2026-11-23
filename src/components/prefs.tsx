"use client";

import { animate } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Tiny localStorage-backed store, safe for SSR (server always sees the initial value). */
function createStore<T>(key: string, initial: T) {
  let value = initial;
  let loaded = false;
  const listeners = new Set<() => void>();
  const get = () => {
    if (!loaded && typeof window !== "undefined") {
      loaded = true;
      try {
        const raw = localStorage.getItem(key);
        if (raw) value = JSON.parse(raw) as T;
      } catch {
        /* ignore corrupt storage */
      }
    }
    return value;
  };
  return {
    get,
    getServer: () => initial,
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    set(next: T) {
      value = next;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* storage full or blocked: keep in memory */
      }
      listeners.forEach((l) => l());
    },
  };
}

/* ---------- currency ---------- */

export type Currency = "USD" | "THB";
/** Approximate display rate; prices are stored in USD. */
const THB_PER_USD = 33;

const currencyStore = createStore<Currency>("okaeri:currency", "USD");

export function useCurrency() {
  const currency = useSyncExternalStore(currencyStore.subscribe, currencyStore.get, currencyStore.getServer);
  return [currency, currencyStore.set] as const;
}

const FORMATTERS: Record<Currency, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
  THB: new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }),
};

/**
 * Baht prices the way Thai travel sites show them: under ฿1,000 to the nearest 10,
 * under ฿10,000 to the nearest 50, and above that ending in ,500 or ,900 (฿72,567 → ฿72,500).
 */
function roundBaht(thb: number) {
  if (thb < 1_000) return Math.round(thb / 10) * 10;
  if (thb < 10_000) return Math.round(thb / 50) * 50;
  const k = Math.floor(thb / 1_000) * 1_000;
  const options = [k - 100, k + 500, k + 900];
  return options.reduce((best, o) => (Math.abs(o - thb) < Math.abs(best - thb) ? o : best));
}

/** A USD price in the visitor's currency, rounded for display. */
export const toDisplay = (usd: number, currency: Currency) => (currency === "USD" ? Math.round(usd) : roundBaht(usd * THB_PER_USD));

/**
 * A price in the visitor's currency; counts to the new value when currency or amount changes.
 * Pass `usd` for a list price (converted and rounded), or `local` for an amount already in the
 * current currency (e.g. a total built from rounded prices, so the sum matches its lines).
 */
export function Money({ usd, local, className }: { usd?: number; local?: number; className?: string }) {
  const [currency] = useCurrency();
  const target = local ?? toDisplay(usd ?? 0, currency);
  const [shown, setShown] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const controls = animate(from.current, target, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        from.current = v;
        setShown(v);
      },
    });
    return () => controls.stop();
  }, [target]);

  return <span className={`tabular-nums ${className ?? ""}`}>{FORMATTERS[currency].format(Math.round(shown))}</span>;
}

/* ---------- wishlist ---------- */

const wishStore = createStore<string[]>("okaeri:wishlist", []);

export function useWishlist() {
  const ids = useSyncExternalStore(wishStore.subscribe, wishStore.get, wishStore.getServer);
  const toggle = (id: string) => wishStore.set(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  return { ids, has: (id: string) => ids.includes(id), toggle };
}

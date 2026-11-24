"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Heart, X } from "lucide-react";
import { PACKAGES, img } from "@/lib/data";
import { useBooking } from "./booking";
import { popoverMotion, usePopover } from "./popover";
import { Money, useCurrency, useWishlist, type Currency } from "./prefs";

const pill = (light: boolean) =>
  light ? "bg-white/15 text-white ring-1 ring-white/40 backdrop-blur" : "bg-white text-ink ring-1 ring-brand-100";

export function CurrencySwitch({ light }: { light: boolean }) {
  const [currency, setCurrency] = useCurrency();
  return (
    <div role="radiogroup" aria-label="Currency" className={`flex rounded-full p-1 text-xs font-semibold ${pill(light)}`}>
      {(["USD", "THB"] as Currency[]).map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={currency === c}
          onClick={() => setCurrency(c)}
          className={`relative rounded-full px-2.5 py-1.5 transition-colors ${
            currency === c ? (light ? "text-brand-700" : "text-white") : light ? "text-white/80" : "text-slate-500"
          }`}
        >
          {currency === c && (
            <motion.span
              layoutId="currency-pill"
              className={`absolute inset-0 rounded-full ${light ? "bg-white" : "bg-brand-600"}`}
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span className="relative">{c}</span>
        </button>
      ))}
    </div>
  );
}

export function WishlistButton({ light }: { light: boolean }) {
  const { open, setOpen, rootRef } = usePopover();
  const { ids, toggle } = useWishlist();
  const booking = useBooking();
  const saved = PACKAGES.filter((p) => ids.includes(p.id));

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`Wishlist, ${saved.length} saved`}
        aria-expanded={open}
        className={`relative grid size-10 place-items-center rounded-full transition ${pill(light)}`}
      >
        <Heart className={`size-4 ${saved.length ? "fill-rose-500 text-rose-500" : ""}`} />
        <AnimatePresence>
          {saved.length > 0 && (
            <motion.span
              key={saved.length}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-5 text-white ring-2 ring-white"
            >
              {saved.length}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...popoverMotion}
            className="absolute right-0 top-full z-50 mt-3 w-80 origin-top-right rounded-3xl bg-white p-3 text-ink shadow-[0_24px_60px_-20px_rgb(21_36_81/0.35)] ring-1 ring-slate-900/5"
          >
            <p className="px-2 pb-2 pt-1 font-display text-sm font-semibold">Wishlist</p>
            {saved.length === 0 ? (
              <p className="px-2 pb-3 text-sm text-slate-500">Tap the heart on any package to save it here.</p>
            ) : (
              <ul className="space-y-1">
                {saved.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-mist">
                    <span className="relative block size-12 shrink-0 overflow-hidden rounded-xl">
                      <Image src={img(p.image, 200)} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        booking.open({ title: p.title, subtitle: `${p.country} · ${p.days} days`, price: p.price, image: p.image, kind: "package", to: p.placeId });
                      }}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate text-sm font-semibold">{p.title}</span>
                      <Money usd={p.price} className="text-xs font-semibold text-brand-700" />
                      <span className="text-xs text-slate-400"> · {p.days}D</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(p.id)}
                      aria-label={`Remove ${p.title}`}
                      className="grid size-8 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-rose-500"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

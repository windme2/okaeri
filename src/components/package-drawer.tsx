"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check, Clock, Heart, MapPin, Star, X } from "lucide-react";
import { useEffect } from "react";
import { img, type TravelPackage } from "@/lib/data";
import { ITINERARIES, NOT_INCLUDED, inclusions } from "@/lib/itineraries";
import { useBooking } from "./booking";
import { useScrollLock } from "./popover";
import { Money, useWishlist } from "./prefs";

const ease = [0.16, 1, 0.3, 1] as const;

/** Side panel with the day-by-day plan, what's included and a booking button. */
export function PackageDrawer({ pkg, onClose }: { pkg: TravelPackage | null; onClose: () => void }) {
  return <AnimatePresence>{pkg && <Drawer key={pkg.id} pkg={pkg} onClose={onClose} />}</AnimatePresence>;
}

function Drawer({ pkg, onClose }: { pkg: TravelPackage; onClose: () => void }) {
  const booking = useBooking();
  const wish = useWishlist();
  const liked = wish.has(pkg.id);
  const days = ITINERARIES[pkg.id] ?? [];

  useScrollLock();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const book = () => {
    onClose();
    booking.open({
      title: pkg.title,
      subtitle: `${pkg.country} · ${pkg.days} days`,
      price: pkg.price,
      image: pkg.image,
      kind: "package",
      to: pkg.placeId,
    });
  };

  return (
    <motion.div className="fixed inset-0 z-[90] flex justify-end" role="dialog" aria-modal="true" aria-label={`${pkg.title} details`}>
      <motion.button
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.aside
        className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-lift"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="relative h-64 shrink-0">
            <Image src={img(pkg.image, 1000)} alt={`${pkg.title}, ${pkg.country}`} fill sizes="512px" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-brand-950/85 via-brand-950/20 to-transparent" />
            <div className="absolute right-4 top-4 flex gap-2">
              <button
                onClick={() => wish.toggle(pkg.id)}
                aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
                aria-pressed={liked}
                className="grid size-10 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:bg-white"
              >
                <Heart className={`size-4 ${liked ? "fill-rose-500 text-rose-500" : "text-slate-600"}`} />
              </button>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid size-10 place-items-center rounded-full bg-white/90 text-slate-700 backdrop-blur transition hover:bg-white"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="absolute inset-x-6 bottom-5 text-white">
              {pkg.tag && <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">{pkg.tag}</span>}
              <h3 className="font-display text-3xl font-semibold">{pkg.title}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {pkg.country}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> {pkg.days} days, {pkg.nights} nights
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" /> {pkg.rating} ({pkg.reviews} reviews)
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-9 px-6 py-8">
            <section>
              <h4 className="font-display text-lg font-semibold text-ink">Your trip, day by day</h4>
              <ol className="mt-5">
                {days.map((d, i) => (
                  <motion.li
                    key={d.title}
                    className="relative flex gap-4 pb-6 last:pb-0"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.05, ease }}
                  >
                    {/* timeline rail */}
                    {i < days.length - 1 && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-brand-100" aria-hidden />}
                    <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700 ring-1 ring-brand-100">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Day {i + 1}</p>
                      <p className="font-semibold text-ink">{d.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">{d.text}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </section>

            <section>
              <h4 className="font-display text-lg font-semibold text-ink">What&apos;s included</h4>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {inclusions(pkg).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-400">Not included: {NOT_INCLUDED.join(", ")}.</p>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4">
          <div>
            <Money usd={pkg.price} className="block font-display text-2xl font-bold text-brand-700" />
            <span className="text-xs text-slate-400">per person</span>
          </div>
          <button
            onClick={book}
            className="rounded-2xl bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
          >
            Book this trip
          </button>
        </div>
      </motion.aside>
    </motion.div>
  );
}

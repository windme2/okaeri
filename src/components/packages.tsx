"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Clock, Heart, MapPin, Star } from "lucide-react";
import { useCallback, useState } from "react";
import { PACKAGES, img, type Category, type TravelPackage } from "@/lib/data";
import { useBooking } from "./booking";
import { PackageDrawer } from "./package-drawer";
import { Money, useWishlist } from "./prefs";
import { SectionHeading } from "./reveal";

const FILTERS: ("All" | Category)[] = ["All", "Beach", "Mountain", "Culture"];

export function Packages() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [openPkg, setOpenPkg] = useState<TravelPackage | null>(null);
  const closeDrawer = useCallback(() => setOpenPkg(null), []);
  const list = filter === "All" ? PACKAGES : PACKAGES.filter((p) => p.category === filter);

  return (
    <section id="packages" className="mx-auto max-w-7xl scroll-mt-24 px-6 pt-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Popular packages"
          title={
            <>
              Journeys travelers <span className="font-script text-5xl font-normal text-brand-600 sm:text-6xl">love</span>
            </>
          }
        />
        <div className="flex w-fit gap-1 rounded-full bg-white p-1 shadow-soft ring-1 ring-brand-100">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f ? "text-white" : "text-slate-600 hover:text-ink"
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="pkg-filter"
                  className="absolute inset-0 rounded-full bg-brand-600"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <PackageCard key={p.id} p={p} index={i} onOpen={() => setOpenPkg(p)} />
          ))}
        </AnimatePresence>
      </motion.div>
      <PackageDrawer pkg={openPkg} onClose={closeDrawer} />
    </section>
  );
}

function PackageCard({ p, index, onOpen }: { p: TravelPackage; index: number; onOpen: () => void }) {
  const { open } = useBooking();
  const wish = useWishlist();
  const liked = wish.has(p.id);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex w-[82%] shrink-0 snap-start cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-soft sm:w-auto ring-1 ring-brand-100/70 transition-shadow duration-500 hover:shadow-lift"
    >
      {/* whole card opens the details panel; the heart and book buttons sit above it */}
      <button type="button" onClick={onOpen} className="absolute inset-0 z-0 rounded-3xl" aria-label={`View details for ${p.title}`} />
      <div className="pointer-events-none relative aspect-[4/3] overflow-hidden">
        <Image
          src={img(p.image, 800)}
          alt={`${p.title}, ${p.country}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {p.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
            {p.tag}
          </span>
        )}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => wish.toggle(p.id)}
          aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={liked}
          className="pointer-events-auto absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:bg-white"
        >
          <motion.span key={String(liked)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
            <Heart className={`size-4 ${liked ? "fill-rose-500 text-rose-500" : "text-slate-600"}`} />
          </motion.span>
        </motion.button>
      </div>

      <div className="pointer-events-none flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5 text-brand-500" /> {p.country}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5 text-brand-500" /> {p.days}D / {p.nights}N
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <Money usd={p.price} className="block font-display text-2xl font-bold text-brand-700" />
            <p className="text-xs text-slate-400">
              per person · <Star className="inline size-3 -translate-y-px fill-amber-400 text-amber-400" /> {p.rating}{" "}
              <span className="text-slate-400">({p.reviews})</span>
            </p>
          </div>
          <button
            onClick={() =>
              open({ title: p.title, subtitle: `${p.country} · ${p.days} days`, price: p.price, image: p.image, kind: "package", to: p.placeId })
            }
            className="pointer-events-auto relative z-10 grid size-11 place-items-center rounded-full bg-brand-50 text-brand-700 transition-all duration-300 hover:bg-brand-600 hover:text-white group-hover:rotate-45 group-hover:bg-brand-600 group-hover:text-white"
            aria-label={`Book ${p.title}`}
          >
            <ArrowUpRight className="size-5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

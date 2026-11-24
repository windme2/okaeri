"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Check, Mail, Send } from "lucide-react";
import { useRef, useState } from "react";
import { IMAGES, img } from "@/lib/data";
import type { SearchTab } from "@/lib/deals";
import { requestSearch } from "@/lib/search-bus";
import { Logo } from "./paper-plane";

export function CallToAction() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="px-4 pt-28 sm:px-6">
      <div ref={ref} className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[40px]">
        <motion.div className="absolute inset-[-12%_0] -z-20" style={{ y }}>
          <Image src={img(IMAGES.roadTrip, 2000)} alt="Vintage van on a desert road between red rock formations" fill sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-950/85 via-brand-900/60 to-transparent" />

        <div className="max-w-xl px-8 py-20 sm:px-14 sm:py-28">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl"
          >
            The road is calling. <span className="font-script text-5xl font-normal text-brand-200 sm:text-6xl">Answer it.</span>
          </motion.h2>
          <p className="mt-4 text-white/80">
            Join 40,000 wanderers getting secret fares and hidden-gem itineraries every Friday.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSent(true);
            }}
            className="mt-8 flex max-w-md items-center gap-2 rounded-full bg-white/95 p-1.5 shadow-2xl backdrop-blur"
          >
            <Mail className="ml-3 size-5 shrink-0 text-brand-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent px-1 text-sm text-ink outline-none placeholder:text-slate-400"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
                    <Check className="size-4" /> Subscribed
                  </motion.span>
                ) : (
                  <motion.span key="go" exit={{ x: 30, y: -30, opacity: 0 }} className="flex items-center gap-1.5">
                    Subscribe <Send className="size-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}

// Only links that lead somewhere on this page: sections, or the hero search on a given tab.
const EXPLORE = [
  { label: "Packages", href: "#packages" },
  { label: "Destinations", href: "#destinations" },
  { label: "Pricing", href: "#pricing" },
  { label: "How to book", href: "#how" },
  { label: "Stories", href: "#stories" },
];
const SEARCH: SearchTab[] = ["Flights", "Hotels", "Cars", "Experiences"];
const footerLink = "text-sm text-slate-500 transition hover:text-brand-600";

export function Footer() {
  return (
    <footer className="mx-auto mt-28 max-w-7xl px-6 pb-10">
      {/* phones: brand on its own row, then Explore and Search side by side */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-brand-100 pt-14 md:grid-cols-[2fr_1fr_1fr] md:gap-12">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-500">
            &ldquo;Welcome home&rdquo; is what greets you at every Japanese doorstep. We bring that warmth to every trip, taking care of flights, stays and the small details so wherever you land feels like home.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-ink">Explore</h4>
          <ul className="mt-4 space-y-2.5">
            {EXPLORE.map((l) => (
              <li key={l.label}>
                <a href={l.href} className={footerLink}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-ink">Search</h4>
          <ul className="mt-4 space-y-2.5">
            {SEARCH.map((tab) => (
              <li key={tab}>
                <button type="button" onClick={() => requestSearch({ tab, values: {} })} className={footerLink}>
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-14 flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
        <p>© 2026 Okaeri by windyoncloud</p>
      </div>
    </footer>
  );
}

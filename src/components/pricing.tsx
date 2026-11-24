"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { PLANS } from "@/lib/data";
import { useBooking } from "./booking";
import { Money } from "./prefs";
import { SectionHeading } from "./reveal";

const PLAN_IMAGE = "1436491865332-7a61a109cc05";

export function Pricing() {
  const [couple, setCouple] = useState(false);
  const { open } = useBooking();

  return (
    <section id="pricing" className="scroll-mt-24 px-4 pt-28 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-linear-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-16 sm:px-10 lg:py-20">
        {/* decorative */}
        <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-brand-400/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 size-[28rem] rounded-full bg-sky-300/20 blur-3xl" />

        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="[&_h2]:text-white [&_p]:text-brand-100 [&_p_span]:bg-brand-200">
            <SectionHeading eyebrow="Pricing details" title="Pick how you want to fly" />
            <p className="mt-4 max-w-md text-sm leading-relaxed">
              Choose a travel style for any trip. It sets your flights, hotels and extras, and is added once per trip on top of
              your package.
            </p>
          </div>
          <button
            onClick={() => setCouple((c) => !c)}
            className="flex items-center gap-3 rounded-full bg-white/10 p-1 pr-4 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur"
            role="switch"
            aria-checked={couple}
          >
            <span className="relative flex h-8 w-14 items-center rounded-full bg-white/20 p-1">
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`size-6 rounded-full bg-white shadow ${couple ? "ml-auto" : ""}`}
              />
            </span>
            Couple pricing <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs text-emerald-200">save 10%</span>
          </button>
        </div>

        <div className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => {
            const price = couple ? Math.round(plan.price * 2 * 0.9) : plan.price;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: plan.featured ? -16 : 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative flex flex-col rounded-3xl p-6 transition-shadow duration-500 ${
                  plan.featured
                    ? "bg-white shadow-2xl shadow-brand-950/40 ring-2 ring-white"
                    : "bg-white/95 shadow-xl shadow-brand-950/20 hover:shadow-2xl"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-linear-to-r from-amber-400 to-orange-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    <Sparkles className="size-3" /> Most popular
                  </span>
                )}
                <h3 className="text-center font-display text-xl font-semibold text-ink">{plan.name}</h3>
                <p className="mt-1 text-center text-xs text-slate-500">{plan.blurb}</p>
                <div className="mt-5 flex h-12 items-center justify-center overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={price}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -30, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="font-display text-4xl font-bold text-brand-700"
                    >
                      <Money usd={price} />
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="text-center text-xs text-slate-400">{couple ? "add-on per trip, for two" : "add-on per trip"}</p>
                <ul className="mt-6 space-y-2.5 text-sm text-slate-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    open({
                      title: `${plan.name} plan`,
                      subtitle: couple ? `${plan.blurb} · for two` : plan.blurb,
                      price,
                      perPerson: false,
                      travelers: couple ? 2 : 1,
                      image: PLAN_IMAGE,
                      kind: "plan",
                      cabin: plan.name,
                    })
                  }
                  className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition ${
                    plan.featured
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700"
                      : "text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50"
                  }`}
                >
                  Select plan
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

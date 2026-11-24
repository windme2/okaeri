"use client";

import { motion } from "motion/react";
import { BadgePercent, Briefcase, Headphones, ShieldCheck } from "lucide-react";

const ITEMS = [
  { icon: BadgePercent, title: "Best price guarantee", text: "Find it cheaper elsewhere and we'll match it." },
  { icon: ShieldCheck, title: "Secure booking", text: "Bank-grade encryption on every payment." },
  { icon: Headphones, title: "24/7 human support", text: "Real travel experts, any time zone." },
  { icon: Briefcase, title: "Tailor-made trips", text: "Itineraries shaped around you." },
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 sm:pt-20">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <motion.span
              whileHover={{ rotate: -8, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="relative grid size-16 shrink-0 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft ring-1 ring-brand-100"
            >
              <span className="absolute inset-0 rounded-2xl bg-linear-to-br from-brand-50 to-transparent" />
              <Icon className="relative size-7" strokeWidth={1.75} />
            </motion.span>
            <div>
              <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

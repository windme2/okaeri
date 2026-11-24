"use client";

import { motion } from "motion/react";
import { CreditCard, MapPin, PackageOpen, Plane } from "lucide-react";
import { SectionHeading } from "./reveal";

const STEPS = [
  { icon: MapPin, title: "Choose destination", text: "Pick the place you've been dreaming about." },
  { icon: PackageOpen, title: "Select a package", text: "Compare curated plans built for you." },
  { icon: CreditCard, title: "Make payment", text: "Secure checkout, pay in installments." },
  { icon: Plane, title: "Enjoy your trip", text: "Pack your bags and make memories." },
];

export function HowToBook() {
  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-6 pt-28">
      <SectionHeading eyebrow="How to book" title="Four steps to take off" className="text-center [&_p]:justify-center" />

      <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center"
          >
            {/* connector to the next step: from this icon's edge to the next icon's edge (icon 80px, 16px breathing room each side, grid gap 1.5rem) */}
            {i < STEPS.length - 1 && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute top-10 hidden h-0.5 origin-left rounded-full bg-brand-200 lg:block"
                style={{ left: "calc(50% + 56px)", width: "calc(100% + 1.5rem - 112px)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <motion.div
              whileHover={{ y: -6, rotate: i % 2 ? 6 : -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="relative grid size-20 place-items-center rounded-[26px] bg-linear-to-br from-white to-brand-50 text-brand-600 shadow-soft ring-1 ring-brand-100"
            >
              <Icon className="size-8" strokeWidth={1.6} />
              <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-brand-600 font-display text-xs font-bold text-white ring-4 ring-mist">
                {i + 1}
              </span>
            </motion.div>
            <h3 className="mt-6 font-display text-lg font-semibold">{title}</h3>
            <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-slate-500">{text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

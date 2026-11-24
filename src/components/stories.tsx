"use client";

import Image from "next/image";
import { AnimatePresence, animate, motion, useInView } from "motion/react";
import { ChevronLeft, ChevronRight, Globe2, Headphones, Luggage, Quote, Star, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS, img } from "@/lib/data";

const STATS = [
  { icon: Globe2, value: 150, suffix: "+", label: "Destinations" },
  { icon: Users, value: 10, suffix: "K+", label: "Happy travelers" },
  { icon: Luggage, value: 500, suffix: "+", label: "Travel packages" },
  { icon: Headphones, value: 24, suffix: "/7", label: "Support" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (node.textContent = Math.round(v) + suffix),
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}

export function Stories() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const t = TESTIMONIALS[index];

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(id);
  }, [index]);

  return (
    <section id="stories" className="scroll-mt-24 px-4 pt-28 sm:px-6">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[40px] bg-brand-700 shadow-lift lg:grid-cols-[1.1fr_1fr]">
        {/* Stats */}
        <div className="relative grid grid-cols-2 gap-px bg-white/10">
          {STATS.map(({ icon: Icon, value, suffix, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="flex flex-col items-center justify-center gap-2 bg-brand-700 px-4 py-10 text-white sm:py-14"
            >
              <Icon className="size-7 text-brand-200" strokeWidth={1.5} />
              <p className="font-display text-4xl font-bold sm:text-5xl">
                <Counter to={value} suffix={suffix} />
              </p>
              <p className="text-sm text-brand-100">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="relative isolate flex min-h-[360px] flex-col justify-between overflow-hidden p-8 sm:p-12">
          <Image src={img("1488085061387-422e29b40080", 1200)} alt="" fill sizes="50vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand-900/90 via-brand-800/80 to-brand-600/60" />
          <Quote className="size-10 text-brand-200" />

          <div className="relative mt-6 flex-1">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: dir * -40, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="font-display text-xl leading-relaxed text-white sm:text-2xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="relative size-14 overflow-hidden rounded-full ring-2 ring-white/60">
                    <Image src={img(t.avatar, 200)} alt={t.name} fill sizes="56px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{t.name}</span>
                    <span className="block text-sm text-brand-100">
                      {t.place} · {t.trip}
                    </span>
                    <span className="mt-1 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="size-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Show testimonial ${i + 1}`}
                  className="relative h-1.5 w-8 overflow-hidden rounded-full bg-white/25"
                >
                  {i === index && (
                    <motion.span
                      key={index}
                      className="absolute inset-y-0 left-0 rounded-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 7, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => go(-1)} aria-label="Previous" className="grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition hover:bg-white hover:text-brand-700">
                <ChevronLeft className="size-5" />
              </button>
              <button onClick={() => go(1)} aria-label="Next" className="grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition hover:bg-white hover:text-brand-700">
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

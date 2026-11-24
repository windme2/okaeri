"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";
import { IMAGES, img } from "@/lib/data";
import { PaperPlane } from "./paper-plane";
import { SearchPanel } from "./search-panel";

const ease = [0.16, 1, 0.3, 1] as const;

const TRAIL =
  "M10 320 C 120 300, 170 220, 220 170 C 260 130, 250 60, 205 70 C 160 80, 170 150, 240 160 C 320 172, 417 130, 470 70";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const planeX = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const planeY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative">
      <div className="relative isolate min-h-svh overflow-hidden pb-56 sm:pb-48">
        {/* Background photo with parallax */}
        <motion.div className="absolute inset-0 -z-20" style={{ y: bgY, scale: bgScale }}>
          <Image
            src={img(IMAGES.heroSky, 2400)}
            alt="Airplane wing above a sea of clouds at golden hour"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-950/85 via-brand-800/55 to-brand-600/10" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-linear-to-t from-mist via-mist/40 to-transparent" />

        {/* Flight path + plane */}
        <motion.div
          className="pointer-events-none absolute right-[6%] top-[12%] hidden w-[22vw] max-w-[330px] md:block"
          style={{ x: planeX, y: planeY }}
        >
          <motion.div
            initial={{ x: -240, y: 180, rotate: 18, opacity: 0, scale: 0.6 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 2.4, delay: 0.5, ease }}
          >
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <svg viewBox="0 0 600 340" className="absolute left-[-86.08%] top-[42.23%] w-[170%] overflow-visible" fill="none">
                <defs>
                  <mask id="trail-mask" maskUnits="userSpaceOnUse">
                    <motion.path
                      d={TRAIL}
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2.2, delay: 0.6, ease: "easeInOut" }}
                    />
                  </mask>
                </defs>
                <path
                  d={TRAIL}
                  mask="url(#trail-mask)"
                  stroke="white"
                  strokeOpacity="0.85"
                  strokeWidth="2.5"
                  strokeDasharray="8 10"
                  strokeLinecap="round"
                />
              </svg>
              <PaperPlane className="relative w-full drop-shadow-[0_40px_40px_rgba(10,30,80,0.35)]" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Copy */}
        <motion.div
          className="mx-auto max-w-7xl px-6 pt-32 sm:pt-40"
          style={{ y: textY, opacity: textOpacity }}
        >
          <h1 className="font-display font-bold uppercase leading-[0.85] text-white">
            <span className="block overflow-hidden">
              <motion.span
                className="block text-[19vw] tracking-tight sm:text-8xl lg:text-[8.5rem]"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease }}
              >
                Travel
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="mt-2 block text-3xl font-semibold tracking-wide sm:text-5xl lg:text-6xl"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.25, ease }}
              >
                around the world
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-5 font-script text-4xl text-brand-100 sm:text-5xl"
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.4, delay: 0.7, ease: "easeOut" }}
          >
            Explore. Dream. Discover.
          </motion.p>

          <motion.p
            className="mt-5 max-w-md text-base leading-relaxed text-white/85 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease }}
          >
            Hand-picked journeys to the world&apos;s most breathtaking places. Flights, stays and
            experiences, carried by the wind in a single booking.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease }}
          >
            <a
              href="#packages"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-700 shadow-xl shadow-brand-950/20 transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Explore packages
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how"
              className="group inline-flex items-center gap-6 text-sm font-semibold text-white"
            >
              <span className="relative grid size-11 place-items-center rounded-full bg-white/15 ring-1 ring-white/40 backdrop-blur transition group-hover:bg-white/25">
                <span className="absolute inset-0 animate-ping rounded-full ring-1 ring-white/40 [animation-duration:2.5s]" />
                <Play className="size-4 fill-white" />
              </span>
              How it works
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto -mt-40 max-w-7xl px-4 sm:-mt-32 sm:px-6">
        <SearchPanel />
      </div>
    </section>
  );
}

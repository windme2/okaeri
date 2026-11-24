"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { DESTINATIONS, img } from "@/lib/data";
import { requestSearch } from "@/lib/search-bus";
import { SectionHeading } from "./reveal";

// Bento spans for the 6 destinations on large screens
const SPANS = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
];

export function Destinations({ home }: { home: string }) {

  return (
    <section id="destinations" className="mx-auto max-w-7xl scroll-mt-24 px-6 pt-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Trending destinations"
          title={
            <>
              Where the wind <br className="hidden sm:block" />
              is <span className="font-script text-5xl font-normal text-brand-600 sm:text-6xl">taking people</span>
            </>
          }
        />
        <p className="max-w-sm text-slate-500">
          From neon skylines to silent glaciers, these are the places our travelers can&apos;t stop booking this season.
        </p>
      </div>


      <div className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DESTINATIONS.map((d, i) => (
          <motion.a
            key={d.name}
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              requestSearch({ tab: "Flights", values: { from: home, to: d.placeId } });
            }}
            aria-label={`Search flights to ${d.name}`}
            initial={{ opacity: 0, y: 40, clipPath: "inset(12% 12% 12% 12% round 28px)" }}
            whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 28px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative overflow-hidden rounded-[28px] ${SPANS[i]}`}
          >
            <Image
              src={img(d.image, 1200)}
              alt={`${d.name}, ${d.country}`}
              fill
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-brand-950/80 via-brand-950/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">{d.country}</p>
                <h3 className="font-display text-2xl font-semibold sm:text-3xl">{d.name}</h3>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold ring-1 ring-white/30 backdrop-blur transition-all duration-500 group-hover:bg-white group-hover:text-brand-700">
                <span className="group-hover:hidden">{d.trips} trips</span>
                <span className="hidden group-hover:inline">Find flights</span>
                <ArrowRight className="size-3.5 -ml-1 w-0 opacity-0 transition-all duration-500 group-hover:ml-0 group-hover:w-3.5 group-hover:opacity-100" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useId } from "react";

/**
 * Paper plane drawn from the same silhouette as the logo icon (24px grid × 10):
 * nose N(220,20) · left-wing tip W(20,95) · fold root F(95,125) · keel tail T(95,200)
 * · keel crease K(131,156) · right-wing tip R(170,190).
 * Each folded face gets its own light, so it reads as creased paper rather than a flat icon.
 * The trail in the hero meets the rear of the centre fold, midway between F and K (113,140).
 */
export function PaperPlane({ className = "" }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const u = (name: string) => `url(#${id}-${name})`;

  return (
    <svg viewBox="0 0 240 220" className={className} aria-hidden>
      <defs>
        {/* big wing faces the light */}
        <linearGradient id={`${id}-wing`} x1="220" y1="20" x2="40" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f4f7fb" />
          <stop offset="1" stopColor="#e3e9f2" />
        </linearGradient>
        {/* soft shadow where the wing meets the centre fold */}
        <linearGradient id={`${id}-wing-ao`} x1="95" y1="125" x2="70" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5a72a0" stopOpacity="0.22" />
          <stop offset="1" stopColor="#5a72a0" stopOpacity="0" />
        </linearGradient>
        {/* body panel slopes down into the fold */}
        <linearGradient id={`${id}-body`} x1="220" y1="20" x2="100" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e9eef6" />
          <stop offset="1" stopColor="#c4d0e4" />
        </linearGradient>
        {/* keel flap folds underneath: darkest face */}
        <linearGradient id={`${id}-keel`} x1="95" y1="125" x2="120" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8da2c6" />
          <stop offset="1" stopColor="#a9badb" />
        </linearGradient>
        {/* far wing catches less light */}
        <linearGradient id={`${id}-far`} x1="220" y1="20" x2="160" y2="185" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f1f4f9" />
          <stop offset="1" stopColor="#d2dbea" />
        </linearGradient>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.36  0 0 0 0 0.5  0 0 0 0.07 0" result="tint" />
          <feComposite in="tint" in2="SourceGraphic" operator="in" result="grain" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>
      </defs>

      <g filter={u("grain")} strokeLinejoin="round">
        {/* far (right) wing */}
        <polygon points="220,20 131,156 170,190" fill={u("far")} stroke="#d2dbea" strokeWidth="0.6" />
        {/* body panel between the two folds */}
        <polygon points="220,20 95,125 131,156" fill={u("body")} stroke="#c4d0e4" strokeWidth="0.6" />
        {/* keel flap */}
        <polygon points="95,125 95,200 131,156" fill={u("keel")} stroke="#8da2c6" strokeWidth="0.6" />
        {/* near (left) wing */}
        <polygon points="220,20 20,95 95,125" fill={u("wing")} stroke="#e3e9f2" strokeWidth="0.6" />
        <polygon points="220,20 82,120 95,125" fill={u("wing-ao")} />

        {/* creases */}
        <line x1="220" y1="20" x2="95" y2="125" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="220" y1="20" x2="131" y2="156" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1" strokeLinecap="round" />
        <line x1="95" y1="125" x2="131" y2="156" stroke="#6f86b0" strokeOpacity="0.35" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`grid size-10 place-items-center rounded-xl ${
          light ? "bg-white/15 ring-1 ring-white/30 backdrop-blur" : "bg-brand-600 shadow-lg shadow-brand-600/30"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-5 -rotate-12 text-white" fill="currentColor" aria-hidden>
          <path d="M22 2 2 9.5l7.5 3L22 2Z" opacity=".95" />
          <path d="m22 2-12.5 10.5V20l3.6-4.4L17 19 22 2Z" opacity=".7" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block font-display text-xl font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>okaeri</span>
        <span className={`mt-1 block text-[11px] font-medium tracking-[0.2em] ${light ? "text-white/70" : "text-brand-600"}`}>おかえり</span>
      </span>
    </span>
  );
}

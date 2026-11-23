"use client";

import { useEffect, useRef, useState } from "react";

/** Open state for a popover that closes on outside click or Escape (without closing a parent modal). */
export function usePopover<T extends HTMLElement = HTMLDivElement>() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<T>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  return { open, setOpen, rootRef };
}

export const popoverMotion = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const },
};

export const popoverPanel =
  "absolute left-0 top-full z-50 mt-4 origin-top-left rounded-3xl bg-white p-2 text-ink shadow-[0_24px_60px_-20px_rgb(21_36_81/0.35)] ring-1 ring-slate-900/5";

/* Body scroll lock shared by overlays: counts holders so closing one overlay while
   another opens (e.g. package drawer → booking modal) doesn't unlock the page. */
let scrollLocks = 0;
export function useScrollLock() {
  useEffect(() => {
    scrollLocks += 1;
    document.body.style.overflow = "hidden";
    return () => {
      scrollLocks -= 1;
      if (scrollLocks === 0) document.body.style.overflow = "";
    };
  }, []);
}

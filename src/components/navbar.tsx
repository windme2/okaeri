"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./paper-plane";
import { CurrencySwitch, WishlistButton } from "./nav-extras";

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "Packages", href: "#packages" },
  { label: "Destinations", href: "#destinations" },
  { label: "Pricing", href: "#pricing" },
  { label: "How it works", href: "#how" },
  { label: "Stories", href: "#stories" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 600 && y > prev && !mobile);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      animate={{ y: hidden ? -110 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6 ${
          scrolled ? "bg-white/75 shadow-soft ring-1 ring-brand-100 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <a href="#top" aria-label="Okaeri home">
          <Logo light={!scrolled} />
        </a>

        <ul className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
          {LINKS.map((l) => (
            <li key={l.label} className="relative">
              <a
                href={l.href}
                onMouseEnter={() => setHovered(l.label)}
                className={`relative z-10 block px-4 py-2 text-sm font-medium transition-colors ${
                  scrolled ? "text-slate-700 hover:text-brand-700" : "text-white/90 hover:text-white"
                }`}
              >
                {l.label}
              </a>
              {hovered === l.label && (
                <motion.span
                  layoutId="nav-hover"
                  className={`absolute inset-0 rounded-full ${scrolled ? "bg-brand-50" : "bg-white/15"}`}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <CurrencySwitch light={!scrolled} />
          <WishlistButton light={!scrolled} />
          <button
            onClick={() => setMobile((m) => !m)}
            className={`grid size-10 place-items-center rounded-full lg:hidden ${scrolled ? "text-ink" : "text-white"}`}
            aria-label="Toggle menu"
            aria-expanded={mobile}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobile && (
          <motion.ul
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl bg-white/95 p-2 shadow-lift backdrop-blur-xl lg:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.li key={l.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                <a
                  href={l.href}
                  onClick={() => setMobile(false)}
                  className="block rounded-xl px-4 py-3 font-medium text-ink hover:bg-brand-50"
                >
                  {l.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

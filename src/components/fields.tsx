"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { useId, useState } from "react";
import { getPlace, searchPlaces } from "@/lib/places";
import { popoverMotion, popoverPanel, usePopover } from "./popover";

const inputClass =
  "w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-slate-400";

/**
 * City autocomplete. `value` is a place id. Remount with `key={value}` when the id changes
 * from outside (e.g. swapping From/To) so the text resets.
 */
export function PlaceInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
}) {
  const current = getPlace(value);
  const { open, setOpen, rootRef } = usePopover();
  const [query, setQuery] = useState(current?.city ?? "");
  const [active, setActive] = useState(0);
  const listId = useId();
  const typed = current && query === current.city ? "" : query;
  const options = searchPlaces(typed);

  const choose = (id: string) => {
    const p = getPlace(id)!;
    setQuery(p.city);
    onChange(id);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const n = options.length;
      setActive((i) => (n ? (i + (e.key === "ArrowDown" ? 1 : -1) + n) % n : 0));
    } else if (e.key === "Enter" && open && options[active]) {
      e.preventDefault();
      choose(options[active].id);
    }
  };

  return (
    <div ref={rootRef} className="relative flex w-full items-center gap-2">
      <MapPin className="size-4 shrink-0 text-brand-500" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
          if (current) onChange(""); // typing clears the confirmed choice until one is picked again
        }}
        onFocus={(e) => {
          e.currentTarget.select();
          setOpen(true);
        }}
        onKeyDown={onKey}
        placeholder={placeholder}
        className={inputClass}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
      />
      {current && <span className="shrink-0 text-[11px] font-semibold tracking-wider text-slate-400">{current.code}</span>}

      <AnimatePresence>
        {open && (
          <motion.ul id={listId} role="listbox" {...popoverMotion} className={`${popoverPanel} -left-6 w-72`}>
            {options.length === 0 && <li className="px-3 py-3 text-sm text-slate-500">No matching city yet. Try another one.</li>}
            {options.map((p, i) => (
              <li key={p.id} role="option" aria-selected={p.id === value}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(p.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                    i === active ? "bg-brand-50" : ""
                  }`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-mist text-brand-600">
                    <MapPin className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.city}</span>
                    <span className="block truncate text-xs text-slate-500">{p.country}</span>
                  </span>
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400">{p.code}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Dropdown that always opens downward, styled like the other popovers. */
export function Select({
  value,
  options,
  onChange,
  icon: Icon,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const { open, setOpen, rootRef } = usePopover();
  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-left text-sm font-semibold text-ink outline-none"
      >
        <Icon className="size-4 shrink-0 text-brand-500" />
        <span className="flex-1 truncate">{value}</span>
        <ChevronDown className={`size-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul role="listbox" {...popoverMotion} className={`${popoverPanel} -left-4 w-60`}>
            {options.map((o) => (
              <li key={o} role="option" aria-selected={o === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm transition hover:bg-brand-50 ${
                    o === value ? "font-semibold text-brand-700" : "text-ink"
                  }`}
                >
                  {o}
                  {o === value && <Check className="size-4" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

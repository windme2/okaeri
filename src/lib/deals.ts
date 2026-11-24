import { distanceKm, getPlace, type Place } from "./places";

export type SearchTab = "Flights" | "Hotels" | "Cars" | "Experiences";

export type SearchQuery = {
  tab: SearchTab;
  from?: string;
  to?: string;
  place?: string;
  dropoff?: string;
  start?: string;
  end?: string;
  /** e.g. "2 Adults", "SUV", "Outdoor" : the tab's select field. */
  option?: string;
};

export type Deal = {
  id: string;
  title: string;
  initials: string;
  hue: number;
  details: string[];
  badge?: string;
  rating?: number;
  /** USD. Per person for flights/experiences, per stay/rental for hotels/cars. */
  price: number;
  priceNote: string;
  perPerson: boolean;
  minutes?: number;
  timeline?: { depart: string; arrive: string; plusDays: number; duration: string; stops: string; route: string };
};

export type SearchResult = { deals: Deal[]; summary: string; destination?: Place; origin?: Place };

/* deterministic RNG so the same search shows the same deals */
function seeded(text: string) {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86_400_000;
function nightsBetween(start?: string, end?: string) {
  if (!start || !end) return null;
  const n = Math.round((Date.parse(end) - Date.parse(start)) / DAY);
  return n > 0 ? n : null;
}
const hhmm = (min: number) =>
  `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(Math.round(min % 60)).padStart(2, "0")}`;
const dur = (min: number) => `${Math.floor(min / 60)}h ${String(Math.round(min % 60)).padStart(2, "0")}m`;
const initials = (s: string) =>
  s
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const AIRLINES = [
  { name: "Skylark Air", budget: false, hue: 215 },
  { name: "Pacific Crane", budget: false, hue: 195 },
  { name: "Aurora Airways", budget: false, hue: 265 },
  { name: "Sakura Wings", budget: false, hue: 340 },
  { name: "Northwind", budget: false, hue: 170 },
  { name: "Monsoon Jet", budget: true, hue: 25 },
  { name: "Hop Lite", budget: true, hue: 45 },
];
const HUBS = ["SIN", "HKG", "DXB", "ICN", "TPE", "DOH", "IST", "FRA"];

function flights(q: SearchQuery, rnd: () => number): SearchResult | string {
  const from = getPlace(q.from);
  const to = getPlace(q.to);
  if (!from || !to) return "Choose where you're flying from and to.";
  if (from.id === to.id) return "Origin and destination can't be the same city.";
  const km = distanceKm(from, to);
  const directMin = (km / 820) * 60 + 35;
  const base = 55 + km * 0.072;

  const deals: Deal[] = Array.from({ length: 7 }, (_, i) => {
    const air = AIRLINES[Math.floor(rnd() * AIRLINES.length)];
    const stops = km > 9500 ? 1 + Math.round(rnd() * 0.6) : km < 2200 ? 0 : rnd() < 0.55 ? 0 : 1;
    const minutes = directMin * (0.96 + rnd() * 0.09) * (stops ? 1.12 : 1) + stops * (80 + rnd() * 170);
    const depart = 6 * 60 + Math.floor(rnd() * 17) * 60 + (rnd() < 0.5 ? 0 : 35);
    const arrive = depart + minutes; // shown in origin time for simplicity
    const price = base * (stops ? 0.8 : 1.05) * (air.budget ? 0.74 : 1) * (0.88 + rnd() * 0.32);
    const via = stops ? HUBS.filter((h) => h !== from.code && h !== to.code)[Math.floor(rnd() * 6)] : "";
    return {
      id: `f${i}`,
      title: air.name,
      initials: initials(air.name),
      hue: air.hue,
      details: [air.budget ? "Carry-on only" : "20 kg checked bag", rnd() < 0.5 ? "Free seat selection" : "Meal included"],
      price: Math.round(price),
      priceNote: "per traveler",
      perPerson: true,
      minutes,
      timeline: {
        depart: hhmm(depart),
        arrive: hhmm(arrive),
        plusDays: Math.floor(arrive / (24 * 60)),
        duration: dur(minutes),
        stops: stops === 0 ? "Direct" : stops === 1 ? `1 stop · ${via}` : `2 stops`,
        route: `${from.code} → ${to.code}`,
      },
    };
  });
  return { deals, summary: `${from.city} to ${to.city}`, destination: to, origin: from };
}

const HOTEL_NAMES = [
  "The {c} Grand",
  "Hoshi Boutique Stay",
  "Casa {c}",
  "The Lantern House",
  "Azure Bay Resort",
  "Maple & Stone Suites",
  "{c} Riverside Hotel",
  "Little Courtyard Inn",
];

function hotels(q: SearchQuery, rnd: () => number): SearchResult | string {
  const city = getPlace(q.place);
  if (!city) return "Choose a destination from the list.";
  const nights = nightsBetween(q.start, q.end) ?? 3;
  const tierBase = { 1: 38, 2: 95, 3: 180 }[city.tier];
  const deals: Deal[] = HOTEL_NAMES.map((n, i) => {
    const name = n.replace("{c}", city.city.split(",")[0]);
    const stars = 3 + Math.floor(rnd() * 3);
    const nightly = tierBase * (0.55 + (stars - 3) * 0.55) * (0.85 + rnd() * 0.4);
    const rating = Math.round((7.6 + rnd() * 2.1) * 10) / 10;
    return {
      id: `h${i}`,
      title: name,
      initials: initials(name),
      hue: 190 + Math.floor(rnd() * 80),
      details: [`${stars}-star hotel`, `${(0.3 + rnd() * 4).toFixed(1)} km from centre`, rnd() < 0.6 ? "Free cancellation" : "Breakfast included"],
      rating,
      price: Math.round(nightly * nights),
      priceNote: `${nights} night${nights > 1 ? "s" : ""} total`,
      perPerson: false,
    };
  });
  return { deals, summary: `Stays in ${city.city}`, destination: city };
}

const CARS = [
  { cls: "Compact", model: "Toyota Yaris", seats: 5, bags: 2, k: 1 },
  { cls: "Compact", model: "Volkswagen Golf", seats: 5, bags: 2, k: 1.08 },
  { cls: "SUV", model: "Toyota RAV4 Hybrid", seats: 5, bags: 4, k: 1.55 },
  { cls: "SUV", model: "Honda CR-V", seats: 5, bags: 4, k: 1.5 },
  { cls: "Convertible", model: "Mazda MX-5", seats: 2, bags: 1, k: 1.7 },
  { cls: "Electric", model: "Tesla Model 3", seats: 5, bags: 3, k: 1.65 },
  { cls: "Electric", model: "Kia EV6", seats: 5, bags: 3, k: 1.6 },
];
const RENTALS = ["Roadly", "Wayfarer Rentals", "Drive & Go", "Kaze Cars"];

function cars(q: SearchQuery, rnd: () => number): SearchResult | string {
  const pick = getPlace(q.place);
  if (!pick) return "Choose a pick-up location from the list.";
  const drop = getPlace(q.dropoff) ?? pick;
  const days = nightsBetween(q.start, q.end) ?? 3;
  const daily = { 1: 22, 2: 38, 3: 55 }[pick.tier];
  const oneWay = drop.id !== pick.id ? Math.round(60 + distanceKm(pick, drop) * 0.15) : 0;
  const list = q.option && q.option !== "Any" ? CARS.filter((c) => c.cls === q.option) : CARS;
  const deals: Deal[] = list.flatMap((c, i) =>
    RENTALS.filter(() => rnd() < 0.45)
      .slice(0, 2)
      .map((r, j) => ({
        id: `c${i}-${j}`,
        title: `${c.model} or similar`,
        initials: initials(r),
        hue: 150 + Math.floor(rnd() * 120),
        details: [c.cls, `${c.seats} seats · ${c.bags} bags`, r, ...(oneWay ? [`One-way to ${drop.city}`] : ["Unlimited km"])],
        rating: Math.round((7.8 + rnd() * 1.8) * 10) / 10,
        price: Math.round(daily * c.k * days * (0.85 + rnd() * 0.3) + oneWay),
        priceNote: `${days} day${days > 1 ? "s" : ""} total`,
        perPerson: false,
      })),
  );
  if (!deals.length) return "No cars of that type here. Try “Any”.";
  return { deals, summary: drop.id !== pick.id ? `${pick.city} to ${drop.city}` : `Cars in ${pick.city}`, destination: pick };
}

const ACTIVITIES: Record<string, string[]> = {
  "Food & drink": ["Street food night walk", "Cooking class with a local chef", "Market-to-table tasting tour"],
  Outdoor: ["Sunrise viewpoint hike", "Kayak & snorkel half-day", "Countryside e-bike ride"],
  "Culture & history": ["Old town heritage walk", "Temples & museums day pass", "Craft workshop with an artisan"],
  Wellness: ["Spa & hot-spring afternoon", "Sunrise yoga by the water", "Forest bathing retreat"],
};

function experiences(q: SearchQuery, rnd: () => number): SearchResult | string {
  const city = getPlace(q.place);
  if (!city) return "Choose a destination from the list.";
  const types = q.option && ACTIVITIES[q.option] ? [q.option] : Object.keys(ACTIVITIES);
  const base = { 1: 18, 2: 45, 3: 75 }[city.tier];
  const deals: Deal[] = types.flatMap((t) =>
    ACTIVITIES[t].map((a, i) => {
      const hours = 2 + Math.floor(rnd() * 6);
      return {
        id: `${t}-${i}`,
        title: `${a} · ${city.city.split(",")[0]}`,
        initials: initials(a),
        hue: 20 + Math.floor(rnd() * 300),
        details: [t, `${hours} hours`, rnd() < 0.5 ? "Small group" : "Hotel pickup"],
        rating: Math.round((4.4 + rnd() * 0.6) * 10) / 10,
        price: Math.round(base * (0.6 + rnd() * 1.1) * (hours / 4 + 0.5)),
        priceNote: "per traveler",
        perPerson: true,
      };
    }),
  );
  return { deals, summary: `Things to do in ${city.city}`, destination: city };
}

export function findDeals(q: SearchQuery): SearchResult | string {
  const rnd = seeded(JSON.stringify(q));
  const result = { Flights: flights, Hotels: hotels, Cars: cars, Experiences: experiences }[q.tab](q, rnd);
  if (typeof result === "string") return result;
  // label the best offers
  const byPrice = [...result.deals].sort((a, b) => a.price - b.price);
  byPrice[0].badge = "Cheapest";
  if (q.tab === "Flights") {
    const fastest = [...result.deals].sort((a, b) => (a.minutes ?? 0) - (b.minutes ?? 0))[0];
    fastest.badge = fastest.badge ? "Cheapest & fastest" : "Fastest";
  } else {
    const top = [...result.deals].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
    if (!top.badge) top.badge = "Top rated";
  }
  return result;
}

export type SortKey = "best" | "price" | "fast" | "rating";
export function sortDeals(deals: Deal[], key: SortKey) {
  const list = [...deals];
  if (key === "price") return list.sort((a, b) => a.price - b.price);
  if (key === "fast") return list.sort((a, b) => (a.minutes ?? 0) - (b.minutes ?? 0));
  if (key === "rating") return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  // "best": balance price with duration (flights) or rating (others)
  const maxP = Math.max(...list.map((d) => d.price));
  const maxM = Math.max(...list.map((d) => d.minutes ?? 1));
  const quality = (d: Deal) => (d.rating ? (d.rating > 5 ? d.rating / 10 : d.rating / 5) : 0.8);
  const score = (d: Deal) => d.price / maxP + (d.minutes ? d.minutes / maxM : (1 - quality(d)) * 3);
  return list.sort((a, b) => score(a) - score(b));
}

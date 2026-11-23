import { IMAGES } from "./data";

export type Place = {
  id: string;
  city: string;
  country: string;
  code: string;
  lat: number;
  lng: number;
  /** 1 = budget … 3 = expensive; scales hotel, car and activity prices. */
  tier: 1 | 2 | 3;
  image?: string;
};

export const PLACES: Place[] = [
  { id: "bkk", city: "Bangkok", country: "Thailand", code: "BKK", lat: 13.69, lng: 100.75, tier: 1 },
  { id: "cnx", city: "Chiang Mai", country: "Thailand", code: "CNX", lat: 18.77, lng: 98.96, tier: 1 },
  { id: "hkt", city: "Phuket", country: "Thailand", code: "HKT", lat: 8.11, lng: 98.31, tier: 1 },
  { id: "tyo", city: "Tokyo", country: "Japan", code: "HND", lat: 35.68, lng: 139.69, tier: 3, image: "1490806843957-31f4c9a91c65" },
  { id: "osa", city: "Osaka", country: "Japan", code: "KIX", lat: 34.69, lng: 135.5, tier: 2 },
  { id: "kyo", city: "Kyoto", country: "Japan", code: "UKY", lat: 35.01, lng: 135.77, tier: 2, image: "1493976040374-85c8e12f0c0e" },
  { id: "sel", city: "Seoul", country: "South Korea", code: "ICN", lat: 37.57, lng: 126.98, tier: 2 },
  { id: "tpe", city: "Taipei", country: "Taiwan", code: "TPE", lat: 25.03, lng: 121.56, tier: 2 },
  { id: "hkg", city: "Hong Kong", country: "China", code: "HKG", lat: 22.32, lng: 114.17, tier: 3 },
  { id: "sin", city: "Singapore", country: "Singapore", code: "SIN", lat: 1.35, lng: 103.82, tier: 3 },
  { id: "dps", city: "Bali", country: "Indonesia", code: "DPS", lat: -8.65, lng: 115.22, tier: 1, image: "1537996194471-e657df975ab4" },
  { id: "syd", city: "Sydney", country: "Australia", code: "SYD", lat: -33.87, lng: 151.21, tier: 3 },
  { id: "mle", city: "Malé", country: "Maldives", code: "MLE", lat: 4.18, lng: 73.51, tier: 3, image: "1514282401047-d79a71a590e8" },
  { id: "dxb", city: "Dubai", country: "UAE", code: "DXB", lat: 25.2, lng: 55.27, tier: 3, image: "1512453979798-5ea266f8880c" },
  { id: "par", city: "Paris", country: "France", code: "CDG", lat: 48.86, lng: 2.35, tier: 3, image: "1502602898657-3e91760cbb34" },
  { id: "lon", city: "London", country: "United Kingdom", code: "LHR", lat: 51.51, lng: -0.13, tier: 3 },
  { id: "rom", city: "Rome", country: "Italy", code: "FCO", lat: 41.9, lng: 12.5, tier: 2 },
  { id: "jtr", city: "Santorini", country: "Greece", code: "JTR", lat: 36.39, lng: 25.46, tier: 2, image: "1570077188670-e3a8d69ac5ff" },
  { id: "zrh", city: "Zurich", country: "Switzerland", code: "ZRH", lat: 47.37, lng: 8.54, tier: 3, image: "1530122037265-a5f1f91d3b99" },
  { id: "cha", city: "Chamonix", country: "France", code: "GVA", lat: 45.92, lng: 6.87, tier: 3, image: "1506905925346-21bda4d32df4" },
  { id: "vce", city: "Dolomites", country: "Italy", code: "VCE", lat: 46.69, lng: 12.08, tier: 2, image: "1476514525535-07fb3b4ae5f1" },
  { id: "rek", city: "Reykjavík", country: "Iceland", code: "KEF", lat: 64.15, lng: -21.94, tier: 3, image: "1504893524553-b855bce32c67" },
  { id: "nyc", city: "New York", country: "United States", code: "JFK", lat: 40.71, lng: -74.01, tier: 3 },
  { id: "lax", city: "Los Angeles", country: "United States", code: "LAX", lat: 34.05, lng: -118.24, tier: 3 },
  { id: "slc", city: "Moab, Utah", country: "United States", code: "SLC", lat: 38.57, lng: -109.55, tier: 2, image: "1500530855697-b586d89ba3ee" },
  { id: "yyc", city: "Banff", country: "Canada", code: "YYC", lat: 51.18, lng: -115.57, tier: 2, image: "1503614472-8c93d56e92ce" },
  { id: "cun", city: "Tulum", country: "Mexico", code: "CUN", lat: 20.21, lng: -87.47, tier: 2, image: "1507525428034-b723cf961d3e" },
];

const BY_ID = new Map(PLACES.map((p) => [p.id, p]));
export const getPlace = (id: string | undefined) => (id ? BY_ID.get(id) : undefined);
export const placeImage = (p: Place | undefined) => p?.image ?? IMAGES.windowSunset;

export function searchPlaces(query: string, limit = 6): Place[] {
  const q = query.trim().toLowerCase();
  if (!q) return PLACES.slice(0, limit);
  return PLACES.filter(
    (p) => p.city.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.code.toLowerCase() === q,
  )
    .sort((a, b) => Number(!a.city.toLowerCase().startsWith(q)) - Number(!b.city.toLowerCase().startsWith(q)))
    .slice(0, limit);
}

/** Great-circle distance in km. */
export function distanceKm(a: Place, b: Place) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

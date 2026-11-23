export const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  heroSky: "1436491865332-7a61a109cc05",
  roadTrip: "1469854523086-cc02fe5d8800",
  windowSunset: "1488085061387-422e29b40080",
};

export type Category = "Beach" | "Mountain" | "Culture";

export type TravelPackage = {
  id: string;
  title: string;
  country: string;
  days: number;
  nights: number;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: Category;
  tag?: string;
  /** destination city in PLACES, used for the route on the boarding pass */
  placeId: string;
};

export const PACKAGES: TravelPackage[] = [
  { id: "greece", placeId: "jtr", title: "Greek Islands Escape", country: "Santorini, Greece", days: 6, nights: 5, price: 1699, rating: 4.8, reviews: 412, image: "1570077188670-e3a8d69ac5ff", category: "Beach", tag: "Bestseller" },
  { id: "maldives", placeId: "mle", title: "Maldives Paradise", country: "Malé Atoll, Maldives", days: 5, nights: 4, price: 2299, rating: 4.9, reviews: 538, image: "1514282401047-d79a71a590e8", category: "Beach", tag: "Overwater villa" },
  { id: "rockies", placeId: "yyc", title: "Canadian Rockies", country: "Banff, Canada", days: 7, nights: 6, price: 1799, rating: 4.7, reviews: 296, image: "1503614472-8c93d56e92ce", category: "Mountain" },
  { id: "japan", placeId: "tyo", title: "Japan Discovery", country: "Tokyo & Fuji, Japan", days: 8, nights: 7, price: 2199, rating: 4.9, reviews: 671, image: "1490806843957-31f4c9a91c65", category: "Culture", tag: "Sakura season" },
  { id: "bali", placeId: "dps", title: "Bali Temple Trail", country: "Ubud, Indonesia", days: 6, nights: 5, price: 799, rating: 4.8, reviews: 389, image: "1537996194471-e657df975ab4", category: "Culture" },
  { id: "iceland", placeId: "rek", title: "Iceland Wild Canyons", country: "Reykjavík, Iceland", days: 6, nights: 5, price: 1899, rating: 4.8, reviews: 214, image: "1504893524553-b855bce32c67", category: "Mountain", tag: "New" },
  { id: "swiss", placeId: "zrh", title: "Swiss Alpine Valleys", country: "Lauterbrunnen, Switzerland", days: 7, nights: 6, price: 2399, rating: 4.9, reviews: 322, image: "1530122037265-a5f1f91d3b99", category: "Mountain" },
  { id: "dolomites", placeId: "vce", title: "Dolomites Lakes", country: "Lago di Braies, Italy", days: 5, nights: 4, price: 1399, rating: 4.7, reviews: 187, image: "1476514525535-07fb3b4ae5f1", category: "Mountain" },
];

export const DESTINATIONS = [
  { placeId: "par", name: "Paris", country: "France", image: "1502602898657-3e91760cbb34", trips: 128 },
  { placeId: "kyo", name: "Kyoto", country: "Japan", image: "1493976040374-85c8e12f0c0e", trips: 96 },
  { placeId: "dxb", name: "Dubai", country: "UAE", image: "1512453979798-5ea266f8880c", trips: 84 },
  { placeId: "cun", name: "Tulum", country: "Mexico", image: "1507525428034-b723cf961d3e", trips: 62 },
  { placeId: "cha", name: "Mont Blanc", country: "France · Italy", image: "1506905925346-21bda4d32df4", trips: 41 },
  { placeId: "slc", name: "Utah", country: "United States", image: "1500530855697-b586d89ba3ee", trips: 57 },
];

export const PLANS = [
  {
    name: "Economy",
    blurb: "Great value for smart travelers",
    price: 499,
    features: ["Economy class flights", "20kg baggage", "Standard hotels", "Airport transfers"],
  },
  {
    name: "Premium",
    blurb: "Comfort and convenience",
    price: 899,
    featured: true,
    features: ["Premium economy flights", "25kg baggage", "4-star hotels", "Airport transfers", "City tours"],
  },
  {
    name: "Business",
    blurb: "Luxury and flexibility",
    price: 1499,
    features: ["Business class flights", "30kg baggage", "5-star hotels", "Airport transfers", "City tours", "Lounge access"],
  },
  {
    name: "Luxury",
    blurb: "The ultimate travel experience",
    price: 2499,
    features: ["First class flights", "35kg baggage", "Premium hotels & villas", "Private transfers", "Exclusive experiences", "24/7 concierge"],
  },
];

export const TESTIMONIALS = [
  {
    quote: "The best travel experience we've ever had. Every transfer, every hotel, every little detail was perfectly organized.",
    name: "Sarah J.",
    place: "New York, USA",
    trip: "Greek Islands Escape",
    avatar: "1494790108377-be9c29b29330",
  },
  {
    quote: "Okaeri found us a cherry-blossom itinerary in Japan that felt handcrafted. Their concierge answered at 3am without a sigh.",
    name: "Daniel K.",
    place: "London, UK",
    trip: "Japan Discovery",
    avatar: "1500648767791-00dcc994a43e",
  },
  {
    quote: "Booked the Maldives in five minutes and paid less than anywhere else. The overwater villa was a dream come true.",
    name: "Mia L.",
    place: "Melbourne, Australia",
    trip: "Maldives Paradise",
    avatar: "1544005313-94ddf0286df2",
  },
];

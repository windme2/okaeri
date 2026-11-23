import type { TravelPackage } from "./data";

export type Day = { title: string; text: string };

/** Day-by-day plan for each package (one entry per day). */
export const ITINERARIES: Record<string, Day[]> = {
  greece: [
    { title: "Arrive in Santorini", text: "Private transfer to your cliffside hotel in Imerovigli. Evening free to settle in." },
    { title: "Fira to Oia walk", text: "A guided caldera-rim hike, ending with the famous Oia sunset." },
    { title: "Sailing the caldera", text: "Catamaran day trip with hot springs, swimming stops and a seafood lunch on board." },
    { title: "Wine and villages", text: "Tastings at two family wineries, then a slow afternoon in Pyrgos." },
    { title: "Beach day", text: "Red Beach and Perissa black sand. Dinner in Ammoudi Bay." },
    { title: "Departure", text: "Breakfast with a view, then your transfer to the airport." },
  ],
  maldives: [
    { title: "Arrive in Malé", text: "Seaplane transfer over the atolls to your overwater villa." },
    { title: "House reef snorkel", text: "Guided snorkel with turtles and reef sharks, right off the jetty." },
    { title: "Sandbank picnic", text: "A private boat to an empty sandbank for lunch and swimming." },
    { title: "Spa and sunset cruise", text: "A slow morning at the spa. Dolphin-spotting cruise at dusk." },
    { title: "Departure", text: "Seaplane back to Malé for your flight home." },
  ],
  rockies: [
    { title: "Arrive in Calgary", text: "Pick up your car and drive the scenic route to Banff." },
    { title: "Lake Louise", text: "Lakeshore trail to the Fairview lookout, afternoon canoe on the lake." },
    { title: "Moraine Lake sunrise", text: "Early shuttle for sunrise, then the Larch Valley hike." },
    { title: "Icefields Parkway", text: "A full day on one of the world's great drives, with a stop at Peyto Lake." },
    { title: "Athabasca Glacier", text: "Walk on the glacier with a guide and visit the Skywalk." },
    { title: "Banff Hot Springs", text: "Gondola up Sulphur Mountain, then a soak in the hot springs." },
    { title: "Departure", text: "Drive back to Calgary for your flight." },
  ],
  japan: [
    { title: "Arrive in Tokyo", text: "Airport pickup and an evening walk through Shinjuku's lanes." },
    { title: "Old and new Tokyo", text: "Asakusa and Senso-ji in the morning, Shibuya and Harajuku in the afternoon." },
    { title: "Hakone and Mount Fuji", text: "Lake Ashi cruise and ropeway views of Fuji. Night at a ryokan with onsen." },
    { title: "Bullet train to Kyoto", text: "Shinkansen ride, then a lantern-lit evening in Gion." },
    { title: "Kyoto temples", text: "Fushimi Inari at dawn, Kiyomizu-dera and the Higashiyama streets." },
    { title: "Arashiyama", text: "Bamboo grove, the monkey park and a tofu lunch by the river." },
    { title: "Nara day trip", text: "Todai-ji's great Buddha and the friendly deer of Nara Park." },
    { title: "Departure", text: "Transfer to Kansai Airport." },
  ],
  bali: [
    { title: "Arrive in Bali", text: "Transfer to a jungle villa in Ubud." },
    { title: "Rice terraces", text: "Morning at Tegallalang, then Tirta Empul water temple." },
    { title: "Mount Batur sunrise", text: "Guided sunrise trek, followed by natural hot springs." },
    { title: "Temple trail", text: "Besakih Mother Temple and the Tirta Gangga water palace." },
    { title: "Uluwatu", text: "Clifftop temple at sunset and the Kecak fire dance." },
    { title: "Departure", text: "Breakfast, then your airport transfer." },
  ],
  iceland: [
    { title: "Arrive in Reykjavík", text: "Blue Lagoon on the way in, then dinner in the old harbour." },
    { title: "Golden Circle", text: "Þingvellir, the Geysir field and Gullfoss waterfall." },
    { title: "South Coast", text: "Seljalandsfoss, Skógafoss and the black sands of Reynisfjara." },
    { title: "Fjaðrárgljúfur canyon", text: "Canyon walk and a glacier hike on Sólheimajökull." },
    { title: "Northern lights", text: "A free day in Reykjavík and an evening aurora hunt (weather permitting)." },
    { title: "Departure", text: "Transfer to Keflavík Airport." },
  ],
  swiss: [
    { title: "Arrive in Zurich", text: "Scenic train to Lauterbrunnen in the Bernese Oberland." },
    { title: "Valley of waterfalls", text: "Staubbach and Trümmelbach falls, with a lunch stop in Wengen." },
    { title: "Jungfraujoch", text: "The cogwheel railway to the Top of Europe and its ice palace." },
    { title: "Mürren and Schilthorn", text: "Car-free village walk, then the revolving summit restaurant." },
    { title: "Lake Brienz", text: "Boat cruise to Iseltwald and Giessbach Falls." },
    { title: "Grindelwald First", text: "Cliff Walk, Bachalpsee lake and the mountain cart ride down." },
    { title: "Departure", text: "Train back to Zurich for your flight." },
  ],
  dolomites: [
    { title: "Arrive in Venice", text: "Drive north into the mountains to your chalet near Braies." },
    { title: "Lago di Braies", text: "Rowboat on the lake and the lakeside loop trail." },
    { title: "Tre Cime di Lavaredo", text: "The classic hike around the three peaks, with a rifugio lunch." },
    { title: "Seceda ridgeline", text: "Cable car from Ortisei and a walk along the dramatic ridge." },
    { title: "Departure", text: "Breakfast in the valley, then the drive to Venice airport." },
  ],
};

/** What's in the price, from the package's length plus a few signature extras. */
export function inclusions(p: TravelPackage) {
  const extras: Record<string, string[]> = {
    greece: ["Caldera catamaran cruise", "Winery tastings"],
    maldives: ["Seaplane transfers", "Overwater villa", "Full board"],
    rockies: ["SUV rental for 7 days", "Parks Canada pass"],
    japan: ["7-day JR Pass", "One night in a ryokan"],
    bali: ["Private driver", "Sunrise trek guide"],
    iceland: ["Blue Lagoon entry", "Aurora tour"],
    swiss: ["Swiss Travel Pass", "Jungfraujoch ticket"],
    dolomites: ["Rental car", "Cable car tickets"],
  };
  return [
    "Return flights from Bangkok",
    `${p.nights} nights' accommodation`,
    "Daily breakfast",
    "Airport transfers",
    ...(extras[p.id] ?? []),
    "24/7 trip support",
  ];
}

export const NOT_INCLUDED = ["Travel insurance", "Visa fees", "Lunches and dinners unless stated"];

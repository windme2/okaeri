import type { SearchTab } from "./deals";

/** Lets any section (e.g. the destinations map) fill in and run the hero search. */
export type SearchRequest = { tab: SearchTab; values: Record<string, string> };

const EVENT = "okaeri:search";

export function requestSearch(request: SearchRequest) {
  window.dispatchEvent(new CustomEvent<SearchRequest>(EVENT, { detail: request }));
}

export function onSearchRequest(handler: (request: SearchRequest) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<SearchRequest>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

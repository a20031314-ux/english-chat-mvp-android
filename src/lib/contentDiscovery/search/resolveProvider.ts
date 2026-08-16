import { WebSearchProvider } from "@/lib/contentDiscovery/search/providers/webSearchProvider";
import { YoutubeSearchProvider } from "@/lib/contentDiscovery/search/providers/youtubeSearchProvider";
import type { SearchProvider } from "@/lib/contentDiscovery/search/types";

export type ContentDiscoveryProviderMode = "search" | "youtube";

/**
 * search = SearchProvider pipeline (web search engine, else YouTube search API)
 * youtube | crawler = legacy YouTube discovery path (kept as fallback)
 */
export function contentDiscoveryProviderMode(): ContentDiscoveryProviderMode {
  const value = process.env.CONTENT_DISCOVERY_PROVIDER?.trim().toLowerCase();
  if (value === "youtube" || value === "crawler") return "youtube";
  return "search";
}

export function resolveSearchProvider(): SearchProvider | null {
  const engine = process.env.CONTENT_DISCOVERY_SEARCH_ENGINE
    ?.trim()
    .toLowerCase();
  if (engine === "youtube") {
    return process.env.YOUTUBE_API_KEY?.trim()
      ? new YoutubeSearchProvider()
      : null;
  }
  if (engine === "brave" && process.env.BRAVE_SEARCH_API_KEY?.trim()) {
    return new WebSearchProvider("brave");
  }
  if (
    engine === "google_cse" &&
    (process.env.GOOGLE_CSE_API_KEY?.trim() ||
      process.env.GOOGLE_SEARCH_API_KEY?.trim()) &&
    process.env.GOOGLE_CSE_ID?.trim()
  ) {
    return new WebSearchProvider("google_cse");
  }
  if (process.env.BRAVE_SEARCH_API_KEY?.trim()) {
    return new WebSearchProvider("brave");
  }
  if (
    (process.env.GOOGLE_CSE_API_KEY?.trim() ||
      process.env.GOOGLE_SEARCH_API_KEY?.trim()) &&
    process.env.GOOGLE_CSE_ID?.trim()
  ) {
    return new WebSearchProvider("google_cse");
  }
  if (process.env.YOUTUBE_API_KEY?.trim()) {
    return new YoutubeSearchProvider();
  }
  return null;
}

export function searchProviderUsesWebEngine(provider: SearchProvider): boolean {
  return provider.id === "brave" || provider.id === "google_cse";
}

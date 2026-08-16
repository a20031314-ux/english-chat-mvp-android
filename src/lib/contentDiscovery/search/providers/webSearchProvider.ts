import { extractYoutubeVideoId } from "../supportedVideo";
import type {
  SearchProvider,
  VideoSearchQuery,
  VideoSearchResult,
} from "@/lib/contentDiscovery/search/types";

type BraveWebResult = {
  title?: string;
  url?: string;
  description?: string;
  thumbnail?: { src?: string };
  meta_url?: { hostname?: string };
};

type GoogleCseItem = {
  title?: string;
  link?: string;
  snippet?: string;
  pagemap?: {
    cse_thumbnail?: Array<{ src?: string }>;
    videoobject?: Array<{ thumbnailurl?: string }>;
    metatags?: Array<{ "og:image"?: string; "og:video:tag"?: string }>;
  };
};

function asVideoResult(input: {
  title?: string;
  url?: string;
  snippet?: string;
  thumbnailUrl?: string;
  source?: string;
  searchQuery: string;
}): VideoSearchResult | null {
  const url = input.url?.trim() || "";
  const title = input.title?.replace(/\s+/g, " ").trim() || "";
  if (!url || !title) return null;
  if (!extractYoutubeVideoId(url)) return null;
  return {
    title,
    url,
    snippet: input.snippet,
    source: input.source || "web",
    thumbnailUrl: input.thumbnailUrl,
    searchQuery: input.searchQuery,
  };
}

async function searchBrave(
  query: VideoSearchQuery,
  apiKey: string,
): Promise<VideoSearchResult[]> {
  const params = new URLSearchParams({
    q: query.query,
    count: String(Math.min(query.maxResults || 20, 20)),
    safesearch: "moderate",
  });
  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": apiKey,
      },
      next: { revalidate: 0 },
    },
  );
  if (!response.ok) {
    throw new Error(response.status === 429 ? "SEARCH_QUOTA" : "SEARCH_FAILED");
  }
  const json = (await response.json()) as {
    web?: { results?: BraveWebResult[] };
  };
  const out: VideoSearchResult[] = [];
  for (const item of json.web?.results || []) {
    const mapped = asVideoResult({
      title: item.title,
      url: item.url,
      snippet: item.description,
      thumbnailUrl: item.thumbnail?.src,
      source: item.meta_url?.hostname || "brave",
      searchQuery: query.query,
    });
    if (mapped) out.push(mapped);
  }
  return out;
}

async function searchGoogleCse(
  query: VideoSearchQuery,
  apiKey: string,
  cx: string,
): Promise<VideoSearchResult[]> {
  const params = new URLSearchParams({
    key: apiKey,
    cx,
    q: query.query,
    num: String(Math.min(query.maxResults || 10, 10)),
    safe: "active",
  });
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?${params.toString()}`,
    { next: { revalidate: 0 } },
  );
  if (!response.ok) {
    throw new Error(response.status === 429 ? "SEARCH_QUOTA" : "SEARCH_FAILED");
  }
  const json = (await response.json()) as { items?: GoogleCseItem[] };
  const out: VideoSearchResult[] = [];
  for (const item of json.items || []) {
    const mapped = asVideoResult({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      thumbnailUrl:
        item.pagemap?.cse_thumbnail?.[0]?.src ||
        item.pagemap?.videoobject?.[0]?.thumbnailurl ||
        item.pagemap?.metatags?.[0]?.["og:image"],
      source: "google_cse",
      searchQuery: query.query,
    });
    if (mapped) out.push(mapped);
  }
  return out;
}

/**
 * Web search engine provider. Finds video URLs; does not transcribe or analyze.
 */
export class WebSearchProvider implements SearchProvider {
  readonly id: string;
  private readonly engine: "brave" | "google_cse";

  constructor(engine: "brave" | "google_cse") {
    this.engine = engine;
    this.id = engine;
  }

  async searchVideos(query: VideoSearchQuery): Promise<VideoSearchResult[]> {
    if (this.engine === "brave") {
      const key = process.env.BRAVE_SEARCH_API_KEY?.trim();
      if (!key) return [];
      return searchBrave(query, key);
    }
    const key =
      process.env.GOOGLE_CSE_API_KEY?.trim() ||
      process.env.GOOGLE_SEARCH_API_KEY?.trim();
    const cx = process.env.GOOGLE_CSE_ID?.trim();
    if (!key || !cx) return [];
    return searchGoogleCse(query, key, cx);
  }
}

export function hasWebSearchConfig(): boolean {
  if (process.env.BRAVE_SEARCH_API_KEY?.trim()) return true;
  const key =
    process.env.GOOGLE_CSE_API_KEY?.trim() ||
    process.env.GOOGLE_SEARCH_API_KEY?.trim();
  const cx = process.env.GOOGLE_CSE_ID?.trim();
  return Boolean(key && cx);
}

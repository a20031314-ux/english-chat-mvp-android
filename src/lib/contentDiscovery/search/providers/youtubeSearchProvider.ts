import type {
  SearchProvider,
  VideoSearchPage,
  VideoSearchQuery,
  VideoSearchResult,
} from "@/lib/contentDiscovery/search/types";
import { canonicalYoutubeUrl } from "../supportedVideo";

type YoutubeSearchItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    publishedAt?: string;
    thumbnails?: {
      medium?: { url?: string };
      high?: { url?: string };
      default?: { url?: string };
    };
  };
};

function thumbnailOf(snippet: YoutubeSearchItem["snippet"]): string | undefined {
  return (
    snippet?.thumbnails?.medium?.url ||
    snippet?.thumbnails?.high?.url ||
    snippet?.thumbnails?.default?.url ||
    undefined
  );
}

function relevanceLanguage(code: string): string {
  if (code === "zh") return "zh-Hans";
  return code;
}

function regionCode(language: string): string {
  switch (language) {
    case "ko":
      return "KR";
    case "ja":
      return "JP";
    case "zh":
      return "TW";
    case "es":
      return "ES";
    case "fr":
      return "FR";
    case "it":
      return "IT";
    case "pt":
      return "BR";
    case "ru":
      return "RU";
    default:
      return "US";
  }
}

/**
 * YouTube Data API Search — a SearchProvider, not a crawler.
 * Kept as fallback when no web search engine key is configured.
 */
export class YoutubeSearchProvider implements SearchProvider {
  readonly id = "youtube";

  async searchVideoPage(query: VideoSearchQuery): Promise<VideoSearchPage> {
    const apiKey = process.env.YOUTUBE_API_KEY?.trim();
    if (!apiKey) return { results: [] };
    const language = query.language || "en";
    const params = new URLSearchParams({
      part: "snippet",
      type: "video",
      maxResults: String(Math.min(query.maxResults || 15, 25)),
      q: query.query,
      key: apiKey,
      safeSearch: "moderate",
      relevanceLanguage: relevanceLanguage(language),
      regionCode: regionCode(language),
    });
    if (query.pageToken) params.set("pageToken", query.pageToken);
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
      { next: { revalidate: 0 } },
    );
    const json = (await response.json()) as {
      items?: YoutubeSearchItem[];
      nextPageToken?: string;
      error?: { message?: string };
    };
    if (!response.ok) {
      console.error("[search/youtube]", json?.error?.message || response.status);
      const error = new Error(
        response.status === 403 || response.status === 429
          ? "YOUTUBE_QUOTA"
          : "YOUTUBE_FAILED",
      );
      throw error;
    }
    const results: VideoSearchResult[] = [];
    for (const item of json.items || []) {
      const videoId = item.id?.videoId?.trim();
      const title = item.snippet?.title?.trim();
      if (!videoId || !title) continue;
      results.push({
        title,
        url: canonicalYoutubeUrl(videoId),
        snippet: item.snippet?.description || undefined,
        source: "youtube",
        thumbnailUrl: thumbnailOf(item.snippet),
        creator: item.snippet?.channelTitle,
        publishedAt: item.snippet?.publishedAt,
        searchQuery: query.query,
      });
    }
    return {
      results,
      ...(json.nextPageToken ? { nextPageToken: json.nextPageToken } : {}),
    };
  }

  async searchVideos(query: VideoSearchQuery): Promise<VideoSearchResult[]> {
    const page = await this.searchVideoPage(query);
    return page.results;
  }
}

type YoutubeVideoItem = {
  id?: string;
  contentDetails?: { duration?: string };
  snippet?: {
    defaultAudioLanguage?: string;
    defaultLanguage?: string;
    channelTitle?: string;
    thumbnails?: {
      medium?: { url?: string };
      high?: { url?: string };
      default?: { url?: string };
    };
  };
};

export function parseIso8601Duration(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i.exec(raw.trim());
  if (!match) return undefined;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

/** Optional metadata hydrate (duration/language). Discovery only — not STT. */
export async function hydrateYoutubeMetadata(
  videoIds: string[],
): Promise<
  Map<
    string,
    {
      duration?: number;
      language?: string;
      thumbnailUrl?: string;
      creator?: string;
    }
  >
> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  const map = new Map<
    string,
    {
      duration?: number;
      language?: string;
      thumbnailUrl?: string;
      creator?: string;
    }
  >();
  if (!apiKey || videoIds.length === 0) return map;
  const ids = videoIds.slice(0, 50).join(",");
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    id: ids,
    key: apiKey,
  });
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`,
      { next: { revalidate: 0 } },
    );
    if (!response.ok) return map;
    const json = (await response.json()) as { items?: YoutubeVideoItem[] };
    for (const item of json.items || []) {
      const id = item.id?.trim();
      if (!id) continue;
      map.set(id, {
        duration: parseIso8601Duration(item.contentDetails?.duration),
        language:
          item.snippet?.defaultAudioLanguage ||
          item.snippet?.defaultLanguage ||
          undefined,
        thumbnailUrl:
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.default?.url,
        creator: item.snippet?.channelTitle,
      });
    }
  } catch (error) {
    console.error("[search/youtube-hydrate]", error);
  }
  return map;
}

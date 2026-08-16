import {
  discoveryCacheGet,
  discoveryCacheKey,
  discoveryCacheSet,
} from "@/lib/contentDiscovery/cache";
import type { RecommendedChannelSeed } from "@/lib/contentDiscovery/recommendedChannels";

export type ResolvedYoutubeChannel = {
  id: string;
  name: string;
  channelId: string;
  uploadsPlaylistId: string;
  thumbnailUrl?: string;
};

type YoutubeChannelItem = {
  id?: string;
  snippet?: {
    title?: string;
    thumbnails?: {
      medium?: { url?: string };
      high?: { url?: string };
      default?: { url?: string };
    };
  };
  contentDetails?: {
    relatedPlaylists?: { uploads?: string };
  };
};

type YoutubeSearchItem = {
  id?: { channelId?: string };
  snippet?: { title?: string };
};

function youtubeKey(): string | null {
  return process.env.YOUTUBE_API_KEY?.trim() || null;
}

function thumbnailOf(item: YoutubeChannelItem): string | undefined {
  const thumbs = item.snippet?.thumbnails;
  const url =
    thumbs?.high?.url ||
    thumbs?.medium?.url ||
    thumbs?.default?.url;
  return url?.trim().replace(/^http:\/\//i, "https://") || undefined;
}

function asResolved(
  seed: RecommendedChannelSeed,
  item: YoutubeChannelItem,
): ResolvedYoutubeChannel | null {
  const channelId = item.id?.trim();
  const uploads = item.contentDetails?.relatedPlaylists?.uploads?.trim();
  if (!channelId || !uploads) return null;
  return {
    id: seed.id,
    name: item.snippet?.title?.trim() || seed.name,
    channelId,
    uploadsPlaylistId: uploads,
    ...(thumbnailOf(item) ? { thumbnailUrl: thumbnailOf(item) } : {}),
  };
}

async function youtubeJson<T>(
  path: string,
  params: Record<string, string>,
): Promise<T | null> {
  const key = youtubeKey();
  if (!key) return null;
  const search = new URLSearchParams({ ...params, key });
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/${path}?${search.toString()}`,
    { next: { revalidate: 3600 } },
  );
  if (!response.ok) {
    console.error("[youtube-channel]", path, response.status);
    return null;
  }
  return (await response.json()) as T;
}

async function channelByHandle(
  handle: string,
): Promise<YoutubeChannelItem | null> {
  const json = await youtubeJson<{ items?: YoutubeChannelItem[] }>(
    "channels",
    {
      part: "snippet,contentDetails",
      forHandle: handle.replace(/^@/, ""),
    },
  );
  return json?.items?.[0] || null;
}

async function channelById(channelId: string): Promise<YoutubeChannelItem | null> {
  const json = await youtubeJson<{ items?: YoutubeChannelItem[] }>(
    "channels",
    {
      part: "snippet,contentDetails",
      id: channelId,
    },
  );
  return json?.items?.[0] || null;
}

async function searchChannelId(name: string): Promise<string | null> {
  const json = await youtubeJson<{ items?: YoutubeSearchItem[] }>("search", {
    part: "snippet",
    type: "channel",
    maxResults: "1",
    q: name,
  });
  return json?.items?.[0]?.id?.channelId?.trim() || null;
}

export async function resolveYoutubeChannel(
  seed: RecommendedChannelSeed,
): Promise<ResolvedYoutubeChannel | null> {
  const cacheKey = discoveryCacheKey({
    kind: "yt-channel",
    v: 2,
    handle: seed.handle,
    name: seed.name,
  });
  const cached = discoveryCacheGet<ResolvedYoutubeChannel>(cacheKey);
  if (cached) return cached;

  try {
    const byHandle = await channelByHandle(seed.handle);
    const resolvedHandle = byHandle ? asResolved(seed, byHandle) : null;
    if (resolvedHandle) {
      discoveryCacheSet(cacheKey, resolvedHandle, 24 * 60 * 60 * 1000);
      return resolvedHandle;
    }

    const foundId = await searchChannelId(seed.name);
    const bySearch = foundId ? await channelById(foundId) : null;
    const resolvedSearch = bySearch ? asResolved(seed, bySearch) : null;
    if (resolvedSearch) {
      discoveryCacheSet(cacheKey, resolvedSearch, 24 * 60 * 60 * 1000);
      return resolvedSearch;
    }
  } catch (error) {
    console.error("[youtube-channel]", seed.handle, error);
  }
  return null;
}

export async function resolveYoutubeChannelById(
  channelId: string,
): Promise<ResolvedYoutubeChannel | null> {
  const id = channelId.trim();
  if (!id) return null;
  const cacheKey = discoveryCacheKey({ kind: "yt-channel-id", v: 2, id });
  const cached = discoveryCacheGet<ResolvedYoutubeChannel>(cacheKey);
  if (cached) return cached;
  const item = await channelById(id);
  const seed = { id, name: id, handle: id };
  const resolved = item ? asResolved(seed, item) : null;
  if (resolved) {
    discoveryCacheSet(cacheKey, resolved, 24 * 60 * 60 * 1000);
  }
  return resolved;
}

export type YoutubeChannelSearchHit = {
  channelId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  subscriberCount?: number;
};

function subscriberCountOf(item: {
  statistics?: {
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
  };
}): number {
  if (item.statistics?.hiddenSubscriberCount) return -1;
  const raw = Number(item.statistics?.subscriberCount || 0);
  return Number.isFinite(raw) ? raw : 0;
}

export async function searchYoutubeChannels(
  query: string,
  language?: string,
): Promise<YoutubeChannelSearchHit[]> {
  const q = query.replace(/\s+/g, " ").trim();
  if (!q || !youtubeKey()) return [];
  const cacheKey = discoveryCacheKey({
    kind: "yt-channel-search",
    v: 2,
    q: q.toLowerCase(),
    language: language || "",
  });
  const cached = discoveryCacheGet<YoutubeChannelSearchHit[]>(cacheKey);
  if (cached) return cached;

  const params: Record<string, string> = {
    part: "snippet",
    type: "channel",
    maxResults: "20",
    q,
    safeSearch: "moderate",
  };
  if (language) {
    params.relevanceLanguage = language === "zh" ? "zh-Hans" : language;
  }
  const json = await youtubeJson<{
    items?: Array<{
      id?: { channelId?: string };
      snippet?: { title?: string; description?: string };
    }>;
  }>("search", params);

  const ids: string[] = [];
  const seen = new Set<string>();
  for (const item of json?.items || []) {
    const channelId = item.id?.channelId?.trim();
    if (!channelId || seen.has(channelId)) continue;
    seen.add(channelId);
    ids.push(channelId);
  }
  if (ids.length === 0) return [];

  const details = await youtubeJson<{
    items?: Array<{
      id?: string;
      snippet?: {
        title?: string;
        description?: string;
        thumbnails?: {
          medium?: { url?: string };
          high?: { url?: string };
          default?: { url?: string };
        };
      };
      statistics?: {
        subscriberCount?: string;
        hiddenSubscriberCount?: boolean;
      };
    }>;
  }>("channels", {
    part: "snippet,statistics",
    id: ids.join(","),
    maxResults: "50",
  });

  const out: YoutubeChannelSearchHit[] = [];
  for (const item of details?.items || []) {
    const channelId = item.id?.trim();
    const name = item.snippet?.title?.replace(/\s+/g, " ").trim();
    if (!channelId || !name) continue;
    const thumbnailUrl = thumbnailOf(item);
    const subscribers = subscriberCountOf(item);
    out.push({
      channelId,
      name,
      url: `https://www.youtube.com/channel/${channelId}`,
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
      ...(item.snippet?.description
        ? { description: item.snippet.description.slice(0, 160) }
        : {}),
      ...(subscribers >= 0 ? { subscriberCount: subscribers } : {}),
    });
  }
  out.sort((a, b) => (b.subscriberCount ?? -1) - (a.subscriberCount ?? -1));
  const top = out.slice(0, 8);
  discoveryCacheSet(cacheKey, top, 10 * 60 * 1000);
  return top;
}

export async function resolveRecommendedChannels(
  seeds: RecommendedChannelSeed[],
): Promise<ResolvedYoutubeChannel[]> {
  if (!youtubeKey()) return [];
  const resolved = await Promise.all(seeds.map((seed) => resolveYoutubeChannel(seed)));
  return resolved.filter((row): row is ResolvedYoutubeChannel => Boolean(row));
}

import { filterChannelUploads } from "@/lib/contentDiscovery/filterCandidates";
import { logVideoDiscovery } from "@/lib/contentDiscovery/search/debug";
import {
  dedupeVideoCandidates,
  normalizeSearchResult,
} from "@/lib/contentDiscovery/search/normalize";
import { hydrateYoutubeMetadata } from "@/lib/contentDiscovery/search/providers/youtubeSearchProvider";
import { resolveYoutubeChannelById } from "@/lib/contentDiscovery/search/resolveYoutubeChannel";
import { videoCandidateToContentCandidate } from "@/lib/contentDiscovery/search/toContentCandidate";
import type {
  VideoCandidate,
  VideoSearchResult,
} from "@/lib/contentDiscovery/search/types";
import { canonicalYoutubeUrl } from "@/lib/contentDiscovery/search/supportedVideo";
import type {
  ContentCandidate,
  ContentSearchIntent,
} from "@/lib/contentDiscovery/types";

type PlaylistItem = {
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
    resourceId?: { videoId?: string };
  };
  contentDetails?: { videoId?: string };
};

function thumbnailOf(item: PlaylistItem): string | undefined {
  return (
    item.snippet?.thumbnails?.medium?.url ||
    item.snippet?.thumbnails?.high?.url ||
    item.snippet?.thumbnails?.default?.url
  );
}

async function playlistPage(
  playlistId: string,
  pageToken?: string,
): Promise<{ results: VideoSearchResult[]; nextPageToken?: string }> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!apiKey) throw new Error("YOUTUBE_UNAVAILABLE");

  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    playlistId,
    maxResults: "25",
    key: apiKey,
  });
  if (pageToken) params.set("pageToken", pageToken);

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`,
    { next: { revalidate: 0 } },
  );
  const json = (await response.json()) as {
    items?: PlaylistItem[];
    nextPageToken?: string;
    error?: { message?: string };
  };
  if (!response.ok) {
    console.error("[youtube-playlist]", json?.error?.message || response.status);
    throw new Error(
      response.status === 403 || response.status === 429
        ? "YOUTUBE_QUOTA"
        : "YOUTUBE_FAILED",
    );
  }

  const results: VideoSearchResult[] = [];
  for (const item of json.items || []) {
    const videoId =
      item.contentDetails?.videoId?.trim() ||
      item.snippet?.resourceId?.videoId?.trim();
    const title = item.snippet?.title?.replace(/\s+/g, " ").trim();
    if (!videoId || !title || title === "Private video" || title === "Deleted video") {
      continue;
    }
    results.push({
      title,
      url: canonicalYoutubeUrl(videoId),
      snippet: item.snippet?.description || undefined,
      source: "youtube",
      thumbnailUrl: thumbnailOf(item),
      creator: item.snippet?.channelTitle,
      publishedAt: item.snippet?.publishedAt,
      searchQuery: playlistId,
    });
  }
  return {
    results,
    ...(json.nextPageToken ? { nextPageToken: json.nextPageToken } : {}),
  };
}

/**
 * Latest uploads from a YouTube channel. Keeps playlist order.
 */
export async function discoverVideosByChannel(
  intent: ContentSearchIntent,
  input: { channelId: string; name?: string },
  pageToken?: string,
): Promise<{
  candidates: ContentCandidate[];
  warnings: string[];
  nextPageToken?: string;
}> {
  const channel = await resolveYoutubeChannelById(input.channelId);
  if (!channel) {
    return { candidates: [], warnings: ["YOUTUBE_FAILED"] };
  }

  let page: { results: VideoSearchResult[]; nextPageToken?: string };
  try {
    page = await playlistPage(channel.uploadsPlaylistId, pageToken);
  } catch (error) {
    const message = error instanceof Error ? error.message : "SEARCH_FAILED";
    return {
      candidates: [],
      warnings: [
        message === "YOUTUBE_UNAVAILABLE"
          ? "YOUTUBE_UNAVAILABLE"
          : message === "YOUTUBE_QUOTA"
            ? "YOUTUBE_QUOTA"
            : "SEARCH_FAILED",
      ],
    };
  }

  const normalized = page.results
    .map((hit) => normalizeSearchResult(hit))
    .filter((row): row is VideoCandidate => Boolean(row));
  const deduped = dedupeVideoCandidates(normalized);
  const meta = await hydrateYoutubeMetadata(deduped.map((row) => row.id));
  const hydrated = deduped.map((row) => {
    const extra = meta.get(row.id);
    if (!extra) return row;
    return {
      ...row,
      ...(extra.duration ? { duration: extra.duration } : {}),
      ...(extra.language ? { language: extra.language } : {}),
      ...(extra.thumbnailUrl && !row.thumbnailUrl
        ? { thumbnailUrl: extra.thumbnailUrl }
        : {}),
      ...(extra.creator && !row.creator ? { creator: extra.creator } : {}),
    };
  });

  const filtered = filterChannelUploads(
    hydrated.map(videoCandidateToContentCandidate),
  );

  logVideoDiscovery(
    {
      category: pageToken ? "(channel-more)" : `(channel:${channel.channelId})`,
      generatedQueries: [channel.channelId],
      rawSearchResults: page.results.length,
      afterDeduplication: deduped.length,
      supportedVideos: normalized.length,
      afterFiltering: filtered.length,
      catalogResults: filtered.length,
      provider: "youtube",
    },
    hydrated,
  );

  return {
    candidates: filtered,
    warnings: [],
    ...(page.nextPageToken ? { nextPageToken: page.nextPageToken } : {}),
  };
}

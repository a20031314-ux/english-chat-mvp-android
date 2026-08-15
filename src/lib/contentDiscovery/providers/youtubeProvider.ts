import { buildSearchQuery } from "@/lib/contentDiscovery/parseSearchIntent";
import type {
  ContentCandidate,
  ContentSearchIntent,
  PreferredDurationBucket,
} from "@/lib/contentDiscovery/types";
import { normalizeYouTubeWatchUrl } from "@/lib/videoLearning";
import {
  listYouTubeCaptionTracks,
} from "@/lib/videoSubtitle/youtubeCaptions";
import {
  captionLanguageMatches,
  isManualCaptionTrack,
} from "@/lib/videoSubtitle/captionLanguages";

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

type YoutubeVideoItem = {
  id?: string;
  contentDetails?: {
    duration?: string;
    caption?: string;
    contentRating?: { ytRating?: string };
  };
  status?: { embeddable?: boolean; privacyStatus?: string };
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    publishedAt?: string;
    defaultAudioLanguage?: string;
    defaultLanguage?: string;
    thumbnails?: {
      medium?: { url?: string };
      high?: { url?: string };
      default?: { url?: string };
    };
  };
};

/** Parse ISO-8601 duration like PT1H2M3S → seconds. */
export function parseIso8601Duration(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i.exec(raw.trim());
  if (!match) return undefined;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

function youtubeDurationFilter(
  bucket: PreferredDurationBucket,
): "any" | "short" | "medium" | "long" {
  if (bucket === "short") return "short";
  if (bucket === "medium") return "medium";
  if (bucket === "long") return "long";
  return "any";
}

function relevanceLanguage(code: string): string {
  if (code === "zh") return "zh-Hans";
  return code;
}

function thumbnailOf(
  snippet:
    | YoutubeSearchItem["snippet"]
    | YoutubeVideoItem["snippet"]
    | undefined,
): string | undefined {
  return (
    snippet?.thumbnails?.medium?.url ||
    snippet?.thumbnails?.high?.url ||
    snippet?.thumbnails?.default?.url ||
    undefined
  );
}

export async function searchYouTubeVideos(
  intent: ContentSearchIntent,
): Promise<{ candidates: ContentCandidate[]; warning?: string }> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!apiKey) {
    return {
      candidates: [],
      warning: "YOUTUBE_UNAVAILABLE",
    };
  }

  const q = buildSearchQuery(intent);
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: "20",
    q,
    key: apiKey,
    safeSearch: "moderate",
    videoEmbeddable: "true",
    relevanceLanguage: relevanceLanguage(intent.language),
  });
  const durationFilter = youtubeDurationFilter(intent.durationBucket);
  if (durationFilter !== "any") {
    params.set("videoDuration", durationFilter);
  }
  if (intent.requireOriginalCaptions) {
    // YouTube search: videos that declare closed captions (manual or auto).
    params.set("videoCaption", "closedCaption");
  }

  let searchJson: { items?: YoutubeSearchItem[]; error?: { message?: string } };
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
      { next: { revalidate: 0 } },
    );
    searchJson = (await response.json()) as typeof searchJson;
    if (!response.ok) {
      console.error("[youtube-search]", searchJson?.error?.message || response.status);
      return {
        candidates: [],
        warning:
          response.status === 403 || response.status === 429
            ? "YOUTUBE_QUOTA"
            : "YOUTUBE_FAILED",
      };
    }
  } catch (error) {
    console.error("[youtube-search]", error);
    return { candidates: [], warning: "YOUTUBE_FAILED" };
  }

  const ids = (searchJson.items || [])
    .map((item) => item.id?.videoId?.trim())
    .filter((id): id is string => Boolean(id));
  if (ids.length === 0) {
    return { candidates: [] };
  }

  const detailsParams = new URLSearchParams({
    part: "snippet,contentDetails,status",
    id: ids.join(","),
    key: apiKey,
  });

  let detailsJson: { items?: YoutubeVideoItem[] };
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${detailsParams.toString()}`,
      { next: { revalidate: 0 } },
    );
    detailsJson = (await response.json()) as typeof detailsJson;
    if (!response.ok) {
      return { candidates: [], warning: "YOUTUBE_FAILED" };
    }
  } catch (error) {
    console.error("[youtube-videos]", error);
    return { candidates: [], warning: "YOUTUBE_FAILED" };
  }

  const candidates: ContentCandidate[] = [];
  for (const item of detailsJson.items || []) {
    const videoId = item.id?.trim();
    if (!videoId) continue;
    if (item.status?.privacyStatus && item.status.privacyStatus !== "public") {
      continue;
    }
    if (item.status?.embeddable === false) continue;

    const durationSeconds = parseIso8601Duration(item.contentDetails?.duration);
    const title = item.snippet?.title?.trim() || "";
    if (!title) continue;

    const hasCaptions = item.contentDetails?.caption === "true";
    candidates.push({
      id: `yt:${videoId}`,
      type: "video",
      source: "youtube",
      title,
      url: normalizeYouTubeWatchUrl(videoId),
      externalId: videoId,
      description: item.snippet?.description?.slice(0, 400) || undefined,
      thumbnail: thumbnailOf(item.snippet),
      durationSeconds,
      publishedAt: item.snippet?.publishedAt,
      authorOrChannel: item.snippet?.channelTitle,
      language:
        item.snippet?.defaultAudioLanguage ||
        item.snippet?.defaultLanguage ||
        undefined,
      preview: item.snippet?.description?.slice(0, 180) || undefined,
      hasCaptions,
    });
  }

  if (intent.requireOriginalCaptions && candidates.length > 0) {
    const probed = await Promise.all(
      candidates.map(async (candidate) => {
        const videoId = candidate.externalId;
        if (!videoId) return { ...candidate, hasOriginalCaptions: false };
        try {
          const tracks = await listYouTubeCaptionTracks(videoId);
          // Prefer official captions in the learning language, not just any language.
          const hasOriginal = tracks.some(
            (track) =>
              isManualCaptionTrack(track.kind) &&
              captionLanguageMatches(track.languageCode, intent.language),
          );
          return {
            ...candidate,
            hasCaptions: candidate.hasCaptions || tracks.length > 0,
            hasOriginalCaptions: hasOriginal,
          };
        } catch {
          // Fall back to contentDetails.caption when timedtext probe fails.
          return {
            ...candidate,
            hasOriginalCaptions: Boolean(candidate.hasCaptions),
          };
        }
      }),
    );
    return {
      candidates: probed.filter((item) => item.hasOriginalCaptions),
    };
  }

  return { candidates };
}

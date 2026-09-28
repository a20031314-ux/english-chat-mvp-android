import { buildSearchQueries } from "@/lib/contentDiscovery/parseSearchIntent";
import type {
  ContentCandidate,
  ContentSearchIntent,
  PreferredDurationBucket,
} from "@/lib/contentDiscovery/types";
import { normalizeYouTubeWatchUrl } from "@/lib/videoLearning";

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
    case "ar":
      return "SA";
    case "id":
      return "ID";
    case "vi":
      return "VN";
    case "th":
      return "TH";
    case "hi":
      return "IN";
    default:
      return "US";
  }
}

async function searchVideoIds(
  apiKey: string,
  query: string,
  intent: ContentSearchIntent,
): Promise<{ ids: string[]; warning?: string }> {
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: "25",
    q: query,
    key: apiKey,
    safeSearch: "moderate",
    relevanceLanguage: relevanceLanguage(intent.language),
    regionCode: regionCode(intent.language),
  });
  const durationFilter = youtubeDurationFilter(intent.durationBucket);
  if (durationFilter !== "any") {
    params.set("videoDuration", durationFilter);
  }
  if (intent.requireOriginalCaptions) {
    params.set("videoCaption", "closedCaption");
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
      { next: { revalidate: 0 } },
    );
    const searchJson = (await response.json()) as {
      items?: YoutubeSearchItem[];
      error?: { message?: string };
    };
    if (!response.ok) {
      console.error("[youtube-search]", searchJson?.error?.message || response.status);
      return {
        ids: [],
        warning:
          response.status === 403 || response.status === 429
            ? "YOUTUBE_QUOTA"
            : "YOUTUBE_FAILED",
      };
    }
    const ids = (searchJson.items || [])
      .map((item) => item.id?.videoId?.trim())
      .filter((id): id is string => Boolean(id));
    return { ids };
  } catch (error) {
    console.error("[youtube-search]", error);
    return { ids: [], warning: "YOUTUBE_FAILED" };
  }
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

  const queries = buildSearchQueries(intent);
  const searches = await Promise.all(
    queries.map((query) => searchVideoIds(apiKey, query, intent)),
  );
  const seen = new Set<string>();
  const ids: string[] = [];
  let warning: string | undefined;
  for (const result of searches) {
    if (result.warning) warning = result.warning;
    for (const id of result.ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      ids.push(id);
      if (ids.length >= 50) break;
    }
    if (ids.length >= 50) break;
  }
  if (ids.length === 0) {
    return { candidates: [], ...(warning ? { warning } : {}) };
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

  if (intent.requireOriginalCaptions) {
    // contentDetails.caption, already read above, is the answer. It is "true"
    // when somebody uploaded a caption track and "false" when all YouTube has
    // is its own speech recognition — checked on 2026-09-29 against twenty
    // videos, ten searched with the caption filter and ten vlogs without, and
    // it agreed with the track list on every one: every "true" had a
    // human-written track, every "false" had exactly one track marked asr.
    //
    // What stood here instead was a per-video probe of
    // youtube.com/api/timedtext?type=list, which YouTube has retired: it now
    // answers 200 with an empty body for every video, from any address. The
    // helper swallows that into an empty track list, so every candidate came
    // back with no original captions and the filter emptied the whole result.
    // Asking for original captions returned nothing at all — not a short list,
    // nothing — and the catch that was meant to fall back to this same flag was
    // unreachable, because a probe that answers 200 does not throw.
    //
    // One thing is lost with the probe: it also checked the track was in the
    // language being learned, and the flag cannot say. The search asks YouTube
    // for the language already, and a video filtered here is a video nobody
    // sees, which is the worse way to be wrong.
    return {
      candidates: candidates
        .map((candidate) => ({
          ...candidate,
          hasOriginalCaptions: candidate.hasCaptions === true,
        }))
        .filter((candidate) => candidate.hasOriginalCaptions),
    };
  }

  return { candidates };
}

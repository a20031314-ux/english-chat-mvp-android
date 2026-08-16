import type { ContentCandidate } from "../types";
import type { VideoCandidate } from "./types";

/** Adapter: search-layer VideoCandidate → existing discovery card model. */
export function videoCandidateToContentCandidate(
  video: VideoCandidate,
): ContentCandidate {
  return {
    id: `yt:${video.id}`,
    type: "video",
    source: video.source || "youtube",
    title: video.title,
    url: video.url,
    externalId: video.id,
    ...(video.description ? { description: video.description } : {}),
    ...(video.thumbnailUrl ? { thumbnail: video.thumbnailUrl } : {}),
    ...(typeof video.duration === "number"
      ? { durationSeconds: video.duration }
      : {}),
    ...(video.publishedAt ? { publishedAt: video.publishedAt } : {}),
    ...(video.creator ? { authorOrChannel: video.creator } : {}),
    ...(video.language ? { language: video.language } : {}),
    ...(video.description
      ? { preview: video.description.slice(0, 180) }
      : {}),
    ...(typeof video.learningScore === "number"
      ? { learningScore: video.learningScore }
      : {}),
  };
}

import {
  canonicalYoutubeUrl,
  extractYoutubeVideoId,
  isSupportedVideoUrl,
} from "./supportedVideo";
import type {
  VideoCandidate,
  VideoSearchResult,
} from "./types";

export { isSupportedVideoUrl };

export function normalizeSearchResult(
  result: VideoSearchResult,
  extra?: { category?: string; language?: string },
): VideoCandidate | null {
  const videoId = extractYoutubeVideoId(result.url);
  if (!videoId) return null;
  const title = result.title.replace(/\s+/g, " ").trim();
  if (!title) return null;
  return {
    id: videoId,
    title,
    url: canonicalYoutubeUrl(videoId),
    source: result.source || "youtube",
    ...(result.snippet ? { description: result.snippet.slice(0, 400) } : {}),
    ...(result.thumbnailUrl ? { thumbnailUrl: result.thumbnailUrl } : {}),
    ...(result.creator ? { creator: result.creator } : {}),
    ...(result.publishedAt ? { publishedAt: result.publishedAt } : {}),
    ...(result.searchQuery ? { searchQuery: result.searchQuery } : {}),
    ...(extra?.category ? { category: extra.category } : {}),
    ...(extra?.language ? { language: extra.language } : {}),
  };
}

export function dedupeVideoCandidates(
  candidates: VideoCandidate[],
): VideoCandidate[] {
  const byId = new Map<string, VideoCandidate>();
  for (const item of candidates) {
    const existing = byId.get(item.id);
    if (!existing) {
      byId.set(item.id, { ...item });
      continue;
    }
    const topics = new Set([
      ...(existing.topics || []),
      ...(item.topics || []),
    ]);
    if (item.category && item.category !== existing.category) {
      topics.add(item.category);
    }
    byId.set(item.id, {
      ...existing,
      ...(!existing.description && item.description
        ? { description: item.description }
        : {}),
      ...(!existing.thumbnailUrl && item.thumbnailUrl
        ? { thumbnailUrl: item.thumbnailUrl }
        : {}),
      ...(!existing.creator && item.creator ? { creator: item.creator } : {}),
      ...(!existing.duration && item.duration
        ? { duration: item.duration }
        : {}),
      ...(topics.size ? { topics: [...topics] } : {}),
    });
  }
  return [...byId.values()];
}

export function mvpLearningScore(candidate: VideoCandidate, topic: string): number {
  const blob = `${candidate.title} ${candidate.description || ""}`.toLowerCase();
  const tokens = topic
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 2);
  let score = 50;
  if (isSupportedVideoUrl(candidate.url)) score += 20;
  if (candidate.thumbnailUrl) score += 5;
  if (candidate.creator) score += 5;
  if (candidate.duration && candidate.duration >= 60) score += 5;
  for (const token of tokens) {
    if (blob.includes(token)) score += 4;
  }
  return Math.max(0, Math.min(100, score));
}

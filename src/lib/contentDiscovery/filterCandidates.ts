import type {
  ContentCandidate,
  ContentSearchIntent,
} from "@/lib/contentDiscovery/types";
import {
  discoveryTextLooksWrongLanguage,
  youtubeLanguageMatchesTarget,
} from "@/lib/videoSubtitle/languageMatch";

function withinDuration(
  seconds: number | undefined,
  intent: ContentSearchIntent,
): boolean {
  if (seconds == null || !Number.isFinite(seconds)) return true;
  const { minSeconds, maxSeconds } = intent.duration;
  if (minSeconds != null && seconds < minSeconds * 0.75) return false;
  if (maxSeconds != null && seconds > maxSeconds * 1.25) return false;
  return true;
}

/** Deterministic metadata filter before AI ranking. */
export function filterCandidates(
  candidates: ContentCandidate[],
  intent: ContentSearchIntent,
): ContentCandidate[] {
  const seen = new Set<string>();
  const out: ContentCandidate[] = [];

  for (const item of candidates) {
    const key = (item.url || item.externalId || item.id).toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);

    if (!item.title?.trim() || !item.url?.trim()) continue;

    if (intent.contentType === "video") {
      if (item.type !== "video") continue;
      if (!withinDuration(item.durationSeconds, intent)) continue;
      if (intent.requireOriginalCaptions && item.hasOriginalCaptions === false) {
        continue;
      }
      if (!youtubeLanguageMatchesTarget(item.language, intent.language)) {
        continue;
      }
      const blob = `${item.title} ${item.description || ""} ${item.preview || ""}`;
      if (discoveryTextLooksWrongLanguage(blob, intent.language)) {
        continue;
      }
    } else if (item.type === "video") {
      continue;
    }

    out.push(item);
    if (out.length >= 50) break;
  }

  return out;
}

/** Channel uploads: keep playlist order. Do not apply category duration/caption/topic filters. */
export function filterChannelUploads(
  candidates: ContentCandidate[],
): ContentCandidate[] {
  const seen = new Set<string>();
  const out: ContentCandidate[] = [];
  for (const item of candidates) {
    const key = (item.url || item.externalId || item.id).toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    if (item.type !== "video") continue;
    if (!item.title?.trim() || !item.url?.trim()) continue;
    out.push(item);
    if (out.length >= 50) break;
  }
  return out;
}

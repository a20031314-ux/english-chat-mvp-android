import { currentLibraryPack, type LibraryClip } from "./catalog.ts";
import type { LearningLanguageCode } from "../learningLanguages.ts";

export type LibraryListing = {
  month: string | null;
  clips: LibraryClip[];
  /** The clips a free learner may open, as the server names them. */
  trialVideoIds: string[];
};

/** Free clips when nobody has said otherwise: the opening of the packed month. */
const BUNDLED_TRIAL_COUNT = 3;

function asClip(value: unknown): LibraryClip | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const videoId = typeof row.videoId === "string" ? row.videoId.trim() : "";
  const title = typeof row.title === "string" ? row.title.trim() : "";
  const durationSeconds =
    typeof row.durationSeconds === "number" && Number.isFinite(row.durationSeconds)
      ? row.durationSeconds
      : 0;
  if (!videoId || !title || durationSeconds <= 0) return null;
  return { videoId, title, durationSeconds };
}

/**
 * What this build already has, which is what it shows until the server answers.
 *
 * Not a loading state: the packed catalog is a real answer, only possibly an
 * old one, and somebody opening the tab on a train should see the list rather
 * than a spinner with nothing behind it.
 */
export function bundledListing(language: LearningLanguageCode): LibraryListing {
  const pack = currentLibraryPack(language);
  const clips = pack?.clips ?? [];
  return {
    month: pack?.month ?? null,
    clips,
    trialVideoIds: clips.slice(0, BUNDLED_TRIAL_COUNT).map((clip) => clip.videoId),
  };
}

/**
 * Read an answer from the library route, or return null to keep what we had.
 *
 * Null rather than a throw or an empty list, because every way this can fail —
 * no network, an older deployment, a route that answers something else — has
 * the same right answer: go on showing the month the build came with. An empty
 * clip list is treated as a failure for that reason; a month with nothing in it
 * is not something to replace a working list with.
 */
export function normalizeLibraryListing(data: unknown): LibraryListing | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const clips = Array.isArray(row.clips)
    ? row.clips.map(asClip).filter((clip): clip is LibraryClip => Boolean(clip))
    : [];
  if (clips.length === 0) return null;
  const named = Array.isArray(row.trialVideoIds)
    ? row.trialVideoIds.filter((id): id is string => typeof id === "string")
    : [];
  const known = new Set(clips.map((clip) => clip.videoId));
  const trialVideoIds = named.filter((id) => known.has(id));
  return {
    month: typeof row.month === "string" ? row.month : null,
    clips,
    // A server that names no free clips, or names ones it did not send, would
    // otherwise lock the whole library for everybody who has not paid.
    trialVideoIds:
      trialVideoIds.length > 0
        ? trialVideoIds
        : clips.slice(0, BUNDLED_TRIAL_COUNT).map((clip) => clip.videoId),
  };
}

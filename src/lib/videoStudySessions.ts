import {
  coerceLanguageCode,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";
import {
  normalizeYouTubeWatchUrl,
  parseYouTubeVideoId,
  type VideoSubtitle,
} from "@/lib/videoLearning";

export type StoredVideoCue = {
  id: string;
  startTime: number;
  endTime: number;
  original: string;
  translation?: string;
  analysisTranslation?: string;
};

export type VideoStudySession = {
  id: string;
  videoId: string;
  videoUrl: string;
  title?: string;
  situationSummary?: string;
  durationSeconds: number;
  cues: StoredVideoCue[];
  /** Cues before any merge/split, used by Restore original. */
  baselineCues?: StoredVideoCue[];
  /** Learning language of the source lines (legacy → "en") */
  languageCode: LearningLanguageCode;
  createdAt: number;
  updatedAt: number;
};

export const VIDEO_STUDY_SESSIONS_KEY = "videoStudySessions";

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCue(raw: unknown): StoredVideoCue | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const id = asString(row.id);
  const original = asString(row.original);
  const startTime = asNumber(row.startTime);
  const endTime = asNumber(row.endTime);
  if (!id || !original || startTime == null || endTime == null) return null;
  const translation = asString(row.translation) || undefined;
  const analysisTranslation = asString(row.analysisTranslation) || undefined;
  return {
    id,
    startTime,
    endTime: Math.max(startTime + 0.3, endTime),
    original,
    ...(translation ? { translation } : {}),
    ...(analysisTranslation ? { analysisTranslation } : {}),
  };
}

function asSession(raw: unknown): VideoStudySession | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const id = asString(row.id);
  const videoId =
    asString(row.videoId) || parseYouTubeVideoId(asString(row.videoUrl)) || "";
  const videoUrl =
    asString(row.videoUrl) ||
    (videoId ? normalizeYouTubeWatchUrl(videoId) : "");
  const createdAt = asNumber(row.createdAt) ?? Date.now();
  const updatedAt = asNumber(row.updatedAt) ?? createdAt;
  const durationSeconds = asNumber(row.durationSeconds) ?? 0;
  const cuesRaw = Array.isArray(row.cues) ? row.cues : [];
  const cues = cuesRaw
    .map(asCue)
    .filter((cue): cue is StoredVideoCue => cue !== null)
    .slice(0, 800);
  if (!id || !videoId || !videoUrl || cues.length === 0) return null;
  const title = asString(row.title) || undefined;
  const situationSummary = asString(row.situationSummary) || undefined;
  const baselineRaw = Array.isArray(row.baselineCues) ? row.baselineCues : [];
  const baselineCues = baselineRaw
    .map(asCue)
    .filter((cue): cue is StoredVideoCue => cue !== null)
    .slice(0, 800);
  return {
    id,
    videoId,
    videoUrl,
    languageCode: coerceLanguageCode(row.languageCode),
    ...(title ? { title } : {}),
    ...(situationSummary ? { situationSummary } : {}),
    durationSeconds: Math.max(durationSeconds, cues[cues.length - 1]!.endTime),
    cues,
    ...(baselineCues.length > 0 ? { baselineCues } : {}),
    createdAt,
    updatedAt,
  };
}

export function cuesToStored(cues: VideoSubtitle[]): StoredVideoCue[] {
  return cues
    .map((cue) => {
      const translation = cue.translation.trim();
      const analysisTranslation = cue.analysisTranslation?.trim();
      return {
        id: cue.id,
        startTime: cue.startTime,
        endTime: Math.max(cue.startTime + 0.3, cue.endTime),
        original: cue.original.trim(),
        ...(translation ? { translation } : {}),
        ...(analysisTranslation ? { analysisTranslation } : {}),
      };
    })
    .filter((cue) => cue.original.length > 0)
    .slice(0, 800);
}

export function storedCuesToSubtitles(cues: StoredVideoCue[]): VideoSubtitle[] {
  return cues.map((cue) => {
    const translation = cue.translation?.trim() || "";
    const analysisTranslation = cue.analysisTranslation?.trim();
    return {
      id: cue.id,
      startTime: cue.startTime,
      endTime: cue.endTime,
      original: cue.original,
      translation,
      translationStatus: translation
        ? ("final" as const)
        : ("english" as const),
      ...(analysisTranslation ? { analysisTranslation } : {}),
    };
  });
}

export function loadVideoStudySessions(): VideoStudySession[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(
      localStorage.getItem(VIDEO_STUDY_SESSIONS_KEY) || "[]",
    );
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(asSession)
      .filter((item): item is VideoStudySession => item !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function persistVideoStudySessions(items: VideoStudySession[]) {
  localStorage.setItem(
    VIDEO_STUDY_SESSIONS_KEY,
    JSON.stringify(items.slice(0, 40)),
  );
}

export function findVideoStudySession(
  videoId: string,
): VideoStudySession | null {
  return (
    loadVideoStudySessions().find((item) => item.videoId === videoId) ?? null
  );
}

export function upsertVideoStudySession(input: {
  videoId: string;
  videoUrl: string;
  title?: string;
  situationSummary?: string;
  durationSeconds: number;
  cues: VideoSubtitle[];
  baselineCues?: VideoSubtitle[];
  languageCode?: LearningLanguageCode;
}): { session: VideoStudySession; created: boolean } {
  const cues = cuesToStored(input.cues);
  if (cues.length === 0) {
    throw new Error("NO_CUES");
  }
  const existing = loadVideoStudySessions();
  const prev = existing.find((item) => item.videoId === input.videoId);
  const now = Date.now();
  const situationSummary =
    input.situationSummary?.trim() || prev?.situationSummary;
  const languageCode =
    input.languageCode ??
    prev?.languageCode ??
    coerceLanguageCode(undefined);
  const baselineCues = cuesToStored(
    input.baselineCues && input.baselineCues.length > 0
      ? input.baselineCues
      : storedCuesToSubtitles(prev?.baselineCues ?? []),
  );
  const session: VideoStudySession = {
    id: prev?.id ?? `vsession-${input.videoId}-${now}`,
    videoId: input.videoId,
    videoUrl: input.videoUrl,
    languageCode,
    ...(input.title || prev?.title
      ? { title: input.title || prev?.title }
      : {}),
    ...(situationSummary ? { situationSummary } : {}),
    durationSeconds: Math.max(
      input.durationSeconds,
      cues[cues.length - 1]!.endTime,
    ),
    cues,
    ...(baselineCues.length > 0
      ? { baselineCues }
      : !prev
        ? { baselineCues: cues }
        : {}),
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  };
  const next = [
    session,
    ...existing.filter((item) => item.videoId !== input.videoId),
  ];
  persistVideoStudySessions(next);
  return { session, created: !prev };
}

export function filterVideoStudySessionsByLanguage(
  sessions: VideoStudySession[],
  languageCode: LearningLanguageCode,
): VideoStudySession[] {
  return sessions.filter((s) => s.languageCode === languageCode);
}

export function deleteVideoStudySession(videoId: string) {
  persistVideoStudySessions(
    loadVideoStudySessions().filter((item) => item.videoId !== videoId),
  );
}

export function isVideoStudySessionSaved(videoId: string): boolean {
  return Boolean(findVideoStudySession(videoId));
}

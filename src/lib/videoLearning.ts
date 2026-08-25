import {
  coerceLanguageCode,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

export type VideoSubtitle = {
  id: string;
  startTime: number;
  endTime: number;
  original: string;
  translation: string;
  /**
   * Critique-on line for sentence analysis. The caption stays `translation`.
   */
  analysisTranslation?: string;
  rawOriginal?: string;
  meaning?: string;
  literalMeaning?: string;
  tone?: {
    formality: string;
    politeness: string;
    intimacy: string;
    emotion: string;
    intensity: string;
    confidence: string;
    hesitation: string;
    humor: string;
    sarcasm: string;
    attitude: string;
  };
  speakerStyle?: string;
  interpretationConfidence?: number;
  confidence?: number;
  translationStatus?: "draft" | "final" | "english";
  /** Dev-only caption decision trace (never shown in production UI). */
  debug?: {
    original: string;
    scene?: {
      setting?: string;
      situation?: string;
      interaction?: string;
      mood?: string;
      visualCues?: string[];
      confidence?: number;
      startTime: number;
      endTime: number;
    };
    previous: string[];
    next: string[];
    meaning?: string;
    toneSummary?: string;
    finalSubtitle: string;
    nativeUnderstanding?: {
      understoodMeaning: string;
      references?: Array<{
        expression: string;
        refersTo: string;
        evidenceLevel?: string;
        confidence?: number;
      }>;
      intent?: string;
      tone?: string;
    };
  };
  /** Native-viewer understanding reused by 「이 표현은 뭐야?」. */
  nativeUnderstanding?: {
    understoodMeaning: string;
    references?: Array<{
      expression: string;
      refersTo: string;
      evidenceLevel?: string;
      confidence?: number;
    }>;
    intent?: string;
    tone?: string;
    establishedNote?: string;
    confidence?: number;
  };
};

export type VideoSubtitleAnalysis = {
  subtitleId: string;
  keyExpression: string;
  keyMeaning: string;
  /** Why this caption was chosen (learning layer — not shown on the caption itself). */
  whyThisSubtitle?: string;
  meaningInSentence: string;
  nuance: string;
  similar: string[];
};

export type VideoLearningSave = {
  id: string;
  sourceType: "video";
  original: string;
  translation: string;
  explanation: string;
  videoUrl: string;
  timestamp: number;
  languageCode: LearningLanguageCode;
  createdAt: number;
};

export const VIDEO_LEARNING_SAVES_KEY = "videoLearningSaves";

export function formatSubtitleTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export function parseYouTubeVideoId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const fromWatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (fromWatch?.[1]) return fromWatch[1];

  const fromShort = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed|shorts|live)\/)([a-zA-Z0-9_-]{11})/,
  );
  if (fromShort?.[1]) return fromShort[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

export function normalizeYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function parseYouTubeInput(raw: string):
  | { ok: true; videoId: string; url: string }
  | { ok: false; reason: "empty" | "invalid" } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: "empty" };
  const videoId = parseYouTubeVideoId(trimmed);
  if (!videoId) return { ok: false, reason: "invalid" };
  return { ok: true, videoId, url: normalizeYouTubeWatchUrl(videoId) };
}

export function cueHasUiLanguage(cue: VideoSubtitle): boolean {
  const translation = cue.translation.trim();
  if (!translation) return false;
  if (translation === cue.original.trim()) return false;
  return cue.translationStatus !== "english";
}

/** Opening spoken lines must have a learner-language gloss before playback. */
export function openingCuesHaveUiLanguage(cues: VideoSubtitle[]): boolean {
  const spoken = cues.filter((cue) => cue.original.trim());
  if (spoken.length === 0) return false;
  const firstStart = spoken[0]!.startTime;
  const opening = spoken
    .filter((cue) => cue.startTime <= firstStart + 12)
    .slice(0, 8);
  return opening.length > 0 && opening.every(cueHasUiLanguage);
}

export function findActiveSubtitle(
  currentTime: number,
  subtitles: VideoSubtitle[],
  mode: "english" | "korean" = "korean",
): VideoSubtitle | null {
  if (subtitles.length === 0) return null;

  const ready =
    mode === "english"
      ? subtitles.filter((cue) => cue.original.trim().length > 0)
      : subtitles.filter((cue) => {
          if (cue.translationStatus === "draft") return false;
          if (cue.translationStatus === "english") return false;
          const text = cue.translation.trim();
          if (!text) return false;
          if (text === cue.original.trim()) return false;
          return /[가-힣]/.test(text) || cue.translationStatus === "final";
        });
  if (ready.length === 0) return null;

  for (const cue of ready) {
    if (currentTime >= cue.startTime && currentTime < cue.endTime) {
      return cue;
    }
  }
  let best: VideoSubtitle | null = null;
  for (const cue of ready) {
    if (cue.endTime <= currentTime && currentTime - cue.endTime <= 0.35) {
      if (!best || cue.endTime > best.endTime) best = cue;
    }
  }
  return best;
}

function asSave(raw: unknown): VideoLearningSave | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id) return null;
  if (typeof o.original !== "string" || !o.original.trim()) return null;
  if (typeof o.translation !== "string") return null;
  if (typeof o.videoUrl !== "string") return null;
  return {
    id: o.id,
    sourceType: "video",
    original: o.original,
    translation: o.translation,
    explanation: typeof o.explanation === "string" ? o.explanation : "",
    videoUrl: o.videoUrl,
    timestamp: typeof o.timestamp === "number" ? o.timestamp : 0,
    languageCode: coerceLanguageCode(o.languageCode),
    createdAt: typeof o.createdAt === "number" ? o.createdAt : Date.now(),
  };
}

export function loadVideoLearningSaves(): VideoLearningSave[] {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(VIDEO_LEARNING_SAVES_KEY) || "[]",
    );
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(asSave)
      .filter((item): item is VideoLearningSave => item !== null);
  } catch {
    return [];
  }
}

export function persistVideoLearningSaves(items: VideoLearningSave[]) {
  localStorage.setItem(VIDEO_LEARNING_SAVES_KEY, JSON.stringify(items));
}

export function videoSaveKey(input: {
  videoUrl: string;
  original: string;
  timestamp: number;
}): string {
  return `${input.videoUrl}|${input.original}|${Math.floor(input.timestamp)}`;
}

export function isVideoSubtitleSaved(
  items: VideoLearningSave[],
  input: { videoUrl: string; original: string; timestamp: number },
): boolean {
  const key = videoSaveKey(input);
  return items.some(
    (item) =>
      videoSaveKey({
        videoUrl: item.videoUrl,
        original: item.original,
        timestamp: item.timestamp,
      }) === key,
  );
}

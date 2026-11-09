import { type LearningLanguageCode } from "@/lib/learningLanguages";

export type VideoSubtitle = {
  id: string;
  /** Source segments behind this cue; more than one means the pipeline merged them. */
  segmentIds?: string[];
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
          // "Has Hangul in it" used to stand in for "has been glossed", which
          // is what the status says, in whichever language the learner reads.
          return cue.translationStatus === "final";
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
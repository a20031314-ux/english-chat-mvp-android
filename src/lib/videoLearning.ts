export type VideoSubtitle = {
  id: string;
  startTime: number;
  endTime: number;
  original: string;
  translation: string;
  rawOriginal?: string;
  confidence?: number;
  translationStatus?: "draft" | "final";
};

export type VideoSubtitleAnalysis = {
  subtitleId: string;
  keyExpression: string;
  keyMeaning: string;
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

export function findActiveSubtitle(
  currentTime: number,
  subtitles: VideoSubtitle[],
): VideoSubtitle | null {
  if (subtitles.length === 0) return null;
  let current: VideoSubtitle | null = null;
  for (const cue of subtitles) {
    if (cue.startTime <= currentTime) current = cue;
    else break;
  }
  return current ?? subtitles[0] ?? null;
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

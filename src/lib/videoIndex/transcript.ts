/**
 * The words of a video, kept once for everybody.
 *
 * Preparing a video is the expensive part of video study: captions fetched or
 * speech transcribed, then cut into sentences by a model. Until now the result
 * lived on one learner's device, so the next person to open the same video paid
 * for all of it again — and on the web, where the server cannot reach YouTube's
 * audio, the video could not be opened at all even though somebody's phone had
 * already done the work.
 *
 * A record is only the learning-language speech: when each line starts and
 * ends, and what was said. No translation (that is per interface language and
 * per learner), nothing about who prepared it. That is also what makes it
 * searchable — the lines are what a study map's topic can be matched against
 * (videoIndex/match.ts).
 *
 * Pure: building and reading a record. Storage is lib/server/videoTranscriptStore.
 */

export const TRANSCRIPT_RECORD_VERSION = 1;

export type TranscriptSource =
  | "whisper"
  | "youtube-asr"
  | "youtube-manual"
  | "youtube-official-ui";

export type TranscriptLine = {
  /** Seconds from the start of the video. */
  start: number;
  end: number;
  text: string;
};

export type TranscriptRecord = {
  version: typeof TRANSCRIPT_RECORD_VERSION;
  videoId: string;
  /** Language the lines are spoken in. */
  language: string;
  title?: string;
  durationSeconds: number;
  source: TranscriptSource;
  lines: TranscriptLine[];
  preparedAt: number;
};

const SOURCES: TranscriptSource[] = [
  "whisper",
  "youtube-asr",
  "youtube-manual",
  "youtube-official-ui",
];

export const MAX_LINES = 2000;
const MAX_LINE_CHARS = 600;

const VIDEO_ID = /^[A-Za-z0-9_-]{6,20}$/;

function readLine(value: unknown): TranscriptLine | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const text =
    typeof row.text === "string"
      ? row.text.replace(/\s+/g, " ").trim().slice(0, MAX_LINE_CHARS)
      : "";
  const start = typeof row.start === "number" && Number.isFinite(row.start) ? row.start : NaN;
  const end = typeof row.end === "number" && Number.isFinite(row.end) ? row.end : NaN;
  if (!text || !(start >= 0) || !(end >= start)) return null;
  return { start: round(start), end: round(end), text };
}

function round(seconds: number): number {
  return Math.round(seconds * 100) / 100;
}

/**
 * Build a record from what the prepare pipeline produced. Returns null when
 * there is nothing worth keeping, so a failed or empty preparation is never
 * stored as if it were the video's words.
 */
export function buildTranscriptRecord(input: {
  videoId: string;
  language: string;
  title?: string;
  durationSeconds: number;
  source: string;
  segments: Array<{ startTime: number; endTime: number; text: string }>;
  now?: number;
}): TranscriptRecord | null {
  if (!VIDEO_ID.test(input.videoId)) return null;
  const language = input.language.trim().toLowerCase();
  if (!/^[a-z]{2,3}(-[a-z0-9]+)?$/.test(language)) return null;
  const source = SOURCES.find((value) => value === input.source);
  if (!source) return null;
  const lines = input.segments
    .map((segment) =>
      readLine({ start: segment.startTime, end: segment.endTime, text: segment.text }),
    )
    .filter((line): line is TranscriptLine => line !== null)
    .sort((a, b) => a.start - b.start)
    .slice(0, MAX_LINES);
  if (lines.length === 0) return null;
  const title = input.title?.replace(/\s+/g, " ").trim().slice(0, 200);
  return {
    version: TRANSCRIPT_RECORD_VERSION,
    videoId: input.videoId,
    language,
    ...(title ? { title } : {}),
    durationSeconds: Math.max(0, Math.round(input.durationSeconds || 0)),
    source,
    lines,
    preparedAt: input.now ?? Date.now(),
  };
}

/** Read a stored record; anything malformed reads as absent. */
export function parseTranscriptRecord(value: unknown): TranscriptRecord | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (row.version !== TRANSCRIPT_RECORD_VERSION) return null;
  if (!Array.isArray(row.lines)) return null;
  return buildTranscriptRecord({
    videoId: typeof row.videoId === "string" ? row.videoId : "",
    language: typeof row.language === "string" ? row.language : "",
    title: typeof row.title === "string" ? row.title : undefined,
    durationSeconds: typeof row.durationSeconds === "number" ? row.durationSeconds : 0,
    source: typeof row.source === "string" ? row.source : "",
    segments: row.lines.map((line) => {
      const l = (line ?? {}) as Record<string, unknown>;
      return {
        startTime: typeof l.start === "number" ? l.start : NaN,
        endTime: typeof l.end === "number" ? l.end : NaN,
        text: typeof l.text === "string" ? l.text : "",
      };
    }),
    now: typeof row.preparedAt === "number" ? row.preparedAt : 0,
  });
}

/**
 * The record's lines in the shape the prepare pipeline accepts as speech it
 * already has, so a stored video is prepared without captions or audio.
 */
export function transcriptAsSttSegments(record: TranscriptRecord): Array<{
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}> {
  return record.lines.map((line, index) => ({
    id: `kept-${index}`,
    text: line.text,
    startTime: line.start,
    endTime: line.end,
  }));
}

/** How fast and how long the speech runs — enough to judge it against a level. */
export function speechStats(record: TranscriptRecord): {
  words: number;
  wordsPerMinute: number;
  wordsPerLine: number;
} {
  const words = record.lines.reduce(
    (sum, line) => sum + line.text.split(/\s+/).filter(Boolean).length,
    0,
  );
  const spoken = record.lines.reduce((sum, line) => sum + Math.max(0, line.end - line.start), 0);
  return {
    words,
    wordsPerMinute: spoken > 0 ? Math.round((words / spoken) * 60) : 0,
    wordsPerLine: record.lines.length ? Math.round((words / record.lines.length) * 10) / 10 : 0,
  };
}

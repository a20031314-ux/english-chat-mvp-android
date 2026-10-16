import { createHash } from "node:crypto";
import { kvGetJson, kvSetJson } from "./kv.ts";

/**
 * Translations of video subtitle lines, kept so the next viewer of the same
 * video in the same language pair is not charged a model call for them.
 *
 * Everyone who opens a video after the first starts from the transcript kept
 * then (videoTranscriptStore), so their lines are the same words in the same
 * order. Nothing was keeping what those lines were translated to, and every
 * viewer of a library clip paid again for every line.
 *
 * Two shapes, for the two ways a line is translated:
 * - one line, when a learner taps its bar (`/api/translate` with a video id):
 *   `videoLine:v1:<target>:<ui>:<videoId>:<hash of the line>`;
 * - a batch of lines, which builds before 2.67 send for the whole video
 *   (`/api/video-subtitles/gloss`): keyed on the hash of the batch's lines,
 *   so the same slice of the same transcript finds the same record whoever
 *   sends it.
 *
 * Only translations are kept — the subtitle lines are the video's words,
 * already kept with its transcript; nothing a learner wrote is stored here.
 * Long-lived rather than permanent, like the transcripts.
 */

const TTL_SECONDS = 400 * 24 * 60 * 60;
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function isVideoId(value: unknown): value is string {
  return typeof value === "string" && VIDEO_ID.test(value);
}

export function videoLineKey(input: {
  targetLanguage: string;
  interfaceLanguage: string;
  videoId: string;
  text: string;
}): string {
  return `videoLine:v1:${input.targetLanguage}:${input.interfaceLanguage}:${input.videoId}:${hash(clean(input.text))}`;
}

export function glossBatchKey(input: {
  targetLanguage: string;
  interfaceLanguage: string;
  lines: string[];
}): string {
  return `videoGloss:v1:${input.targetLanguage}:${input.interfaceLanguage}:${hash(
    input.lines.map(clean).join("\n"),
  )}`;
}

export async function readVideoLine(
  key: string,
): Promise<string | null> {
  const stored = await kvGetJson<unknown>(key);
  return typeof stored === "string" && stored.trim() ? stored : null;
}

/** Failures are logged and swallowed: the learner already has the line. */
export async function keepVideoLine(key: string, translated: string): Promise<void> {
  if (!translated.trim()) return;
  try {
    await kvSetJson(key, translated, TTL_SECONDS);
  } catch (error) {
    console.error("[subtitle-gloss-store] line", error);
  }
}

export type KeptGlossItem = {
  interpretation: string;
  analysisTranslation?: string;
};

/**
 * A batch, stored by position rather than by cue id: ids are minted on the
 * device and need not agree between two viewers, while the lines do.
 */
export async function readGlossBatch(key: string): Promise<KeptGlossItem[] | null> {
  const stored = await kvGetJson<unknown>(key);
  if (!Array.isArray(stored)) return null;
  const items: KeptGlossItem[] = [];
  for (const row of stored) {
    if (!row || typeof row !== "object") return null;
    const interpretation = (row as { interpretation?: unknown }).interpretation;
    const analysis = (row as { analysisTranslation?: unknown }).analysisTranslation;
    if (typeof interpretation !== "string") return null;
    items.push({
      interpretation,
      ...(typeof analysis === "string" && analysis ? { analysisTranslation: analysis } : {}),
    });
  }
  return items;
}

export async function keepGlossBatch(key: string, items: KeptGlossItem[]): Promise<void> {
  // A batch with an empty line is a partial answer; keeping it would hand the
  // gap to every later viewer as if it were the translation.
  if (items.length === 0 || items.some((item) => !item.interpretation.trim())) return;
  try {
    await kvSetJson(key, items, TTL_SECONDS);
  } catch (error) {
    console.error("[subtitle-gloss-store] batch", error);
  }
}

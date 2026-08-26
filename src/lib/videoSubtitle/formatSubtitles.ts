import type { SubtitleDraft } from "./subtitleDraft";
import type { NormalizedSegment, SubtitleSegment } from "./types";

const MAX_CHARS = 42;

function charLen(text: string): number {
  return [...text].length;
}

/**
 * Soft line breaks for display only — does NOT create new timed cues.
 * Timing must stay aligned with the original speech/caption span.
 */
export function splitReadable(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const explicit = normalized
    .split("\n")
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (explicit.length > 1) {
    return explicit.flatMap((line) =>
      charLen(line) <= MAX_CHARS ? [line] : splitLongLine(line),
    );
  }

  return splitLongLine(explicit[0] ?? normalized.replace(/\s+/g, " ").trim());
}

function splitLongLine(trimmed: string): string[] {
  if (!trimmed) return [];
  if (charLen(trimmed) <= MAX_CHARS) return [trimmed];

  const sentences = trimmed
    .split(
      /(?<=(?:다|요|죠|까|네|습니다|해요|예요|이에요|네요)[.?!]?)(?:\s+|$)|(?<=[.?!])\s+/,
    )
    .map((part) => part.trim())
    .filter(Boolean);

  const lines: string[] = [];
  for (const sentence of sentences.length ? sentences : [trimmed]) {
    if (charLen(sentence) <= MAX_CHARS) {
      lines.push(sentence);
      continue;
    }
    const chunks = sentence.split(/(?<=,|만|고|는데|지만|니까|거든요)\s+/);
    let buf = "";
    for (const chunk of chunks) {
      const next = buf ? `${buf} ${chunk}` : chunk;
      if (charLen(next) <= MAX_CHARS) {
        buf = next;
      } else {
        if (buf) lines.push(buf);
        buf = chunk;
      }
    }
    if (buf) lines.push(buf);
  }
  return lines.length ? lines : [trimmed];
}

/**
 * One meaning unit → one timed cue.
 * Keep STT/caption timestamps; never stretch end past the next cue.
 */
export function formatSubtitleDrafts(drafts: SubtitleDraft[]): SubtitleSegment[] {
  const sorted = [...drafts].sort((a, b) => a.startTime - b.startTime);
  const cues: SubtitleSegment[] = [];

  for (let i = 0; i < sorted.length; i += 1) {
    const draft = sorted[i]!;
    // Never drop a timed cue — empty Korean would create mid-video gaps.
    const translation =
      draft.naturalSubtitle.trim() ||
      (draft.literalMeaning || "").trim() ||
      (draft.meaning || "").trim() ||
      draft.original.trim();
    if (!translation) continue;
    const parts = splitReadable(translation);
    const display =
      parts.length > 1 ? parts.join("\n") : parts[0] ?? translation;

    const next = sorted[i + 1];
    let endTime = Math.max(draft.startTime + 0.3, draft.endTime);
    if (next) {
      // Clamp every overlap, not just the small ones. A cue that ran past the
      // next one kept winning the active-cue lookup, so the caption lagged the
      // speech and clip playback ran on into the following line.
      const limit = Math.max(draft.startTime + 0.25, next.startTime);
      if (endTime > limit) endTime = limit;
    }

    const analysis =
      (draft.analysisTranslation || "").replace(/\s+/g, " ").trim();
    const captionKey = display.replace(/\s+/g, " ").trim();
    const analysisTranslation =
      analysis && analysis !== captionKey ? analysis : undefined;
    cues.push({
      id: draft.id,
      segmentIds: draft.segmentIds,
      startTime: draft.startTime,
      endTime,
      rawOriginal: draft.original,
      original: draft.original,
      translation: display,
      ...(analysisTranslation ? { analysisTranslation } : {}),
      meaning: draft.meaning,
      literalMeaning: draft.meaning,
      tone: draft.tone,
      speakerStyle: draft.speakerStyle,
      interpretationConfidence: draft.interpretationConfidence,
      confidence: draft.confidence,
      translationStatus: "final",
      analysis: draft.uncertain ? { flags: ["uncertain-stt"] } : undefined,
    });
  }
  return cues;
}

/** Legacy path: one string per STT segment id. */
export function formatSubtitles(input: {
  segments: NormalizedSegment[];
  translations: Map<string, string>;
  literalMeanings?: Map<string, string>;
}): SubtitleSegment[] {
  const drafts: SubtitleDraft[] = input.segments.map((segment) => {
    const natural = (input.translations.get(segment.id) || "").trim();
    const meaning =
      (input.literalMeanings?.get(segment.id) || natural).trim() || natural;
    return {
      id: segment.id,
      segmentIds: [segment.id],
      startTime: segment.startTime,
      endTime: segment.endTime,
      original: segment.normalizedText,
      meaning,
      tone: {
        formality: "neutral",
        politeness: "neutral",
        intimacy: "neutral",
        emotion: "neutral",
        intensity: "medium",
        confidence: "medium",
        hesitation: "none",
        humor: "none",
        sarcasm: "none",
        attitude: "neutral",
      },
      speakerStyle: "spoken",
      naturalSubtitle: natural,
      interpretationConfidence: 0.5,
      literalMeaning: meaning,
      confidence: segment.confidence,
      uncertain: segment.uncertain,
    };
  });
  return formatSubtitleDrafts(drafts);
}

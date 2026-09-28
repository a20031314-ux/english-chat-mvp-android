import { asNumber, asRecord, asString } from "./parseModelJson.ts";
import type { SttSegment, SttWord } from "./types";

/** Longer than any one sentence. Past this the array is not a sentence's words. */
const MAX_WORDS_PER_SEGMENT = 400;

function asWord(value: unknown): SttWord | null {
  const row = asRecord(value);
  if (!row) return null;
  const word = asString(row.word);
  const start = asNumber(row.start);
  const end = asNumber(row.end);
  if (!word || start == null || end == null) return null;
  if (start < 0 || end < start) return null;
  return { word, start, end };
}

/**
 * One transcript line as the app sends it — word stamps included.
 *
 * The stamps are the whole point of this file. The app transcribes on device,
 * so its segments arrive over HTTP with a `words` array carrying where each
 * word actually falls; the parser this replaced read only id, text and the two
 * ends, and the array was dropped on the floor. Everything downstream then
 * rebuilt word positions by dividing the line evenly at a fixed 3.2 words a
 * second (timedWords.ts), which is roughly right for a news reader and wrong
 * for anybody talking quickly. Sentence cuts are word-index slices, so a
 * boundary placed on a guessed position lands mid-phrase, and a line whose
 * guessed length outruns the real one holds the screen into the next pause.
 *
 * Measured on a 17-word line: spoken at 3.2 words a second the guess and the
 * stamps agree to the frame, and at 6 it keeps the line up 5.5 seconds for 3.0
 * seconds of speech. Which is exactly the complaint — fast video, wrong times.
 *
 * Nothing verifies the numbers beyond their shape. They do not have to be
 * trusted: timedWords.ts checks the words against the line's own text and
 * falls back to interpolation when they do not cover it.
 */
export function parseSttSegment(value: unknown): SttSegment | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asString(row.id);
  const text = asString(row.text);
  const startTime = asNumber(row.startTime);
  const endTime = asNumber(row.endTime);
  if (!id || !text || startTime == null || endTime == null) return null;
  const words = Array.isArray(row.words)
    ? row.words
        .slice(0, MAX_WORDS_PER_SEGMENT)
        .map(asWord)
        .filter((word): word is SttWord => word !== null)
    : [];
  return {
    id,
    text,
    startTime,
    endTime,
    ...(words.length > 0 ? { words } : {}),
    confidence: asNumber(row.confidence) ?? undefined,
    uncertain: row.uncertain === true,
  };
}

export function parseSttSegments(value: unknown, limit: number): SttSegment[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(parseSttSegment)
    .filter((row): row is SttSegment => row !== null)
    .slice(0, limit);
}

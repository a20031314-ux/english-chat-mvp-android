import type { NormalizedSegment, SttSegment } from "./types";

/**
 * How long one study line may hold the screen.
 *
 * Two bad shapes are possible here and the budget sits between them. Left at
 * whole sentences, a caption can run twenty-five seconds while the speaker has
 * moved on — that is what sent the display spine to the device's own caption
 * lines in the first place. Taken from those lines instead, the learner reads
 * where the display broke rather than where the sentence did: measured on two
 * real tracks, 54% of the lines of a TED-Ed talk and 76% of a fast product
 * video's ended mid-sentence, and a fragment is also what the analyse button
 * is handed.
 *
 * Ten seconds keeps the sentence whole for about nine in ten of them — across
 * the four tracks measured the median sentence ran 5.5 to 7.6 seconds and the
 * ninetieth percentile 9.5 to 13.5 — and cuts only the ones long enough to
 * stop following the talking.
 */
const MAX_CUE_SECONDS = 10;

/** Below this a part is a fragment, not a line to read. */
const MIN_PART_SECONDS = 1.6;

function overlapSeconds(
  a: { startTime: number; endTime: number },
  b: { startTime: number; endTime: number },
): number {
  return Math.min(a.endTime, b.endTime) - Math.max(a.startTime, b.startTime);
}

function joinLineText(lines: SttSegment[]): string {
  return lines
    .map((line) => line.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The caption lines that belong to a sentence, each to its best overlap. */
function linesBySentence(
  sentences: NormalizedSegment[],
  lines: SttSegment[],
): Map<string, SttSegment[]> {
  const byId = new Map<string, SttSegment[]>();
  for (const line of lines) {
    let best: NormalizedSegment | null = null;
    let bestOverlap = 0;
    for (const sentence of sentences) {
      const overlap = overlapSeconds(line, sentence);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        best = sentence;
      }
    }
    if (!best || bestOverlap <= 0) continue;
    const rows = byId.get(best.id);
    if (rows) rows.push(line);
    else byId.set(best.id, [line]);
  }
  return byId;
}

/**
 * Cut one long sentence at the caption breaks inside it.
 *
 * The cuts have to fall somewhere, and a caption line's start is a break the
 * source already chose. Parts are aimed at equal lengths so a sentence does
 * not end in a half-second scrap.
 */
function splitSentence(
  sentence: NormalizedSegment,
  lines: SttSegment[],
): NormalizedSegment[] {
  const span = sentence.endTime - sentence.startTime;
  const parts = Math.ceil(span / MAX_CUE_SECONDS);
  const starts = [sentence.startTime];
  for (let i = 1; i < parts; i += 1) {
    const target = sentence.startTime + (span * i) / parts;
    let best = -1;
    let bestDistance = Infinity;
    for (const line of lines) {
      const previous = starts[starts.length - 1]!;
      if (line.startTime <= previous + MIN_PART_SECONDS) continue;
      if (line.startTime >= sentence.endTime - MIN_PART_SECONDS) continue;
      const distance = Math.abs(line.startTime - target);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = line.startTime;
      }
    }
    if (best < 0) break;
    starts.push(best);
  }
  if (starts.length < 2) return [sentence];

  const out: NormalizedSegment[] = [];
  for (let i = 0; i < starts.length; i += 1) {
    const startTime = starts[i]!;
    const endTime = starts[i + 1] ?? sentence.endTime;
    const mine = lines.filter((line) => {
      const middle = (line.startTime + line.endTime) / 2;
      return line.startTime >= startTime && line.startTime < endTime
        ? true
        : middle >= startTime && middle < endTime;
    });
    const text = joinLineText(mine);
    if (!text) continue;
    out.push({
      ...sentence,
      id: i === 0 ? sentence.id : `${sentence.id}-p${i + 1}`,
      startTime,
      endTime,
      rawText: text,
      normalizedText: text,
    });
  }
  return out.length > 1 ? out : [sentence];
}

/**
 * Study lines to show while the video plays.
 *
 * The server groups the speech into sentences, which is what the reading and
 * the analyse button want, and the device holds the caption lines underneath
 * them, which is what following along wants. Taking one or the other is the
 * choice this used to make — whichever had more rows — and both answers are
 * wrong in their own way. So the sentence is the unit, and the caption lines
 * are used only to break the few that run too long to stay on screen.
 *
 * With no lines to break them by — a caption track that arrives as one block
 * of timed words, which is every track read as json3 — the sentences are
 * returned as they came.
 */
export function displaySpineFromSentences(
  sentences: NormalizedSegment[],
  lines: SttSegment[],
): NormalizedSegment[] {
  if (sentences.length === 0) return sentences;
  if (lines.length < 2) return sentences;
  const byId = linesBySentence(sentences, lines);
  const out: NormalizedSegment[] = [];
  for (const sentence of sentences) {
    const mine = byId.get(sentence.id) ?? [];
    if (sentence.endTime - sentence.startTime <= MAX_CUE_SECONDS || mine.length < 2) {
      out.push(sentence);
      continue;
    }
    out.push(...splitSentence(sentence, mine));
  }
  return out;
}

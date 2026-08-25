import type { NormalizedSegment } from "./types";

export type MeaningUnit = {
  id: string;
  segmentIds: string[];
  startTime: number;
  endTime: number;
  original: string;
  previousTexts: string[];
  nextTexts: string[];
  confidence?: number;
  uncertain?: boolean;
  /** Soft hints from transcript markers only — never sole evidence for emotion. */
  voiceHints?: string[];
};

/** Merge STT crumbs into a sentence; do not cap to a clock beat. */
const MAX_SEGMENTS_PER_UNIT = 8;
const MAX_CHARS_PER_UNIT = 240;
const MAX_UNIT_SECONDS = 14;
const MAX_GAP_SECONDS = 0.9;
/** When the previous line clearly needs a complement, allow a longer join. */
const OPEN_TAIL_MAX_SECONDS = 18;
const OPEN_TAIL_MAX_CHARS = 320;

const CONTINUATION_START =
  /^(and|or|but|because|so|then|which|to|of|for|with|without|by|from|into|onto|is|are|was|were|been|being)\b/i;

const NEEDS_COMPLEMENT_END =
  /\b(tell|told|telling|make|made|making|take|took|give|gave|let|put|keep|want|wanted|try|tried|trying|need|needed|ask|asked|show|shown|call|called)\s*$/i;

const CLAUSE_VERB =
  /\b(am|is|are|was|were|be|been|being|'s|'re|'m|do|does|did|have|has|had|'ve|will|would|can|could|should|might|may|need|needs|needed|go|goes|went|get|got|know|think|want|said|say|make|made|take|see|come|came|tell|told|leave|left|call|called|talk|keep|try|tried|ask|asked|show|give|gave|feel|look|like|love|use|used|start|stop|work|play|mean|seem)\b/i;

const DANGLING_END =
  /\b(already|just|really|very|been|being|getting|going|gonna|wanna|gotta|kinda|adding|making|taking|giving|looking|trying|saying|using|putting|more|most|less|so|too|not|never|always|still|also|even|only|had|have|has|was|were|is|are|am|will|would|could|should|can|do|does|did|to|a|an|the)\s*$/i;

/** Trailing words that usually expect a complement (STT often splits here). */
const OPEN_NOUN_PHRASE_END =
  /\b(a|an|the|my|your|our|their|his|her|its|this|that|these|those)\s+(first|last|next|other|same|new|old|good|bad|little|big|more|most|few|many|own|only|main|real|right|wrong|best|worst)\s*[.!?…]?$/i;

function avgConfidence(segments: NormalizedSegment[]): number | undefined {
  const values = segments
    .map((segment) => segment.confidence)
    .filter((value): value is number => typeof value === "number");
  if (values.length === 0) return undefined;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stripTrailingPunct(text: string): string {
  return text.trim().replace(/[.!?…]+$/g, "").trim();
}

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/^[^a-z0-9가-힣]+|[^a-z0-9가-힣]+$/gi, "");
}

function stripLeadingOverlap(previous: string, next: string): string {
  const prevWords = previous.split(/\s+/).filter(Boolean);
  const nextWords = next.split(/\s+/).filter(Boolean);
  if (prevWords.length === 0 || nextWords.length === 0) return next;
  const max = Math.min(6, prevWords.length, nextWords.length);
  for (let count = max; count >= 1; count -= 1) {
    if (count === nextWords.length && nextWords.length > 4) continue;
    const left = prevWords.slice(-count).map(normalizeToken).join(" ");
    const right = nextWords.slice(0, count).map(normalizeToken).join(" ");
    if (left && left === right) return nextWords.slice(count).join(" ");
  }
  return next;
}

function dedupeRepeatedWords(text: string): string {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const word of words) {
    const prev = out[out.length - 1];
    if (prev && normalizeToken(prev) === normalizeToken(word) && normalizeToken(word).length >= 3) {
      continue;
    }
    out.push(word);
  }
  return out.join(" ");
}

function looksIncomplete(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (/[다요죠까네임음]$/.test(trimmed)) return false;

  // STT often plants a period before the noun: "as a first." + "language."
  if (OPEN_NOUN_PHRASE_END.test(trimmed)) return true;

  const hasTerminal = /[.!?…]"?$/.test(trimmed);
  const core = stripTrailingPunct(trimmed);
  if (!core) return true;

  if (hasTerminal) {
    const lastWord = core.split(/\s+/).pop() || "";
    // False period after a function word: "going to." / "kind of."
    if (
      /^(a|an|the|to|of|for|with|and|or|but|as|by|from|into|my|your|our|their|his|her|its)$/i.test(
        lastWord,
      )
    ) {
      return true;
    }
    return DANGLING_END.test(core);
  }

  if (endsWithOpenFunctionWord(trimmed) || OPEN_NOUN_PHRASE_END.test(trimmed)) {
    return true;
  }
  if (DANGLING_END.test(core) || NEEDS_COMPLEMENT_END.test(core)) return true;
  const words = core.split(/\s+/).filter(Boolean).length;
  if (
    /^(the reason|the thing|what i|what we|how i|how we)\b/i.test(core) &&
    !/\b(is|was|are|were|'s)\b/i.test(core)
  ) {
    return true;
  }
  if (words <= 2 && !looksStandaloneReaction(trimmed)) return true;
  if (words <= 4 && !CLAUSE_VERB.test(trimmed)) return true;
  // Unpunctuated but already a spoken thought — do not keep gluing fast speech.
  return false;
}

function looksContinuation(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return CONTINUATION_START.test(trimmed);
}

/** Stray STT crumb like "Colored." / "language." / "Stacy." that should not stand alone. */
function looksOrphanFragment(text: string): boolean {
  const core = text
    .trim()
    .replace(/^["'`]+/, "")
    .replace(/["'`.!?…]+$/g, "")
    .trim();
  if (!core) return true;
  const words = core.split(/\s+/).filter(Boolean);
  if (words.length === 1 && core.length <= 28) return true;
  if (words.length === 2 && core.length <= 20) return true;
  return false;
}

/** Short turn that can stand alone as its own beat after a finished sentence. */
function looksStandaloneReaction(text: string): boolean {
  const core = text
    .trim()
    .replace(/^["'`]+/, "")
    .replace(/["']+$/g, "")
    .trim();
  return /^(yeah|yes|yep|yup|no|nope|ok|okay|right|sure|hmm+|mm+|mhm|uh-huh|thanks|thank you|wow|oh|ah|huh|sorry|please|hello|hi|hey)[.!?…]*$/i.test(
    core,
  );
}

/** Lowercase start is a continuation only for short crumbs / clause glue. */
function looksLowercaseContinuation(text: string): boolean {
  const trimmed = text.trim();
  if (!/^[a-z]/.test(trimmed)) return false;
  if (CONTINUATION_START.test(trimmed)) return true;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  return words <= 3;
}

/** A full spoken thought, even when ASR omitted the period. */
function looksFinishedThought(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (endsWithOpenFunctionWord(trimmed) || OPEN_NOUN_PHRASE_END.test(trimmed)) {
    return false;
  }
  if (DANGLING_END.test(stripTrailingPunct(trimmed))) return false;
  if (NEEDS_COMPLEMENT_END.test(stripTrailingPunct(trimmed))) return false;
  if (
    /^(the reason|the thing|what i|what we|how i|how we)\b/i.test(trimmed) &&
    !/\b(is|was|are|were|'s)\b/i.test(trimmed)
  ) {
    return false;
  }
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  if (/[.!?…]"?$/.test(trimmed) && !looksIncomplete(trimmed) && words >= 3) {
    return true;
  }
  if (CONTINUATION_START.test(trimmed)) return false;
  if (words >= 5 && CLAUSE_VERB.test(trimmed) && /^[A-Z]/.test(trimmed)) {
    return true;
  }
  if (words >= 6 && CLAUSE_VERB.test(trimmed)) return true;
  if (words >= 8) return true;
  return false;
}

function looksParallelLyric(prev: string, next: string): boolean {
  const left = prev.trim().split(/\s+/).filter(Boolean);
  const right = next.trim().split(/\s+/).filter(Boolean);
  if (left.length < 4 || right.length < 4) return false;
  const a = left.slice(0, 2).join(" ").toLowerCase();
  const b = right.slice(0, 2).join(" ").toLowerCase();
  return Boolean(a) && a === b;
}

/** Ends on a word that cannot finish a thought (e.g. "... you are the.", "... he didn't"). */
function endsWithOpenFunctionWord(text: string): boolean {
  const core = stripTrailingPunct(text.trim());
  if (!core) return true;
  const last = core.split(/\s+/).pop() || "";
  // Contractions that still need a verb/complement: didn't / don't / won't …
  if (/^[a-z]+n't$/i.test(last)) return true;
  return /^(a|an|the|to|of|for|with|and|or|but|as|by|from|into|at|in|on|my|your|our|their|his|her|its|this|these|those|what|which|whose|whom|who|how|where|when|why|is|are|was|were|be|been|being|am|do|does|did|have|has|had|will|would|could|should|can|must|might|may|to)$/i.test(
    last,
  );
}

/**
 * Merge mid-sentence STT splits and orphan crumbs (e.g. "already" + "Colored.",
 * "as a first." + "language.", "Gwen" + "Stacy.", "... the." + "Nicest...").
 */
function shouldMerge(
  current: NormalizedSegment[],
  next: NormalizedSegment,
): boolean {
  if (current.length >= MAX_SEGMENTS_PER_UNIT) return false;
  const first = current[0]!;
  const last = current[current.length - 1]!;
  const gap = next.startTime - last.endTime;
  const incompleteGuess =
    looksIncomplete(last.normalizedText) ||
    endsWithOpenFunctionWord(last.normalizedText);
  const mergeGap = incompleteGuess ? 1.45 : MAX_GAP_SECONDS;
  if (gap > mergeGap || gap < -1.8) return false;

  const joinedPrev = current.map((segment) => segment.normalizedText).join(" ");
  const openTail =
    endsWithOpenFunctionWord(joinedPrev) ||
    endsWithOpenFunctionWord(last.normalizedText);
  const nextLooksFinished =
    /[.!?…]"?$/.test(next.normalizedText.trim()) &&
    /^[A-Z]/.test(next.normalizedText.trim());
  // A pause plus a finished new sentence should not glue onto an open crumb.
  if (nextLooksFinished && gap >= 0.45 && !openTail) {
    return false;
  }
  if (
    looksContinuation(next.normalizedText) &&
    !looksStandaloneReaction(next.normalizedText) &&
    gap <= MAX_GAP_SECONDS &&
    !/[.!?…]"?$/.test(joinedPrev.trim())
  ) {
    return true;
  }
  const incomplete = looksIncomplete(joinedPrev) || openTail;
  const maxSpan =
    openTail || incomplete ? OPEN_TAIL_MAX_SECONDS : MAX_UNIT_SECONDS;
  const maxChars =
    openTail || incomplete ? OPEN_TAIL_MAX_CHARS : MAX_CHARS_PER_UNIT;

  const span = next.endTime - first.startTime;
  if (span > maxSpan) return false;

  const joined =
    `${current.map((s) => s.normalizedText).join(" ")} ${next.normalizedText}`.trim();
  if ([...joined].length > maxChars) return false;

  const continuation = looksContinuation(next.normalizedText);
  const orphanNext = looksOrphanFragment(next.normalizedText);
  const lowercaseNext = looksLowercaseContinuation(next.normalizedText);
  const prevHasTerminal = /[.!?…]"?$/.test(last.normalizedText.trim());
  const reactionNext = looksStandaloneReaction(next.normalizedText);

  // "... are the." / "... he didn't" MUST take the following complement.
  if (openTail && !reactionNext) {
    return true;
  }

  const wordsOf = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
  const prevFinished = looksFinishedThought(joinedPrev);
  const nextFinished = looksFinishedThought(next.normalizedText);
  if (looksParallelLyric(last.normalizedText, next.normalizedText) && !openTail) {
    return false;
  }
  const prevLooksLikeCaptionLine =
    prevFinished &&
    !openTail &&
    !endsWithOpenFunctionWord(last.normalizedText) &&
    !DANGLING_END.test(stripTrailingPunct(last.normalizedText));
  const nextLooksLikeCaptionLine =
    nextFinished &&
    !continuation &&
    !lowercaseNext;
  // Karaoke/ASR lines are often unpunctuated full thoughts. Do not glue verse
  // lines just because they sit on adjacent clocks.
  if (prevLooksLikeCaptionLine && nextLooksLikeCaptionLine && prevFinished) {
    return false;
  }
  if (prevFinished && nextFinished && !continuation && !lowercaseNext && !openTail) {
    return false;
  }
  if (
    prevFinished &&
    !openTail &&
    !continuation &&
    wordsOf(next.normalizedText) >= 5 &&
    !lowercaseNext &&
    !orphanNext
  ) {
    return false;
  }
  if (
    !prevFinished &&
    wordsOf(last.normalizedText) <= 6 &&
    !reactionNext &&
    (incomplete || openTail || looksIncomplete(last.normalizedText))
  ) {
    return true;
  }

  // Capitalized VP after an unfinished clause: "... didn't" + "Murder us..."
  if (
    incomplete &&
    !reactionNext &&
    gap <= MAX_GAP_SECONDS &&
    /^[A-Z]/.test(next.normalizedText.trim())
  ) {
    return true;
  }

  if (
    incomplete &&
    (continuation || orphanNext || lowercaseNext)
  ) {
    return true;
  }
  if (incomplete && gap <= 1.2) {
    if (
      prevFinished &&
      nextFinished &&
      !openTail &&
      !continuation &&
      !lowercaseNext
    ) {
      return false;
    }
    if (
      wordsOf(last.normalizedText) >= 5 &&
      wordsOf(next.normalizedText) >= 5 &&
      !openTail &&
      !continuation &&
      !lowercaseNext
    ) {
      return false;
    }
    return true;
  }
  // Lonely content crumbs (names, final nouns) always attach to the previous beat.
  if (orphanNext && !reactionNext) {
    return true;
  }
  // "Yeah." / "Ok." only join when the previous line was unfinished.
  if (orphanNext && reactionNext && !prevHasTerminal) {
    return true;
  }
  if (
    orphanNext &&
    lowercaseNext &&
    !prevHasTerminal &&
    gap <= 0.45
  ) {
    return true;
  }
  return false;
}

function voiceHintsFromText(text: string): string[] {
  const hints: string[] = [];
  const lower = text.toLowerCase();
  if (/\[laughter\]|\[laughs?\]|\(laughs?\)/i.test(text)) hints.push("laughter");
  if (/\[sigh\]|\(sighs?\)/i.test(text)) hints.push("sigh");
  if (/\[pause\]|\.\.\.|…/.test(text)) hints.push("pause");
  if (/\[applause\]/i.test(text)) hints.push("applause");
  if (/\buh+\b|\bum+\b|\ber+\b/i.test(lower)) hints.push("hesitation-filler");
  return hints;
}

function buildUnit(
  members: NormalizedSegment[],
  all: NormalizedSegment[],
  previousWindow: string[],
  nextWindow: string[],
): MeaningUnit {
  const startIndex = all.findIndex((segment) => segment.id === members[0]!.id);
  const endIndex = startIndex + members.length;
  const localPrev = all
    .slice(Math.max(0, startIndex - 5), startIndex)
    .map((segment) => segment.normalizedText);
  const localNext = all
    .slice(endIndex, Math.min(all.length, endIndex + 3))
    .map((segment) => segment.normalizedText);

  const previousTexts = [
    ...previousWindow.filter((text) => !localPrev.includes(text)),
    ...localPrev,
  ].slice(-5);
  const nextTexts = [
    ...localNext,
    ...nextWindow.filter((text) => !localNext.includes(text)),
  ].slice(0, 3);

  const original = dedupeRepeatedWords(
    members
      .map((segment) => segment.normalizedText.trim())
      .filter(Boolean)
      .reduce((joined, text) => {
        if (!joined) return text;
        const rest = stripLeadingOverlap(joined, text);
        return rest ? `${joined} ${rest}` : joined;
      }, ""),
  );
  const voiceHints = voiceHintsFromText(original);

  return {
    id: `mu-${members[0]!.id}`,
    segmentIds: members.map((segment) => segment.id),
    startTime: members[0]!.startTime,
    endTime: members[members.length - 1]!.endTime,
    original,
    previousTexts,
    nextTexts,
    confidence: avgConfidence(members),
    uncertain: members.some((segment) => segment.uncertain),
    ...(voiceHints.length ? { voiceHints } : {}),
  };
}

/**
 * Build short timed units for on-screen captions / study lines.
 * Previous/next text is context for AI only — timestamps stay on speech cues.
 */
export function groupMeaningUnits(input: {
  currentSegments: NormalizedSegment[];
  previousSegments?: NormalizedSegment[];
  nextSegments?: NormalizedSegment[];
}): MeaningUnit[] {
  const current = input.currentSegments;
  if (current.length === 0) return [];

  const previousWindow = (input.previousSegments ?? []).map(
    (segment) => segment.normalizedText,
  );
  const nextWindow = (input.nextSegments ?? []).map(
    (segment) => segment.normalizedText,
  );
  const all = [
    ...(input.previousSegments ?? []),
    ...current,
    ...(input.nextSegments ?? []),
  ];

  const units: MeaningUnit[] = [];
  let bucket: NormalizedSegment[] = [];

  for (const segment of current) {
    if (bucket.length === 0) {
      bucket = [segment];
      continue;
    }
    if (shouldMerge(bucket, segment)) {
      bucket.push(segment);
      continue;
    }
    units.push(buildUnit(bucket, all, previousWindow, nextWindow));
    bucket = [segment];
  }
  if (bucket.length > 0) {
    units.push(buildUnit(bucket, all, previousWindow, nextWindow));
  }
  for (let i = 1; i < units.length; i += 1) {
    const prev = units[i - 1]!;
    const current = units[i]!;
    const stripped = dedupeRepeatedWords(
      stripLeadingOverlap(prev.original, current.original),
    );
    if (!stripped) {
      prev.endTime = Math.max(prev.endTime, current.endTime);
      prev.segmentIds = [...prev.segmentIds, ...current.segmentIds];
      units.splice(i, 1);
      i -= 1;
      continue;
    }
    current.original = stripped;
  }
  return refineMeaningUnits(units);
}

function unitAsSegment(unit: MeaningUnit): NormalizedSegment {
  return {
    id: unit.id,
    startTime: unit.startTime,
    endTime: unit.endTime,
    rawText: unit.original,
    normalizedText: unit.original,
    confidence: unit.confidence,
  };
}

function joinUnitText(left: string, right: string): string {
  return dedupeRepeatedWords(
    [left.trim(), stripLeadingOverlap(left, right).trim()]
      .filter(Boolean)
      .join(" "),
  );
}

function mergeRefinedUnits(left: MeaningUnit, right: MeaningUnit): MeaningUnit {
  return {
    ...left,
    original: joinUnitText(left.original, right.original),
    endTime: Math.max(left.endTime, right.endTime),
    segmentIds: [...left.segmentIds, ...right.segmentIds],
    confidence:
      left.confidence != null && right.confidence != null
        ? (left.confidence + right.confidence) / 2
        : left.confidence ?? right.confidence,
    uncertain: Boolean(left.uncertain || right.uncertain),
    nextTexts: right.nextTexts,
  };
}

function allocateUnitParts(unit: MeaningUnit, parts: string[]): MeaningUnit[] {
  const duration = Math.max(0.3, unit.endTime - unit.startTime);
  const total = parts.reduce((sum, part) => sum + part.length, 0) || 1;
  let cursor = unit.startTime;
  return parts.map((part, index) => {
    const span = duration * (part.length / total);
    const startTime = cursor;
    const endTime =
      index === parts.length - 1 ? unit.endTime : cursor + span;
    cursor = endTime;
    return {
      ...unit,
      id: index === 0 ? unit.id : `${unit.id}-v${index}`,
      original: part,
      startTime,
      endTime: Math.max(startTime + 0.25, endTime),
      segmentIds:
        index === 0 ? unit.segmentIds : [`${unit.id}-v${index}`],
    };
  });
}

function splitRunOnUnit(unit: MeaningUnit): MeaningUnit[] {
  const text = unit.original.replace(/\s+/g, " ").trim();
  if (!text) return [unit];

  const punctParts = text
    .split(/(?<=[.!?…])["']?\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (
    punctParts.length >= 2 &&
    punctParts.every((part) => part.split(/\s+/).filter(Boolean).length >= 4)
  ) {
    const safeBreaks = punctParts.every((part, index) => {
      if (index === punctParts.length - 1) return true;
      return looksFinishedThought(part) && !looksIncomplete(part);
    });
    if (safeBreaks) return allocateUnitParts(unit, punctParts);
  }

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 10) return [unit];
  for (let index = 4; index <= words.length - 4; index += 1) {
    const left = words.slice(0, index).join(" ");
    const right = words.slice(index).join(" ");
    const nextWord = (words[index] ?? "").replace(/[^a-zA-Z']/g, "");
    if (
      looksFinishedThought(left) &&
      !endsWithOpenFunctionWord(left) &&
      /^(I|We|You|They|He|She|And|But|So|Then)$/.test(nextWord) &&
      looksFinishedThought(right)
    ) {
      return allocateUnitParts(unit, [left, right]);
    }
  }
  return [unit];
}

function mergeFragmentUnits(units: MeaningUnit[]): MeaningUnit[] {
  const out: MeaningUnit[] = [];
  for (const unit of units) {
    const prev = out[out.length - 1];
    if (prev && shouldMerge([unitAsSegment(prev)], unitAsSegment(unit))) {
      out[out.length - 1] = mergeRefinedUnits(prev, unit);
      continue;
    }
    out.push({ ...unit });
  }
  return out;
}

/**
 * Second look at 1st-pass study lines: split run-on cues, then merge
 * leftover fragments. Does not replace the first grouping pass.
 */
export function refineMeaningUnits(units: MeaningUnit[]): MeaningUnit[] {
  if (units.length === 0) return units;
  const split = units.flatMap((unit) => splitRunOnUnit(unit));
  return mergeFragmentUnits(split);
}

/** Exported for unit tests. */
export const meaningUnitHeuristics = {
  looksIncomplete,
  looksContinuation,
  looksOrphanFragment,
  looksStandaloneReaction,
  looksLowercaseContinuation,
  looksFinishedThought,
  endsWithOpenFunctionWord,
  shouldMerge,
};

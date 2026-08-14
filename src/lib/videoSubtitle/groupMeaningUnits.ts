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

/** Prefer short on-screen beats — over-merge breaks A/V sync. */
const MAX_SEGMENTS_PER_UNIT = 5;
const MAX_CHARS_PER_UNIT = 180;
const MAX_UNIT_SECONDS = 10;
const MAX_GAP_SECONDS = 0.75;
/** When the previous line clearly needs a complement, allow a longer join. */
const OPEN_TAIL_MAX_SECONDS = 18;
const OPEN_TAIL_MAX_CHARS = 280;

const CONTINUATION_START =
  /^(and|or|but|because|so|then|which|to|of|for|with|without|by|from|into|onto|is|are|was|were|been|being)\b/i;

const INCOMPLETE_END =
  /\b(and|or|but|because|that|than|to|of|the|a|an|with|without|for|if|when|while|which|who|as|by|from|into|my|your|our|their|his|her|its|this|these|those|an?)\s*$/i;

/** Trailing words that usually expect a complement (STT often splits here). */
const DANGLING_END =
  /\b(already|just|really|very|been|being|getting|going|gonna|wanna|gotta|kinda|more|most|so|too|not|never|always|still|also|even|only|had|have|has|was|were|is|are|am|will|would|could|should|can|do|does|did|to|a|an|the)\s*$/i;

/** "... as a first." / "the other." — STT often puts a period before the noun. */
const OPEN_NOUN_PHRASE_END =
  /\b(a|an|the|my|your|our|their|his|her|its|this|that|these|those)\s+(first|last|next|other|same|new|old|good|bad|little|big|more|most|few|many|own|only|main|real|right|wrong|best|worst|[a-z]{2,14})\s*[.!?…]?$/i;

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

  return INCOMPLETE_END.test(core) || DANGLING_END.test(core);
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

/** Lowercase start = almost always a mid-sentence STT split. */
function looksLowercaseContinuation(text: string): boolean {
  return /^[a-z]/.test(text.trim());
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
  if (gap > MAX_GAP_SECONDS || gap < -0.05) return false;

  const openTail = endsWithOpenFunctionWord(last.normalizedText);
  const incomplete = looksIncomplete(last.normalizedText) || openTail;
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
    (continuation || gap <= 0.45 || orphanNext || lowercaseNext)
  ) {
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

  const original = members
    .map((segment) => segment.normalizedText.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
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
  return units;
}

/** Exported for unit tests. */
export const meaningUnitHeuristics = {
  looksIncomplete,
  looksContinuation,
  looksOrphanFragment,
  looksStandaloneReaction,
  looksLowercaseContinuation,
  endsWithOpenFunctionWord,
  shouldMerge,
};

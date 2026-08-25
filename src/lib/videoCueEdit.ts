import type { VideoSubtitle } from "@/lib/videoLearning";

function makeCueId(seed: string): string {
  return `edit-${seed}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function normalizeCueText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Snap a cut so we don't split inside a Latin/Cyrillic word when possible. */
export function snapCutOffset(text: string, rawCut: number): number {
  const cut = Math.max(0, Math.min(text.length, Math.round(rawCut)));
  if (cut <= 0 || cut >= text.length) return cut;
  if (/\s/.test(text[cut]!) || /\s/.test(text[cut - 1]!)) return cut;

  const isWord = (ch: string | undefined) =>
    Boolean(ch && /[A-Za-zÀ-ÿ0-9'’\u0400-\u04FF]/.test(ch));

  if (!isWord(text[cut]) || !isWord(text[cut - 1])) return cut;

  let left = cut;
  while (left > 0 && isWord(text[left - 1])) left -= 1;
  let right = cut;
  while (right < text.length && isWord(text[right])) right += 1;

  // Prefer the nearer word boundary; bias slightly toward earlier cut.
  if (cut - left <= right - cut) return left > 0 ? left : right;
  return right < text.length ? right : left;
}

/** Map a 0–1 slider position to a character cut (snapped to word edges). */
export function cutOffsetFromRatio(sentence: string, ratio: number): number | null {
  const text = normalizeCueText(sentence);
  if (text.length < 2) return null;
  const clamped = Math.min(0.92, Math.max(0.08, ratio));
  const cut = snapCutOffset(text, text.length * clamped);
  if (cut <= 0 || cut >= text.length) {
    // Ensure we always return a usable interior cut when possible.
    const fallback = snapCutOffset(text, Math.floor(text.length / 2));
    if (fallback <= 0 || fallback >= text.length) return null;
    return fallback;
  }
  const left = text.slice(0, cut).trim();
  const right = text.slice(cut).trim();
  if (!left || !right) return null;
  return cut;
}

/**
 * Infer cut offset from the current DOM selection inside `sentence`.
 * Cut is placed after the selected span (selected text stays on the left).
 */
export function cutOffsetFromSelection(sentence: string): number | null {
  if (typeof window === "undefined") return null;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;

  const selected = normalizeCueText(sel.toString());
  if (!selected) return null;

  const text = normalizeCueText(sentence);
  if (text.length < 2) return null;

  // Prefer the occurrence that best matches the selection's place in the line.
  let idx = text.indexOf(selected);
  if (idx < 0) {
    // Soften whitespace differences.
    const soft = selected.replace(/\s+/g, "");
    const compact = text.replace(/\s+/g, "");
    const softIdx = compact.indexOf(soft);
    if (softIdx < 0) return null;
    // Map compact index back roughly via walking text.
    let compactPos = 0;
    let mapped = 0;
    for (; mapped < text.length && compactPos < softIdx + soft.length; mapped += 1) {
      if (!/\s/.test(text[mapped]!)) compactPos += 1;
    }
    idx = Math.max(0, mapped - soft.length);
    const cut = snapCutOffset(text, mapped);
    if (cut <= 0 || cut >= text.length) return null;
    return cut;
  }

  const cut = snapCutOffset(text, idx + selected.length);
  if (cut <= 0 || cut >= text.length) return null;
  return cut;
}

function blankInterpretation(cue: VideoSubtitle, original: string): VideoSubtitle {
  return {
    ...cue,
    original,
    rawOriginal: original,
    translation: "",
    meaning: original,
    literalMeaning: original,
    translationStatus: "english",
    analysisTranslation: undefined,
  };
}

/**
 * Merge two or more selected cues (by id order in the list) into one cue.
 * Non-contiguous selections are rejected. Translation is cleared for re-gloss.
 */
export function mergeVideoCues(
  cues: VideoSubtitle[],
  ids: string[],
): VideoSubtitle[] | null {
  if (cues.length === 0 || ids.length < 2) return null;
  const indexes = ids
    .map((id) => cues.findIndex((cue) => cue.id === id))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b);
  if (indexes.length < 2) return null;

  for (let i = 1; i < indexes.length; i += 1) {
    if (indexes[i] !== indexes[i - 1]! + 1) return null;
  }

  const from = indexes[0]!;
  const to = indexes[indexes.length - 1]!;
  const members = cues.slice(from, to + 1);
  const original = normalizeCueText(
    members
      .map((cue) => cue.original.trim())
      .filter(Boolean)
      .join(" "),
  );
  if (!original) return null;

  const merged = blankInterpretation(
    {
      ...members[0]!,
      id: makeCueId(`merge-${from}-${to}`),
      startTime: members[0]!.startTime,
      endTime: Math.max(
        members[0]!.startTime + 0.3,
        members[members.length - 1]!.endTime,
      ),
      confidence: members[0]!.confidence,
    },
    original,
  );

  return [...cues.slice(0, from), merged, ...cues.slice(to + 1)];
}

/**
 * Split one cue at a character offset in the original text.
 * Timing is proportional to the left/right text length.
 * Translations are cleared so each half can be re-glossed.
 */
export function splitVideoCue(
  cues: VideoSubtitle[],
  id: string,
  cutOffset: number,
): VideoSubtitle[] | null {
  const index = cues.findIndex((cue) => cue.id === id);
  if (index < 0) return null;
  const cue = cues[index]!;
  const span = cue.endTime - cue.startTime;
  if (span < 0.8) return null;

  const original = normalizeCueText(cue.original);
  const cut = snapCutOffset(original, cutOffset);
  if (cut <= 0 || cut >= original.length) return null;

  const leftOriginal = original.slice(0, cut).trim();
  const rightOriginal = original.slice(cut).trim();
  if (!leftOriginal || !rightOriginal) return null;

  const ratio = leftOriginal.length / Math.max(1, original.length);
  const mid = cue.startTime + span * Math.min(0.92, Math.max(0.08, ratio));

  const first = blankInterpretation(
    {
      ...cue,
      id: makeCueId(`split-a-${index}`),
      startTime: cue.startTime,
      endTime: Math.max(cue.startTime + 0.3, mid),
    },
    leftOriginal,
  );
  const second = blankInterpretation(
    {
      ...cue,
      id: makeCueId(`split-b-${index}`),
      startTime: mid,
      endTime: Math.max(mid + 0.3, cue.endTime),
    },
    rightOriginal,
  );

  return [...cues.slice(0, index), first, second, ...cues.slice(index + 1)];
}

/** Ids present in `next` but not in `prev`. */
export function newCueIds(
  prev: VideoSubtitle[],
  next: VideoSubtitle[],
): string[] {
  const old = new Set(prev.map((cue) => cue.id));
  return next.filter((cue) => !old.has(cue.id)).map((cue) => cue.id);
}

export function cuesLookUserEdited(cues: Array<{ id: string }>): boolean {
  return cues.some((cue) => cue.id.startsWith("edit-"));
}

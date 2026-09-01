/**
 * Source collocations whose parts are not optional fillers.
 * Dropping one word flips polarity or scope ("not just X" ≠ "not X").
 */

export type LockedCollocationId =
  | "not_just"
  | "not_only"
  | "not_even"
  | "not_yet"
  | "more_than_just";

export type LockedCollocationHit = {
  id: LockedCollocationId;
  phrase: string;
};

const PATTERNS: { id: LockedCollocationId; phrase: string; needles: string[] }[] =
  [
    { id: "not_just", phrase: "not just", needles: ["not just", "n't just"] },
    { id: "not_only", phrase: "not only", needles: ["not only", "n't only"] },
    { id: "not_even", phrase: "not even", needles: ["not even", "n't even"] },
    { id: "not_yet", phrase: "not yet", needles: ["not yet", "n't yet"] },
    {
      id: "more_than_just",
      phrase: "more than just",
      needles: ["more than just"],
    },
  ];

function normalizeSource(text: string): string {
  return text.toLowerCase().replace(/['’]/g, "'").replace(/\s+/g, " ").trim();
}

function containsNeedle(haystack: string, needle: string): boolean {
  return haystack.includes(needle);
}

const NOT_MERELY_KEEP =
  /뿐|단지|다만|다는 아니|그뿐만|뿐만|만이|만은|만의|만 아니라|만 그런|만 있는|것만|[가-힣]만(?:은|이|의)?(?:\s|이 아니|은 아니| 아니| 그런| 있는| 아니라)/;
const EVEN_KEEP = /조차|마저도|도 안|도 못|하나도|조차도|조차 안/;
const YET_KEEP = /아직/;

export function lockedCollocationsIn(original: string): LockedCollocationHit[] {
  const text = normalizeSource(original);
  if (!text) return [];
  const hits: LockedCollocationHit[] = [];
  for (const pattern of PATTERNS) {
    if (pattern.needles.some((needle) => containsNeedle(text, needle))) {
      hits.push({ id: pattern.id, phrase: pattern.phrase });
    }
  }
  return hits;
}

export function lockedCollocationLabels(original: string): string[] {
  return lockedCollocationsIn(original).map((hit) => hit.phrase);
}

function keepsNotMerely(subtitle: string): boolean {
  return NOT_MERELY_KEEP.test(subtitle);
}

function keepsEven(subtitle: string): boolean {
  return EVEN_KEEP.test(subtitle);
}

function keepsYet(subtitle: string): boolean {
  return YET_KEEP.test(subtitle);
}

/**
 * True when a locked collocation is in the source but the Korean caption
 * lost that sense. Filler "just" ("I just think") is not locked.
 */
export function droppedLockedCollocation(
  original: string,
  subtitle: string,
  locale: string,
): boolean {
  if (locale !== "ko") return false;
  const hits = lockedCollocationsIn(original);
  if (hits.length === 0) return false;
  const sub = subtitle.replace(/\s+/g, " ").trim();
  if (!sub) return true;

  for (const hit of hits) {
    if (hit.id === "not_just" || hit.id === "not_only" || hit.id === "more_than_just") {
      if (!keepsNotMerely(sub)) return true;
    }
    if (hit.id === "not_even" && !keepsEven(sub)) return true;
    if (hit.id === "not_yet" && !keepsYet(sub)) return true;
  }
  return false;
}

/** Prompt block: treat these as one unit, not optional words. */
export function lockedCollocationPromptRule(): string {
  return `Meaning-bearing collocations are atomic. Dropping one word flips meaning.
- "not just" / "n't just" / "not only" = not merely X. NEVER "X is not". Keep "X is not the only thing" (Korean: X뿐만 아니라 / X만의 문제는 아니고).
- "not even" = not so much as X. NEVER drop "even".
- "not yet" = still hasn't happened. NEVER drop "yet".
- "more than just" = X and also more.
Filler "just" ("I just think") MAY be dropped. These collocations may not.`;
}

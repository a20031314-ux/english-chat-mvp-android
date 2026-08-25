import type {
  RankedSalienceCandidate,
  SalienceCandidate,
  UdToken,
} from "./types.ts";

export function rangeKey(range: { start: number; end: number }): string {
  return `${range.start}:${range.end}`;
}

export function tokenText(tokens: UdToken[], start: number, end: number): string {
  const slice = tokens.slice(start, end + 1);
  if (slice.length === 0) return "";
  let out = slice[0]!.text;
  for (let i = 1; i < slice.length; i += 1) {
    const prev = slice[i - 1]!;
    const cur = slice[i]!;
    const glue = prev.charEnd === cur.charStart ? "" : " ";
    out += glue + cur.text;
  }
  return out;
}

export function charRangeForTokens(
  tokens: UdToken[],
  start: number,
  end: number,
): { charStart: number; charEnd: number } {
  const from = tokens[start];
  const to = tokens[end];
  return {
    charStart: from?.charStart ?? 0,
    charEnd: to?.charEnd ?? from?.charEnd ?? 0,
  };
}

export function makeCandidate(input: {
  tokens: UdToken[];
  start: number;
  end: number;
  linguisticScore?: number;
  sourceExpressionScore?: number;
  signalTags: string[];
}): SalienceCandidate {
  const linguisticScore = input.linguisticScore ?? 0;
  const sourceExpressionScore = input.sourceExpressionScore ?? 0;
  return {
    tokenRange: { start: input.start, end: input.end },
    originalText: tokenText(input.tokens, input.start, input.end),
    linguisticScore,
    sourceExpressionScore,
    signalTags: [...input.signalTags],
    totalScore: linguisticScore + sourceExpressionScore,
  };
}

export function mergeCandidateLists(
  ...lists: SalienceCandidate[][]
): SalienceCandidate[] {
  const byKey = new Map<string, SalienceCandidate>();
  for (const list of lists) {
    for (const item of list) {
      const key = rangeKey(item.tokenRange);
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, {
          ...item,
          signalTags: [...item.signalTags],
          totalScore: item.linguisticScore + item.sourceExpressionScore,
        });
        continue;
      }
      const signalTags = [...existing.signalTags];
      for (const tag of item.signalTags) {
        if (!signalTags.includes(tag)) signalTags.push(tag);
      }
      const linguisticScore = Math.max(existing.linguisticScore, item.linguisticScore);
      const sourceExpressionScore = Math.max(
        existing.sourceExpressionScore,
        item.sourceExpressionScore,
      );
      byKey.set(key, {
        ...existing,
        linguisticScore,
        sourceExpressionScore,
        signalTags,
        totalScore: linguisticScore + sourceExpressionScore,
      });
    }
  }
  return [...byKey.values()].sort(
    (a, b) => b.totalScore - a.totalScore || a.tokenRange.start - b.tokenRange.start,
  );
}

function overlaps(
  a: { start: number; end: number },
  b: { start: number; end: number },
): boolean {
  return a.start <= b.end && b.start <= a.end;
}

export function pickNonOverlapping(
  candidates: RankedSalienceCandidate[],
  limit: number,
): RankedSalienceCandidate[] {
  const out: RankedSalienceCandidate[] = [];
  for (const item of candidates) {
    if (out.length >= limit) break;
    if (out.some((kept) => overlaps(kept.tokenRange, item.tokenRange))) continue;
    out.push(item);
  }
  return out;
}

export function withCharOffsets(
  tokens: UdToken[],
  candidate: SalienceCandidate,
  salienceReason: string,
): RankedSalienceCandidate {
  const chars = charRangeForTokens(
    tokens,
    candidate.tokenRange.start,
    candidate.tokenRange.end,
  );
  return {
    ...candidate,
    salienceReason,
    charStart: chars.charStart,
    charEnd: chars.charEnd,
  };
}

export function locatePhrase(
  tokens: UdToken[],
  phrase: string,
): Array<{ start: number; end: number }> {
  const needle = phrase.replace(/\s+/g, " ").trim();
  if (!needle || tokens.length === 0) return [];
  const byKey = new Map<string, { start: number; end: number }>();
  const add = (start: number, end: number) => {
    if (start < 0 || end < start || end >= tokens.length) return;
    byKey.set(`${start}:${end}`, { start, end });
  };

  const parts = needle
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.replace(/^-+|-+$/g, ""))
    .filter(Boolean);
  const keys = tokens.map((token) =>
    (token.lemma || token.text).toLowerCase().replace(/['’]/g, "'"),
  );

  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i] !== parts[0] && tokens[i]?.text.toLowerCase() !== parts[0]) {
      continue;
    }
    if (parts.length === 1) {
      add(i, i);
      continue;
    }
    let partIndex = 1;
    let j = i + 1;
    while (j < keys.length && partIndex < parts.length) {
      const token = tokens[j];
      const key = keys[j];
      const want = parts[partIndex];
      if (key === want || token.text.toLowerCase() === want) {
        partIndex += 1;
        j += 1;
        continue;
      }
      const skipPronoun =
        partIndex === 1 &&
        parts.length === 2 &&
        (token.upos === "PRON" || token.upos === "ADV" || token.upos === "PART");
      if (skipPronoun) {
        j += 1;
        continue;
      }
      break;
    }
    if (partIndex === parts.length) {
      add(i, j - 1);
    }
  }

  for (let i = 0; i < tokens.length; i += 1) {
    let built = "";
    for (let j = i; j < tokens.length; j += 1) {
      const prev = j === i ? null : tokens[j - 1]!;
      const cur = tokens[j]!;
      const glue = prev && prev.charEnd !== cur.charStart ? " " : "";
      built += glue + cur.text;
      if (built === needle) {
        add(i, j);
        break;
      }
      if (built.length >= needle.length) break;
    }
  }

  return [...byKey.values()].sort((a, b) => a.start - b.start || a.end - b.end);
}

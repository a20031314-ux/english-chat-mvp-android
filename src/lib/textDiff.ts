export type DiffPart = {
  type: "equal" | "remove" | "add";
  text: string;
  /** When type is equal, the corrected-side surface form (may differ only by case). */
  matchText?: string;
};

export type HighlightPart = {
  text: string;
  /** Wrong word in the original */
  error: boolean;
  /** Missing words that should appear here (insertion-only mistakes) */
  missingHint?: string;
};

function tokenize(text: string): string[] {
  // Space-delimited languages: keep words + whitespace.
  // CJK / Hangul without spaces: character tokens so particle/ending
  // fixes highlight only the changed glyphs (not the whole sentence).
  const rough = text.match(/\S+|\s+/g) ?? [];
  const out: string[] = [];
  for (const part of rough) {
    if (/^\s+$/.test(part)) {
      out.push(part);
      continue;
    }
    if (
      !/\s/.test(part) &&
      /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(part)
    ) {
      out.push(...Array.from(part));
      continue;
    }
    out.push(part);
  }
  return out;
}

function tokenKey(token: string): string {
  return token
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

/**
 * Word/token-level diff (LCS). Whitespace tokens are preserved for rendering.
 */
export function diffWords(original: string, corrected: string): DiffPart[] {
  const a = tokenize(original);
  const b = tokenize(corrected);
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: m + 1 }, () => 0),
  );

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (tokenKey(a[i]) === tokenKey(b[j])) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const parts: DiffPart[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (tokenKey(a[i]) === tokenKey(b[j])) {
      parts.push({ type: "equal", text: a[i], matchText: b[j] });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      parts.push({ type: "remove", text: a[i] });
      i += 1;
    } else {
      parts.push({ type: "add", text: b[j] });
      j += 1;
    }
  }
  while (i < n) {
    parts.push({ type: "remove", text: a[i] });
    i += 1;
  }
  while (j < m) {
    parts.push({ type: "add", text: b[j] });
    j += 1;
  }

  return parts;
}

/**
 * Original-side highlight parts: wrong words + gap markers for missing words.
 */
export function originalHighlightParts(
  original: string,
  corrected: string,
): HighlightPart[] {
  const diffs = diffWords(original, corrected);
  const out: HighlightPart[] = [];
  let pendingMissing: string[] = [];

  const flushMissing = () => {
    const hint = pendingMissing.join("").replace(/\s+/g, " ").trim();
    pendingMissing = [];
    if (!hint) return;
    out.push({ text: "", error: true, missingHint: hint });
  };

  for (const part of diffs) {
    if (part.type === "add") {
      pendingMissing.push(part.text);
      continue;
    }
    flushMissing();
    if (part.type === "remove") {
      out.push({ text: part.text, error: true });
    } else {
      out.push({ text: part.text, error: false });
    }
  }
  flushMissing();

  return out;
}

export type CorrectedHighlightPart = {
  text: string;
  added: boolean;
};

/** Corrected-side parts: newly inserted/changed tokens marked as added. */
export function correctedHighlightParts(
  original: string,
  corrected: string,
): CorrectedHighlightPart[] {
  return diffWords(original, corrected)
    .filter((p) => p.type === "equal" || p.type === "add")
    .map((p) => ({
      text: p.type === "equal" ? p.matchText || p.text : p.text,
      added: p.type === "add",
    }));
}

function isCjkLetterToken(text: string) {
  return /^[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]$/u.test(text);
}

const CJK_FUNCTION_CHARS = new Set([
  "は",
  "が",
  "を",
  "に",
  "で",
  "と",
  "も",
  "の",
  "へ",
  "や",
  "か",
  "ね",
  "よ",
  "わ",
  "さ",
  "은",
  "는",
  "이",
  "가",
  "을",
  "를",
  "에",
  "의",
  "도",
  "만",
  "를",
]);

/**
 * Surface form(s) to show as the inline fix — changed tokens only.
 * For CJK verb/adjective endings, keep a short shared stem (行 + った → 行った).
 * Particle swaps (を→が) stay as the single corrected particle.
 */
export function correctionReplacementSnippet(
  original: string,
  corrected: string,
): string {
  const diffs = diffWords(original, corrected);
  const snippets: string[] = [];

  for (let i = 0; i < diffs.length; i += 1) {
    if (diffs[i]?.type !== "add") continue;

    let added = "";
    let j = i;
    while (j < diffs.length && diffs[j]?.type === "add") {
      added += diffs[j]!.text;
      j += 1;
    }

    let removeCount = 0;
    let k = i - 1;
    while (k >= 0 && diffs[k]?.type === "remove") {
      removeCount += 1;
      k -= 1;
    }

    // Particle-sized swaps: show only the new particle/word.
    const attachStem = removeCount > 1 || [...added].length > 2;
    let stem = "";
    if (attachStem) {
      while (
        k >= 0 &&
        diffs[k]?.type === "equal" &&
        isCjkLetterToken(diffs[k]!.text) &&
        !CJK_FUNCTION_CHARS.has(diffs[k]!.text) &&
        stem.length < 2
      ) {
        stem = (diffs[k]!.matchText || diffs[k]!.text) + stem;
        k -= 1;
      }
    }

    const piece = `${stem}${added}`.replace(/\s+/g, " ").trim();
    if (piece) snippets.push(piece);
    i = j - 1;
  }

  if (snippets.length > 0) return snippets.join(" · ");
  return corrected.replace(/\s+/g, " ").trim();
}

function isContentToken(text: string) {
  return /[\p{L}\p{N}]/u.test(text);
}

/**
 * Word-level error mass for accuracy scoring.
 * A substitution (remove+add) counts once.
 */
export function correctionErrorMass(
  original: string,
  corrected: string,
): { writtenWords: number; wrongWords: number } {
  const diffs = diffWords(original, corrected);
  let writtenWords = 0;
  let wrongWords = 0;
  let missingWords = 0;

  for (const part of diffs) {
    if (!isContentToken(part.text)) continue;
    if (part.type === "equal") {
      writtenWords += 1;
    } else if (part.type === "remove") {
      writtenWords += 1;
      wrongWords += 1;
    } else {
      missingWords += 1;
    }
  }

  if (writtenWords === 0) {
    writtenWords = original.trim().split(/\s+/).filter(Boolean).length || 1;
  }

  return {
    writtenWords,
    wrongWords: Math.min(writtenWords, Math.max(wrongWords, missingWords)),
  };
}

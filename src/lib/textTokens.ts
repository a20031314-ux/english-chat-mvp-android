function inferSegmenterLocale(text: string): string {
  if (/[\u3040-\u30ff]/u.test(text)) return "ja";
  if (/[\u3400-\u9fff]/u.test(text)) return "zh";
  if (/[\uac00-\ud7af]/u.test(text)) return "ko";
  if (/[\u0e00-\u0e7f]/u.test(text)) return "th";
  if (/[\u0400-\u04ff]/u.test(text)) return "ru";
  return "en";
}

type WordSegmenter = {
  segment(input: string): Iterable<{ segment: string }>;
};

const segmenters = new Map<string, WordSegmenter>();

function getWordSegmenter(locale: string): WordSegmenter | null {
  const Ctor = (
    Intl as typeof Intl & {
      Segmenter?: new (
        locale: string,
        options: { granularity: "word" },
      ) => WordSegmenter;
    }
  ).Segmenter;
  if (!Ctor) return null;
  const cached = segmenters.get(locale);
  if (cached) return cached;
  const created = new Ctor(locale, { granularity: "word" });
  segmenters.set(locale, created);
  return created;
}

/** Word tokens plus whitespace/punctuation. Never splits a script into glyphs. */
export function tokenize(sentence: string): string[] {
  if (!sentence) return [];
  const segmenter = getWordSegmenter(inferSegmenterLocale(sentence));
  if (segmenter) {
    return Array.from(segmenter.segment(sentence), (part) => part.segment);
  }
  const parts = sentence.split(/(\s+)/).filter((part) => part.length > 0);
  const out: string[] = [];
  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      out.push(part);
      continue;
    }
    out.push(...splitAffixedPunctuation(part));
  }
  return out;
}

function splitAffixedPunctuation(part: string): string[] {
  const re =
    /([^\p{L}\p{M}\p{N}'’_-]+)|([\p{L}\p{M}\p{N}]+(?:['’_-][\p{L}\p{M}\p{N}]+)*)/gu;
  const pieces: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(part)) !== null) {
    pieces.push(match[0]);
  }
  return pieces.length > 0 ? pieces : [part];
}

export function isWordToken(token: string) {
  if (!token || /^\s+$/.test(token)) return false;
  if (!/[\p{L}\p{M}]/u.test(token)) return false;
  return true;
}

export type WordSpan = {
  text: string;
  start: number;
  end: number;
};

export function listWordSpans(sentence: string): WordSpan[] {
  const tokens = tokenize(sentence);
  const out: WordSpan[] = [];
  let offset = 0;
  for (const token of tokens) {
    if (isWordToken(token)) {
      out.push({
        text: token,
        start: offset,
        end: offset + token.length,
      });
    }
    offset += token.length;
  }
  return out;
}

export function wordRangeForText(
  sentence: string,
  selected: string,
): { start: number; end: number } | null {
  const words = listWordSpans(sentence);
  if (words.length === 0) return null;
  const needle = selected.replace(/\s+/g, " ").trim();
  if (!needle) return { start: 0, end: words.length - 1 };
  const hay = sentence.toLowerCase();
  const want = needle.toLowerCase();
  let index = hay.indexOf(want);
  if (index < 0) {
    index = hay.replace(/\s+/g, "").indexOf(want.replace(/\s+/g, ""));
    if (index < 0) return { start: 0, end: words.length - 1 };
    return { start: 0, end: words.length - 1 };
  }
  const end = index + needle.length;
  const startWord = words.findIndex((word) => word.end > index);
  let endWord = words.length - 1;
  for (let i = words.length - 1; i >= 0; i -= 1) {
    if (words[i].start < end) {
      endWord = i;
      break;
    }
  }
  if (startWord < 0) return { start: 0, end: words.length - 1 };
  return { start: startWord, end: Math.max(startWord, endWord) };
}

export function textForWordRange(
  sentence: string,
  start: number,
  end: number,
): string {
  const words = listWordSpans(sentence);
  if (words.length === 0) return sentence.replace(/\s+/g, " ").trim();
  const from = words[Math.max(0, Math.min(start, words.length - 1))];
  const to = words[Math.max(0, Math.min(end, words.length - 1))];
  if (!from || !to) return sentence.replace(/\s+/g, " ").trim();
  const left = Math.min(from.start, to.start);
  const right = Math.max(from.end, to.end);
  return sentence.slice(left, right).replace(/\s+/g, " ").trim();
}

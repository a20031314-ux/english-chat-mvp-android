function inferSegmenterLocale(text: string): string {
  if (/[\u0600-\u06ff]/u.test(text)) return "ar";
  if (/[\u0e00-\u0e7f]/u.test(text)) return "th";
  if (/[\u0900-\u097f]/u.test(text)) return "hi";
  if (/[\u3040-\u30ff]/u.test(text)) return "ja";
  if (/[\u3400-\u9fff]/u.test(text)) return "zh";
  if (/[\uac00-\ud7af]/u.test(text)) return "ko";
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

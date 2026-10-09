/**
 * Words of a line in a language that does not put spaces between them.
 *
 * Splitting on whitespace is the right first cut for most of the app's
 * languages and the wrong one for Japanese, Chinese and Thai, where a whole
 * sentence comes back as one "word". Anything that lines words up — an attempt
 * against its target, an expression against a transcript — then has nothing to
 * line up: a Japanese sentence said with one wrong word was all wrong, and a
 * phrase inside a Japanese line could never be found in it.
 *
 * So a chunk written in one of those scripts is cut by the platform's own word
 * segmenter (Intl.Segmenter, in Node and every WebView the app runs in). Where
 * it is missing, the chunk stays whole, which is what happened before.
 *
 * Plain module, no imports: the server, the screen and the tests share it.
 */

const SPACELESS =
  /[぀-ヿㇰ-ㇿ㐀-䶿一-鿿豈-﫿฀-๿຀-໿က-႟]/;

export function isSpaceless(text: string): boolean {
  return SPACELESS.test(text);
}

const segmenters = new Map<string, Intl.Segmenter>();

function segmenterFor(language?: string): Intl.Segmenter | null {
  if (typeof Intl === "undefined" || typeof Intl.Segmenter !== "function") return null;
  const key = language || "";
  let segmenter = segmenters.get(key);
  if (!segmenter) {
    segmenter = new Intl.Segmenter(language || undefined, { granularity: "word" });
    segmenters.set(key, segmenter);
  }
  return segmenter;
}

/** One chunk without spaces, cut into words when its script needs it. */
export function segmentChunk(chunk: string, language?: string): string[] {
  if (!isSpaceless(chunk)) return [chunk];
  const segmenter = segmenterFor(language);
  if (!segmenter) return [chunk];
  const words = [...segmenter.segment(chunk)]
    .filter((part) => part.isWordLike)
    .map((part) => part.segment);
  return words.length ? words : [chunk];
}

/** A line's words: whitespace first, then each chunk cut if its script needs it. */
export function segmentWords(text: string, language?: string): string[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((chunk) => segmentChunk(chunk, language));
}

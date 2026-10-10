/**
 * Whether a heard turn stopped in the middle of a sentence.
 *
 * The turn ends itself after a pause (hearFrame.ts), and the pause has to be
 * short or every answer feels slow. Learners pause mid-sentence to find the
 * next word, so a short pause sometimes cuts them off — reported from a phone:
 * "This cafe has variety of coffee and" went off as a turn, the character
 * finished the sentence for them, and the learner never got to.
 *
 * Lengthening the pause for everyone would slow every turn to fix a few. The
 * words say which turns were cut: a sentence that ends on "and", "because",
 * "the", a Korean connective ending or a Japanese て is waiting for the rest.
 * Those turns are given more time; the rest go as fast as before.
 *
 * Pure, so it can be tested without a microphone, and it goes through
 * wordSegments for the scripts that do not put spaces between words.
 */
import { segmentWords } from "../wordSegments.ts";

/** Words a sentence does not end on, per learning language. */
const TRAILING: Record<string, string[]> = {
  en: "and but or because cause if when the a an to of with for from my your his her their our is are was were i um uh er".split(" "),
  es: "y e pero o u porque si cuando que el la los las un una de del con para por en a mi tu su es son eh este".split(" "),
  fr: "et mais ou donc parce si quand que qui le la les un une de des du avec pour par en à au mon ma mes ton ta est euh".split(" "),
  it: "e ma o perché se quando che il lo la i gli le un una di del della con per in a al mio mia è ehm".split(" "),
  pt: "e mas ou porque se quando que o a os as um uma de do da com para por em no na meu minha é hum".split(" "),
  ru: "и а но или потому если когда что который в на с со к по для из мой моя это ну э".split(" "),
  id: "dan tapi atau karena kalau ketika yang di ke dari untuk dengan pada saya aku itu eh".split(" "),
  vi: "và nhưng hoặc vì nếu khi mà của với cho ở là thì ờ".split(" "),
  ar: "و لكن أو لأن إذا عندما الذي التي في من مع إلى على عن هو هي".split(" "),
  hi: "और लेकिन या क्योंकि अगर जब जो कि का की के में से पर को है".split(" "),
  zh: "和 跟 但是 可是 或者 因为 所以 如果 还有 然后 的 在 是 嗯 那个".split(" "),
  ja: "えっと あの その".split(" "),
  th: "และ แต่ หรือ เพราะ ถ้า เมื่อ ที่ ของ กับ ใน ก็ คือ แล้วก็ เอ่อ".split(" "),
};

/** Korean connective endings: the clause goes on after these. */
const KOREAN_CONNECTIVE = /(고|는데|은데|인데|지만|어서|아서|해서|면|니까|려고|다가|거나|든지|랑|하고)$/u;
/**
 * Japanese particles and connectives the segmenter leaves on the end of a
 * word (だけど, 行って), so read as endings rather than whole words.
 */
const JAPANESE_CONNECTIVE = /(けど|けれど|から|ので|のに|し|て|で|が|と|たら|ば|は|を|に|の)$/u;
/** Korean fillers, as whole words. */
const KOREAN_FILLER = new Set(["음", "어", "그", "저", "저기", "그니까"]);

/** Marks a transcriber leaves when the speaker trailed off. */
const TRAILING_MARK = /(,|，|、|\.\.\.|…|-|—)\s*$/u;

export function soundsUnfinished(heard: string, language: string): boolean {
  const text = heard.trim();
  if (!text) return false;
  // A sentence that ended says so; a trailing comma or ellipsis says it did not.
  if (/[.!?。！？]\s*$/u.test(text) && !/(\.\.\.|…)\s*$/u.test(text)) return false;
  if (TRAILING_MARK.test(text)) return true;

  const words = segmentWords(text.replace(/[^\p{L}\p{M}\p{N}'\s]/gu, " "), language);
  const last = words[words.length - 1]?.toLowerCase();
  if (!last) return false;

  if (language === "ko") return KOREAN_FILLER.has(last) || KOREAN_CONNECTIVE.test(last);
  if (language === "ja") return TRAILING.ja.includes(last) || JAPANESE_CONNECTIVE.test(last);
  return (TRAILING[language] ?? TRAILING.en).includes(last);
}

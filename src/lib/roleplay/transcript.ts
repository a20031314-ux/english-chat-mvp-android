/**
 * Whether what came back is plausibly what was said.
 *
 * Speech models in this family invent text when they are given almost nothing —
 * a short word, a breath, a half second of room noise — and they do not invent
 * quietly. The best known case is a Japanese stock phrase appearing over
 * silence, which is exactly what a learner saying "hi" to an English scene got
 * back. It is confident, it is well formed, and it is not what they said.
 *
 * A language hint on the request is supposed to prevent this and does not
 * always, so the answer is checked on the way back. Not for correctness —
 * nothing here can know whether "large" was really said — but for the one thing
 * that can be known from text alone: a reply written in a script the language
 * being learned does not use was not a transcription of it.
 *
 * Deliberately blunt. It rejects a whole answer or none of it, and it says
 * nothing about answers inside the right script, because a wrong word in the
 * right alphabet is indistinguishable from a real mishearing and mishearings
 * are the scene's business to handle.
 */

/** The writing system a language is spoken down into, for the few that differ. */
type Script = "latin" | "hangul" | "kana" | "han" | "cyrillic" | "arabic" | "thai" | "devanagari";

const SCRIPT_OF: Record<string, Script> = {
  en: "latin",
  es: "latin",
  fr: "latin",
  it: "latin",
  pt: "latin",
  id: "latin",
  vi: "latin",
  ko: "hangul",
  ja: "kana",
  zh: "han",
  ru: "cyrillic",
  ar: "arabic",
  th: "thai",
  hi: "devanagari",
};

const RANGES: Record<Script, RegExp> = {
  latin: /[\p{Script=Latin}]/u,
  hangul: /[\p{Script=Hangul}]/u,
  kana: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
  han: /[\p{Script=Han}]/u,
  cyrillic: /[\p{Script=Cyrillic}]/u,
  arabic: /[\p{Script=Arabic}]/u,
  thai: /[\p{Script=Thai}]/u,
  devanagari: /[\p{Script=Devanagari}]/u,
};

/**
 * Whether a transcript is written in the script the language uses.
 *
 * Counts letters rather than looking for a single stray character: a name, a
 * borrowed word or a piece of punctuation should not throw away a turn, and a
 * learner of English who says a word in their own language has still said
 * something. What it catches is an answer that is mostly not the language at
 * all, which is what an invented one looks like.
 */
/**
 * How much of a turn has to be the language before it is believed.
 *
 * A fifth, which is low on purpose: what this refuses is an answer with none of
 * the language in it, because that is what an invented one looks like — half a
 * second of room noise came back as a whole Japanese sentence, with not one
 * Latin letter in it.
 *
 * It was a half, and a half does not mean "mostly not the language" however it
 * reads. Measured on what a learner actually says: "How can I say 전기공학 in
 * English?" is 83% Latin and went through, and the answer to it — "It's
 * 전기공학." — is 43% and was thrown away whole. The app then heard silence and
 * the character replied to somebody who had said nothing, one turn after
 * answering the question that prompted it.
 *
 * Which is the worst turn to lose. Reaching for a word in your own language
 * because you do not have it yet in the one you are learning is the moment the
 * app exists for.
 */
const ENOUGH_OF_THE_LANGUAGE = 0.2;

export function looksLikeLanguage(text: string, language: string): boolean {
  const script = SCRIPT_OF[language];
  if (!script) return true;
  const letters = [...text].filter((character) => /\p{L}/u.test(character));
  if (letters.length === 0) return true;
  const matching = letters.filter((character) => RANGES[script].test(character)).length;
  if (matching / letters.length < ENOUGH_OF_THE_LANGUAGE) return false;
  // 일본어 글자에는 한자도 들어가서, 가나 하나 없는 중국어 줄이 일본어로 통과했다(2026-10-22 영어↔일본어 방에
  // "这是一佛西海的三星…"가 자막으로 올라감, 노트에도 중국어 문장). 한자 다섯 자 이상에 가나가 없으면 일본어가 아니다 —
  // 짧은 말("最近", "大丈夫")은 가나 없이도 일본어라 그대로. 거꾸로 중국어에 가나가 많이 섞이면 일본어다.
  const kana = letters.filter((character) => KANA_ONLY.test(character)).length;
  const han = letters.filter((character) => RANGES.han.test(character)).length;
  if (language === "ja" && han >= 5 && kana === 0) return false;
  if (language === "zh" && kana / letters.length >= ENOUGH_OF_THE_LANGUAGE) return false;
  return true;
}

const KANA_ONLY = /[\p{Script=Hiragana}\p{Script=Katakana}]/u;

/**
 * What the learner said, or nothing.
 *
 * Nothing is the safe answer: the scene already knows what to do with a turn it
 * could not hear — the character asks again, in character — and that is a far
 * better outcome than answering a sentence they never spoke.
 */
export function heardOrNothing(text: string, language: string): string {
  const said = text.trim();
  return said && looksLikeLanguage(said, language) ? said : "";
}

/**
 * A person-to-person room speaks two languages, either of which is what a
 * speaker may be saying, so it cannot be given one language hint — a hint of
 * English on a Korean sentence comes back translated, not transcribed. Without
 * one, a short "hi, hi" came back as Japanese in an English and Korean room.
 *
 * What came back is believed when it is written in a script one of the room's
 * languages uses; otherwise it was invented, and the caller asks again with the
 * room's first language as the hint. With no languages, anything goes.
 */
export function heardInAny(text: string, languages: readonly string[]): string {
  const said = text.trim();
  if (!said) return "";
  if (languages.length === 0) return said;
  return languages.some((language) => looksLikeLanguage(said, language)) ? said : "";
}

/**
 * Which of a speaker's languages a line is in, when the script says so: the one
 * language whose script it is written in. Two candidates that share a script
 * (Spanish and English) cannot be told apart this way, so nothing is claimed.
 * Used to label lines in a free-talk room, where nobody fixed the language.
 */
export function whichLanguage(text: string, languages: readonly string[]): string | null {
  const letters = [...text].filter((character) => /\p{L}/u.test(character));
  if (letters.length === 0) return null;
  const scripts = [...new Set(languages.map((language) => SCRIPT_OF[language]).filter(Boolean))];
  if (scripts.length < languages.length) return null;
  const matching = languages.filter((language) => {
    const share = letters.filter((character) => RANGES[SCRIPT_OF[language]].test(character)).length / letters.length;
    return share > 0.5;
  });
  return matching.length === 1 ? matching[0] : null;
}

/**
 * Small, very common words (and hesitation sounds) of the Latin-script
 * languages — enough to tell "euh… vingt-deux" from English when both are
 * written in the same letters. Not a language detector: it only has to notice a
 * line that is mostly someone's own language.
 */
const COMMON_WORDS: Record<string, readonly string[]> = {
  en: ["the", "a", "i", "you", "is", "are", "and", "to", "of", "it", "in", "my", "what", "how", "yes", "no", "that", "this", "was", "do", "have", "me", "we", "uh", "um", "i'm", "it's"],
  es: ["el", "la", "los", "las", "de", "que", "y", "es", "en", "un", "una", "yo", "tú", "sí", "mi", "por", "para", "con", "pero", "muy", "qué", "cómo", "tengo", "soy", "estoy", "eh", "bueno", "pues"],
  fr: ["le", "la", "les", "de", "des", "et", "est", "je", "tu", "un", "une", "pas", "oui", "non", "mon", "ma", "c'est", "que", "qui", "pour", "avec", "mais", "très", "euh", "alors", "j'ai", "suis", "ben"],
  it: ["il", "la", "lo", "gli", "di", "che", "e", "è", "un", "una", "io", "tu", "non", "sì", "mio", "per", "con", "ma", "molto", "sono", "ho", "ehm", "allora", "cosa", "boh"],
  pt: ["o", "a", "os", "as", "de", "que", "e", "é", "um", "uma", "eu", "você", "não", "sim", "meu", "para", "com", "mas", "muito", "sou", "tenho", "estou", "então", "né", "tipo"],
  id: ["aku", "saya", "kamu", "yang", "dan", "di", "ke", "ini", "itu", "tidak", "ya", "ada", "apa", "dengan", "untuk", "sudah", "mau", "eh", "nggak", "gak", "puluh"],
  vi: ["tôi", "bạn", "là", "và", "của", "có", "không", "này", "đó", "một", "được", "ờ", "à", "thì", "mà", "rồi", "đi", "năm", "mươi"],
};

function commonShare(words: string[], language: string): number {
  const list = COMMON_WORDS[language];
  if (!list || words.length === 0) return 0;
  return words.filter((word) => list.includes(word)).length / words.length;
}

/**
 * Whether a room line leans on the speaker's own language ("어.. 스물둘..",
 * "I'm 스물둘", "euh… vingt-deux"), so a hint in the language they learn helps.
 * Written differently: a real share of the own language's script. Written in
 * the same letters: more of the own language's common words than of the one
 * being learned. Japanese and Chinese share Han characters, so that pair is
 * left alone.
 */
export function leansOnOwnLanguage(text: string, learning: string, own: string): boolean {
  if (learning === own) return false;
  const learningScript = SCRIPT_OF[learning];
  const ownScript = SCRIPT_OF[own];
  if (!learningScript || !ownScript) return false;
  if ((learningScript === "kana" && ownScript === "han") || (learningScript === "han" && ownScript === "kana")) return false;
  if (learningScript === ownScript) {
    const words = text
      .toLowerCase()
      .replace(/[’]/g, "'")
      .split(/[^\p{L}\p{M}']+/u)
      .filter(Boolean);
    const mine = commonShare(words, own);
    return mine >= 0.25 && mine > commonShare(words, learning);
  }
  const letters = [...text].filter((character) => /\p{L}/u.test(character));
  if (letters.length === 0) return false;
  const ownLetters = letters.filter((character) => RANGES[ownScript].test(character)).length;
  return ownLetters / letters.length >= ENOUGH_OF_THE_LANGUAGE;
}

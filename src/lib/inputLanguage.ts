import {
  learningLanguageScript,
  type LearningScript,
} from "./learningLanguages.ts";

export type ChatInputMode = "chat" | "how_to_say";

function countMatches(text: string, pattern: RegExp): number {
  return (text.match(pattern) || []).length;
}

const SCRIPT_CHARS: Record<LearningScript, RegExp> = {
  latin: /\p{Script=Latin}/gu,
  hangul: /\p{Script=Hangul}/gu,
  // Kanji count for Japanese too, or a kanji-heavy Japanese line would lose to
  // a few Latin letters. Against Chinese, kana alone decides (see below).
  japanese: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/gu,
  hanzi: /\p{Script=Han}/gu,
  cyrillic: /\p{Script=Cyrillic}/gu,
  arabic: /\p{Script=Arabic}/gu,
  thai: /\p{Script=Thai}/gu,
  devanagari: /\p{Script=Devanagari}/gu,
};

/**
 * What tells one Latin-script language from another in a short chat line:
 * its commonest small words, and the letters only it (or few others) uses.
 * Only ever compared two at a time — the learning language against the UI
 * language — so words shared between them cancel out rather than mislead.
 */
const LATIN_SIGNS: Record<string, { words: Set<string>; letters?: RegExp }> = {
  en: {
    words: new Set(
      "the a an i you he she we they is are was were am be been have has had do does did my your our to for with this that it and but or of in on at will can would could should what how why when where who i'm don't it's that's want go went yesterday today say said not no yes".split(" "),
    ),
  },
  es: {
    words: new Set(
      "el la los las de que y en un una es son por para con no yo tú mi me te lo se del al pero como qué cómo está estoy soy muy ayer hoy quiero hola gracias sí también tengo fui".split(" "),
    ),
    letters: /[ñ¿¡áéíóú]/giu,
  },
  fr: {
    words: new Set(
      "le la les de des du un une et est je tu il elle nous vous ils pas pour avec que qui dans ce c'est j'ai t'as mon ma mes suis très hier aujourd'hui bonjour merci oui aussi au aux ça quoi où".split(" "),
    ),
    letters: /[éçèêëàâùûîïôœ]/giu,
  },
  it: {
    words: new Set(
      "il lo la gli le di che e è un una uno per con non sono ho mi ti ci io tu del della sei molto ieri oggi ciao grazie anche voglio".split(" "),
    ),
    letters: /[èàòùì]/giu,
  },
  pt: {
    words: new Set(
      "o a os as de que e é um uma para com não eu você meu minha do da em no na está estou sou muito ontem hoje olá obrigado obrigada também quero fui".split(" "),
    ),
    letters: /[ãõçâêô]/giu,
  },
  id: {
    words: new Set(
      "yang dan di ke dari ini itu saya aku kamu tidak ada dengan untuk akan sudah apa bisa mau kemarin hari sangat juga terima kasih".split(" "),
    ),
  },
  vi: {
    words: new Set(
      "tôi bạn không là của và có này được một những cho với rất hôm nay qua đi muốn".split(" "),
    ),
    letters: /[ăâđêôơưẠ-ỹ]/giu,
  },
};

function latinScore(text: string, language: string): number {
  const signs = LATIN_SIGNS[language];
  if (!signs) return 0;
  const words = text.toLowerCase().match(/[\p{L}']+/gu) ?? [];
  const wordHits = words.filter((word) => signs.words.has(word)).length;
  const letterHits = signs.letters ? countMatches(text, signs.letters) : 0;
  return wordHits + letterHits;
}

function scriptCount(text: string, script: LearningScript, other: LearningScript): number {
  // Japanese and Chinese share Han; between the two, only kana is evidence.
  if (script === "japanese" && other === "hanzi") {
    return countMatches(text, /[\p{Script=Hiragana}\p{Script=Katakana}]/gu);
  }
  if (script === "hanzi" && other === "japanese") {
    return countMatches(text, /[\p{Script=Hiragana}\p{Script=Katakana}]/gu) > 0
      ? 0
      : countMatches(text, SCRIPT_CHARS.hanzi);
  }
  return countMatches(text, SCRIPT_CHARS[script]);
}

/**
 * Whether a line someone typed is in the language they are learning, as
 * opposed to the language they read the app in.
 *
 * This used to be "does it look like English", which was the right question
 * for exactly one pair — learning English with the app in Korean — and the
 * wrong one for every other. With the app in English and Spanish as the
 * target it was exactly backwards: an English line counted as practice and
 * went to the tutor untranslated, a Spanish one went to the phrase helper.
 *
 * Different scripts are decided by counting letters, so an embedded word
 * ("I went to 강남 yesterday") does not flip a line. Same-script pairs are
 * decided by small words and distinctive letters. A tie counts as the
 * learning language: the chat box is where practice is typed, and a
 * sentence too short to tell is more often an attempt than a question.
 */
export function writtenInLearningLanguage(
  text: string,
  learningLanguage: string,
  interfaceLanguage: string,
): boolean {
  if (!text.trim() || learningLanguage === interfaceLanguage) return true;
  const evidence = languageEvidence(text, learningLanguage, interfaceLanguage);
  return evidence.learning >= evidence.ui;
}

/**
 * How much of a line points to each of two languages: letters of each
 * script when the scripts differ, small words and distinctive letters when
 * they do not. Zero on both sides means the line gives nothing away — two
 * languages sharing a script that this has no signs for, or a line too
 * short to tell.
 */
export function languageEvidence(
  text: string,
  learningLanguage: string,
  interfaceLanguage: string,
): { learning: number; ui: number } {
  const trimmed = text.trim();
  if (!trimmed || learningLanguage === interfaceLanguage) {
    return { learning: 0, ui: 0 };
  }
  const learningScript = learningLanguageScript(learningLanguage);
  const interfaceScript = learningLanguageScript(interfaceLanguage);

  if (learningScript !== interfaceScript) {
    return {
      learning: scriptCount(trimmed, learningScript, interfaceScript),
      ui: scriptCount(trimmed, interfaceScript, learningScript),
    };
  }
  if (learningScript === "latin") {
    return {
      learning: latinScore(trimmed, learningLanguage),
      ui: latinScore(trimmed, interfaceLanguage),
    };
  }
  return { learning: 0, ui: 0 };
}

export function resolveChatInputMode(
  text: string,
  options: {
    chatEnabled: boolean;
    askExpressionEnabled: boolean;
    learningLanguage: string;
    interfaceLanguage: string;
  },
): ChatInputMode {
  const { chatEnabled, askExpressionEnabled } = options;

  if (chatEnabled && !askExpressionEnabled) return "chat";
  if (!chatEnabled && askExpressionEnabled) return "how_to_say";
  if (!chatEnabled && !askExpressionEnabled) return "chat";

  // Both modes on: a line in the learning language is practice; a line in
  // the UI language is a request for how to say it.
  return writtenInLearningLanguage(
    text,
    options.learningLanguage,
    options.interfaceLanguage,
  )
    ? "chat"
    : "how_to_say";
}

import type { LearningLanguageCode } from "../learningLanguages.ts";
import type { SentenceBank } from "./script.ts";
import type { Direction } from "./director.ts";
import { BANK_GLOSS_LANGUAGE } from "./justTalk.ts";

/**
 * Saying the character's reaction from the bank, after it has decided to say it.
 *
 * The bank was offered to the character twice and withdrawn twice
 * (justTalk.ts, BANK_OFFERED_IN_OPEN_TALK): shown a list, it reached for lines
 * as a gesture rather than because they fit. This never shows it anything. The
 * character writes its turn exactly as it always does, and only afterwards, if
 * the turn opens with a reaction the table holds in other words — "Oh, that
 * sounds great!" for the bank's "That sounds great." — that opening is spoken
 * in the table's fixed words. What is said cannot stop fitting, because it is what the
 * character chose to say.
 *
 * What it buys is the synthesis. A bank line is the same words in the same
 * voice every time, so /api/tts serves it from the shared edge cache after the
 * first person to reach it; a written line is a string nobody has asked for
 * before. The reaction also starts sounding before the rest of the turn has
 * been synthesised.
 *
 * Reactions only, on the user's decision (2026-10-16): the half of a turn that
 * answers what was just said in a way that fits anything. Questions and answers
 * point at what the learner said, and two of them that look alike are not the
 * same line — "Where was that?" for "Where did you go?" was a real failure.
 *
 * Text, not ids. The Just talk lines are not shipped as files (build-roleplay-
 * audio.mjs records a scene's nodes, not its repertoire), and an id the app
 * believes ships as a file plays silence (session.ts, `recorded`). Sent as its
 * own words the line goes to the same cache whichever build plays it.
 *
 * Pure: the route calls it with the answer and says whether the build can play
 * a reaction as a line of its own.
 */

type Reaction = {
  /**
   * The words spoken: a bank line that does not ask anything, or a line of the
   * table's own. Either way it is one fixed string in the scene's voice, which
   * is all the shared cache needs — the Just talk lines are not files either.
   * A line of its own carries a Korean gloss like the bank's (BANK_GLOSS_LANGUAGE).
   */
  line: { id: string } | { text: string; translation: string };
  /**
   * Other ways of writing the same reaction, which the character produces and
   * this line should answer for. Case, spaces and punctuation are ignored, so
   * only different words need listing. Same meaning and same register only:
   * the line spoken is this one, and the transcript shows it.
   */
  also?: string[];
};

const fromBank = (id: string, also?: string[]): Reaction => ({ line: { id }, ...(also ? { also } : {}) });
const own = (text: string, translation: string, also?: string[]): Reaction => ({
  line: { text, translation },
  ...(also ? { also } : {}),
});

/**
 * Lines of the table's own come from what the character was seen to say on
 * the first check against production (2026-10-16): of eighteen turns, the bank
 * answered two, and the reactions it missed were these. The table grows the
 * same way — the written lines kept by noteSentenceWritten are where to look.
 */
const REACTIONS: Partial<Record<LearningLanguageCode, Reaction[]>> = {
  en: [
    fromBank("talk.nice", ["Sounds great.", "Oh, that sounds great.", "Oh, sounds great.", "That sounds really great."]),
    fromBank("talk.go-on", ["Really? Tell me more.", "Oh, really? Tell me more."]),
    fromBank("talk.rough", ["That sounds rough.", "Oh no, that's rough.", "That's rough.", "Oh no, that sounds tough.", "That sounds tough."]),
    fromBank("talk.same", ["Same here."]),
    fromBank("talk.didnt-catch"),
    fromBank("talk.slower"),
    fromBank("talk.agree", ["Exactly.", "Yes, exactly."]),
    fromBank("talk.think-so"),
    fromBank("talk.good-point", ["Good point.", "Oh, that's a good point."]),
    fromBank("talk.tough", ["That must've been tough.", "Oh, that must have been tough.", "Oh no, that must have been tough."]),
    fromBank("talk.glad", ["Glad it worked out.", "I'm so glad it worked out."]),
    fromBank("talk.impressive", ["That's impressive.", "Wow, that's really impressive.", "Wow, impressive."]),
    fromBank("talk.funny", ["That's funny.", "Haha, that's funny."]),
    fromBank("talk.makes-sense", ["That makes sense.", "Oh, that makes sense.", "Ah, makes sense.", "Makes sense."]),
    fromBank("talk.never-done", ["I have never done that."]),
    fromBank("talk.jealous", ["Honestly, I'm a little jealous."]),
    fromBank("talk.know-feeling", ["I know that feeling.", "Yeah, I know the feeling.", "I know the feeling."]),
    fromBank("talk.surprised", ["Seriously?", "Wait, really?"]),
    own("That sounds fun!", "재밌었겠네요!", ["Sounds fun!", "Oh, that sounds fun!", "That sounds like fun!", "Oh, that sounds like fun!"]),
    own("That's awesome!", "멋지네요!", ["Wow, that's awesome!", "Oh, that's awesome!"]),
    own("Congratulations!", "축하해요!", ["Congrats!", "Oh, congratulations!", "Wow, congratulations!"]),
  ],
  // Plain register throughout, like the bank's own lines: a polite いいですね
  // written by the character is not swapped for a plain いいね.
  ja: [
    fromBank("talk.nice", ["いいね。", "それはいいね。"]),
    fromBank("talk.go-on", ["もっと教えて。", "へー、もっと教えてよ。", "へえ、もっと教えて。"]),
    fromBank("talk.rough", ["それは大変だったね。", "大変だったね。", "うわー、大変だったね。"]),
    fromBank("talk.same", ["実は私もそうだったよ。", "私もそうだったよ。"]),
    fromBank("talk.didnt-catch"),
    fromBank("talk.slower", ["ゆっくりでいいよ。"]),
    fromBank("talk.agree", ["ほんとそれ。", "ほんとにそれ。"]),
    fromBank("talk.think-so"),
    fromBank("talk.good-point"),
    fromBank("talk.tough", ["それはつらかったよね。", "つらかったよね。"]),
    fromBank("talk.glad", ["うまくいってよかった。"]),
    fromBank("talk.impressive", ["すごいね！", "それすごいね！", "それはすごいね。"]),
    fromBank("talk.funny", ["それ面白いね。", "面白いね。"]),
    fromBank("talk.makes-sense", ["なるほどね。", "なるほど。", "あー、なるほど。"]),
    fromBank("talk.never-done"),
    fromBank("talk.jealous", ["ちょっとうらやましいな。"]),
    fromBank("talk.know-feeling", ["その気持ちわかるよ。", "その気持ち、わかる。", "わかるよ、その気持ち。"]),
    fromBank("talk.surprised", ["マジで？", "えっ、マジで？"]),
    own("おめでとう！", "축하해!", ["わあ、おめでとう！"]),
    own("楽しそうだね！", "재밌었겠다!", ["楽しそう！", "それは楽しそうだね。"]),
  ],
  // No bank yet, so every line is the table's own.
  es: [
    own("¡Qué bien!", "좋네요!"),
    own("¡Qué divertido!", "재밌었겠네요!"),
    own("¡Felicidades!", "축하해요!", ["¡Muchas felicidades!"]),
  ],
};

function resolve(reaction: Reaction, bank: SentenceBank): { text: string; translation?: string } | null {
  if ("text" in reaction.line) return reaction.line;
  return bank[reaction.line.id] ?? null;
}

/** A name for each reaction, for tests and counting: the bank id, or its words. */
function nameOf(reaction: Reaction): string {
  return "id" in reaction.line ? reaction.line.id : reaction.line.text;
}

/** What is compared: letters, marks and digits, nothing else, in one case. */
export function reactionKey(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "");
}

/**
 * The sentences of a line, each with its closing punctuation and the space
 * after it.
 *
 * Full-width marks end a sentence without a space (Japanese, Chinese); ASCII
 * ones need the space or the end, so "4.50" and "e.g." stay inside a sentence.
 * A language that closes nothing with punctuation (Thai) comes back as one
 * sentence, and so never has a reaction split from it.
 */
export function sentencesOf(text: string): string[] {
  const out: string[] = [];
  const pattern = /[\s\S]*?(?:[。！？؟]+|[.!?…]+(?=\s|$))["'”’」』)]*\s*/gu;
  let used = 0;
  for (const match of text.matchAll(pattern)) {
    if (!match[0]) continue;
    out.push(match[0]);
    used = (match.index ?? 0) + match[0].length;
  }
  if (used < text.length) out.push(text.slice(used));
  return out.filter((part) => part.trim());
}

function indexFor(language: string, bank: SentenceBank): Map<string, Reaction> {
  const index = new Map<string, Reaction>();
  for (const reaction of REACTIONS[language as LearningLanguageCode] ?? []) {
    const line = resolve(reaction, bank);
    if (!line) continue;
    for (const form of [line.text, ...(reaction.also ?? [])]) {
      const key = reactionKey(form);
      if (key && !index.has(key)) index.set(key, reaction);
    }
  }
  return index;
}

export type FoundReaction = {
  /** The bank id, or the line's own words when it is the table's. */
  id: string;
  /** The bank's words, which are what will be spoken. */
  text: string;
  translation?: string;
  /** What the character wrote after the reaction. Empty when the reaction was the whole line. */
  rest: string;
};

/**
 * The reaction a written line opens with, when the bank holds it.
 *
 * One or two sentences, longest first: "Oh really? Tell me more." is one
 * reaction across two.
 */
export function findReaction(
  text: string,
  language: string,
  bank: SentenceBank,
): FoundReaction | null {
  const index = indexFor(language, bank);
  if (index.size === 0) return null;
  const parts = sentencesOf(text.trim());
  for (let take = Math.min(2, parts.length); take >= 1; take -= 1) {
    const reaction = index.get(reactionKey(parts.slice(0, take).join("")));
    const line = reaction && resolve(reaction, bank);
    if (!reaction || !line) continue;
    return {
      id: nameOf(reaction),
      text: line.text,
      ...(line.translation ? { translation: line.translation } : {}),
      rest: parts.slice(take).join("").trim(),
    };
  }
  return null;
}

/** The bank lines a language's reactions are said as. */
export function reactionIdsFor(language: string): string[] {
  return (REACTIONS[language as LearningLanguageCode] ?? []).flatMap((reaction) =>
    "id" in reaction.line ? [reaction.line.id] : [],
  );
}

/** Whether a language has any reactions to swap in. */
export function hasReactions(language: string): boolean {
  return (REACTIONS[language as LearningLanguageCode]?.length ?? 0) > 0;
}

/**
 * The answer with its opening reaction spoken from the bank.
 *
 * A line that is nothing but a reaction becomes the bank's line, for any build:
 * it is still one written line, only in the words the cache already holds. A
 * reaction followed by more is split off as `react` only for a build that
 * says it plays one (ROLEPLAY_REACT_CLIENT_HEADER); every other build gets the
 * line as the character wrote it, which is what it has always had.
 *
 * Lines the bank already says by id, the scripted scenes and every language
 * without reactions pass through untouched.
 */
export function withBankReaction(
  direction: Direction,
  input: {
    language: string;
    nativeLanguage: string;
    bank: SentenceBank;
    openEnded: boolean;
    canSplit: boolean;
  },
): { direction: Direction; swapped: boolean } {
  if (!input.openEnded || !("text" in direction.say) || direction.react) {
    return { direction, swapped: false };
  }
  const found = findReaction(direction.say.text, input.language, input.bank);
  if (!found) return { direction, swapped: false };
  // The bank's glosses are Korean (justTalk.ts, BANK_GLOSS_LANGUAGE). Anyone
  // else gets the line without one, and it is translated once it has been said.
  const gloss = input.nativeLanguage === BANK_GLOSS_LANGUAGE ? found.translation : undefined;
  const reaction = { text: found.text, ...(gloss ? { translation: gloss } : {}) };
  if (!found.rest) return { direction: { ...direction, say: reaction }, swapped: true };
  if (!input.canSplit) return { direction, swapped: false };
  return {
    direction: { ...direction, react: reaction, say: { text: found.rest } },
    swapped: true,
  };
}

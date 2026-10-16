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
 * the turn opens with a reaction the bank already holds in other words — "Oh,
 * that sounds great!" for "That sounds great." — that opening is spoken as the
 * bank's line. What is said cannot stop fitting, because it is what the
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
  /** A line in the bank that does not ask anything. */
  id: string;
  /**
   * Other ways of writing the same reaction, which the character produces and
   * the bank should answer for. Case, spaces and punctuation are ignored, so
   * only different words need listing. Same meaning and same register only:
   * the line spoken is the bank's, and the transcript shows it.
   */
  also?: string[];
};

const REACTIONS: Partial<Record<LearningLanguageCode, Reaction[]>> = {
  en: [
    { id: "talk.nice", also: ["Sounds great.", "Oh, that sounds great.", "Oh, sounds great.", "That sounds really great."] },
    { id: "talk.go-on", also: ["Really? Tell me more.", "Oh, really? Tell me more."] },
    { id: "talk.rough", also: ["That sounds rough.", "Oh no, that's rough.", "That's rough."] },
    { id: "talk.same", also: ["Same here."] },
    { id: "talk.didnt-catch" },
    { id: "talk.slower" },
    { id: "talk.agree", also: ["Exactly.", "Yes, exactly."] },
    { id: "talk.think-so" },
    { id: "talk.good-point", also: ["Good point.", "Oh, that's a good point."] },
    { id: "talk.tough", also: ["That must've been tough.", "Oh, that must have been tough."] },
    { id: "talk.glad", also: ["Glad it worked out.", "I'm so glad it worked out."] },
    { id: "talk.impressive", also: ["That's impressive.", "Wow, that's really impressive.", "Wow, impressive."] },
    { id: "talk.funny", also: ["That's funny.", "Haha, that's funny."] },
    { id: "talk.makes-sense", also: ["That makes sense.", "Oh, that makes sense.", "Ah, makes sense.", "Makes sense."] },
    { id: "talk.never-done", also: ["I have never done that."] },
    { id: "talk.jealous", also: ["Honestly, I'm a little jealous."] },
    { id: "talk.know-feeling", also: ["I know that feeling.", "Yeah, I know the feeling.", "I know the feeling."] },
    { id: "talk.surprised", also: ["Seriously?", "Wait, really?"] },
  ],
  // Plain register throughout, like the bank's own lines: a polite いいですね
  // written by the character is not swapped for a plain いいね.
  ja: [
    { id: "talk.nice", also: ["いいね。", "それはいいね。"] },
    { id: "talk.go-on", also: ["もっと教えて。", "へー、もっと教えてよ。", "へえ、もっと教えて。"] },
    { id: "talk.rough", also: ["それは大変だったね。", "大変だったね。", "うわー、大変だったね。"] },
    { id: "talk.same", also: ["実は私もそうだったよ。", "私もそうだったよ。"] },
    { id: "talk.didnt-catch" },
    { id: "talk.slower", also: ["ゆっくりでいいよ。"] },
    { id: "talk.agree", also: ["ほんとそれ。", "ほんとにそれ。"] },
    { id: "talk.think-so" },
    { id: "talk.good-point" },
    { id: "talk.tough", also: ["それはつらかったよね。", "つらかったよね。"] },
    { id: "talk.glad", also: ["うまくいってよかった。"] },
    { id: "talk.impressive", also: ["すごいね！", "それすごいね！", "それはすごいね。"] },
    { id: "talk.funny", also: ["それ面白いね。", "面白いね。"] },
    { id: "talk.makes-sense", also: ["なるほどね。", "なるほど。", "あー、なるほど。"] },
    { id: "talk.never-done" },
    { id: "talk.jealous", also: ["ちょっとうらやましいな。"] },
    { id: "talk.know-feeling", also: ["その気持ちわかるよ。", "その気持ち、わかる。", "わかるよ、その気持ち。"] },
    { id: "talk.surprised", also: ["マジで？", "えっ、マジで？"] },
  ],
};

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

function indexFor(language: string, bank: SentenceBank): Map<string, string> {
  const index = new Map<string, string>();
  for (const reaction of REACTIONS[language as LearningLanguageCode] ?? []) {
    const line = bank[reaction.id];
    if (!line) continue;
    for (const form of [line.text, ...(reaction.also ?? [])]) {
      const key = reactionKey(form);
      if (key && !index.has(key)) index.set(key, reaction.id);
    }
  }
  return index;
}

export type FoundReaction = {
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
    const id = index.get(reactionKey(parts.slice(0, take).join("")));
    if (!id) continue;
    const line = bank[id]!;
    return {
      id,
      text: line.text,
      ...(line.translation ? { translation: line.translation } : {}),
      rest: parts.slice(take).join("").trim(),
    };
  }
  return null;
}

/** The bank lines a language's reactions are said as. */
export function reactionIdsFor(language: string): string[] {
  return (REACTIONS[language as LearningLanguageCode] ?? []).map((reaction) => reaction.id);
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

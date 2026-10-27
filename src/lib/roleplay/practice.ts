import { segmentChunk } from "../wordSegments.ts";
/**
 * Saying the line again, and being told what came out instead.
 *
 * The review hands the learner a sentence they could have said. This is the
 * half after that: they say it, and it is compared against the sentence they
 * were given.
 *
 * Which is the whole reason this can say anything useful about how it sounded.
 * In free conversation a transcript is ambiguous — "I walked here" might be
 * what they said or what the machine heard — and there is no way to tell a
 * mispronounced word from a wrong one. Here the target is known, so every
 * divergence is located and meaningful: the word was "please", the machine
 * heard "peace", and that is evidence about a sound rather than a guess.
 *
 * What it must not do is claim more than that. A transcript is text; the sound
 * is gone by the time it arrives. This can say which word did not survive the
 * trip and what it turned into. It cannot say a vowel was short or the stress
 * was on the wrong syllable, and pretending otherwise would spend the one thing
 * a learner cannot get back, which is their trust in the rest of it.
 *
 * Pure. The comparing and the prompt are here; the route moves bytes.
 */

/** One word of the sentence they were given, and what came out of it. */
export type WordOutcome =
  | { kind: "kept"; word: string }
  /** Said as something else — the evidence a sound did not land. */
  | { kind: "changed"; word: string; heardAs: string }
  /** Not in what was heard at all. */
  | { kind: "dropped"; word: string };

export type Comparison = {
  outcomes: WordOutcome[];
  /** Words in what was heard that the sentence did not ask for. */
  added: string[];
  /** Whether every word of the target survived. */
  clean: boolean;
};

/**
 * The sentence as words, for lining one up against the other.
 *
 * Marks are letters here. A Devanagari vowel sign and a Thai tone mark are
 * \p{M} rather than \p{L}, and stripping them does not tidy a sentence up — it
 * cuts every syllable into its bare consonant. Measured on the scene's own two
 * lines: Thai came apart into twenty-one pieces where there are six, and Hindi
 * into thirty averaging 1.4 characters, which is one consonant each.
 *
 * That is worse than useless here, because this is the one place the pieces are
 * shown to the learner as the words they said: it told them, with confidence,
 * that นใหม had come out as นเก — two things that are not words. Everything
 * else in the app that splits a sentence already keeps marks (learningSpans.ts).
 */
function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s']/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    // Japanese, Chinese and Thai have no spaces to split on: without this a
    // whole sentence was one word, and one wrong word made all of it wrong.
    .flatMap((chunk) => segmentChunk(chunk));
}

/** Longest common subsequence, as pairs of indexes that matched. */
function commonPairs(a: string[], b: string[]): [number, number][] {
  const grid: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      grid[i]![j] =
        a[i] === b[j]
          ? grid[i + 1]![j + 1]! + 1
          : Math.max(grid[i + 1]![j]!, grid[i]![j + 1]!);
    }
  }
  const pairs: [number, number][] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      pairs.push([i, j]);
      i += 1;
      j += 1;
    } else if (grid[i + 1]![j]! >= grid[i]![j + 1]!) {
      i += 1;
    } else {
      j += 1;
    }
  }
  return pairs;
}

/**
 * What became of each word of the sentence they were given.
 *
 * Words between two that survived are lined up in order: the first word that
 * went missing is read as having come out as the first word that appeared in
 * its place. That is a guess, but a narrow one — the anchors on either side
 * hold it — and it is the guess that turns "these two sentences differ" into
 * "this word came out as that one".
 */
export function compareToTarget(target: string, heard: string): Comparison {
  const wanted = words(target);
  const said = words(heard);
  const pairs = commonPairs(wanted, said);

  const outcomes: WordOutcome[] = [];
  const added: string[] = [];
  let i = 0;
  let j = 0;

  const drain = (untilI: number, untilJ: number) => {
    const missing = wanted.slice(i, untilI);
    const extra = said.slice(j, untilJ);
    // When more came out than went missing, the last missing word takes the rest:
    // 初めまして is cut into 初め + まして, and both stand for はじめまして.
    const tail = missing.length > 0 && extra.length > missing.length;
    const glue = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u.test(heard) ? "" : " ";
    missing.forEach((word, index) => {
      const heardAs = tail && index === missing.length - 1 ? extra.slice(index).join(glue) : extra[index];
      outcomes.push(
        heardAs ? { kind: "changed", word, heardAs } : { kind: "dropped", word },
      );
    });
    if (!tail) added.push(...extra.slice(missing.length));
  };

  for (const [pi, pj] of pairs) {
    drain(pi, pj);
    outcomes.push({ kind: "kept", word: wanted[pi]! });
    i = pi + 1;
    j = pj + 1;
  }
  drain(wanted.length, said.length);

  return {
    outcomes,
    added,
    clean: outcomes.every((outcome) => outcome.kind === "kept") && added.length === 0,
  };
}

/** The words that did not survive, as the prompt should describe them. */
export function troubleWords(comparison: Comparison): string[] {
  return comparison.outcomes
    .filter((outcome) => outcome.kind !== "kept")
    .map((outcome) =>
      outcome.kind === "changed"
        ? `"${outcome.word}" came out as "${outcome.heardAs}"`
        : `"${outcome.word}" did not come out at all`,
    );
}

export type Practice = {
  /** Said well enough that nothing is worth raising. */
  good: boolean;
  /** One or two sentences, in the learner's own language. */
  note: string;
};

export const MAX_PRACTICE_CHARS = 400;

export function practicePrompt(input: {
  target: string;
  heard: string;
  comparison: Comparison;
  targetLanguage: string;
  nativeLanguage: string;
}): string {
  const trouble = troubleWords(input.comparison);
  return `Someone learning ${input.targetLanguage} was given a sentence to say out loud, and has just said it. You are looking at what a speech recogniser made of it.

The sentence they were given: "${input.target}"
What the recogniser heard: "${input.heard || "(nothing)"}"
${trouble.length > 0 ? `Where it diverged:\n${trouble.map((line) => `- ${line}`).join("\n")}` : "Every word came through."}

What you may conclude, and nothing beyond it: a word the recogniser turned into a different word is a word whose sounds did not land, and the word it turned into says which sounds. You are reading text, not listening — you cannot know about vowel length, stress or rhythm, so do not mention them. Never guess at an accent.

One exception, and it matters: if the word it heard sounds the same as the word they were given — here and hear, piece and peace, to and too — then the sounds did land and the recogniser simply chose the other spelling. Say that it was said correctly, and when every divergence is of this kind — including the same word written in kana instead of kanji or the other way round — "good" is true. Telling someone to fix a sound they got right is the fastest way to make them stop believing the rest of this.

Be plain about scale. A word or two out of a short sentence is normal and worth one specific tip. Everything coming through is worth saying so in one line and nothing more.

The person reading your note speaks ${input.nativeLanguage}: write the note entirely in ${input.nativeLanguage}, never in ${input.targetLanguage} (2026-10-27: a Japanese line got a note in Japanese for a Korean reader). Quote words of the sentence only where you must.

Reply as JSON only, writing in ${input.nativeLanguage}, politely and in one consistent level of politeness:
{"good": true or false, "note": "<one or two sentences>"}

"good" is true when nothing is worth raising. "note" is still written then — say what came through well, briefly, without praise it did not earn.`;
}

/**
 * "내 말로"(단계 대본 3~5단계, 2026-10-27): 원문을 보지 않고 뜻만 보고 자기 말로 했다. 낱말 비교가 아니라
 * 그 자리에서 그 뜻이 자연스럽게 통하는지 — good이면 통과. 원어민 줄은 비교 기준이 아니라 한 가지 예.
 */
export function ownWordsPrompt(input: {
  meaning: string;
  reference: string;
  heard: string;
  before: string;
  targetLanguage: string;
  nativeLanguage: string;
}): string {
  return `Someone learning ${input.targetLanguage} is practising a conversation. They were shown only the meaning of their next line and said it in their own words. You are looking at what a speech recogniser made of it.

${input.before ? `The other person had just said: "${input.before}"\n` : ""}The meaning they had to get across: "${input.meaning}"
One way a native speaker might say it (not the only right answer): "${input.reference}"
What the recogniser heard: "${input.heard || "(nothing)"}"

"good" is true when what they said gets that meaning across, fits as a reply at this point, and a native listener would accept it without stumbling — different words from the native line are fine. It is false when the meaning is lost or changed, when a mistake would confuse or sound wrong to a native, or when nothing usable came through. A recogniser slip that sounds the same is not their mistake.

The person reading your note speaks ${input.nativeLanguage}: write the note entirely in ${input.nativeLanguage}, never in ${input.targetLanguage}, quoting ${input.targetLanguage} words only where you must. When "good" is false, say in one sentence what did not come across or what sounds wrong, and how to fix it. When "good" is true, one short line on what worked; if the native line has a more natural turn worth knowing, mention it.

Reply as JSON only, politely and in one consistent level of politeness:
{"good": true or false, "note": "<one or two sentences>"}`;
}

export function parsePractice(raw: string): Practice | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const record = parsed as { good?: unknown; note?: unknown };
  const note = typeof record.note === "string" ? record.note.trim().slice(0, MAX_PRACTICE_CHARS) : "";
  if (!note) return null;
  return { good: record.good === true, note };
}

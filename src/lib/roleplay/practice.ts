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
    // When more came out than went missing, the pieces are shared out by length:
    // 初めまして is cut into 初め + まして, and both stand for はじめまして. Each missing
    // word takes pieces until it is about as long as the word, leaving one for each
    // word after it; the last takes what is left.
    const tail = missing.length > 0 && extra.length > missing.length;
    const glue = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u.test(heard) ? "" : " ";
    const shares: string[] = [];
    if (tail) {
      let k = 0;
      missing.forEach((word, index) => {
        const left = missing.length - index - 1;
        if (!left) {
          shares.push(extra.slice(k).join(glue));
          return;
        }
        const taken = [extra[k++]!];
        while (k < extra.length - left && [...taken.join(glue)].length < [...word].length) taken.push(extra[k++]!);
        shares.push(taken.join(glue));
      });
    }
    missing.forEach((word, index) => {
      const heardAs = tail ? shares[index] : extra[index];
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
  /**
   * 떠올려 말한 줄·내 말로·문장구조(2026-10-28 사용자 "의미상 맞는 문장 / 문법적으로 맞지만 자연스럽지 않은 문장 / 틀린 문장으로 나눠서"):
   * natural = 맞는 표현, awkward = 맞지만 더 자연스러운 말이 있음(통과), wrong = 틀림. 없으면 예전 판단만.
   */
  verdict?: "natural" | "awkward" | "wrong";
  /** awkward·wrong일 때 더 자연스러운(맞는) 말 한 줄(학습 언어). */
  better?: string;
};

export const MAX_PRACTICE_CHARS = 400;

/** 받아쓰기가 망설인 낱말(clarity, 2026-10-28) — 확인 한마디에 넣는 문단. good은 바꾸지 않는다. */
function unclearPart(unclear: readonly string[] | undefined, nativeLanguage: string): string {
  if (!unclear?.length) return "";
  return `\nThe recogniser hesitated over ${unclear.length === 1 ? "this word" : "these words"}: ${unclear.map((word) => `"${word}"`).join(", ")}. It still wrote ${unclear.length === 1 ? "it" : "them"} correctly, so ${unclear.length === 1 ? "it counts" : "they count"} as said and does not change "good" — but hesitation usually means the sounds were not quite clear. In the note, after saying what went well, name the least clear word and give one concrete, short tip a ${nativeLanguage} speaker can act on (which sound in the word to make clearer, e.g. a final consonant or a vowel), without claiming to know about stress, rhythm or accent.\n`;
}

export function practicePrompt(input: {
  target: string;
  heard: string;
  comparison: Comparison;
  targetLanguage: string;
  nativeLanguage: string;
  unclear?: string[];
}): string {
  const trouble = troubleWords(input.comparison);
  return `Someone learning ${input.targetLanguage} was given a sentence to say out loud, and has just said it. You are looking at what a speech recogniser made of it.

The sentence they were given: "${input.target}"
What the recogniser heard: "${input.heard || "(nothing)"}"
${trouble.length > 0 ? `Where it diverged:\n${trouble.map((line) => `- ${line}`).join("\n")}` : "Every word came through."}
${unclearPart(input.unclear, input.nativeLanguage)}
What you may conclude, and nothing beyond it: a word the recogniser turned into a different word is a word whose sounds did not land, and the word it turned into says which sounds. You are reading text, not listening — you cannot know about vowel length, stress or rhythm, so do not mention them. Never guess at an accent.

One exception, and it matters: if the word it heard sounds the same as the word they were given — here and hear, piece and peace, to and too — then the sounds did land and the recogniser simply chose the other spelling. Say that it was said correctly, and when every divergence is of this kind — including the same word written in kana instead of kanji or the other way round — "good" is true. Telling someone to fix a sound they got right is the fastest way to make them stop believing the rest of this.

Be plain about scale. A word or two out of a short sentence is normal and worth one specific tip. Everything coming through is worth saying so in one line and nothing more.

The person reading your note speaks ${input.nativeLanguage}: write the note entirely in ${input.nativeLanguage}, never in ${input.targetLanguage} (2026-10-27: a Japanese line got a note in Japanese for a Korean reader). Quote words of the sentence only where you must.

Reply as JSON only, writing in ${input.nativeLanguage}, politely and in one consistent level of politeness:
{"good": true or false, "note": "<one or two sentences>"}

"good" is true when nothing is worth raising. "note" is still written then — say what came through well, briefly, without praise it did not earn.`;
}

/**
 * 대본·문장구조를 보지 않고(첫 글자만·가리기·문장구조만) 떠올려 말했다(2026-10-28 사용자 "기존 문장에서 변형된 맞는 표현도 고치라고 함" →
 * 맞게 바꿔 말한 것은 통과). 원문 그대로가 아니어도 같은 뜻을 자연스럽고 맞게 말했으면 good — 원문과 다른 말은 note에 원문 표현을 짧게 알려 준다.
 * 받아쓰기가 떨어뜨린 짧은 낱말(관사·전치사)과 같은 소리 다른 글자는 학습자 잘못이 아니다.
 */
export function recallPrompt(input: { target: string; heard: string; comparison: Comparison; targetLanguage: string; nativeLanguage: string; unclear?: string[] }): string {
  return `Someone learning ${input.targetLanguage} is practising a dialogue line from memory — the line was hidden, so they said it in their own way. You are looking at what a speech recogniser made of what they said.

The line in the script: "${input.target}"
What the recogniser heard: "${input.heard || "(nothing)"}"
${unclearPart(input.unclear, input.nativeLanguage)}
This is not a dictation check. Decide like a friendly native speaker in that conversation: would you understand the same thing, and does it sound like something people really say?
- "good" is TRUE when the meaning is the same and it is natural and grammatical, even with different wording. Different but equivalent choices are fine: will vs. going to for a plan, a modal or impersonal form instead of a personal one when the question means the same, a synonym, a contraction, a different natural order, a polite form of the same request, a shorter natural way of saying it.
- Speech recognisers drop or blur short unstressed words (articles, prepositions such as before days of the week, auxiliaries) and spell some words differently; they also drop punctuation and the rise of a question, so a statement-shaped transcript of something that works as the question here is fine. If the rest of the sentence is right, assume those small words were said.
- Recognisers do not strip word endings. A missing past tense, plural, conjugation or agreement — especially more than once — is the learner's mistake, not the recogniser's.
- "good" is FALSE only when the meaning really changed (a different fact, time, person or intention), the grammar is clearly wrong in a way a native would notice (wrong tense for what is meant, wrong form, broken agreement), or too little came through to tell.

Also sort it into one of three verdicts:
- "natural": the meaning fits and it is something a native speaker would naturally say here (wording may differ from the script).
- "awkward": understandable and grammatical, but a native speaker would put it differently — still counts as a pass; give the more natural way in "better".
- "wrong": the meaning changed or got lost, or there is a real grammar mistake — give the correct way in "better".
"good" is true for "natural" and "awkward", false for "wrong". "better" is one short line in ${input.targetLanguage} (empty for "natural"). In the note, for "awkward" say briefly why the better line sounds more natural.

The person reading your note speaks ${input.nativeLanguage}: write the note entirely in ${input.nativeLanguage}, never in ${input.targetLanguage}, quoting ${input.targetLanguage} words only where you must. When "good" is true and the wording differs from the script, say in one short line that it works and quote how the script says it. When "good" is false, say in one sentence what is off and how to fix it; if almost nothing came through, say gently to try again a little slower.

Reply as JSON only, politely and in one consistent level of politeness:
{"good": true or false, "verdict": "natural or awkward or wrong", "better": "<more natural or correct line, or empty>", "note": "<one or two sentences>"}`;
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

"good" is true when what they said gets that meaning across, fits as a reply at this point, and a native listener would accept it without stumbling — different words from the native line are fine. It is false when the meaning is lost or changed, when a mistake would confuse or sound wrong to a native, or when nothing usable came through. A recogniser slip that sounds the same is not their mistake, and the recogniser often drops punctuation and the rise of a question — a statement-shaped transcript of something that works as a question at this point is fine. Bring up politeness only when it clearly clashes with the relationship the conversation shows; match the speech level the native line uses.

Also sort it into one of three verdicts:
- "natural": the meaning fits and it is something a native speaker would naturally say here (wording may differ from the script).
- "awkward": understandable and grammatical, but a native speaker would put it differently — still counts as a pass; give the more natural way in "better".
- "wrong": the meaning changed or got lost, or there is a real grammar mistake — give the correct way in "better".
"good" is true for "natural" and "awkward", false for "wrong". "better" is one short line in ${input.targetLanguage} (empty for "natural"). In the note, for "awkward" say briefly why the better line sounds more natural.

The person reading your note speaks ${input.nativeLanguage}: write the note entirely in ${input.nativeLanguage}, never in ${input.targetLanguage}, quoting ${input.targetLanguage} words only where you must. When "good" is false, say in one sentence what did not come across or what sounds wrong, and how to fix it. When "good" is true, one short line on what worked; if the native line has a more natural turn worth knowing, mention it.

Reply as JSON only, politely and in one consistent level of politeness:
{"good": true or false, "verdict": "natural or awkward or wrong", "better": "<more natural or correct line, or empty>", "note": "<one or two sentences>"}`;
}

/**
 * 틀 "내 말로"(3단계 틀, 2026-10-28): 틀은 그대로 두고 빈칸에 자기 이야기를 넣어 말했다. 빈칸에 무엇을 넣었는지가 아니라
 * 틀을 맞게(활용·조사·어순까지) 썼는지와 문장이 자연스러운지 — good이면 그 예문 하나 통과.
 */
export function frameUsePrompt(input: {
  frame: string;
  meaning: string;
  example: string;
  heard: string;
  targetLanguage: string;
  nativeLanguage: string;
}): string {
  return `Someone learning ${input.targetLanguage} is practising one sentence pattern. They keep the pattern and fill the blank (___) with something true about themselves, in their own words. You are looking at what a speech recogniser made of it.

The pattern: "${input.frame}"${input.meaning ? `\nWhat the pattern does: "${input.meaning}"` : ""}
One example sentence with this pattern (theirs may fill the blank with anything): "${input.example}"
What the recogniser heard: "${input.heard || "(nothing)"}"

"good" is true when the sentence uses this pattern — with the blank filled by any sensible content, conjugated or joined to the pattern correctly — and a native listener would accept it as natural. It is false when the pattern is missing or changed into a different one, when the filler is not joined to it correctly (wrong form, particle or agreement), or when nothing usable came through. Do not judge what they chose to talk about.

Also sort it into one of three verdicts:
- "natural": the meaning fits and it is something a native speaker would naturally say here (wording may differ from the script).
- "awkward": understandable and grammatical, but a native speaker would put it differently — still counts as a pass; give the more natural way in "better".
- "wrong": the meaning changed or got lost, or there is a real grammar mistake — give the correct way in "better".
"good" is true for "natural" and "awkward", false for "wrong". "better" is one short line in ${input.targetLanguage} (empty for "natural"). In the note, for "awkward" say briefly why the better line sounds more natural. A recogniser slip that sounds the same is not their mistake, and the recogniser often drops punctuation.

The person reading your note speaks ${input.nativeLanguage}: write the note entirely in ${input.nativeLanguage}, never in ${input.targetLanguage}, quoting ${input.targetLanguage} words only where you must. When "good" is false, say in one sentence what is off in how the pattern was used and how to fix it. When "good" is true, one short line on what worked.

Reply as JSON only, politely and in one consistent level of politeness:
{"good": true or false, "verdict": "natural or awkward or wrong", "better": "<more natural or correct line, or empty>", "note": "<one or two sentences>"}`;
}

export function parsePractice(raw: string): Practice | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const record = parsed as { good?: unknown; note?: unknown; verdict?: unknown; better?: unknown };
  const note = typeof record.note === "string" ? record.note.trim().slice(0, MAX_PRACTICE_CHARS) : "";
  if (!note) return null;
  const verdict = record.verdict === "natural" || record.verdict === "awkward" || record.verdict === "wrong" ? record.verdict : undefined;
  const better = typeof record.better === "string" ? record.better.trim().slice(0, 200) : "";
  // 세 갈래가 오면 그것으로 good을 정한다(맞지만 어색한 것도 통과).
  const good = verdict ? verdict !== "wrong" : record.good === true;
  return { good, note, ...(verdict ? { verdict } : {}), ...(better && verdict !== "natural" ? { better } : {}) };
}

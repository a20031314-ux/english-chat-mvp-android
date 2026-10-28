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
export type WordOutcome = (
  | { kind: "kept"; word: string }
  /** Said as something else — the evidence a sound did not land. */
  | { kind: "changed"; word: string; heardAs: string }
  /** Not in what was heard at all. */
  | { kind: "dropped"; word: string }
) & {
  /**
   * 화면에 보일 모양(2026-10-29 사용자 "첫 글자가 소문자로, 온점도 없고"): 대본 그대로의 대소문자와 붙은 문장부호.
   * word는 비교용(소문자·부호 없음) 그대로 — 옛 앱은 이 칸을 모른다.
   */
  shown?: string;
  /** 뒤에 띄어쓰기가 오는지(띄어쓰기 없는 언어의 조각 사이는 false). */
  space?: boolean;
};

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

/**
 * words()와 같은 조각을, 화면용 모양으로(대소문자 그대로, 앞뒤 문장부호를 그 조각에 붙여서).
 * 공백으로 나눈 덩어리마다 words()를 하면 전체 words()와 같은 순서가 나온다.
 */
function shownWords(text: string): { shown: string; space: boolean }[] {
  const out: { shown: string; space: boolean }[] = [];
  for (const chunk of text.split(/\s+/).filter(Boolean)) {
    const pieces = words(chunk);
    if (!pieces.length) {
      // 부호만 있는 덩어리("—", "?")는 앞 조각에 붙인다.
      if (out.length) out[out.length - 1]!.shown += chunk;
      continue;
    }
    if (pieces.length === 1) {
      out.push({ shown: chunk, space: true });
      continue;
    }
    // 한 덩어리에 여러 조각(띄어쓰기 없는 언어, "fun!I"): 원래 글자로 다시 자르고, 개수가 어긋나면 비교용 조각을 쓴다.
    const original = chunk
      .replace(/[^\p{L}\p{M}\p{N}\s']/gu, " ")
      .split(/\s+/)
      .filter(Boolean)
      .flatMap((part) => segmentChunk(part));
    const parts = original.length === pieces.length ? original : pieces;
    // 띄어쓰기 없는 글자(일·중·태) 조각 사이는 붙이고, 라틴 등("fun!I")은 띄운다.
    const spaceless = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u;
    parts.forEach((part, index) => {
      const last = index === parts.length - 1;
      out.push({ shown: index === 0 ? chunk.match(/^[^\p{L}\p{M}\p{N}']*/u)![0] + part : last ? part + chunk.match(/[^\p{L}\p{M}\p{N}']*$/u)![0] : part, space: last || !(spaceless.test(part) && spaceless.test(parts[index + 1] ?? "")) });
    });
  }
  return out;
}

/** 들린 낱말을 대본 낱말 모양에 맞춘다: 대본이 대문자로 시작하면 들린 말도(라틴·키릴 등 대소문자 있는 글자만). */
function caseLike(heardAs: string, shown: string | undefined): string {
  if (!shown) return heardAs;
  const first = shown.replace(/^[^\p{L}]+/u, "")[0];
  if (first && first !== first.toLowerCase() && heardAs[0]) return heardAs[0].toUpperCase() + heardAs.slice(1);
  return heardAs;
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
  const display = shownWords(target);
  const look = display.length === wanted.length ? display : null;
  const dress = (index: number) => (look ? { shown: look[index]!.shown, space: look[index]!.space } : {});
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
      const dressed = dress(i + index);
      outcomes.push(
        heardAs ? { kind: "changed", word, heardAs: caseLike(heardAs, dressed.shown), ...dressed } : { kind: "dropped", word, ...dressed },
      );
    });
    if (!tail) added.push(...extra.slice(missing.length));
  };

  for (const [pi, pj] of pairs) {
    drain(pi, pj);
    outcomes.push({ kind: "kept", word: wanted[pi]!, ...dress(pi) });
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
  /** 떠올려 말하기(2026-10-29): 대본 줄의 뜻과 내 말의 뜻(앱 언어) — 이 둘을 맞춰 판단한다. 아직 화면에는 안 씀. */
  scriptMeaning?: string;
  saidMeaning?: string;
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
  // 2026-10-29 사용자 "맞는 문장이랑 대조하지 말고 맞는 문장, 내 발화를 각각 해석해서 그걸 대조 — 의미상 어긋난 점만": 낱말이 아니라 뜻끼리 맞춘다.
  return `Someone learning ${input.targetLanguage} is practising a dialogue line from memory — the line was hidden, so they said it in their own way. You are looking at what a speech recogniser made of what they said.

The line in the script: "${input.target}"
What the recogniser heard: "${input.heard || "(nothing)"}"
${unclearPart(input.unclear, input.nativeLanguage)}
Do not compare the words. Compare what a listener would take away, in three steps:
1. "scriptMeaning": what a listener in this conversation would take away from the script line, written in ${input.nativeLanguage} as short facts — what happened or is wanted, who, with whom, where, when (past, now or future), how it felt, and whether it asks something. Write the situation, not the wording: "went to see a film" and "saw a film" both become the fact that they saw a film; "was at the beach" and "went to the beach" both become the fact that they spent time at the beach.
2. "saidMeaning": the same facts for the learner's line, written in the same style. Read it as a listener would: speech recognisers drop punctuation and the rise of a question, blur or drop short unstressed words (articles, prepositions, auxiliaries), and turn a word into a similar-sounding one or run two words together. Where a word of the transcript sounds close to the script's word (or two of them run together) and makes no better sense in this conversation, it is such a slip: write the script's word in "saidMeaning", as if it had been transcribed right, and mention the slip only in the note. If you catch yourself thinking a word "was probably misrecognised", that is exactly this case — it can never make the line "wrong". But never invent content that is not there: a word that is simply absent is absent.
3. Compare the two lists of facts. A difference counts only when a listener would come away believing something different about the situation. Another verb for the same event, a verb that implies the script's one, a synonym, a different natural order, a contraction or a shorter way of saying it all leave the facts the same.

Verdicts:
- "wrong": the two meanings differ — something is missing, added or changed (a fact, time or tense of what happened, person, amount, feeling, intention, or a question turned into a statement where it matters), or too little came through to tell.
- "awkward": the meanings match, but the line has a grammar slip or is phrased in a way a native would not say here — still a pass; give the correct, natural line in "better".
- "natural": the meanings match and it is fine as said.
When in doubt between "natural" and "awkward", choose "natural". A recogniser slip is never a reason for "awkward" or "wrong".
"good" is true for "natural" and "awkward", false for "wrong". "better" is one short line in ${input.targetLanguage} (empty for "natural").

The note is for someone who speaks ${input.nativeLanguage}: write it entirely in ${input.nativeLanguage}, quoting ${input.targetLanguage} words only where you must, in one or two sentences.
- "wrong": name only the meaning that differs (what the script says vs what came across) and the ${input.targetLanguage} words that would carry it. Say nothing about parts whose meaning matched, however differently they were worded.
- "awkward": the slip, and the natural way to say it.
- "natural": one short line that it works; if the wording differs from the script, quote how the script says it.
- If a word read as a recogniser slip, add that that word could be said more clearly.
- If almost nothing came through, say gently to try again a little slower.

Reply as JSON only, politely and in one consistent level of politeness:
{"scriptMeaning": "...", "saidMeaning": "...", "good": true or false, "verdict": "natural or awkward or wrong", "better": "<line or empty>", "note": "<one or two sentences>"}`;
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
- "natural": the meaning fits and a native speaker could comfortably say it this way in this conversation — casual, slightly more formal or simply different from the script all count as natural.
- "awkward": completely grammatical and understandable, but no native would phrase it like this here (clumsy, stiff or odd word choice) — still counts as a pass; give the more natural way in "better".
- "wrong": the meaning changed or got lost, or there is any grammar mistake (wrong verb form or tense, wrong preposition or particle, wrong agreement), even if the meaning still comes through — give the correct way in "better".
When in doubt between "natural" and "awkward", choose "natural"; when in doubt between "awkward" and "wrong" because of a grammar slip, choose "wrong".
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
- "natural": the meaning fits and a native speaker could comfortably say it this way in this conversation — casual, slightly more formal or simply different from the script all count as natural.
- "awkward": completely grammatical and understandable, but no native would phrase it like this here (clumsy, stiff or odd word choice) — still counts as a pass; give the more natural way in "better".
- "wrong": the meaning changed or got lost, or there is any grammar mistake (wrong verb form or tense, wrong preposition or particle, wrong agreement), even if the meaning still comes through — give the correct way in "better".
When in doubt between "natural" and "awkward", choose "natural"; when in doubt between "awkward" and "wrong" because of a grammar slip, choose "wrong".
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
  const record = parsed as { good?: unknown; note?: unknown; verdict?: unknown; better?: unknown; scriptMeaning?: unknown; saidMeaning?: unknown };
  const meaning = (value: unknown) => (typeof value === "string" ? value.trim().slice(0, 300) : "");
  const scriptMeaning = meaning(record.scriptMeaning);
  const saidMeaning = meaning(record.saidMeaning);
  const note = typeof record.note === "string" ? record.note.trim().slice(0, MAX_PRACTICE_CHARS) : "";
  if (!note) return null;
  const verdict = record.verdict === "natural" || record.verdict === "awkward" || record.verdict === "wrong" ? record.verdict : undefined;
  const better = typeof record.better === "string" ? record.better.trim().slice(0, 200) : "";
  // 세 갈래가 오면 그것으로 good을 정한다(맞지만 어색한 것도 통과).
  const good = verdict ? verdict !== "wrong" : record.good === true;
  return {
    good,
    note,
    ...(verdict ? { verdict } : {}),
    ...(better && verdict !== "natural" ? { better } : {}),
    ...(scriptMeaning && saidMeaning ? { scriptMeaning, saidMeaning } : {}),
  };
}

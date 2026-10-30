import type { SpokenLine } from "./director.ts";

/**
 * Looking back at the moment they got stuck, after the conversation moved on.
 *
 * The scene never stops for this. When the tutor judges a turn a struggle the
 * conversation carries on in character, and a button is left on that turn; the
 * learner presses it when they want to know what happened, or never. So the
 * expensive reading happens here, where nothing is waiting: the whole exchange
 * is available, not one turn, and there is no second and a half to answer in.
 *
 * This is also where explicit teaching finally lands. It used to be written
 * into the director's `note` and shown as small text under a bubble while the
 * microphone was open — which is to say, while the learner was trying to speak
 * and reading nothing.
 *
 * Pure. The prompt is built and the answer read here; the route moves bytes.
 */

/** What the scene knows about the turn they got stuck on. */
/**
 * One line of the conversation as the screen holds it.
 *
 * The spoken text plus everything that was learned about it afterwards: a gloss
 * fetched when somebody tapped it, their own sentence said better, a word about
 * it, and the evidence for a turn they got stuck on. It lives here rather than
 * beside the component that draws it because a saved conversation is a list of
 * these, and a library module cannot reach into a component for its shape.
 */
export type TranscriptLine = {
  who: "tutor" | "learner";
  text: string;
  translation?: string;
  /** On the character's line: help for the moment they were stuck in. Never spoken. */
  tip?: string;
  stuck?: StuckTurn;
  /** Their own sentence, said better. Shown under it, never spoken. */
  better?: string;
  /** What they were trying to say, rebuilt from a broken sentence. Shown under it, never spoken. */
  meant?: string;
  /** A word about that sentence, in their own language. Also never spoken. */
  about?: string;
  /** 학습자 줄: 받아쓰기가 확신이 낮았음 — 줄 끝에 "?"(speechConfidence.ts). */
  unsure?: boolean;
  /** 튜터 줄: 번역이 접힌 채 눌러서 뜻을 봤음 — 통화 정리의 "뜻을 본 말"(recap.ts). */
  looked?: boolean;
};

export type StuckTurn = {
  /** The tutor's line they were answering. */
  asked: string;
  /** What they said, or empty when they said nothing usable. */
  heard: string;
  /** How many goes they had at this step. */
  attempts: number;
  /** Silence before they started speaking. */
  hesitationMs: number;
  /** The conversation up to and including the turn, most recent last. */
  history: SpokenLine[];
  /**
   * 통화 중에 💡 힌트를 눌렀다(2026-10-30 사용자 "막힐 시 버튼 → 일시정지 → 확인 → 재개").
   * 대화는 그 자리에 멈춰 이 턴을 기다리고, `heard`는 말하다 끊긴 앞부분(없으면 빈 글).
   * 돌아보기가 아니라 지금 이어 말할 말을 준다.
   */
  live?: boolean;
};

/** Lines of conversation a review reads. Enough for the shape of the scene. */
export const REVIEW_LINES = 12;

/** Longest a review may be. It is read on a phone, in one sitting. */
export const MAX_REVIEW_CHARS = 600;

export type Review = {
  /** Why the turn was hard, in the learner's own language. */
  why: string;
  /** What they could have said, in the language being learned. */
  say: string;
  /** What that means, in the learner's own language. */
  meaning: string;
};

/**
 * How long a silence is worth mentioning.
 *
 * Under this, saying "you hesitated" about an ordinary pause for breath would
 * be inventing a struggle that was not there.
 */
const LONG_SILENCE_MS = 3000;

/** The turn as evidence, in the plainest terms the model can act on. */
function evidence(turn: StuckTurn): string {
  const notes = [
    turn.heard
      ? `They answered: "${turn.heard}"`
      : `They said nothing the scene could use — silence, or a sound that was not words.`,
    turn.attempts > 1 ? `It was try number ${turn.attempts} at this step.` : "",
    turn.hesitationMs >= LONG_SILENCE_MS
      ? `They waited about ${Math.round(turn.hesitationMs / 1000)} seconds before starting.`
      : "",
  ].filter(Boolean);
  return notes.join("\n");
}

export function reviewPrompt(input: {
  /**
   * What this language in particular gets wrong, in its own terms
   * (lib/languageFocus.ts). The sentence written into "say" is the one thing a
   * learner takes away from being stuck, so it had better be the one a speaker
   * would use — right particles, right register — and not merely correct.
   * Absent for English, which has no row.
   */
  focus?: string;
  tutorRole: string;
  setting: string;
  targetLanguage: string;
  nativeLanguage: string;
  turn: StuckTurn;
}): string {
  const { turn } = input;
  const transcript = turn.history
    .slice(-REVIEW_LINES)
    .map((line) => `${line.who === "tutor" ? input.tutorRole : "Them"}: ${line.text}`)
    .join("\n");

  if (turn.live) return livePrompt(input, transcript);

  return `Someone is learning ${input.targetLanguage} by talking their way through a scene. You are looking back at one moment with them, after the conversation has already moved on.

${input.setting}

How the conversation went:
${transcript}

The moment in question — the ${input.tutorRole} had just said "${turn.asked}":
${evidence(turn)}

Work out what actually stopped them and say it plainly. Some possibilities: they did not understand the question, they understood it but could not find the words, they answered something next to it, or they knew it and were simply slow. Judge from what they said, not from whether it was perfect.

Write for them, in ${input.nativeLanguage}, speaking to them directly. Address them politely, and keep the same level of politeness throughout.
- "why": two or three sentences. What was being asked, and what went wrong for them. No praise, no scolding, no talk of scores or levels.
- "say": one thing they could have said, in ${input.targetLanguage}. Short, the way a person really answers.
- "meaning": that sentence in ${input.nativeLanguage}, and nothing else — no "it means", no quotation marks, no alternatives.${
    input.focus
      ? `

What goes wrong in ${input.targetLanguage} in particular, which the sentence you write must not get wrong:
${input.focus}`
      : ""
  }

Reply as JSON only: {"why": "...", "say": "...", "meaning": "..."}`;
}

/**
 * 통화 중 💡 힌트: 대화는 멈춰 있고, 이 사람이 지금 하려던 말을 짐작해 이어 말할 수 있게 한다.
 *
 * 돌아보기(위)와 같은 모양으로 답해서 같은 패널이 그린다. 다른 점은 셋:
 * 끊긴 앞부분이 있으면 그 말을 살려 끝까지 이어 준다(새 답을 지어 주지 않는다),
 * "why"는 한두 문장 — 무엇을 묻는지와 어떻게 이으면 되는지(무엇이 잘못됐는지가 아니라),
 * 앞부분이 편한 말로 섞여 있어도 그 뜻을 학습 언어 문장으로.
 */
function livePrompt(
  input: { focus?: string; tutorRole: string; setting: string; targetLanguage: string; nativeLanguage: string; turn: StuckTurn },
  transcript: string,
): string {
  const { turn } = input;
  const started = turn.heard
    ? `They had started to answer and stopped: "${turn.heard}"
They may have mixed in words from ${input.nativeLanguage}, or stopped mid-sentence. Work out what they were trying to say from those words and from what they were asked.`
    : `They have not managed to say anything yet.`;
  return `Someone is learning ${input.targetLanguage} by talking with a ${input.tutorRole}. They got stuck just now and pressed for help. The conversation is paused, waiting for their answer; when they close this they will try again.

${input.setting}

The conversation so far:
${transcript}

The ${input.tutorRole} has just said "${turn.asked}".
${started}

Write for them, in ${input.nativeLanguage}, speaking to them directly. Address them politely, and keep the same level of politeness throughout.
- "why": one or two short sentences. What they are being asked, and how they can go on${turn.heard ? " from what they already said" : ""}. No praise, no scolding, no talk of scores or levels.
- "say": the sentence they can say now, in ${input.targetLanguage}. ${turn.heard ? "Finish what they started: keep their own words and their own idea, put right, and complete it. Do not swap in a different answer." : "A short, natural answer to what was asked."} The way a person really answers — one sentence.
- "meaning": that sentence in ${input.nativeLanguage}, and nothing else — no "it means", no quotation marks, no alternatives.${
    input.focus
      ? `

What goes wrong in ${input.targetLanguage} in particular, which the sentence you write must not get wrong:
${input.focus}`
      : ""
  }

Reply as JSON only: {"why": "...", "say": "...", "meaning": "..."}`;
}

/** The review out of the model's answer, or null when there is nothing to show. */
export function parseReview(raw: string): Review | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const record = parsed as { why?: unknown; say?: unknown; meaning?: unknown };
  const read = (value: unknown, limit: number) =>
    typeof value === "string" ? value.trim().slice(0, limit) : "";
  const why = read(record.why, MAX_REVIEW_CHARS);
  // Without the explanation there is no review: the line on its own is the
  // "here is the right answer" card this exists instead of.
  if (!why) return null;
  return {
    why,
    say: read(record.say, 200),
    meaning: read(record.meaning, 200),
  };
}

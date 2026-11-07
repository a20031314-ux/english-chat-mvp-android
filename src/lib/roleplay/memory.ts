import { readTopics, TALK_TOPICS } from "./talkStats.ts";
import { tagPrompt, type OpeningLine } from "./talkTags.ts";
import type { SpokenLine } from "./director.ts";

/**
 * What the tutor remembers of a conversation longer than it can read.
 *
 * Two lines of sight, kept apart. The raw line is the conversation itself,
 * verbatim, as the tutor's own turns — never fewer than RAW_LINES of the most
 * recent. The context line is everything older, folded into a few sentences of
 * notes: who the learner is, what has been settled, what has been talked about,
 * what they keep getting wrong. Without it, "I work at a design company" said
 * early in a long chat is simply gone by the time it would matter.
 *
 * Folding runs beside the conversation, never in front of it. A turn is sent
 * with whatever notes exist at that moment; the fold happens after, on its own
 * request, and the next turn has it. So the notes can cost a request every ten
 * lines, but they never cost the learner a second of waiting.
 *
 * The raw line is every line not yet folded, which is why nothing falls between
 * the two: it grows from RAW_LINES towards FOLD_AT, and when it reaches FOLD_AT
 * the oldest lines are folded until RAW_LINES are left. A line is always either
 * read verbatim or in the notes.
 *
 * Pure. The prompt is built and the answer read here; the route moves bytes.
 */

/** The fewest recent lines the tutor always reads verbatim — ten exchanges. */
export const RAW_LINES = 20;

/** Unfolded lines at which the oldest are folded into the notes. */
export const FOLD_AT = 30;

/**
 * A ceiling on the raw line as sent, for when folding keeps failing: better to
 * lose the oldest verbatim lines than to send an ever-growing conversation.
 */
export const MAX_RAW_LINES = 40;

/** The notes, and how many lines of history (from the start) they cover. */
export type ConversationMemory = { text: string; upTo: number };

export const EMPTY_MEMORY: ConversationMemory = { text: "", upTo: 0 };

/** What the tutor reads verbatim: every line the notes do not cover. */
export function rawLines(history: SpokenLine[], memory: ConversationMemory): SpokenLine[] {
  return history.slice(memory.upTo).slice(-MAX_RAW_LINES);
}

/** The lines to fold now, and where the notes will reach once folded — or null. */
export function foldDue(
  history: SpokenLine[],
  memory: ConversationMemory,
): { lines: SpokenLine[]; upTo: number } | null {
  if (history.length - memory.upTo < FOLD_AT) return null;
  const upTo = history.length - RAW_LINES;
  return { lines: history.slice(memory.upTo, upTo), upTo };
}

/** Longest the notes may grow. They are read on every turn; they must stay short. */
export const MAX_CONTEXT_CHARS = 1200;

export function contextPrompt(input: {
  tutorRole: string;
  setting: string;
  previous: string;
  lines: SpokenLine[];
  /** 학습자 기기의 오늘(YYYY-MM-DD). "어제"를 그 날짜로 적게. */
  today: string;
  /**
   * 통화가 끝난 접기에만(2026-11-06 사용자 "카드마다 튜터가 요약을 적어서 기록"): 튜터가 학습자에게 남기는 두세 문장.
   * Logbank 통화 카드·끝 화면에 보인다. 중간 접기는 안 씀(출력만 늘어서).
   */
  summary?: { language: string; target: string; name: string; manner: string };
  /** 통화가 끝난 접기에만: 그 통화 처음 줄 — 내 줄 문법·튜터 질문 종류 표시(talkTags.ts, 2026-11-07 밤). */
  opening?: { language: string; lines: readonly OpeningLine[] };
}): string {
  const transcript = input.lines
    .map((line) => `${line.who === "tutor" ? "You" : "Them"}: ${line.text}`)
    .join("\n");
  return `You are the ${input.tutorRole} in this scene, keeping private notes on a spoken conversation with someone learning the language, so you can remember it later.

${input.setting}

Your notes so far:
${input.previous.trim() || "(none yet)"}

What was said since:
${transcript}

Rewrite your notes to cover all of it. Keep only what you would need to carry on the conversation naturally:
- facts about them (name, work, plans, likes)
- what has been settled or done
- what you have talked about
- mistakes they keep making, if any

Plain sentences, in English, at most 80 words. Nothing about this being practice.

Also write "facts": what you learned about their life — work, plans, places, people, things they did or like. Not grammar, not a sentence you corrected, not something you only suggested. One short English sentence each. Today is ${input.today}. When they said when it happened, write that day instead of a relative word. An empty list when nothing about their life was said.

${input.summary ? `
The call is over. Also write "summary": a short note from you, ${input.summary.name}, to them about this whole call, the way you talk (${input.summary.manner}). Write it in ${input.summary.language}, speaking to them as "you": at most three short sentences, about 60 words in all, no questions, no lists.
1. What you talked about, in a few words.
2. One thing they said well — something that is really in their lines above.
3. One thing to practise next: the mistake they made most in their own lines above (look at what they said, not at what you said), named by its right form in ${input.summary.target}, a few words, not a whole sentence of theirs. If they made no mistake, something they could say more of. Never invent a mistake, a word or a topic that is not in this call.
Also write "topics": the one or two things this call was mostly about, from this list only: ${TALK_TOPICS.join(", ")} (people = family, friends, someone; time = plans, schedule, daily routine; nature = weather, seasons, animals; society = news, culture, school). An empty list if none fits.
${input.opening ? tagPrompt(input.opening.language, input.opening.lines) : ""}
They are learning ${input.summary.target}: every word, form or example from it stays in ${input.summary.target}. Never give an example in ${input.summary.language} or show how to say it in ${input.summary.language}. No levels, scores, grades, percentages or praise for being a learner.
` : ""}
Reply as JSON only: {"notes": "<your notes>", "facts": ["<a fact>"]${input.summary ? `, "summary": "<your note to them>", "topics": ["<topic>"]${input.opening && tagPrompt(input.opening.language, input.opening.lines) ? `, "uses": {}, "asks": {}` : ""}` : ""}}`;
}

export type FoldedMemory = { notes: string; facts: string[]; summary?: string; topics?: string[]; uses?: unknown; asks?: unknown };

/** 튜터 요약 글 상한(서버가 자름). */
export const SUMMARY_MAX_CHARS = 400;

/** 노트와, 다음 통화로 넘길 삶의 사실. 둘 다 비면 null. */
export function parseMemory(raw: string): FoldedMemory | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const record = parsed as { notes?: unknown; facts?: unknown; summary?: unknown; topics?: unknown; uses?: unknown; asks?: unknown };
  const notes = typeof record.notes === "string" ? record.notes.trim().slice(0, MAX_CONTEXT_CHARS) : "";
  const facts = Array.isArray(record.facts)
    ? record.facts
        .filter((fact): fact is string => typeof fact === "string")
        .map((fact) => fact.trim().slice(0, 180))
        .filter(Boolean)
        .slice(0, 8)
    : [];
  const summary = typeof record.summary === "string" ? record.summary.trim().slice(0, SUMMARY_MAX_CHARS) : "";
  if (!notes && facts.length === 0 && !summary) return null;
  const topics = readTopics(record.topics);
  return { notes, facts, ...(summary ? { summary } : {}), ...(topics.length ? { topics } : {}), ...(record.uses !== undefined ? { uses: record.uses } : {}), ...(record.asks !== undefined ? { asks: record.asks } : {}) };
}

/** The notes out of the model's answer, or null if there are none to use. */
export function parseContext(raw: string): string | null {
  return parseMemory(raw)?.notes || null;
}

import { kvDelete, kvGetJson, kvGetJsonMany, kvGetNumbers, kvIncrBy, kvSetJson, kvSetJsonIfAbsent } from "./kv.ts";
import { readAccount } from "./accountStore.ts";
import { readBlocked } from "./socialStore.ts";
import { readLines } from "./roomStore.ts";
import { readMessages, readThread } from "./dmStore.ts";
import { readComments, readPost } from "./boardStore.ts";
import {
  addMade,
  addStudyDay,
  addThankGiven,
  addThankReceived,
  contribOf,
  thankWeight,
  type ContribSummary,
  type ThankKind,
} from "../rooms/contribution.ts";

/**
 * 기여 요약 저장(설명: rooms/contribution.ts). KV:
 *   contrib:v1:<계정>                         요약 JSON(받은 도움됐어요·언어별 수·반영 의견 수·최근 30일 기록·공부한 날)
 *   contrib:v1:once:<누른 사람>:<종류>:<답 id>  같은 답에 한 번만(30일)
 *   contrib:v1:pair:<누른 사람>:<받는 사람>:<날짜> 같은 두 사람 하루 한 번(2일)
 *   contrib:v1:made:<카드>:<계정>              반영된 의견 하나에 한 번(120일)
 *   contrib:v1:day:<계정>:<날짜>               공부한 날을 하루 한 번만 쓰기(2일)
 *   contrib:v1:n:<계정>:<scripts|frames|lines> 공부 기록 숫자(통과한 대본·문장구조, 말한 문장 — 2026-10-28, 400일)
 *
 * 문장·질문 내용은 남기지 않는다(숫자·시각·상대 계정 id만). 계정을 지우면 요약을 지운다(나머지는 기한으로 사라짐).
 */
const summaryKey = (id: string) => `contrib:v1:${id}`;
const onceKey = (giver: string, kind: ThankKind, ref: string) => `contrib:v1:once:${giver}:${kind}:${ref}`;
const pairKey = (giver: string, receiver: string, day: string) => `contrib:v1:pair:${giver}:${receiver}:${day}`;
const madeKey = (card: string, id: string) => `contrib:v1:made:${card}:${id}`;
const dayKey = (id: string, day: string) => `contrib:v1:day:${id}:${day}`;
export const STUDY_KINDS = ["scripts", "frames", "lines"] as const;
export type StudyKind = (typeof STUDY_KINDS)[number];
const studyKey = (id: string, kind: StudyKind) => `contrib:v1:n:${id}:${kind}`;

/** 요약은 기여가 끊겨도 배지 숫자를 남기려고 길게(400일 — 학습 기록과 같음). */
const SUMMARY_TTL_SECONDS = 400 * 24 * 60 * 60;
const ONCE_TTL_SECONDS = 30 * 24 * 60 * 60;
const SHORT_TTL_SECONDS = 2 * 24 * 60 * 60;
const MADE_TTL_SECONDS = 120 * 24 * 60 * 60;

export async function readContrib(id: string): Promise<ContribSummary> {
  return contribOf(await kvGetJson<ContribSummary>(summaryKey(id)));
}

export async function readContribMany(ids: string[]): Promise<ContribSummary[]> {
  if (!ids.length) return [];
  return (await kvGetJsonMany<ContribSummary>(ids.map(summaryKey))).map(contribOf);
}

async function writeContrib(id: string, summary: ContribSummary): Promise<void> {
  await kvSetJson(summaryKey(id), summary, SUMMARY_TTL_SECONDS);
}

export type ThankTarget =
  | { kind: "room"; roomId: string; seq: number }
  | { kind: "dm"; threadId: string; seq: number }
  | { kind: "board"; postId: string; commentId: string };

export type ThankResult =
  | { ok: true; counted: boolean }
  | { error: "NOT_FOUND" | "NOT_ASKER" | "SELF" | "BLOCKED" | "ALREADY" | "TODAY" };

/**
 * 답을 쓴 사람을 찾고, 누르는 사람이 그 질문을 한 사람인지 본다.
 * - 방: 답 줄이 집은 줄이 내 ❓ 질문 줄이어야 한다(방 기록에서 찾음 — 남이 꾸민 인용은 서버가 채운 것이라 믿을 수 있음).
 * - 쪽지: 같은 대화에서 답 메시지가 집은 메시지가 내 질문이어야 한다.
 * - 게시판: 내 글에 달린 댓글, 또는 내 댓글 아래 답글.
 * 맞으면 답한 사람의 계정, 아니면 오류.
 */
export async function findAnswerer(
  me: string,
  target: ThankTarget,
): Promise<{ answerer: string; ref: string } | { error: "NOT_FOUND" | "NOT_ASKER" }> {
  if (target.kind === "room") {
    const lines = await readLines(target.roomId);
    const answer = lines.find((line) => line.seq === target.seq);
    if (!answer || !answer.accountId || !answer.quote) return { error: "NOT_FOUND" };
    const asked = lines.find((line) => line.seq === answer.quote?.seq);
    if (!asked || asked.ask !== true || asked.accountId !== me) return { error: "NOT_ASKER" };
    return { answerer: answer.accountId, ref: `${target.roomId}:${target.seq}` };
  }
  if (target.kind === "dm") {
    const thread = await readThread(target.threadId);
    if (!thread || !thread.members.includes(me)) return { error: "NOT_FOUND" };
    const messages = await readMessages(target.threadId);
    const answer = messages.find((message) => message.seq === target.seq);
    if (!answer || !answer.quote) return { error: "NOT_FOUND" };
    const asked = messages.find((message) => message.seq === answer.quote?.seq);
    if (!asked || asked.ask !== true || asked.from !== me) return { error: "NOT_ASKER" };
    return { answerer: answer.from, ref: `${target.threadId}:${target.seq}` };
  }
  const post = await readPost(target.postId);
  if (!post) return { error: "NOT_FOUND" };
  const comments = await readComments(target.postId);
  const answer = comments.find((comment) => comment.id === target.commentId);
  if (!answer) return { error: "NOT_FOUND" };
  const parent = answer.parent ? comments.find((comment) => comment.id === answer.parent) : null;
  const asker = parent ? parent.author : post.author;
  // 맨 위 댓글은 글쓴이가, 답글은 그 맨 위 댓글을 쓴 사람(또는 글쓴이)이 누를 수 있다.
  if (asker !== me && post.author !== me) return { error: "NOT_ASKER" };
  return { answerer: answer.author, ref: `${target.postId}:${target.commentId}` };
}

/** 도움됐어요 하나. 같은 답 한 번, 같은 두 사람 하루 한 번, 서로 차단한 사이는 안 됨. */
export async function recordThank(input: {
  me: string;
  target: ThankTarget;
  lang: string | null;
  day: string;
  now?: number;
}): Promise<ThankResult> {
  const now = input.now ?? Date.now();
  const found = await findAnswerer(input.me, input.target);
  if ("error" in found) return found;
  const { answerer, ref } = found;
  if (answerer === input.me) return { error: "SELF" };
  const [mine, theirs] = await Promise.all([readBlocked(input.me), readBlocked(answerer)]);
  if (mine.includes(answerer) || theirs.includes(input.me)) return { error: "BLOCKED" };

  // 먼저 읽기만 해서 같은 답이면 끝 — 그래야 "오늘은 이미" 때문에 같은 답 표시가 먼저 잡히지 않는다.
  const once = onceKey(input.me, input.target.kind, ref);
  if ((await kvGetJson<number>(once)) !== null) return { error: "ALREADY" };
  const firstToday = await kvSetJsonIfAbsent(pairKey(input.me, answerer, input.day), now, SHORT_TTL_SECONDS);
  if (!firstToday) return { error: "TODAY" };
  if (!(await kvSetJsonIfAbsent(once, now, ONCE_TTL_SECONDS))) return { error: "ALREADY" };

  const [giver, receiver, giverSummary] = await Promise.all([
    readAccount(input.me),
    readContrib(answerer),
    readContrib(input.me),
  ]);
  const weight = thankWeight({
    giverCreatedAt: giver ? Date.parse(giver.createdAt) : now,
    giverId: input.me,
    receiver,
    now,
  });
  await Promise.all([
    writeContrib(answerer, addThankReceived(receiver, { weight, lang: input.lang, now })),
    writeContrib(input.me, addThankGiven(giverSummary, answerer, now)),
  ]);
  return { ok: true, counted: weight > 0 };
}

/** 반영된 의견 카드를 보낸 계정에 한 번(반영 소식을 받을 때 — 그때 계정을 안다). */
export async function creditFixedFeedback(accountId: string, cards: string[], now: number = Date.now()): Promise<number> {
  let credited = 0;
  let summary: ContribSummary | null = null;
  for (const card of new Set(cards)) {
    if (!(await kvSetJsonIfAbsent(madeKey(card, accountId), now, MADE_TTL_SECONDS))) continue;
    summary = addMade(summary ?? (await readContrib(accountId)), now);
    credited += 1;
  }
  if (summary) await writeContrib(accountId, summary);
  return credited;
}

/** 채팅·통화·대본·문장구조를 한 날. 하루 첫 번째에만 요약을 다시 쓴다. */
export async function markStudyDay(accountId: string, day: string): Promise<void> {
  if (!(await kvSetJsonIfAbsent(dayKey(accountId, day), 1, SHORT_TTL_SECONDS))) return;
  await writeContrib(accountId, addStudyDay(await readContrib(accountId), day));
}

/** 공부 기록 숫자 하나 올리기(대본·문장구조 통과, 말한 문장). 공부한 날도 같이. */
export async function noteStudy(accountId: string, day: string, kind: StudyKind, amount = 1): Promise<void> {
  await Promise.all([markStudyDay(accountId, day), kvIncrBy(studyKey(accountId, kind), amount, SUMMARY_TTL_SECONDS)]);
}

export async function readStudy(accountId: string): Promise<Record<StudyKind, number>> {
  const [scripts, frames, lines] = await kvGetNumbers(STUDY_KINDS.map((kind) => studyKey(accountId, kind)));
  return { scripts: Math.max(0, scripts ?? 0), frames: Math.max(0, frames ?? 0), lines: Math.max(0, lines ?? 0) };
}

export async function forgetContrib(accountId: string): Promise<void> {
  await kvDelete([summaryKey(accountId), ...STUDY_KINDS.map((kind) => studyKey(accountId, kind))]);
}

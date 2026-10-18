/**
 * 1:1 메시지 저장소 (KV). 규칙은 rooms/dm.ts.
 *
 *   dm:v1:t:<대화>          대화 한 줄(DmThread) — 보낼 때마다 마지막 말 갱신
 *   dm:v1:m:<대화>          줄 목록(RPUSH) — 둘이 동시에 써도 엉키지 않음
 *   dm:v1:seq:<대화>        줄 번호
 *   dm:v1:box:<계정>        내가 낀 대화 id 목록(RPUSH, 읽을 때 겹친 것 정리)
 *   dm:v1:read:<계정>:<대화> 내가 읽은 마지막 줄 번호(나만 씀)
 *   dm:v1:log:<방>          통화 기록을 한 번만 남기기(SET NX)
 *
 * 모두 마지막 활동으로부터 30일(DM_TTL_SECONDS)이면 사라진다.
 */
import {
  DM_MAX_KEPT,
  DM_TTL_SECONDS,
  canSend,
  otherOf,
  threadIdFor,
  type DmMessage,
  type DmSummary,
  type DmThread,
  type SendDecision,
} from "../rooms/dm.ts";
import { kvGetJson, kvIncrBy, kvListPush, kvListRange, kvListTrim, kvSetJson, kvSetJsonIfAbsent } from "./kv.ts";

const threadKey = (id: string) => `dm:v1:t:${id}`;
const msgsKey = (id: string) => `dm:v1:m:${id}`;
const seqKey = (id: string) => `dm:v1:seq:${id}`;
const boxKey = (account: string) => `dm:v1:box:${account}`;
const readKey = (account: string, id: string) => `dm:v1:read:${account}:${id}`;
const logKey = (roomId: string) => `dm:v1:log:${roomId}`;
const BOX_KEEP = 200;

export async function readThread(id: string): Promise<DmThread | null> {
  return kvGetJson<DmThread>(threadKey(id));
}

function parse(rows: string[]): DmMessage[] {
  const out: DmMessage[] = [];
  for (const row of rows) {
    try {
      out.push(JSON.parse(row) as DmMessage);
    } catch {
      // 깨진 줄은 건너뛴다.
    }
  }
  return out;
}

export async function readMessages(id: string, since = 0): Promise<DmMessage[]> {
  return parse(await kvListRange(msgsKey(id), -DM_MAX_KEPT, -1)).filter((message) => message.seq > since);
}

export type SendResult = { ok: true; thread: DmThread; message: DmMessage } | { ok: false; error: SendDecision | "BLOCKED" };

/**
 * 한 줄 보내기(글·통화 요청·통화 기록). 대화가 없으면 만든다(보낸 사람이 starter).
 * 받는 사람이 처음 답하면 대화가 열린다.
 */
export async function send(input: {
  from: string;
  to: string;
  kind: DmMessage["kind"];
  text: string;
  roomId?: string;
  lines?: DmMessage["lines"];
}): Promise<SendResult> {
  const id = threadIdFor(input.from, input.to);
  const existing = await readThread(id);
  let starterSent = 0;
  if (existing && existing.status === "pending" && existing.starter === input.from) {
    starterSent = (await readMessages(id)).filter((message) => message.from === input.from && message.kind === "text").length;
  }
  if (input.kind === "text") {
    const decision = canSend(existing, input.from, starterSent);
    if (decision !== "ok") return { ok: false, error: decision };
  } else if (!existing || existing.status !== "open") {
    // 통화는 열린 대화에서만.
    return { ok: false, error: "PENDING_LIMIT" };
  }

  const now = Date.now();
  const seq = await kvIncrBy(seqKey(id), 1, DM_TTL_SECONDS);
  const message: DmMessage = {
    seq,
    from: input.from,
    kind: input.kind,
    text: input.text,
    at: now,
    ...(input.roomId ? { roomId: input.roomId } : {}),
    ...(input.lines ? { lines: input.lines } : {}),
  };
  const members = [input.from, input.to].sort() as [string, string];
  const thread: DmThread = existing
    ? {
        ...existing,
        // 받는 사람의 답이 대화를 연다(거절했다가 답해도 연다).
        status: existing.starter !== input.from ? "open" : existing.status,
        lastAt: now,
        lastText: input.kind === "text" ? input.text : existing.lastText,
        lastFrom: input.from,
        lastSeq: seq,
      }
    : {
        id,
        members,
        starter: input.from,
        status: "pending",
        createdAt: now,
        lastAt: now,
        lastText: input.text,
        lastFrom: input.from,
        lastSeq: seq,
      };
  await kvListPush(msgsKey(id), [JSON.stringify(message)], DM_TTL_SECONDS);
  await kvListTrim(msgsKey(id), DM_MAX_KEPT);
  await kvSetJson(threadKey(id), thread, DM_TTL_SECONDS);
  if (!existing) {
    for (const account of members) {
      await kvListPush(boxKey(account), [id], DM_TTL_SECONDS);
      await kvListTrim(boxKey(account), BOX_KEEP);
    }
  }
  // 보낸 사람은 자기 줄을 읽은 것으로.
  await kvSetJson(readKey(input.from, id), seq, DM_TTL_SECONDS);
  return { ok: true, thread, message };
}

/** 받는 사람이 요청을 거절: 보낸 사람은 더 보낼 수 없다(받는 사람이 답하면 다시 열림). */
export async function decline(me: string, id: string): Promise<boolean> {
  const thread = await readThread(id);
  if (!thread || !thread.members.includes(me) || thread.starter === me || thread.status !== "pending") return false;
  await kvSetJson(threadKey(id), { ...thread, status: "declined" }, DM_TTL_SECONDS);
  return true;
}

export async function markRead(me: string, id: string, seq: number): Promise<void> {
  const have = (await kvGetJson<number>(readKey(me, id))) ?? 0;
  if (seq > have) await kvSetJson(readKey(me, id), seq, DM_TTL_SECONDS);
}

/** 내 대화 목록. 거절한 요청은 받은 쪽 목록에서 뺀다. 최근 순. */
export async function inbox(me: string): Promise<DmSummary[]> {
  const ids = [...new Set(await kvListRange(boxKey(me)))];
  const rows = await Promise.all(
    ids.map(async (id) => {
      const thread = await readThread(id);
      if (!thread || !thread.members.includes(me)) return null;
      if (thread.status === "declined" && thread.starter !== me) return null;
      const read = (await kvGetJson<number>(readKey(me, id))) ?? 0;
      return {
        thread,
        other: otherOf(thread, me),
        // 정확한 수는 줄을 읽어야 알지만, 목록에는 마지막 번호 차이로 충분하다(내 줄도 번호를 쓰므로 근사).
        unread: thread.lastFrom === me ? 0 : Math.max(0, thread.lastSeq - read),
        request: thread.status === "pending" && thread.starter !== me,
      } satisfies DmSummary;
    }),
  );
  return rows.filter((row): row is DmSummary => row !== null).sort((a, b) => b.thread.lastAt - a.thread.lastAt);
}

/** 통화 기록은 방 하나에 한 번만(둘 다 끊어도). 처음 부른 쪽이 true. */
export async function claimCallLog(roomId: string): Promise<boolean> {
  return kvSetJsonIfAbsent(logKey(roomId), 1, DM_TTL_SECONDS);
}

/**
 * 단체방 저장소 (KV). 규칙은 rooms/group.ts.
 *
 *   grp:v1:g:<방>           방 한 줄(Group) — 사람·초대·마지막 말
 *   grp:v1:m:<방>           줄 목록(RPUSH)
 *   grp:v1:seq:<방>         줄 번호
 *   grp:v1:box:<계정>       내가 낀(초대 포함) 방 id 목록(RPUSH, 읽을 때 정리)
 *   grp:v1:read:<계정>:<방> 내가 읽은 마지막 줄 번호
 *
 * 모두 마지막 활동으로부터 30일이면 사라진다.
 */
import {
  GROUP_MAX_KEPT,
  GROUP_TTL_SECONDS,
  canInvite,
  newGroupId,
  type Group,
  type GroupMessage,
  type GroupSummary,
} from "../rooms/group.ts";
import { clipQuote, type LineQuote } from "../rooms/quote.ts";
import { kvGetJson, kvIncrBy, kvListPush, kvListRange, kvListTrim, kvSetJson } from "./kv.ts";

const groupKey = (id: string) => `grp:v1:g:${id}`;
const msgsKey = (id: string) => `grp:v1:m:${id}`;
const seqKey = (id: string) => `grp:v1:seq:${id}`;
const boxKey = (account: string) => `grp:v1:box:${account}`;
const readKey = (account: string, id: string) => `grp:v1:read:${account}:${id}`;
const BOX_KEEP = 100;

export async function readGroup(id: string): Promise<Group | null> {
  return kvGetJson<Group>(groupKey(id));
}

async function saveGroup(group: Group): Promise<void> {
  await kvSetJson(groupKey(group.id), group, GROUP_TTL_SECONDS);
}

async function addToBox(account: string, id: string): Promise<void> {
  await kvListPush(boxKey(account), [id], GROUP_TTL_SECONDS);
  await kvListTrim(boxKey(account), BOX_KEEP);
}

function parse(rows: string[]): GroupMessage[] {
  const out: GroupMessage[] = [];
  for (const row of rows) {
    try {
      out.push(JSON.parse(row) as GroupMessage);
    } catch {
      // 깨진 줄은 건너뛴다.
    }
  }
  return out;
}

export async function readGroupMessages(id: string, since = 0): Promise<GroupMessage[]> {
  return parse(await kvListRange(msgsKey(id), -GROUP_MAX_KEPT, -1)).filter((message) => message.seq > since);
}

async function push(group: Group, message: Omit<GroupMessage, "seq" | "at">): Promise<{ group: Group; message: GroupMessage }> {
  const seq = await kvIncrBy(seqKey(group.id), 1, GROUP_TTL_SECONDS);
  const now = Date.now();
  const row: GroupMessage = { ...message, seq, at: now };
  await kvListPush(msgsKey(group.id), [JSON.stringify(row)], GROUP_TTL_SECONDS);
  await kvListTrim(msgsKey(group.id), GROUP_MAX_KEPT);
  const next: Group = {
    ...group,
    lastAt: now,
    lastSeq: seq,
    ...(row.kind === "text" ? { lastText: row.text, lastFrom: row.from } : {}),
  };
  await saveGroup(next);
  return { group: next, message: row };
}

export async function createGroup(input: { owner: string; name: string; languages: string[]; invite: string[] }): Promise<Group> {
  const now = Date.now();
  let id = newGroupId();
  for (let tries = 0; tries < 3 && (await readGroup(id)); tries += 1) id = newGroupId();
  let group: Group = {
    id,
    name: input.name,
    languages: input.languages.slice(0, 2),
    owner: input.owner,
    members: [input.owner],
    invited: [],
    createdAt: now,
    lastAt: now,
    lastText: "",
    lastFrom: input.owner,
    lastSeq: 0,
  };
  for (const target of input.invite) {
    if (target !== input.owner && canInvite(group, target) === "ok") group = { ...group, invited: [...group.invited, target] };
  }
  await saveGroup(group);
  await Promise.all([input.owner, ...group.invited].map((account) => addToBox(account, id)));
  return group;
}

/** 초대: 방에 있는 사람이면 누구나(정원 안에서). */
export async function inviteToGroup(by: string, id: string, target: string): Promise<"ok" | "NO_GROUP" | "NOT_MEMBER" | "ALREADY" | "FULL"> {
  const group = await readGroup(id);
  if (!group) return "NO_GROUP";
  if (!group.members.includes(by)) return "NOT_MEMBER";
  const can = canInvite(group, target);
  if (can !== "ok") return can;
  await saveGroup({ ...group, invited: [...group.invited, target] });
  await addToBox(target, id);
  return "ok";
}

/** 초대에 답하기. 참여하면 "들어왔어요" 알림 줄. */
export async function answerInvite(account: string, id: string, accept: boolean): Promise<Group | null> {
  const group = await readGroup(id);
  if (!group || !group.invited.includes(account)) return null;
  const invited = group.invited.filter((row) => row !== account);
  if (!accept) {
    const next = { ...group, invited };
    await saveGroup(next);
    return next;
  }
  const joined = { ...group, invited, members: [...group.members, account] };
  return (await push(joined, { from: account, kind: "system", text: "join" })).group;
}

/** 나가기. 방장이 나가면 가장 먼저 들어온 사람이 방장, 아무도 없으면 방은 그대로 사라지게 둔다. */
export async function leaveGroup(account: string, id: string): Promise<boolean> {
  const group = await readGroup(id);
  if (!group || !group.members.includes(account)) return false;
  const members = group.members.filter((row) => row !== account);
  const owner = group.owner === account ? (members[0] ?? group.owner) : group.owner;
  const next = { ...group, members, owner };
  if (members.length === 0) {
    await saveGroup(next);
    return true;
  }
  const after = await push(next, { from: account, kind: "system", text: "leave" });
  if (owner !== group.owner) await push(after.group, { from: owner, kind: "system", text: "host" });
  return true;
}

/** 방장만: 내보내기(초대 중인 사람이면 초대 취소). */
export async function kickFromGroup(by: string, id: string, target: string): Promise<"ok" | "NO_GROUP" | "NOT_OWNER" | "NO_TARGET"> {
  const group = await readGroup(id);
  if (!group) return "NO_GROUP";
  if (group.owner !== by) return "NOT_OWNER";
  if (target === by) return "NO_TARGET";
  if (group.invited.includes(target)) {
    await saveGroup({ ...group, invited: group.invited.filter((row) => row !== target) });
    return "ok";
  }
  if (!group.members.includes(target)) return "NO_TARGET";
  await push({ ...group, members: group.members.filter((row) => row !== target) }, { from: target, kind: "system", text: "kick" });
  return "ok";
}

/** 방장만: 방장 넘기기(방에 있는 사람에게). */
export async function transferGroup(by: string, id: string, target: string): Promise<"ok" | "NO_GROUP" | "NOT_OWNER" | "NO_TARGET"> {
  const group = await readGroup(id);
  if (!group) return "NO_GROUP";
  if (group.owner !== by) return "NOT_OWNER";
  if (target === by || !group.members.includes(target)) return "NO_TARGET";
  await push({ ...group, owner: target }, { from: target, kind: "system", text: "host" });
  return "ok";
}

/** 글 보내기: 방에 있는 사람만. quoteSeq를 주면 이 방의 글 한 줄을 인용(묻기·답하기). */
export async function sendToGroup(input: {
  from: string;
  id: string;
  text: string;
  quoteSeq?: number;
  ask?: boolean;
}): Promise<{ ok: true; group: Group; message: GroupMessage } | { ok: false; error: "NO_GROUP" | "NOT_MEMBER" | "NO_QUOTE" }> {
  const group = await readGroup(input.id);
  if (!group) return { ok: false, error: "NO_GROUP" };
  if (!group.members.includes(input.from)) return { ok: false, error: "NOT_MEMBER" };
  let quote: LineQuote | undefined;
  if (typeof input.quoteSeq === "number") {
    const found = (await readGroupMessages(group.id)).find((row) => row.seq === input.quoteSeq && row.kind === "text");
    if (!found) return { ok: false, error: "NO_QUOTE" };
    quote = { seq: found.seq, nickname: "", text: clipQuote(found.text), accountId: found.from };
  }
  const result = await push(group, { from: input.from, kind: "text", text: input.text, ...(quote ? { quote, ask: input.ask === true } : {}) });
  return { ok: true, ...result };
}

export async function markGroupRead(account: string, id: string, seq: number): Promise<void> {
  await kvSetJson(readKey(account, id), seq, GROUP_TTL_SECONDS);
}

/** 내 단체방과 받은 초대(초대가 위, 그다음 최근 순). */
export async function myGroups(account: string): Promise<GroupSummary[]> {
  const ids = [...new Set(await kvListRange(boxKey(account)))];
  const rows = await Promise.all(
    ids.map(async (id): Promise<GroupSummary | null> => {
      const group = await readGroup(id);
      if (!group) return null;
      if (group.invited.includes(account)) return { group, unread: 0, invite: true };
      if (!group.members.includes(account)) return null;
      const read = (await kvGetJson<number>(readKey(account, id))) ?? 0;
      return { group, unread: Math.max(0, group.lastSeq - read), invite: false };
    }),
  );
  return rows
    .filter((row): row is GroupSummary => row !== null)
    .sort((a, b) => Number(b.invite) - Number(a.invite) || b.group.lastAt - a.group.lastAt);
}

/**
 * 단체방(워크스페이스 1단계) — 앱과 서버가 함께 쓰는 모양과 규칙.
 *
 * 초대로만 들어온다: 방장(만든 사람)이 팔로우한 사람 등을 초대하면 받는 사람에게
 * "초대 · 참여 / 거절"이 뜨고, 참여해야 대화를 읽고 쓴다. 모르는 사람이 남을 끌어들이지 못하게.
 * 줄은 1:1 메시지와 같은 모양(DmMessage)이라 번역·묻기·답하기를 같이 쓴다.
 * 마지막 활동으로부터 30일 보관(1:1 메시지와 같음).
 */

import type { DmMessage } from "./dm.ts";

export const GROUP_MAX_MEMBERS = 20;
export const GROUP_MAX_NAME_CHARS = 40;
export const GROUP_TTL_SECONDS = 30 * 24 * 60 * 60;
export const GROUP_MAX_KEPT = 500;

export type Group = {
  id: string;
  name: string;
  /** 언어 조합(보통 둘) — 목록에 "영어 ↔ 한국어"처럼. */
  languages: string[];
  owner: string;
  members: string[];
  /** 초대했지만 아직 답하지 않은 계정. */
  invited: string[];
  createdAt: number;
  lastAt: number;
  lastText: string;
  lastFrom: string;
  lastSeq: number;
};

/** 단체방 줄: 글(text) 또는 알림(system — text가 "join" | "leave" | "kick" | "host", from이 그 사람). */
export type GroupMessage = Omit<DmMessage, "kind"> & { kind: "text" | "system" };

export type GroupSummary = {
  group: Group;
  unread: number;
  /** 나에게 온, 아직 답하지 않은 초대. */
  invite: boolean;
};

export function isGroupId(value: unknown): value is string {
  return typeof value === "string" && /^g_[a-z2-9]{10}$/.test(value);
}

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
export function newGroupId(random: () => number = Math.random): string {
  let id = "g_";
  for (let i = 0; i < 10; i += 1) id += ALPHABET[Math.floor(random() * ALPHABET.length)];
  return id;
}

/** 한 번 더 초대할 수 있는지: 이미 있거나 초대 중이 아니고, 자리가 남아 있을 때. */
export function canInvite(group: Group, target: string): "ok" | "ALREADY" | "FULL" {
  if (group.members.includes(target) || group.invited.includes(target)) return "ALREADY";
  if (group.members.length + group.invited.length >= GROUP_MAX_MEMBERS) return "FULL";
  return "ok";
}

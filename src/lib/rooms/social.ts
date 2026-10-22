/** 공개 프로필(api/social) — 앱과 서버가 함께 쓰는 모양. */
import type { ProfileFacts } from "../account/profileFacts.ts";
import type { ProfileBadges } from "./contribution.ts";

export type PublicProfile = {
  id: string;
  nickname: string;
  bio: string;
  photo: string | null;
  /** 가입한 달(YYYY-MM). */
  since: string;
  followers: number;
  following: number;
  /** 연 방 수. */
  hosted: number;
  /** 방장으로서 손든 사람을 올려 준 횟수. */
  helped: number;
  isMe: boolean;
  isFollowing: boolean;
  blockedByMe: boolean;
  /** 나에 대한 사실(칩 id). 예전 서버면 없음. */
  facts?: ProfileFacts;
  /** 켠 기여·꾸준함 칸만(rooms/contribution.ts). */
  badges?: ProfileBadges;
  /** 목표 한 줄의 재료(체크 답 id, 화면이 틀 문구로 문장을 만든다). 켰고 체크가 있을 때만. */
  goal?: { language: string; use: string | null; focus: string[] };
  /** 본인 프로필이면 칸 켬/끔(편집 시트가 쓴다). */
  show?: Record<string, boolean>;
};

/** 사람 목록 한 사람(api/social people). 사진은 목록에 싣지 않고 프로필에서 따로 받는다. */
export type PersonCard = {
  id: string;
  nickname: string;
  /** 자기소개 앞부분(최대 140자). */
  bio: string;
  hasPhoto: boolean;
  /** 앱 언어(할 줄 아는 말)와 학습 언어. 모르면 null. */
  ui: string | null;
  learn: string | null;
  /** 마지막으로 본 시각(ms). */
  lastSeen: number;
  isFollowing: boolean;
  /** 모국어(정했으면 — 화면은 ui 대신 이걸 "할 줄 아는 말"로). */
  native?: string | null;
  /** 국적(ISO 두 글자, 화면은 국기). */
  country?: string | null;
  /** 관심사 칩 앞 3개와 나와 겹치는 수. */
  interests?: string[];
  sharedInterests?: number;
  /** 받은 도움됐어요 수(켰을 때만). */
  help?: number;
  /** 좋아하는 대화 방식(글·통화·영상) — "통화 좋아함" 거르기. */
  meetModes?: string[];
};

/** 5분 안에 봤으면 "접속 중". */
export const ONLINE_WINDOW_MS = 5 * 60 * 1000;
/** 목록에 넣는 기간. */
export const PEOPLE_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

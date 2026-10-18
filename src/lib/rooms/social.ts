/** 공개 프로필(api/social) — 앱과 서버가 함께 쓰는 모양. */
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
};

/** 5분 안에 봤으면 "접속 중". */
export const ONLINE_WINDOW_MS = 5 * 60 * 1000;
/** 목록에 넣는 기간. */
export const PEOPLE_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

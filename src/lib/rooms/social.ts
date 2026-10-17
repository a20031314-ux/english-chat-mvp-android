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

/** 친구 초대 링크 — 앱·서버·초대 웹 페이지가 같이 쓰는 것. */

/** 초대 웹 페이지가 있는 곳(운영 서버). 앱 안에서 링크를 만들 때도 이 주소. */
export const INVITE_WEB_BASE = "https://english-chat-mvp.vercel.app";
export const ANDROID_PACKAGE = "com.yourname.englishchat";
/** 앱이 받는 링크: languagebank://invite?c=…&room=… */
export const APP_LINK_SCHEME = "languagebank";

export type InviteLookup = {
  inviter: {
    id: string;
    nickname: string;
    bio: string;
    photo: string | null;
    learn: string | null;
    ui: string | null;
  };
  room: { id: string; name: string; languages: string[]; people: number } | null;
  isMe: boolean;
};

export type PendingInvite = { code: string; room: string | null };

export function inviteWebUrl(code: string, room?: string | null): string {
  const params = new URLSearchParams({ c: code });
  if (room) params.set("room", room);
  return `${INVITE_WEB_BASE}/invite?${params.toString()}`;
}

/** 설치 경로(Play Install Referrer)에 실어 보내는 값과 그 읽기. */
export function referrerFor(invite: PendingInvite): string {
  const params = new URLSearchParams({ invite: invite.code });
  if (invite.room) params.set("room", invite.room);
  return params.toString();
}

export function parseInviteParams(query: string, codeKey = "c"): PendingInvite | null {
  const params = new URLSearchParams(query.replace(/^[?#]/, ""));
  const code = (params.get(codeKey) ?? "").trim().toLowerCase();
  if (!/^[a-z0-9]{6,12}$/.test(code)) return null;
  const room = params.get("room");
  return { code, room: room && /^[A-Za-z0-9_-]{4,64}$/.test(room) ? room : null };
}

export function playStoreUrl(invite: PendingInvite | null): string {
  const base = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
  return invite ? `${base}&referrer=${encodeURIComponent(referrerFor(invite))}` : base;
}

/** 안드로이드 크롬·카카오톡 브라우저: 앱이 있으면 앱으로, 없으면 Play(초대 코드를 실어서). */
export function androidIntentUrl(invite: PendingInvite): string {
  const query = new URLSearchParams({ c: invite.code });
  if (invite.room) query.set("room", invite.room);
  return `intent://invite?${query.toString()}#Intent;scheme=${APP_LINK_SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(playStoreUrl(invite))};end`;
}

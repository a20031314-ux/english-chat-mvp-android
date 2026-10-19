"use client";

import { Capacitor } from "@capacitor/core";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { InviteLink } from "@/plugins/inviteLink";
import { fillInvite, inviteCopy } from "./copy";
import { inviteWebUrl, parseInviteParams, type InviteLookup, type PendingInvite } from "./shared";
import type { InviteStatus } from "./rewards";
import type { PlanTier } from "@/lib/billing/plans";

/**
 * 앱 쪽 초대: 내 초대 링크 공유, 받은 초대 읽기·받아들이기.
 *
 * 받은 초대는 localStorage에 둔다 — 로그인하면 앱을 다시 열기 때문에(account/client.ts),
 * 로그인 전에 받은 초대가 그 뒤 환영 시트까지 살아 있어야 한다. 받아들이거나 "나중에"면 지운다.
 */

const PENDING_KEY = "invite:pending:v1";

async function call<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch(apiUrl("/api/invite"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "NETWORK");
  return data;
}

let myCode: Promise<string> | null = null;

export function myInviteCode(): Promise<string> {
  myCode ??= call<{ code: string }>({ action: "mine" })
    .then(({ code }) => code)
    .catch((error) => {
      myCode = null;
      throw error;
    });
  return myCode;
}

/** 공유 창을 띄운다. 웹에서 공유가 안 되면 복사하고 "copied". */
export async function shareInvite(
  locale: string,
  room?: { id: string; name: string } | null,
): Promise<"shared" | "copied"> {
  const t = inviteCopy(locale);
  const code = await myInviteCode();
  const url = inviteWebUrl(code, room?.id ?? null);
  const text = `${room ? fillInvite(t.shareRoomText, { room: room.name }) : t.shareText}\n${url}`;
  try {
    await InviteLink.share({ text, title: room ? t.inviteRoom : t.invite });
    return "shared";
  } catch (error) {
    if ((error as Error)?.message === "COPIED") return "copied";
    throw error;
  }
}

export function lookupInvite(invite: PendingInvite): Promise<InviteLookup> {
  return call<InviteLookup>({ action: "lookup", c: invite.code, room: invite.room ?? undefined });
}

export function acceptInvite(code: string): Promise<{ inviterId: string; self?: boolean }> {
  return call({ action: "accept", c: code });
}

function save(invite: PendingInvite | null): void {
  try {
    if (invite) localStorage.setItem(PENDING_KEY, JSON.stringify(invite));
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    // 저장이 안 되면 이번 실행에서만.
  }
}

export function readSavedInvite(): PendingInvite | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as PendingInvite;
    return typeof value?.code === "string" ? { code: value.code, room: value.room ?? null } : null;
  } catch {
    return null;
  }
}

export function clearSavedInvite(): void {
  save(null);
}

function fromNative(value: { code?: string; room?: string; referrer?: string }): PendingInvite | null {
  if (value.code) return parseInviteParams(`c=${encodeURIComponent(value.code)}&room=${encodeURIComponent(value.room ?? "")}`);
  if (value.referrer) return parseInviteParams(value.referrer, "invite");
  return null;
}

/**
 * 받은 초대: 앱 링크·설치 경로(안드로이드), 주소의 ?invite=(웹), 아니면 저장해 둔 것.
 * 새로 받은 것은 저장해서 로그인 뒤에도 남게 한다.
 */
export async function takeInvite(): Promise<PendingInvite | null> {
  let fresh: PendingInvite | null = null;
  if (Capacitor.isNativePlatform()) {
    try {
      fresh = fromNative(await InviteLink.takePending());
    } catch {
      fresh = null;
    }
  } else if (typeof window !== "undefined") {
    fresh = parseInviteParams(window.location.search, "invite");
    if (fresh) {
      // 저장했으니 주소에서는 지운다 — 남아 있으면 다시 열 때마다 새 초대로 읽힌다.
      const url = new URL(window.location.href);
      url.searchParams.delete("invite");
      url.searchParams.delete("room");
      window.history.replaceState(window.history.state, "", url.toString());
    }
  }
  if (fresh) save(fresh);
  return fresh ?? readSavedInvite();
}

/** 앱이 켜져 있는데 초대 링크로 다시 열렸을 때. */
export function onInviteLink(listener: (invite: PendingInvite) => void): () => void {
  if (!Capacitor.isNativePlatform()) return () => {};
  const handle = InviteLink.addListener("inviteLink", (payload) => {
    const invite = fromNative(payload);
    if (!invite) return;
    save(invite);
    listener(invite);
  });
  return () => {
    void handle.then((h) => h.remove());
  };
}

// ── 초대 보상(invite/rewards.ts) ─────────────────────────────

const PASS_KEY = "ec_invite_pass";
type Pass = { tier: PlanTier; until: number };
const passListeners = new Set<() => void>();
let passCache: Pass | null | undefined;

function readPassStored(): Pass | null {
  try {
    const raw = localStorage.getItem(PASS_KEY);
    const value = raw ? (JSON.parse(raw) as Pass) : null;
    return value && typeof value.until === "number" && value.until > Date.now() ? value : null;
  } catch {
    return null;
  }
}

/** 단계 보상으로 열린 요금(플러스 7일·프리미엄 30일). 서버도 따로 확인하므로 화면용. */
export function readInvitePass(): Pass | null {
  if (typeof window === "undefined") return null;
  if (passCache === undefined) passCache = readPassStored();
  if (passCache && passCache.until <= Date.now()) passCache = null;
  return passCache;
}

function writePass(pass: Pass | null): void {
  const before = readInvitePass();
  passCache = pass;
  try {
    if (pass) localStorage.setItem(PASS_KEY, JSON.stringify(pass));
    else localStorage.removeItem(PASS_KEY);
  } catch {
    // 이번 실행에서만.
  }
  if (before?.tier !== pass?.tier || before?.until !== pass?.until) for (const listener of passListeners) listener();
}

export function subscribeInvitePass(listener: () => void): () => void {
  passListeners.add(listener);
  return () => passListeners.delete(listener);
}

/** 내 초대 현황. news면 쌓인 소식을 받아 가고 서버에서 지운다. 열린 요금도 같이 기억. */
export async function inviteStatus(news = false): Promise<InviteStatus> {
  const status = await call<InviteStatus>({ action: "status", news });
  writePass(status.pass);
  return status;
}

/** 로그아웃·계정 삭제 때. */
export function clearInvitePass(): void {
  writePass(null);
}

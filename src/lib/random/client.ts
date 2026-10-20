"use client";

import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { RandomMatch, RandomMode, RandomStatus } from "./protocol";

/** 랜덤 연결 API(api/random). 실패하면 코드(OFF·MINOR·USED…)를 담은 오류. */
export class RandomApiError extends Error {
  constructor(readonly code: string, readonly status: number) {
    super(code);
  }
}

async function call<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(apiUrl("/api/random"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...entitlementHeaders() },
    body: JSON.stringify({ action, ...payload }),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) throw new RandomApiError(body.error ?? "FAILED", response.status);
  return body;
}

export async function randomStatus(): Promise<RandomStatus> {
  return (await call<{ status: RandomStatus }>("status")).status;
}

export async function verifyAdult(verificationId: string): Promise<RandomStatus> {
  return (await call<{ status: RandomStatus }>("verify", { verificationId })).status;
}

export async function randomJoin(mode: RandomMode, learn: string, ui: string): Promise<RandomMatch | null> {
  return (await call<{ match: RandomMatch | null }>("join", { mode, learn, ui })).match;
}

export async function randomLeave(): Promise<void> {
  await call("leave").catch(() => {});
}

/** AI 영상 검사 한 장(랜덤 영상 방). 검사 못 하면 걸리지 않은 것으로. */
export async function randomFrame(
  roomId: string,
  who: "self" | "other",
  image: string,
): Promise<{ flagged: boolean; pausedUntil?: number; off?: boolean }> {
  try {
    return await call("frame", { roomId, who, image });
  } catch {
    return { flagged: false };
  }
}

/**
 * 영상 한 장을 작게(긴 쪽 320px, JPEG) — 검사에만 쓰고 서버는 저장하지 않는다.
 * 스트림마다 화면에 안 보이는 video 하나를 두고 다시 쓴다.
 */
export class FrameGrabber {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private stream: MediaStream | null = null;

  grab(stream: MediaStream | null): string | null {
    if (!stream || !stream.getVideoTracks().some((track) => track.readyState === "live" && track.enabled)) return null;
    if (this.stream !== stream || !this.video) {
      this.stop();
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      void video.play().catch(() => {});
      this.video = video;
      this.stream = stream;
      return null;
    }
    const video = this.video;
    if (!video.videoWidth || !video.videoHeight) return null;
    const scale = 320 / Math.max(video.videoWidth, video.videoHeight);
    const canvas = (this.canvas ??= document.createElement("canvas"));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.6);
  }

  stop(): void {
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
    this.stream = null;
  }
}

// ── 포트원 본인인증 창 ────────────────────────────────────────

type PortOneResponse = { code?: string; message?: string; identityVerificationId?: string } | undefined;
type PortOneSdk = {
  requestIdentityVerification: (request: {
    storeId: string;
    identityVerificationId: string;
    channelKey: string;
    customData?: string;
    redirectUrl?: string;
  }) => Promise<PortOneResponse>;
};

const SDK_URL = "https://cdn.portone.io/v2/browser-sdk.js";

/** 앱 쪽 설정(공개 값). 둘 다 있어야 인증 창을 연다. */
export function portoneClientReady(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PORTONE_STORE_ID && process.env.NEXT_PUBLIC_PORTONE_IDV_CHANNEL_KEY);
}

function loadSdk(): Promise<PortOneSdk> {
  const ready = (window as unknown as { PortOne?: PortOneSdk }).PortOne;
  if (ready) return Promise.resolve(ready);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => {
      const sdk = (window as unknown as { PortOne?: PortOneSdk }).PortOne;
      if (sdk) resolve(sdk);
      else reject(new Error("PortOne SDK missing"));
    };
    script.onerror = () => reject(new Error("PortOne SDK failed"));
    document.head.appendChild(script);
  });
}

/**
 * 본인인증 창을 연다. 모바일 웹은 인증 뒤 이 화면으로 되돌아오며(`redirectUrl`) 주소에
 * `identityVerificationId`가 붙는다 — RandomScreen이 그걸 보고 마저 확인한다.
 * 데스크톱은 같은 화면에서 끝나 인증 번호를 돌려준다. 취소·실패면 null.
 */
export async function openAdultVerification(accountId: string): Promise<string | null> {
  const sdk = await loadSdk();
  const identityVerificationId = `lbv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  const back = new URL(window.location.href);
  back.searchParams.set("screen", "random");
  const result = await sdk.requestIdentityVerification({
    storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID ?? "",
    identityVerificationId,
    channelKey: process.env.NEXT_PUBLIC_PORTONE_IDV_CHANNEL_KEY ?? "",
    // 서버가 "인증 창을 연 계정"과 맞춰 본다(api/random verify).
    customData: accountId,
    redirectUrl: back.toString(),
  });
  if (!result || result.code) return null;
  return result.identityVerificationId ?? identityVerificationId;
}

/** 모바일에서 인증 뒤 돌아왔을 때 주소의 인증 번호(있으면 한 번 꺼내고 주소에서 지운다). */
export function takeReturnedVerification(): string | null {
  try {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("identityVerificationId");
    const failed = url.searchParams.get("code");
    if (!id) return null;
    for (const key of ["identityVerificationId", "identityVerificationTxId", "transactionType", "code", "message"]) url.searchParams.delete(key);
    window.history.replaceState(window.history.state, "", url.toString());
    return failed ? null : id;
  } catch {
    return null;
  }
}

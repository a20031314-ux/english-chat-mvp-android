"use client";

/**
 * 아이콘 묶음(앱 쪽). 규칙은 rooms/icons.ts, 서버는 /api/icons.
 * 올릴 때는 원본(움직이는 GIF·WebP 그대로)을 보내고, 줄이기·WebP 바꾸기·프레임 검사는 서버가 한다 —
 * 폰의 캔버스로 줄이면 움직임이 사라져서.
 */
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { noteSuspended } from "./suspended";
import { ICON_UPLOAD_MAX_BYTES, iconPath, type IconLicense, type IconPack, type IconPrice } from "./icons";

export class IconApiError extends Error {
  constructor(readonly code: string, readonly status: number) {
    super(code);
  }
}

async function icons<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiUrl("/api/icons"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders() },
      // sale: 판매 묶음(가격·사기)을 아는 빌드 — 없으면(2.74 이하) 서버가 목록에서 판매 묶음을 뺀다.
      body: JSON.stringify({ action, sale: 1, ...payload }),
    });
  } catch {
    throw new IconApiError("FAILED", 0);
  }
  const body = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    noteSuspended(response.status, body);
    throw new IconApiError(body.error ?? "FAILED", response.status);
  }
  return body;
}

export const iconSrc = (pack: string, id: string) => apiUrl(iconPath(pack, id));

export function listIconPacks(sort: "new" | "popular", offset = 0): Promise<{ packs: IconPack[]; next: number }> {
  return icons("list", { sort, offset });
}
export function openIconPack(id: string): Promise<{ pack: IconPack }> {
  return icons("pack", { id });
}
export function iconPacksBy(owner: string): Promise<{ packs: IconPack[] }> {
  return icons("by", { owner });
}
/** 보낼 때 고르는 목록(내 묶음 + 받아 둔 묶음)과 만들기 화면용 내 묶음 전체(빈 묶음 포함). */
export function myIconPacks(): Promise<{ packs: IconPack[]; own: IconPack[] }> {
  return icons("mine");
}
/** price 0 = 무료(라이선스 고름), 2~30 = 판매 묶음(라이선스는 서버가 "app"). */
export function createIconPack(name: string, license: IconLicense, price: IconPrice = 0): Promise<{ pack: IconPack }> {
  return icons("create", { name, license, agree: true, ...(price ? { price } : {}) });
}
/** 판매 신청(운영자 승인 뒤 목록에). */
export function sellIconPack(id: string): Promise<{ pack: IconPack }> {
  return icons("sell", { id });
}
/** 사기(포인트). 모자라면 IconApiError("NO_POINTS"). */
export function buyIconPack(id: string): Promise<{ pack: IconPack; spent: number }> {
  return icons("buy", { id });
}
export function renameIconPack(id: string, name: string): Promise<{ pack: IconPack }> {
  return icons("rename", { id, name });
}
export function removeIconFromPack(id: string, iconId: string): Promise<{ pack: IconPack }> {
  return icons("removeIcon", { id, iconId });
}
export function deleteIconPack(id: string): Promise<{ ok: true }> {
  return icons("deletePack", { id });
}
export function collectIconPack(id: string, on: boolean): Promise<{ collection: string[] }> {
  return icons("collect", { id, on });
}
export function reportIconPack(id: string, reason: string): Promise<{ ok: true }> {
  return icons("report", { id, reason });
}

function readDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new IconApiError("BAD_TYPE", 0));
    reader.readAsDataURL(file);
  });
}

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function uploadIcon(id: string, file: File, phrase?: { lang: string; text: string }): Promise<{ pack: IconPack }> {
  if (!ACCEPTED.includes(file.type)) throw new IconApiError("BAD_TYPE", 0);
  if (file.size > ICON_UPLOAD_MAX_BYTES) throw new IconApiError("TOO_BIG", 0);
  const dataUrl = await readDataUrl(file);
  return icons("upload", { id, dataUrl, ...(phrase?.text.trim() ? { phrase } : {}) });
}

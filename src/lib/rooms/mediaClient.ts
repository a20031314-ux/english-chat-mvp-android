"use client";

/**
 * 사진 올리기·보기(앱 쪽). 규칙은 rooms/media.ts, 서버는 /api/media.
 * 폰에서 긴 쪽 1280px로 줄여(webp, 못 하면 jpeg) 올리고, 볼 때는 서버에서 받아 기기 안 주소(blob:)로 띄운다 —
 * 1:1·단체방 사진은 그 방 사람만 볼 수 있어 그냥 주소로는 열리지 않는다.
 */
import { apiUrl } from "@/lib/apiBase";
import { noteSuspended } from "./suspended";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { fitSize, MEDIA_MAX_BYTES, MEDIA_MAX_SIDE, MEDIA_QUALITY, type MediaRef, type MediaScope } from "./media";

export type MediaUploadError = "TOO_BIG" | "BAD_TYPE" | "LIMIT" | "REJECTED" | "UNAVAILABLE" | "SIGNED_OUT" | "FAILED";

export class MediaError extends Error {
  constructor(readonly code: MediaUploadError) {
    super(code);
  }
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new MediaError("BAD_TYPE"));
    };
    image.src = url;
  });
}

/** 줄이기: 긴 쪽 MEDIA_MAX_SIDE, webp(안 되면 jpeg). 너무 크면 품질을 낮춰 한 번 더. */
export async function shrinkImage(file: Blob): Promise<{ dataUrl: string; w: number; h: number }> {
  if (!file.type.startsWith("image/")) throw new MediaError("BAD_TYPE");
  const image = await loadImage(file);
  const { w, h } = fitSize(image.naturalWidth, image.naturalHeight, MEDIA_MAX_SIDE);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext("2d");
  if (!context) throw new MediaError("FAILED");
  context.drawImage(image, 0, 0, w, h);
  for (const quality of [MEDIA_QUALITY, 0.6, 0.45]) {
    let dataUrl = canvas.toDataURL("image/webp", quality);
    if (!dataUrl.startsWith("data:image/webp")) dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrl.length * 0.75 <= MEDIA_MAX_BYTES) return { dataUrl, w, h };
  }
  throw new MediaError("TOO_BIG");
}

/** 줄여서 올리기. 실패하면 MediaError(코드는 화면 문구로). */
export async function uploadImage(scope: MediaScope, file: Blob): Promise<MediaRef> {
  const { dataUrl, w, h } = await shrinkImage(file);
  let response: Response;
  try {
    response = await fetch(apiUrl("/api/media"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders() },
      body: JSON.stringify({ scope, dataUrl, w, h }),
    });
  } catch {
    throw new MediaError("FAILED");
  }
  const data = (await response.json().catch(() => ({}))) as { image?: MediaRef; error?: string };
  if (!response.ok || !data.image) {
    noteSuspended(response.status, data);
    const code = data.error as MediaUploadError | undefined;
    throw new MediaError(code && ["TOO_BIG", "BAD_TYPE", "LIMIT", "REJECTED", "UNAVAILABLE", "SIGNED_OUT"].includes(code) ? code : "FAILED");
  }
  return data.image;
}

const cache = new Map<string, Promise<string | null>>();

/** 사진 한 장의 기기 안 주소(한 번 받으면 이 실행 동안 다시 쓴다). 못 받으면 null. */
export function mediaSrc(id: string): Promise<string | null> {
  let found = cache.get(id);
  if (!found) {
    found = fetch(apiUrl(`/api/media?id=${encodeURIComponent(id)}`), { headers: entitlementHeaders() })
      .then(async (response) => (response.ok ? URL.createObjectURL(await response.blob()) : null))
      .catch(() => null);
    cache.set(id, found);
    void found.then((src) => {
      if (!src) cache.delete(id);
    });
  }
  return found;
}

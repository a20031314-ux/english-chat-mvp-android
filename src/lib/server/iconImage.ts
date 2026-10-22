import sharp from "sharp";
import { ICON_MAX_FRAMES, ICON_MAX_SIDE, ICON_STORED_MAX_BYTES, ICON_UPLOAD_MAX_BYTES } from "../rooms/icons.ts";

/**
 * 올린 아이콘 원본(PNG·JPEG·WebP·GIF, 움직이는 것 포함)을 저장할 모양으로: 긴 쪽 ICON_MAX_SIDE, WebP(움직임 유지).
 * 그리고 검사할 프레임(처음·가운데·끝) PNG를 뽑는다 — 검사 모델이 동영상·움직이는 그림을 통째로 받지 못해서.
 * 사람이 올린 그림을 서버 밖(검사 모델 말고)으로 보내지 않는다.
 */

export type PreparedIcon = {
  webp: Buffer;
  w: number;
  h: number;
  animated: boolean;
  /** 검사용 프레임(data:image/png;base64,…), 1~3장. */
  frames: string[];
};

export type PrepareError = "BAD_TYPE" | "TOO_BIG" | "TOO_MANY_FRAMES";

const ACCEPTED = new Set(["png", "jpeg", "webp", "gif"]);

/** 프레임 번호: 처음·가운데·끝(겹치면 하나로). */
export function framesToCheck(pages: number): number[] {
  if (pages <= 1) return [0];
  return [...new Set([0, Math.floor((pages - 1) / 2), pages - 1])];
}

async function encode(input: Buffer, animated: boolean, quality: number): Promise<Buffer> {
  return sharp(input, { animated, limitInputPixels: 40_000_000 })
    .resize(ICON_MAX_SIDE, ICON_MAX_SIDE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 4, loop: 0 })
    .toBuffer();
}

export async function prepareIcon(bytes: Uint8Array): Promise<{ ok: true; icon: PreparedIcon } | { ok: false; error: PrepareError }> {
  if (bytes.byteLength === 0 || bytes.byteLength > ICON_UPLOAD_MAX_BYTES) return { ok: false, error: "TOO_BIG" };
  const input = Buffer.from(bytes);
  let meta: sharp.Metadata;
  try {
    meta = await sharp(input, { animated: true }).metadata();
  } catch {
    return { ok: false, error: "BAD_TYPE" };
  }
  if (!meta.format || !ACCEPTED.has(meta.format)) return { ok: false, error: "BAD_TYPE" };
  const pages = Math.max(1, meta.pages ?? 1);
  if (pages > ICON_MAX_FRAMES) return { ok: false, error: "TOO_MANY_FRAMES" };
  const animated = pages > 1;

  // 크면 품질을 낮춰 한 번 더. 그래도 크면 거절(움직이는 그림이 너무 김).
  let webp = await encode(input, animated, 80);
  if (webp.byteLength > ICON_STORED_MAX_BYTES) webp = await encode(input, animated, 55);
  if (webp.byteLength > ICON_STORED_MAX_BYTES) return { ok: false, error: "TOO_BIG" };

  const out = await sharp(webp, { animated }).metadata();
  const w = out.width ?? ICON_MAX_SIDE;
  // 움직이는 그림은 metadata.height가 프레임을 이어 붙인 높이라 pageHeight를 쓴다.
  const h = (animated ? out.pageHeight : out.height) ?? ICON_MAX_SIDE;

  const frames: string[] = [];
  for (const page of framesToCheck(pages)) {
    const png = await sharp(input, { page, limitInputPixels: 40_000_000 })
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();
    frames.push(`data:image/png;base64,${png.toString("base64")}`);
  }
  return { ok: true, icon: { webp, w, h, animated, frames } };
}

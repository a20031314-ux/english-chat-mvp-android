import sharp from "sharp";
import { ICON_MAX_SIDE, type IconMotion } from "../rooms/icons.ts";

/**
 * 정지 그림 한 장 → 움직이는 WebP(아이콘 편집기의 "움직임", 사용자 2026-10-25 "아이콘 만드는 페이지 ①").
 * 폰 브라우저는 움직이는 그림을 만들 수 없어 편집기는 PNG 한 장과 움직임 이름만 보내고, 여기서 프레임을 만든다.
 * 결과는 그대로 prepareIcon(줄이기·프레임 검사)으로 간다. 이미 움직이는 그림은 손대지 않는다.
 */
const FRAMES = 10;
const DELAY_MS = 70;
/** 움직일 자리를 남기려고 그림을 이만큼 줄여 가운데에 둔다. */
const CORE = 0.8;

type Pose = { dx: number; dy: number; scale: number; rot: number };

/** t: 0 ≤ t < 1(한 바퀴). 크기 단위는 캔버스 한 변에 대한 비율. */
export function poseAt(motion: IconMotion, t: number): Pose {
  const wave = Math.sin(2 * Math.PI * t);
  if (motion === "bounce") {
    const up = Math.abs(Math.sin(Math.PI * t));
    return { dx: 0, dy: -0.08 * up, scale: 1 - 0.04 * (1 - up), rot: 0 };
  }
  if (motion === "shake") return { dx: 0.035 * Math.sin(4 * Math.PI * t), dy: 0, scale: 1, rot: 5 * Math.sin(4 * Math.PI * t) };
  if (motion === "pulse") return { dx: 0, dy: 0, scale: 1 + 0.1 * wave, rot: 0 };
  return { dx: 0, dy: 0, scale: 1, rot: 12 * wave };
}

export async function animateStill(input: Uint8Array, motion: IconMotion, side = ICON_MAX_SIDE): Promise<Uint8Array> {
  const meta = await sharp(input, { animated: true }).metadata();
  if ((meta.pages ?? 1) > 1) return input;
  const core = Math.round(side * CORE);
  const still = await sharp(input).ensureAlpha().resize(core, core, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const frames: Buffer[] = [];
  for (let i = 0; i < FRAMES; i++) {
    const pose = poseAt(motion, i / FRAMES);
    const size = Math.max(1, Math.round(core * pose.scale));
    let piece = sharp(still).resize(size, size);
    if (pose.rot) piece = sharp(await piece.png().toBuffer()).rotate(pose.rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
    const { data, info } = await piece.png().toBuffer({ resolveWithObject: true });
    // 돌리면 커지니 캔버스를 넘지 않게 자른다.
    const fit = info.width > side || info.height > side ? await sharp(data).resize(side, side, { fit: "inside" }).png().toBuffer({ resolveWithObject: true }) : { data, info };
    const clamp = (value: number, max: number) => Math.min(Math.max(0, Math.round(value)), max);
    const left = clamp((side - fit.info.width) / 2 + pose.dx * side, side - fit.info.width);
    const top = clamp((side - fit.info.height) / 2 + pose.dy * side, side - fit.info.height);
    frames.push(
      await sharp({ create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
        .composite([{ input: fit.data, left, top }])
        .png()
        .toBuffer(),
    );
  }
  const webp = await sharp(frames, { join: { animated: true } }).webp({ delay: Array(FRAMES).fill(DELAY_MS), loop: 0, quality: 80 }).toBuffer();
  return new Uint8Array(webp);
}

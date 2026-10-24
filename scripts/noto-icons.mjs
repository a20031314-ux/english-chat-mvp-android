/**
 * 기본 아이콘 묶음(Noto 움직이는 이모지, CC BY 4.0)을 받아 줄인다: 512px 원본 → 160px, 프레임 절반(시간은 그대로), WebP q50.
 * 결과 public/icons/noto/<코드포인트>.webp(48개 약 4.8MB, 웹에서만 — 앱 빌드에서 빠짐). 저장소 루트에서:
 *   node scripts/noto-icons.mjs
 */
import fs from "node:fs";
const sharp = (await import("sharp")).default;
// 목록은 src/lib/rooms/builtinIcons.ts NOTO_PACKS와 같게.
const list = "1f600 1f604 1f602 1f923 1f60a 1f607 1f60d 1f970 1f618 1f60b 1f61c 1f60e 1f914 1f928 1f644 1f634 1f97a 1f622 1f62d 1f631 1f621 1f92f 1f973 1f917 1f44d 1f44e 1f44f 1f64c 1f64f 1f44b 1f91d 1f4aa 270c_fe0f 1f44c 1f44a 2764_fe0f 1f494 1f525 1f389 2728 1f4af 1f440 1f648 1f480 1f4a5 2615 1f381 1f3c6".split(" ");
const SIDE = 160, STEP = 2; let total = 0;
fs.mkdirSync("public/icons/noto", { recursive: true });
await Promise.all(list.map(async (cp) => {
  const buf = Buffer.from(await (await fetch(`https://fonts.gstatic.com/s/e/notoemoji/latest/${cp}/512.webp`)).arrayBuffer());
  const { pages, delay } = await sharp(buf, { animated: true }).metadata();
  const frames = [], delays = [];
  for (let i = 0; i < pages; i += STEP) {
    frames.push(await sharp(buf, { page: i }).resize(SIDE, SIDE).png().toBuffer());
    let d = 0; for (let j = i; j < Math.min(pages, i + STEP); j++) d += delay?.[j] ?? 40; delays.push(d);
  }
  const out = await sharp(frames, { join: { animated: true } }).webp({ quality: 50, effort: 6, loop: 0, delay: delays }).toBuffer();
  fs.writeFileSync(`public/icons/noto/${cp.replace(/_fe0f$/, "")}.webp`, out);
  total += out.length;
}));
console.log("files", fs.readdirSync("public/icons/noto").length, "total", total);

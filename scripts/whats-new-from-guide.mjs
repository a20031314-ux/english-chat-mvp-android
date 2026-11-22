/**
 * 새로워진 점 그림을 사용법 장면에서 만든다(2.80부터).
 * 사용법 장면(public/guide/<언어>/<장면>.webp)은 14개 앱 언어로 이미 지금 화면을 찍어 두었고, 위에 제목 띠가 있다.
 * 새로워진 점 카드는 제목을 따로 보이므로, 제목 띠를 빼고 화면이 있는 부분만 잘라 public/whats-new/<버전>/<언어>/<그림>.webp로.
 * 실행: node scripts/whats-new-from-guide.mjs 2.80
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const VERSION = process.argv[2];
if (!VERSION) {
  console.error("Usage: whats-new-from-guide.mjs <version>");
  process.exit(2);
}
/** 버전마다 그림 이름 → 사용법 장면. */
const PLAN = {
  "2.80": { "call-coach": "call-talk-2", "my-banks": "my-keep-1", languagebank: "my-lang-1", logbank: "my-log-1" },
};
const plan = PLAN[VERSION];
if (!plan) {
  console.error(`No plan for ${VERSION}`);
  process.exit(2);
}
const LOCALES = ["ko", "en", "es", "ja", "zh", "vi", "fr", "it", "pt", "ru", "id", "ar", "th", "hi"];
/** 행마다 밝은 점이 있나. 제목 띠(한두 줄 — 아랍어·힌디어는 두 줄로 접힘)가 끝나는 곳 = 제목이 시작된 뒤 어두운 줄이 GAP줄 이어진 곳. */
const GAP = 30;

async function contentBox(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const bright = [];
  for (let y = 0; y < height; y += 1) {
    let lit = false;
    for (let x = 0; x < width && !lit; x += 2) {
      const at = (y * width + x) * channels;
      lit = data[at] + data[at + 1] + data[at + 2] > 3 * 45;
    }
    bright.push(lit);
  }
  let y = bright.indexOf(true);
  if (y < 0) return null;
  let dark = 0;
  for (; y < height && dark < GAP; y += 1) dark = bright[y] ? 0 : dark + 1;
  const top = bright.indexOf(true, y);
  const bottom = bright.lastIndexOf(true);
  if (top < 0 || top >= bottom) return null;
  const pad = 16;
  const from = Math.max(y - dark, top - pad);
  return { left: 0, top: from, width, height: Math.min(height, bottom + pad) - from };
}

let made = 0;
for (const locale of LOCALES) {
  const dir = path.join("public", "whats-new", VERSION, locale);
  fs.mkdirSync(dir, { recursive: true });
  for (const [shot, slide] of Object.entries(plan)) {
    const from = path.join("public", "guide", locale, `${slide}.webp`);
    if (!fs.existsSync(from)) {
      console.warn(`없음: ${from}`);
      continue;
    }
    const box = await contentBox(from);
    if (!box) continue;
    await sharp(from).extract(box).resize({ width: 600 }).webp({ quality: 82 }).toFile(path.join(dir, `${shot}.webp`));
    made += 1;
  }
}
console.log(`새로워진 점 ${VERSION}: 그림 ${made}개`);

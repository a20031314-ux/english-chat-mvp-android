// 2.80 스토어 7장(1080×1920) — 장마다 핵심 화면 조각 하나만 크게(사용자 2026-11-16 "최대한 단순화"). 사용법 장면용으로 찍은 실제 화면 조각(tmp/guide-slides/raw/<앱 언어>,
// scripts/guide-slides/shoot*.mjs·crop-tabs.mjs)을 잘라 크게, 위에 제목 한 줄만(부제·세부 설명 없음, 사용자 2026-11-16).
// 메시지 순서는 hub/work/drafts/marketing-layers-2026-11-01.md(틀 > 양 > 적용 · 연결 · 약점), 영상 학습은 뺌.
// 수업 장은 얼굴 위에 겹친 시간 줄(회색 글자)을 지운 그림을 쓴다 — cleanTimer().
// Run(저장소 맨 위, 재료: scripts/guide-slides/shoot*.mjs·crop-tabs.mjs + store-shots/v280/shoot-log.mjs):
//   node --experimental-strip-types store-shots/v280/compose.mjs <ko|ko,ja|all> [--play] → store-shots/out/v280/<앱 언어>/01-call … 07-log.png
//   --play면 fastlane/metadata/android/<등록정보>/images/phoneScreenshots를 이 7장으로 바꾼다. 글은 strings.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const { chromium } = createRequire(root + "/node_modules/")("playwright");
import { COPY, TYPED, FONT as FONTS, LISTING, QUIZ_TILES } from "./strings.mjs";
import { SLIDE_TITLES } from "../../src/lib/guide/slideTitles.ts";

const args = process.argv.slice(2);
const play = args.includes("--play");
const which = args.find((a) => !a.startsWith("--")) ?? "ko";
const LOCALES = which === "all" ? Object.keys(COPY) : which.split(",");
let locale, raw, out, T, FONT;
// 검색어 맞춤 등록정보는 "<앱 언어>-<배우는 언어>"(예: ko-ja) — 글은 앱 언어 것, 그림은 raw/ko-ja/, 쓰기 칸 답이 없어 퀴즈 칸 셋, Play 폴더엔 안 넣음(Console에 직접).
function use(key) {
  const loc = key.split("-")[0];
  locale = key;
  raw = path.join(root, "tmp", "guide-slides", "raw", key);
  out = path.join(root, "store-shots", "out", "v280", key);
  const c = COPY[loc], titles = SLIDE_TITLES[loc];
  T = { call: [c.call], quiz: [c.quiz], chat: [c.chat], quizKinds: c.kinds, lang: [titles["my-lang-1"]], people: [titles["tab-people-1"]], log: [titles["my-log-1"]] };
  FONT = FONTS[loc] ?? FONTS.default;

}
const rawKo = path.join(root, "tmp", "guide-slides", "raw", "ko");

const file = (name) => (name === "call-face" ? path.join(rawKo, "call-fix.png") : path.join(raw, `${name}.png`));
const size = (name) => {
  const head = fs.readFileSync(file(name)).subarray(16, 24);
  return { w: head.readUInt32BE(0), h: head.readUInt32BE(4) };
};
const uri = (name) => `data:image/png;base64,${(CLEAN[name] ?? fs.readFileSync(file(name))).toString("base64")}`;
const CLEAN = {};
/** 조각 하나만 크게: 원본 px [x0, y0, x1, y1]만 잘라 폭 w로. 화면의 곁가지(시간 줄·버튼 줄)는 자르는 자리로 뺀다. */
const piece = (name, box, w = 960, over = "") => {
  const s = size(name);
  const [x0, y0, x1, y1] = box ?? [0, 0, s.w, s.h];
  const k = w / (x1 - x0);
  return `<div class="card" style="width:${w}px;height:${Math.round((y1 - y0) * k)}px"><img src="${uri(name)}" style="width:${Math.round(s.w * k)}px;transform:translate(${-x0 * k}px,${-y0 * k}px)">${over}</div>`;
};
const arrow = `<div class="arrow">↓</div>`;
const pills = (names) => `<div class="pills">${names.map((n, i) => `${i ? '<span class="to">→</span>' : ""}<span class="pill p${i}">${n}</span>`).join("")}</div>`;

// 장 순서 = 학습 흐름(통화 → 퀴즈·사전·수업 → 채팅·사람 → 기록). 흐름 표시 줄은 두지 않는다(사용자 2026-11-16).
// 1장 = 통화 장면 한 화면: 위 튜터(call-talk) + 아래 내 얼굴·고친 말 카드(call-fix, /dev/call-preview)를 폰 한 장처럼 붙임.
// 아래 내 얼굴 동그라미는 글자 없는 그림이라 한국어 /dev/call-preview 그림(call-fix)을 모든 언어에 쓰고, 그 아래 고친 말 카드는 그 언어 것.
const callScene = () => `<div class="phone">${piece("call-talk", [0, 0, 780, 700], 700)}${piece("call-face", [0, 380, 732, 730], 700)}<div class="fixpad">${piece("call-fix-card", null, 660)}</div></div>`;
function quizGrid() {
  const typed = TYPED[locale];
  let tiles = [["keep-after", [0, 0, 772, 600], 0], ["type-meaning", [0, 0, 772, 540], 1], ["type-spots", [0, 0, 772, 600], 2]];
  if (typed) tiles.push(["type-type", [0, 0, 772, typed[4]], 3]);
  if (QUIZ_TILES[locale]) tiles = QUIZ_TILES[locale];
  return `<div class="grid${tiles.length === 3 ? " three" : ""}">${tiles.map(([name, box, kind]) => {
    let over = "";
    if (kind === 3 && typed) {
      const k = 470 / 772, [text, x, y, w] = typed;
      const size = Math.min(21, Math.floor((w * k - 16) / (text.length * 0.5)));
      over = `<span class="typed" dir="ltr" style="left:${Math.round(x * k + 12)}px;top:${Math.round(y * k - size * 0.65)}px;font-size:${size}px">${text}</span>`;
    }
    return `<div><div class="tag">${T.quizKinds[kind]}</div>${piece(name, box, 470, over)}</div>`;
  }).join("")}</div>`;
}
const shots = () => [
  ["01-call", T.call, callScene()],
  ["02-quiz", T.quiz, quizGrid()],
  // 사전 전체(종류별 개수) → 묶음 → 넘겨 보기 카드
  ["03-lang", T.lang, `<div class="col">${piece("lang-core", [0, 170, 772, 525], 700)}${arrow}${piece("lang-bundle", [0, 0, 772, 330], 700)}${arrow}${piece("lang-flip", [0, 50, 752, 524], 700)}</div>`],
  ["05-chat", T.chat, piece("tab-chat-2", [50, 0, 700, 240])],
  ["06-people", T.people, piece("tab-people-1", [0, 60, 780, 330])],
  // 학습 곡선 — store-shots/v280/shoot-log.mjs가 지난 14일 치를 넣어 찍은 그림
  ["07-log", T.log, piece("log-curve")],
];

const page = ([, [title, sub], body]) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;overflow:hidden;display:flex;flex-direction:column;padding:230px 0 120px;font-family:${FONT};color:#fff;
  background:radial-gradient(120% 70% at 50% 0%,#1d3b6e 0%,#0b1220 55%,#05070d 100%)}
header{padding:0 70px;text-align:center}
h1{font-size:76px;font-weight:800;letter-spacing:-1.5px;line-height:1.2;word-break:keep-all}
.sub{margin-top:22px;font-size:40px;font-weight:500;color:#b9c7e6}
main{flex:1;display:flex;align-items:center;justify-content:center}
.col{display:flex;flex-direction:column;align-items:center;gap:36px}
.grid{display:grid;grid-template-columns:470px 470px;gap:44px 24px;align-items:start}
.tag{display:inline-block;margin:0 0 12px 14px;padding:8px 22px;border-radius:999px;background:#16a34a;font-size:30px;font-weight:700}
.arrow{font-size:50px;line-height:1;color:#7fa7ff;margin:-10px 0}
.phone{display:flex;flex-direction:column;border-radius:44px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 0 3px rgba(255,255,255,.12)}
.phone .card{border-radius:0;box-shadow:none}
.pills{display:flex;align-items:center;gap:18px;margin-top:30px}
.pill{padding:18px 34px;border-radius:999px;font-size:40px;font-weight:700}
.p0{background:#16a34a}.p1{background:#3b82f6}.p2{background:#0ea5e9}
.to{font-size:40px;color:#7fa7ff}
.card{overflow:hidden;border-radius:34px;background:#000;box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 0 2px rgba(255,255,255,.08)}
.card{position:relative}
.card img{display:block}
.typed{position:absolute;color:#fff;white-space:nowrap}
.grid.three>div:last-child{grid-column:1/3;justify-self:center}
.fixpad{background:#050505;padding:0 20px 24px;display:flex;justify-content:center}
.piece{position:relative}
.tag{display:inline-block;margin:0 0 12px 18px;padding:8px 22px;border-radius:999px;background:#3b82f6;font-size:30px;font-weight:700}
</style></head><body><header><h1 dir="auto">${title}</h1>${sub ? `<div class="sub" dir="auto">${sub}</div>` : ""}</header><main>${body}</main></body></html>`;

const browser = await chromium.launch();
/** 통화 화면 맨 위 시간 줄(원본 y 88~138의 무채색 글자)을 검게 — 얼굴 테두리 색은 남는다. */
async function cleanTimer(name) {
  const tab = await browser.newPage();
  const data = await tab.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 88, c.width, 50);
    // 얼굴 동그라미(가운데, 원본 반지름 약 106 — 테두리 고리 안쪽) 안은 건드리지 않는다.
    const cx = c.width / 2, cy = 232, rr = 106 * 106;
    for (let i = 0; i < d.data.length; i += 4) {
      const x = (i / 4) % c.width, y = 88 + Math.floor(i / 4 / c.width);
      if ((x - cx) ** 2 + (y - cy) ** 2 < rr) continue;
      const [r, gg, b] = [d.data[i], d.data[i + 1], d.data[i + 2]];
      const hi = Math.max(r, gg, b);
      if (hi > 12 && hi - Math.min(r, gg, b) < 60) d.data[i] = d.data[i + 1] = d.data[i + 2] = 5;
    }
    g.putImageData(d, 0, 88);
    return c.toDataURL("image/png").split(",")[1];
  }, `data:image/png;base64,${fs.readFileSync(path.join(raw, `${name}.png`)).toString("base64")}`);
  CLEAN[name] = Buffer.from(data, "base64");
  await tab.close();
}
const tab = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const loc of LOCALES) {
  use(loc);
  for (const k of Object.keys(CLEAN)) delete CLEAN[k];
  await cleanTimer("call-talk");
  fs.mkdirSync(out, { recursive: true });
  for (const shot of shots()) {
    await tab.setContent(page(shot));
    await tab.evaluate(() => document.fonts.ready);
    await tab.screenshot({ path: path.join(out, `${shot[0]}.png`) });
  }
  // --play: 그 등록정보 phoneScreenshots를 이 7장으로 통째로 바꾼다(예전 장 지움, Play는 파일 이름 순서로 올림).
  if (play && LISTING[loc]) {
    const dir = path.join(root, "fastlane", "metadata", "android", LISTING[loc], "images", "phoneScreenshots");
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(dir)) fs.rmSync(path.join(dir, f));
    for (const f of fs.readdirSync(out).sort()) fs.copyFileSync(path.join(out, f), path.join(dir, f));
  }
  console.log("wrote", loc);
}
await browser.close();

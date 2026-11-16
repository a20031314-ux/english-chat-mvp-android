// 2.80 스토어 8장(1080×1920) — 장마다 핵심 화면 조각 하나만 크게(사용자 2026-11-16 "최대한 단순화"). 사용법 장면용으로 찍은 실제 화면 조각(tmp/guide-slides/raw/<앱 언어>,
// scripts/guide-slides/shoot*.mjs·crop-tabs.mjs)을 잘라 크게, 위에 제목 한 줄만(부제·세부 설명 없음, 사용자 2026-11-16).
// 메시지 순서는 hub/work/drafts/marketing-layers-2026-11-01.md(틀 > 양 > 적용 · 연결 · 약점), 영상 학습은 뺌.
// 수업 장은 얼굴 위에 겹친 시간 줄(회색 글자)을 지운 그림을 쓴다 — cleanTimer().
// Run(저장소 맨 위): node store-shots/v280/compose.mjs [ko] → store-shots/out/v280/<앱 언어>/01-…08-.png
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const { chromium } = createRequire(root + "/node_modules/")("playwright");
const locale = process.argv[2] ?? "ko";
const raw = path.join(root, "tmp", "guide-slides", "raw", locale);
const out = path.join(root, "store-shots", "out", "v280", locale);

const TEXT = {
  ko: {
    call: ["AI 튜터와 학습하세요"],
    quiz: ["다양한 유형의 퀴즈로<br>매일 학습"],
    typed: "What can I do for you?",
    quizKinds: ["고르기", "뜻", "틀린 곳", "쓰기"],
    lang: ["배울 말이 모두 여기에"],
    lesson: ["AI 튜터와 수업하세요"],
    chat: ["AI 튜터와 채팅하세요"],
    people: ["다른 사람과 교류하세요"],
    log: ["배운 것이 쌓여요"],
  },
};
const T = TEXT[locale];
const FONT = '"Noto Sans KR","Noto Sans CJK KR","Noto Sans CJK JP",sans-serif';

const size = (name) => {
  const head = fs.readFileSync(path.join(raw, `${name}.png`)).subarray(16, 24);
  return { w: head.readUInt32BE(0), h: head.readUInt32BE(4) };
};
const uri = (name) => `data:image/png;base64,${(CLEAN[name] ?? fs.readFileSync(path.join(raw, `${name}.png`))).toString("base64")}`;
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
const callScene = () => `<div class="phone">${piece("call-talk", [0, 0, 780, 700], 700)}${piece("call-fix", [0, 380, 732, 946], 700)}</div>`;
const shots = () => [
  ["01-call", T.call, callScene()],
  ["02-quiz", T.quiz, `<div class="grid">${[
    ["keep-after", [0, 0, 772, 600]],
    ["type-meaning", [0, 0, 772, 540]],
    ["type-spots", [0, 0, 772, 600]],
    ["type-type", [0, 0, 772, 235]],
  ].map(([name, box], i) => `<div><div class="tag">${T.quizKinds[i]}</div>${piece(name, box, 470, i === 3 ? `<span class="typed">${T.typed}</span>` : "")}</div>`).join("")}</div>`],
  // 사전 전체(종류별 개수) → 묶음 → 넘겨 보기 카드
  ["03-lang", T.lang, `<div class="col">${piece("lang-core", [0, 170, 772, 525], 700)}${arrow}${piece("lang-bundle", [0, 0, 772, 330], 700)}${arrow}${piece("lang-flip", [0, 50, 752, 524], 700)}</div>`],
  ["04-lesson", T.lesson, piece("call-lesson", [0, 100, 780, 520])],
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
.typed{position:absolute;left:30px;top:101px;font-size:21px;color:#fff}
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
await cleanTimer("call-lesson");
await cleanTimer("call-talk");
fs.mkdirSync(out, { recursive: true });
const tab = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const shot of shots()) {
  await tab.setContent(page(shot));
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: path.join(out, `${shot[0]}.png`) });
  console.log("wrote", shot[0]);
}
await browser.close();

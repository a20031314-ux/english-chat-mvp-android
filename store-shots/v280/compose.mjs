// 2.80 스토어 8장(1080×1920): 사용법 장면용으로 찍은 실제 화면 조각(tmp/guide-slides/raw/<앱 언어>,
// scripts/guide-slides/shoot*.mjs·crop-tabs.mjs)을 이어 붙이고 위에 제목 한 줄 + 부제 한 줄.
// 메시지 순서는 hub/work/drafts/marketing-layers-2026-11-01.md(틀 > 양 > 적용 · 연결 · 약점), 영상 학습은 뺌.
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
    overview: ["언어 공부의 모든 것", "퀴즈로 채우고, 튜터와 말하고, 기록이 쌓여요"],
    overviewTags: ["Quizbank", "AI 튜터 통화", "Logbank"],
    quiz: ["퀴즈로 매일 배우세요", "맞힐수록 한 단계씩 어려워져요"],
    quizTags: ["고르기", "틀린 곳", "쓰기"],
    weak: ["부족한 곳은 다시 채워져요", "틀린 것만 다시 나와요"],
    call: ["튜터와 편하게 통화하세요", "고친 말은 카드로 보여요"],
    modes: ["수업하고, 놀고, 가르쳐 보세요", "수업 · 스무고개 · 가르치기"],
    chat: ["튜터와 채팅하세요", "고친 문장을 바로 보세요"],
    lang: ["배울 말이 모두 여기에", "뜻과 예문을 한눈에"],
    people: ["다른 사람과 교류하세요", "같은 언어를 배우는 사람들과"],
  },
};
const T = TEXT[locale];
const FONT = '"Noto Sans KR","Noto Sans CJK KR","Noto Sans CJK JP",sans-serif';

const size = (name) => {
  const head = fs.readFileSync(path.join(raw, `${name}.png`)).subarray(16, 24);
  return { w: head.readUInt32BE(0), h: head.readUInt32BE(4) };
};
const uri = (name) => `data:image/png;base64,${fs.readFileSync(path.join(raw, `${name}.png`)).toString("base64")}`;
/** 조각: 폭 w로 줄이고, 위에서 y(줄인 뒤 px)부터 높이 h만. h 없으면 끝까지. */
const piece = (name, w, h, y = 0, tag = "") => {
  const s = size(name);
  const full = Math.round((s.h * w) / s.w);
  const show = Math.min(h ?? full, full - y);
  return `<div class="piece">${tag ? `<div class="tag">${tag}</div>` : ""}<div class="card" style="width:${w}px;height:${show}px"><img src="${uri(name)}" style="width:${w}px;transform:translateY(${-y}px)"></div></div>`;
};
const arrow = `<div class="arrow">↓</div>`;

const SHOTS = [
  ["01-overview", T.overview, `<div class="col">${piece("keep-core", 860, 300, 0, T.overviewTags[0])}${arrow}${piece("call-talk", 860, 330, 100, T.overviewTags[1])}${arrow}${piece("log-core", 860, 330, 0, T.overviewTags[2])}</div>`],
  ["02-quiz", T.quiz, `<div class="col">${piece("keep-core", 880, 520, 0, T.quizTags[0])}${arrow}${piece("type-spot", 880, null, 0, T.quizTags[1])}${arrow}${piece("type-type", 880, null, 0, T.quizTags[2])}</div>`],
  ["03-weak", T.weak, `<div class="col">${piece("keep-after", 940)}${piece("log-session", 940, 560)}</div>`],
  ["04-call", T.call, `<div class="col">${piece("call-talk", 940, 900)}${piece("call-fix-card", 940)}</div>`],
  ["05-modes", T.modes, `<div class="col">${piece("call-lesson", 940, 900)}<div class="row">${piece("call-twenty", 460, 330)}${piece("call-teach", 460, 330)}</div></div>`],
  ["06-chat", T.chat, `<div class="col">${piece("tab-chat-1", 940)}${piece("tab-chat-2", 940)}</div>`],
  ["07-lang", T.lang, `<div class="col">${piece("lang-core", 940, 620)}${piece("lang-word", 940, 680)}</div>`],
  ["08-people", T.people, `<div class="col">${piece("tab-people-1", 940, null, 40)}${piece("tab-rooms-1", 940, 760)}</div>`],
];

const page = ([, [title, sub], body]) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;overflow:hidden;font-family:${FONT};color:#fff;
  background:radial-gradient(120% 70% at 50% 0%,#1d3b6e 0%,#0b1220 55%,#05070d 100%)}
header{padding:120px 70px 0;text-align:center}
h1{font-size:76px;font-weight:800;letter-spacing:-1.5px;line-height:1.15}
.sub{margin-top:22px;font-size:40px;font-weight:500;color:#b9c7e6}
main{position:absolute;left:0;right:0;top:400px;bottom:60px;display:flex;align-items:center;justify-content:center}
.col{display:flex;flex-direction:column;align-items:center;gap:28px}
.row{display:flex;gap:20px}
.card{overflow:hidden;border-radius:34px;background:#000;box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 0 2px rgba(255,255,255,.08)}
.card img{display:block}
.piece{position:relative}
.tag{display:inline-block;margin:0 0 12px 18px;padding:8px 22px;border-radius:999px;background:#3b82f6;font-size:30px;font-weight:700}
.arrow{font-size:46px;line-height:1;color:#7fa7ff;margin:-18px 0}
</style></head><body><header><h1 dir="auto">${title}</h1><div class="sub" dir="auto">${sub}</div></header><main>${body}</main></body></html>`;

fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const shot of SHOTS) {
  await tab.setContent(page(shot));
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: path.join(out, `${shot[0]}.png`) });
  console.log("wrote", shot[0]);
}
await browser.close();

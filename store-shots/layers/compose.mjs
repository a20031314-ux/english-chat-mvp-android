// 스토어 8장(마케팅 층위 — hub/drafts/marketing-layers-2026-11-01.md §3) 합치기: capture.mjs가 찍은 조각을 1080×1920으로.
// 결과: store-shots/out/layers/<앱 언어>/1~8.png. 글은 strings.mjs(앱 언어마다), 버튼·칸 이름은 앱 문구(copy.ts) 그대로.
// --play 를 붙이면 fastlane/metadata/android/<등록정보>/images/phoneScreenshots/01-…08-로도 복사(예전 장은 지움).
// Run(저장소 맨 위): CHROMIUM=/usr/bin/google-chrome node store-shots/layers/compose.mjs [ko,en,…] [--play]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { COPY, FLAG, PLAY_FOLDER, SCOPE, rolesFor } from "./strings.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const { chromium } = createRequire(root + "/node_modules/")("playwright");
const args = process.argv.slice(2);
const play = args.includes("--play");
const locales = (args.find((a) => !a.startsWith("--")) ?? "ko").split(",");
const appCopy = JSON.parse(fs.readFileSync(path.join(root, "tmp", "store-layers", "copy.json"), "utf8"));
const NAMES = ["overview", "patterns", "quizbank", "call", "after-call", "people", "connect", "weak"];

const FONT = {
  ko: '"Noto Sans KR","Noto Sans CJK KR","Malgun Gothic"',
  ja: '"Yu Gothic","Noto Sans CJK JP"',
  zh: '"Microsoft YaHei","Noto Sans CJK SC"',
  hi: '"Nirmala UI","Noto Sans Devanagari"',
  th: '"Leelawadee UI","Noto Sans Thai","Loma"',
  ar: '"Segoe UI","Noto Sans Arabic","Tahoma"',
};

function pagesFor(ui) {
  const T = COPY[ui];
  const C = appCopy[ui];
  const R = rolesFor(ui);
  const raw = path.join(root, "tmp", "store-layers", ui);
  const uri = (name) => `data:image/png;base64,${fs.readFileSync(path.join(raw, `${name}.png`)).toString("base64")}`;
  /** 조각 그림을 폭 w로 줄였을 때 높이(PNG 머리에서). */
  const heightAt = (name, w) => {
    const head = fs.readFileSync(path.join(raw, `${name}.png`)).subarray(16, 24);
    return Math.round((head.readUInt32BE(4) * w) / head.readUInt32BE(0));
  };
  const fill = (text) => text.replace("{n}", String(SCOPE[R.lesson2]?.[0] ?? 96)).replace("{g}", String(SCOPE[R.quiz]?.[1] ?? 37));
  const bar = (on) =>
    `<div class="bar">${["Stagebank", "Quizbank", C.homeTabTalk].map((name, i) => `<span class="${on.includes(i) ? `on t${i}` : ""}">${name}</span>`).join("")}</div>`;
  const chip = (langs) => `<div class="chip">${[...new Set(langs)].map((l) => FLAG[l] ?? "").join("  ")}</div>`;
  const head = (i, on, langs) => `${bar(on)}${chip(langs)}<h1>${T.h[i][0]}</h1>${T.h[i][1] ? `<div class="sub">${fill(T.h[i][1])}</div>` : ""}`;
  /** 조각 하나: 그림을 폭 iw로 줄이고 (x, y)부터 w×h만 보이게. */
  const piece = (name, w, h, y = 0, iw = w, x = 0) =>
    `<div class="card" style="width:${w}px;height:${h}px"><img src="${uri(name)}" style="width:${iw}px;transform:translate(${-x}px,${-y}px)"></div>`;
  const tag = (text, color) => `<div class="tag" style="color:${color}">${text}</div>`;
  const button = (icon, name, desc) => `<div class="btn"><div class="ico">${icon}</div><div><b>${name}</b><span>${desc}</span></div></div>`;
  return [
    // 1 종합: 세 칸 + 되돌아오는 화살표
    () => `${head(0, [0, 1, 2], [R.lesson1, R.quiz, R.call])}
      <div class="rows">
        <div class="row"><div class="label"><small class="c0">Stagebank</small>${T.rows[0]}</div>${piece("lesson1-explain", 700, 330, Math.max(0, heightAt("lesson1-explain", 700) - 400), 700)}</div>
        <div class="arrow">↓</div>
        <div class="row"><div class="label"><small class="c1">Quizbank</small>${T.rows[1]}</div>${piece("quiz-q1", 700, 330, 0, 700)}</div>
        <div class="arrow">↓</div>
        <div class="row"><div class="label"><small class="c2">${C.homeTabTalk}</small>${T.rows[2]}</div>${piece("call-live", 700, 300, 1000, 700)}</div>
      </div>
      <div class="loop">↺ ${T.loop}</div>`,
    // 2 틀: 수업 설명 + 퀴즈
    () => `${head(1, [0], [R.lesson2])}
      <div class="gap">${piece("lesson2-explain", 940, 760)}</div>
      <div class="arrow">↓</div>
      ${piece("lesson2-quiz", 940, 300)}`,
    // 3 양: Quizbank 정답 고른 화면
    () => `${head(2, [1], [R.quiz])}
      <div class="gap">${piece("quiz-layer", 940, 1163)}</div>`,
    // 4 통화 중: 튜터 → 🎓 고친 말 카드 크게 → 버튼 넷
    () => `${head(3, [2], [R.call])}
      <div class="gap">${piece("call-live", 940, 470, 130, 940)}</div>
      ${tag(`🎓 ${C.callCoach}`, "#FFD15C")}
      ${piece("call-live", 940, 232, 1718, 1120, 70)}
      <div class="btns">
        ${button("🎓", C.callCoach, T.call[0])}
        ${button("🙉", C.roleplayMissed, T.call[1])}
        ${button("💬", C.roleplayCaptions, T.call[2])}
        ${button("💡", C.missionHint, T.call[3])}
      </div>`,
    // 5 통화 끝: 요약 줄 크게(⏱ ✎ 💡 🔁 칸 이름) → 하려던 말을 고친 대본
    () => `${head(4, [2], [R.past])}
      <div class="gap">${piece("call-end", 940, 150, 0, 1140, 0)}</div>
      <div class="legend"><span>⏱ 5:12</span><span>✎ ${C.roleplayBetter}</span><span>💡 ${C.missionHint}</span><span>🔁 ${C.roleplaySayAgain}</span></div>
      <div style="margin-top:28px">${piece("past-review-first", 940, 1000, 0, 940)}</div>`,
    // 6 사람
    () => `${head(5, [2], ["ja"])}
      <div class="gap">${piece("people-call", 940, 640, 120)}</div>
      <div style="margin-top:28px">${piece("people-group", 940, 470)}</div>`,
    // 7 연결: 통화 정리 → 다시 보기 문제
    () => `${head(6, [1, 2], [R.past, R.review])}
      <div class="gap">${piece("past-recap", 940, 620)}</div>
      <div class="arrow">↓</div>
      ${piece("review-q", 940, 360)}`,
    // 8 약점: 맞힌 것은 쉬고, 틀린 것은 다시 보기 탭에
    () => `${head(7, [1], [R.quiz, R.review])}
      <div style="margin-top:60px">${tag(T.known, "#5BD6A0")}</div>
      ${piece("quiz-q1-answered", 700, 739, 0, 700)}
      <div style="margin-top:34px">${tag(T.wrong, "#FF8A6B")}</div>
      ${piece("review-layer", 700, 396, 0, 700)}`,
  ];
}

const css = (ui) => `
  html,body{margin:0}
  body{width:1080px;height:1920px;overflow:hidden;background:radial-gradient(1200px 900px at 50% -10%,#2A2B36 0%,#14151A 60%);color:#fff;
    font-family:${FONT[ui] ? `${FONT[ui]},` : ""}"Noto Sans","Noto Sans CJK KR","DejaVu Sans",sans-serif;box-sizing:border-box;position:relative}
  .bar{display:flex;justify-content:center;gap:14px;padding-top:64px}
  .bar span{font-size:28px;font-weight:700;padding:10px 24px;border-radius:999px;border:2px solid #3A3B45;color:#7D7F8C}
  .bar span.on{color:#14151A}
  .bar span.on.t0{border-color:#FFD15C;background:#FFD15C}
  .bar span.on.t1{border-color:#5BD6A0;background:#5BD6A0}
  .bar span.on.t2{border-color:#7CC4FF;background:#7CC4FF}
  .c0{color:#FFD15C}.c1{color:#5BD6A0}.c2{color:#7CC4FF}
  .chip{margin:30px auto 0;width:max-content;font-size:34px;background:#24252E;border-radius:999px;padding:6px 24px;letter-spacing:4px}
  h1{margin:24px auto 0;font-size:${ui === "ru" || ui === "fr" || ui === "it" || ui === "es" || ui === "pt" || ui === "id" || ui === "vi" ? 72 : 80}px;line-height:1.16;font-weight:900;text-align:center;letter-spacing:-.02em;white-space:pre-line;max-width:1010px}
  .sub{margin:20px auto 0;font-size:33px;line-height:1.4;color:#B9BAC2;text-align:center;max-width:980px;white-space:pre-line}
  .gap{margin-top:52px}
  .card{direction:ltr;margin:0 auto;border-radius:36px;overflow:hidden;background:#0B0B0E;box-shadow:0 30px 80px rgba(0,0,0,.55);border:2px solid #2C2D36;position:relative}
  .card img{display:block}
  .arrow{text-align:center;font-size:56px;color:#FFD15C;line-height:1;margin:14px 0}
  .rows{margin-top:52px;display:flex;flex-direction:column;gap:22px}
  .row{display:flex;align-items:center;gap:26px;margin:0 50px}
  .row .label{flex:0 0 260px;font-size:31px;font-weight:800;line-height:1.3}
  .row .label small{display:block;font-size:26px;font-weight:700;margin-bottom:6px}
  .loop{position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:34px;font-weight:800;color:#FFD15C}
  .tag{font-size:30px;font-weight:800;margin:22px auto 12px;width:940px}
  .btns{display:grid;grid-template-columns:1fr 1fr;gap:22px;width:940px;margin:44px auto 0}
  .btn{display:flex;gap:16px;align-items:center;background:#1E1F27;border:2px solid #2C2D36;border-radius:28px;padding:30px 22px}
  .btn .ico{flex:0 0 76px;height:76px;border-radius:50%;background:#2A2B35;display:flex;align-items:center;justify-content:center;font-size:40px}
  .btn b{display:block;font-size:29px;line-height:1.25}
  .btn span{display:block;font-size:24px;line-height:1.3;color:#B9BAC2;margin-top:4px}
  .legend{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;width:940px;margin:22px auto 0}
  .legend span{font-size:27px;font-weight:700;background:#1E1F27;border:2px solid #2C2D36;border-radius:999px;padding:8px 20px}
`;

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const ui of locales) {
  const out = path.join(here, "..", "out", "layers", ui);
  fs.mkdirSync(out, { recursive: true });
  const pages = pagesFor(ui);
  const playDir = play && PLAY_FOLDER[ui] ? path.join(root, "fastlane", "metadata", "android", PLAY_FOLDER[ui], "images", "phoneScreenshots") : null;
  if (playDir) {
    fs.mkdirSync(playDir, { recursive: true });
    for (const file of fs.readdirSync(playDir)) if (/^0\d-.*\.png$/.test(file)) fs.rmSync(path.join(playDir, file));
  }
  for (const [i, make] of pages.entries()) {
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(ui)}</style><body${ui === "ar" ? ' dir="rtl"' : ""}>${make()}</body>`, { waitUntil: "load" });
    await page.waitForTimeout(250);
    const file = path.join(out, `${i + 1}.png`);
    await page.screenshot({ path: file });
    if (playDir) fs.copyFileSync(file, path.join(playDir, `0${i + 1}-${NAMES[i]}.png`));
  }
  console.log(`${ui}: ${pages.length}장${playDir ? ` → ${path.relative(root, playDir)}` : ""}`);
}
await browser.close();

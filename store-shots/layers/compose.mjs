// 스토어 8장(마케팅 층위 — hub/drafts/marketing-layers-2026-11-01.md §3) 합치기: capture.mjs가 찍은 조각을 1080×1920으로.
// 결과: store-shots/out/layers/<앱 언어>/1~8.png. 글은 이 파일 COPY(앱 언어마다), 숫자는 그림 속 학습 언어 것(marketing-layers 끝 표).
// Run(저장소 맨 위): CHROMIUM=/usr/bin/google-chrome node store-shots/layers/compose.mjs [ko]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const { chromium } = createRequire(root + "/node_modules/")("playwright");
const ui = process.argv[2] ?? "ko";
const raw = path.join(root, "tmp", "store-layers", ui);
const out = path.join(here, "..", "out", "layers", ui);
fs.mkdirSync(out, { recursive: true });
const uri = (name) => `data:image/png;base64,${fs.readFileSync(path.join(raw, `${name}.png`)).toString("base64")}`;

const COPY = {
  ko: {
    bar: ["Stagebank", "Quizbank", "대화"],
    learning: { en: "🇺🇸 영어", es: "🇪🇸 스페인어", ja: "🇯🇵 일본어", fr: "🇫🇷 프랑스어" },
    learningSuffix: "배우는 중",
    shots: [
      { h1: "언어 공부의 모든 것", sub: "문장구조 90여 개 · 낱말 약 7,000개 · 문법 35~40가지", rows: ["문장 틀을 잡고", "많이 풀어서 채우고", "말하며 바로 고쳐요"], loop: "틀린 말은 다시 문제로" },
      { h1: "문장 틀을 잡아요", sub: "문장구조 96개, 하나씩 내 것으로" },
      { h1: "많이 풀어서 채워요", sub: "낱말 약 7,000개 · 문법 37가지\n막힌 것·약한 곳·잊을 때 된 것부터" },
      { h1: "AI 튜터와\n소리 내어 말해요", sub: "큰 실수만 짚고, 바로 다시 말해 봐요" },
      { h1: "통화가 끝나면\n고칠 말만 모아 줘요", sub: "하려던 말을 바른 문장으로" },
      { h1: "같은 언어 배우는\n사람들과", sub: "단체 통화 · 단체방 · Room" },
      { h1: "틀린 말은 정리해서\n다시 문제로", sub: "통화에서 고친 말 → 그 틀 수업 · 다시 보기" },
      { h1: "아는 건 빼고,\n모르는 것만", sub: "내게 필요한 것부터 먼저 나와요", known: "✓ 맞힌 건 잊을 때쯤 한 번 더", wrong: "✗ 틀린 건 따로 모아 다시" },
    ],
  },
};
const T = COPY[ui] ?? COPY.ko;

const css = `
  html,body{margin:0}
  body{width:1080px;height:1920px;overflow:hidden;background:radial-gradient(1200px 900px at 50% -10%,#2A2B36 0%,#14151A 60%);color:#fff;
    font-family:"Pretendard","Noto Sans KR","Noto Sans CJK KR","Noto Sans JP","Apple SD Gothic Neo",sans-serif;box-sizing:border-box;position:relative}
  .bar{display:flex;justify-content:center;gap:14px;padding-top:64px}
  .bar span{font-size:28px;font-weight:700;padding:10px 24px;border-radius:999px;border:2px solid #3A3B45;color:#7D7F8C}
  .bar span.on{border-color:#FFD15C;color:#14151A;background:#FFD15C}
  .bar span.on.keep{border-color:#5BD6A0;background:#5BD6A0}
  .bar span.on.talk{border-color:#7CC4FF;background:#7CC4FF}
  .chip{margin:34px auto 0;width:max-content;font-size:28px;font-weight:600;color:#D9DAE2;background:#24252E;border-radius:999px;padding:10px 26px}
  h1{margin:26px auto 0;font-size:84px;line-height:1.16;font-weight:900;text-align:center;letter-spacing:-.02em;white-space:pre-line;max-width:1000px}
  .sub{margin:22px auto 0;font-size:36px;line-height:1.4;color:#B9BAC2;text-align:center;max-width:960px;white-space:pre-line}
  .card{margin:0 auto;border-radius:36px;overflow:hidden;background:#0B0B0E;box-shadow:0 30px 80px rgba(0,0,0,.55);border:2px solid #2C2D36;position:relative}
  .card img{display:block;width:100%}
  .crop{overflow:hidden}
  .phone{margin:0 auto;border:14px solid #050507;border-bottom:0;border-radius:64px 64px 0 0;outline:2px solid #34353C;overflow:hidden;background:#000}
  .phone img{display:block;width:100%}
  .arrow{text-align:center;font-size:56px;color:#FFD15C;line-height:1;margin:14px 0}
  .row{display:flex;align-items:center;gap:26px;margin:0 50px}
  .row .label{flex:0 0 260px;font-size:31px;font-weight:800;line-height:1.3}
  .row .label small{display:block;font-size:26px;font-weight:700;margin-bottom:6px}
  .loop{position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:34px;font-weight:800;color:#FFD15C}
  .tag{font-size:30px;font-weight:800;color:#7CC4FF;margin:0 auto 12px;width:700px}
`;
const bar = (on) => `<div class="bar">${T.bar.map((name, i) => `<span class="${on.includes(i) ? `on ${["", "keep", "talk"][i]}` : ""}">${name}</span>`).join("")}</div>`;
const chip = (langs) => `<div class="chip">${langs.map((l) => T.learning[l]).join(" · ")} ${T.learningSuffix}</div>`;
const head = (i, on, langs) => `${bar(on)}${chip(langs)}<h1>${T.shots[i].h1}</h1>${T.shots[i].sub ? `<div class="sub">${T.shots[i].sub}</div>` : ""}`;
/** 조각 하나: 폭 w, 위에서 top(조각 높이 비율)부터 높이 h만 보이게. */
const piece = (name, w, h, top = 0, extra = "") =>
  `<div class="card crop" style="width:${w}px;height:${h}px;${extra}"><img src="${uri(name)}" style="transform:translateY(-${top}px)"></div>`;
const phone = (name, w, h, top = 0) => `<div class="phone" style="width:${w}px;height:${h}px"><img src="${uri(name)}" style="transform:translateY(-${top}px)"></div>`;

const pages = [
  // 1 종합: 세 칸 + 되돌아오는 화살표
  () => `${head(0, [0, 1, 2], ["en", "es"])}
    <div style="margin-top:56px;display:flex;flex-direction:column;gap:22px">
      <div class="row"><div class="label"><small style="color:#FFD15C">Stagebank</small>${T.shots[0].rows[0]}</div>${piece("en-lesson-explain", 700, 330, 640)}</div>
      <div class="arrow">↓</div>
      <div class="row"><div class="label"><small style="color:#5BD6A0">Quizbank</small>${T.shots[0].rows[1]}</div>${piece("es-quiz-q1", 700, 330, 0)}</div>
      <div class="arrow">↓</div>
      <div class="row"><div class="label"><small style="color:#7CC4FF">${T.bar[2]}</small>${T.shots[0].rows[2]}</div>${piece("call-live-ja", 700, 300, 1030)}</div>
    </div>
    <div class="loop">↺ ${T.shots[0].loop}</div>`,
  // 2 틀: 수업 설명 + 퀴즈
  () => `${head(1, [0], ["ja"])}
    <div style="margin-top:56px">${piece("ja-lesson-explain", 940, 760, 0)}</div>
    <div class="arrow">↓</div>
    ${piece("ja-lesson-quiz", 940, 300, 0)}`,
  // 3 양: Quizbank 문제
  () => `${head(2, [1], ["es"])}
    <div style="margin-top:60px">${piece("es-quiz-layer", 940, 1163, 0)}</div>`,
  // 4 통화 중
  () => `${head(3, [2], ["ja"])}
    <div style="position:absolute;left:0;right:0;bottom:0">${phone("call-live-ja", 600, 1340, 0)}</div>`,
  // 5 통화 끝 고친 말
  () => `${head(4, [2], ["en"])}
    <div style="margin-top:60px">${piece("en-call-review-first", 940, 1170, 0)}</div>`,
  // 6 사람
  () => `${head(5, [2], ["ja"])}
    <div style="margin-top:56px">${piece("people-call", 940, 640, 120)}</div>
    <div style="margin-top:28px">${piece("people-group", 940, 470, 0)}</div>`,
  // 7 연결: 통화 정리 → 다시 보기 문제
  () => `${head(6, [1, 2], ["en", "fr"])}
    <div style="margin-top:56px">${piece("en-call-recap", 940, 620, 0)}</div>
    <div class="arrow">↓</div>
    ${piece("fr-review-q", 940, 360, 0)}`,
  // 8 약점: 맞힌 것은 쉬고, 틀린 것은 다시 보기 탭에
  () => `${head(7, [1], ["es", "fr"])}
    <div class="tag" style="margin-top:60px;color:#5BD6A0">${T.shots[7].known}</div>
    ${piece("es-quiz-q1-answered", 700, 739, 0)}
    <div class="tag" style="margin-top:34px;color:#FF8A6B">${T.shots[7].wrong}</div>
    ${piece("fr-review-layer", 700, 396, 0)}`,
];

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [i, make] of pages.entries()) {
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css}</style><body>${make()}</body>`, { waitUntil: "load" });
  // 조각 이미지는 폭에 맞춰 줄어든다 — translateY는 줄어든 크기 기준이 되게 다시 계산.
  await page.evaluate(() => {
    for (const img of document.querySelectorAll(".card img, .phone img")) {
      const want = Number((img.getAttribute("style").match(/translateY\(-(\d+)px\)/) ?? [])[1] ?? 0);
      img.dataset.top = String(want);
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, `${i + 1}.png`) });
}
await browser.close();
console.log(`${ui}: ${pages.length}장 → ${path.relative(root, out)}`);

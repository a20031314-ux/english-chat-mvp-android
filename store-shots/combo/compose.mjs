// 스토어 8장(1080×1920): 큰 화면 하나(탭의 핵심 기능) + 확대 카드 둘(세부 기능) + 칩(더 있는 기능).
// 장면·문구: store-shots/combo/strings.mjs. 화면: tmp/store-raw/<locale>/<장면>.png
// (npm run build:capacitor 뒤 capture-whats-new.mjs store-my·store-tabs, fastlane/STORE_AUTOMATION.md).
//
// 결과: store-shots/out/combo/<등록정보>/1~8-<장>.png — 폴더째 Play에 올리면 된다.
// Run: node store-shots/combo/compose.mjs
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { COPY, LISTINGS, OVERRIDES, SHOTS } from "./strings.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const raw = path.join(root, "tmp", "store-raw");
const out = path.join(here, "..", "out", "combo");
const ACCENTS = ["#FF8A6B", "#7CC4FF", "#C6F25A", "#FFD15C"];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const uri = (file) => `data:image/png;base64,${readFileSync(file).toString("base64")}`;

/** 화면 412×915(2배 824×1830). 카드는 가로 전체·세로 약 56%를 보여준다. */
const CARD_W = 440;
const CARD_H = 530;
const SHOW = (824 / CARD_W) * CARD_H; // 원본에서 보일 높이(px)

function html(L, shot, i, files) {
  const [kicker, title, subtitle, labels, chips] = COPY[L.locale][shot.id];
  const accent = ACCENTS[i % ACCENTS.length];
  const card = ([scene, top], k) => {
    // 원본 1830px 중 top 비율 위치부터 SHOW만큼 → 카드 높이에 맞춘다.
    const scale = CARD_W / 824;
    const y = Math.min(top * 1830, 1830 - SHOW) * scale;
    return `<figure class="detail"><figcaption><span class="dot" style="background:${accent}"></span>${esc(labels[k + 1])}</figcaption>
      <div class="card"><img src="${files[scene]}" style="transform:translateY(-${y}px)"></div></figure>`;
  };
  return `<!doctype html><html lang="${L.lang}"><head><meta charset="utf-8"><style>
  html,body{margin:0}
  body{width:1080px;height:1920px;overflow:hidden;background:#15161A;color:#fff;font-family:${L.font};box-sizing:border-box;padding:88px 48px 0}
  .kicker{font-size:30px;font-weight:700;letter-spacing:.06em;color:${accent};text-align:center}
  h1{margin:20px auto 0;font-size:76px;line-height:1.16;font-weight:900;text-align:center;letter-spacing:-.02em;white-space:pre-line;max-width:984px}
  .sub{margin:22px auto 0;font-size:32px;color:#B7B8BF;text-align:center;max-width:960px}
  .body{display:flex;gap:28px;margin-top:52px;align-items:flex-start}
  .main{width:516px;flex:none}
  .label{display:inline-flex;align-items:center;gap:10px;font-size:28px;font-weight:700;margin-bottom:14px}
  .dot{width:14px;height:14px;border-radius:50%;display:inline-block;flex:none}
  .phone{border-radius:56px;border:14px solid #000;outline:2px solid #34353C;overflow:hidden;background:#000}
  .phone img{display:block;width:100%}
  .side{display:flex;flex-direction:column;gap:26px;width:${CARD_W}px;flex:none}
  .detail{margin:0}
  .detail figcaption{display:flex;align-items:center;gap:10px;font-size:26px;font-weight:700;margin-bottom:12px;color:#E8E8EC}
  .card{width:${CARD_W}px;height:${CARD_H}px;overflow:hidden;border-radius:28px;outline:2px solid #34353C;background:#000}
  .card img{display:block;width:100%}
  .chips{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin-top:40px}
  .chip{font-size:26px;padding:12px 22px;border-radius:999px;border:2px solid #3A3B44;color:#D7D8DE}
  .chip::before{content:"+ ";color:${accent};font-weight:700}
</style></head><body>
  <div class="kicker">${esc(kicker)}</div>
  <h1>${esc(title)}</h1>
  <p class="sub">${esc(subtitle)}</p>
  <div class="body">
    <div class="main"><div class="label"><span class="dot" style="background:${accent}"></span>${esc(labels[0])}</div>
      <div class="phone"><img src="${files[shot.main]}"></div></div>
    <div class="side">${shot.details.map(card).join("")}</div>
  </div>
  <div class="chips">${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
</body></html>`;
}

rmSync(out, { recursive: true, force: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const problems = [];
for (const L of LISTINGS) {
  const dir = path.join(out, L.folder);
  mkdirSync(dir, { recursive: true });
  for (const [i, base] of SHOTS.entries()) {
    const shot = { ...base, ...(OVERRIDES[L.locale]?.[base.id] ?? {}) };
    const scenes = [shot.main, ...shot.details.map(([s]) => s)];
    const missing = scenes.filter((s) => !existsSync(path.join(raw, L.locale, `${s}.png`)));
    if (missing.length) {
      problems.push(`${L.locale}/${shot.id}: 화면 없음 ${missing.join(", ")}`);
      continue;
    }
    const files = Object.fromEntries(scenes.map((s) => [s, uri(path.join(raw, L.locale, `${s}.png`))]));
    await page.setContent(html(L, shot, i, files), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    // 긴 말(스페인어·힌디어): 제목은 두 줄에, 설명은 한 줄 반 안에 맞게 줄인다.
    await page.evaluate(() => {
      const fit = (el, start, min, maxLines) => {
        const lines = () => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight));
        for (let size = start; lines() > maxLines && size > min; size -= 2) el.style.fontSize = `${size - 2}px`;
      };
      fit(document.querySelector("h1"), 76, 52, 2);
      fit(document.querySelector(".sub"), 32, 24, 2);
    });
    // 아래 칩까지 1920 안에 들어오는지.
    const bottom = await page.evaluate(() => document.querySelector(".chips").getBoundingClientRect().bottom);
    if (bottom > 1900) problems.push(`${L.locale}/${shot.id}: 아래가 ${Math.round(bottom)}px까지 — 넘침`);
    await page.screenshot({ path: path.join(dir, `${i + 1}-${shot.id}.png`) });
  }
}
await browser.close();
console.log(problems.length ? `확인할 것:\n${problems.join("\n")}` : "8장 × 등록정보 모두 합성, 넘친 것 없음");

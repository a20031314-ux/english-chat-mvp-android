// App Store 6.9인치 스크린샷(1320×2868): 안드로이드 8장(compose.mjs)과 같은 꾸밈에서 사람 기능 장(Room·사람)을 뺀 6장.
// 화면: CAPTURE_IOS=1로 찍은 tmp/store-raw-ios/<locale>/<장면>.png(440×956의 3배 = 1320×2868, 아이폰 하단 탭).
// 결과: store-shots/out/combo-ios/<등록정보>/1~6-<장>.png — App Store Connect의 6.9인치 칸에 올린다.
// Run: node store-shots/combo/compose-ios.mjs [--only ko,en]
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { COPY, LISTINGS, OVERRIDES, SHOTS } from "./strings.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const raw = path.join(root, "tmp", "store-raw-ios");
const out = path.join(here, "..", "out", "combo-ios");
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const ACCENTS = ["#FF8A6B", "#7CC4FF", "#C6F25A", "#FFD15C"];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const uri = (file) => `data:image/png;base64,${readFileSync(file).toString("base64")}`;

/** iOS 1차에는 사람 기능이 없다(platform.ts socialFeaturesEnabled). */
const IOS_SHOTS = SHOTS.filter((shot) => shot.id !== "room" && shot.id !== "people");

/** 캔버스는 1080폭으로 그리고 1320/1080배로 찍는다 → 1320×2868. */
const W = 1080;
const H = Math.round(2868 / (1320 / W)); // 2347
const RAW_W = 1320;
const RAW_H = 2868;
const CARD_W = 440;
const CARD_H = 640;
const SHOW = (RAW_W / CARD_W) * CARD_H; // 원본에서 보일 높이

function html(L, shot, i, files) {
  const [kicker, title, subtitle, labels, chips] = COPY[L.locale][shot.id];
  const accent = ACCENTS[i % ACCENTS.length];
  const card = ([scene, top], k) => {
    const scale = CARD_W / RAW_W;
    const y = Math.min(top * RAW_H, RAW_H - SHOW) * scale;
    return `<figure class="detail"><figcaption><span class="dot" style="background:${accent}"></span>${esc(labels[k + 1])}</figcaption>
      <div class="card"><img src="${files[scene]}" style="transform:translateY(-${y}px)"></div></figure>`;
  };
  return `<!doctype html><html lang="${L.lang}"><head><meta charset="utf-8"><style>
  html,body{margin:0}
  body{width:${W}px;height:${H}px;overflow:hidden;background:#15161A;color:#fff;font-family:${L.font};box-sizing:border-box;padding:110px 48px 0}
  .kicker{font-size:32px;font-weight:700;letter-spacing:.06em;color:${accent};text-align:center}
  h1{margin:22px auto 0;font-size:80px;line-height:1.16;font-weight:900;text-align:center;letter-spacing:-.02em;white-space:pre-line;max-width:984px}
  .sub{margin:24px auto 0;font-size:34px;color:#B7B8BF;text-align:center;max-width:960px}
  .body{display:flex;gap:28px;margin-top:60px;align-items:flex-start}
  .main{width:516px;flex:none}
  .label{display:inline-flex;align-items:center;gap:10px;font-size:28px;font-weight:700;margin-bottom:14px}
  .dot{width:14px;height:14px;border-radius:50%;display:inline-block;flex:none}
  .phone{border-radius:64px;border:14px solid #000;outline:2px solid #34353C;overflow:hidden;background:#000}
  .phone img{display:block;width:100%}
  .side{display:flex;flex-direction:column;gap:30px;width:${CARD_W}px;flex:none}
  .detail{margin:0}
  .detail figcaption{display:flex;align-items:center;gap:10px;font-size:26px;font-weight:700;margin-bottom:12px;color:#E8E8EC}
  .card{width:${CARD_W}px;height:${CARD_H}px;overflow:hidden;border-radius:28px;outline:2px solid #34353C;background:#000}
  .card img{display:block;width:100%}
  .chips{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin-top:48px}
  .chip{font-size:28px;padding:12px 24px;border-radius:999px;border:2px solid #3A3B44;color:#D7D8DE}
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
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1320 / W });
const problems = [];
for (const L of LISTINGS.filter((l) => !only || only.includes(l.locale))) {
  if (!existsSync(path.join(raw, L.locale))) continue;
  const dir = path.join(out, L.folder);
  mkdirSync(dir, { recursive: true });
  for (const [i, base] of IOS_SHOTS.entries()) {
    const shot = { ...base, ...(OVERRIDES[L.locale]?.[base.id] ?? {}) };
    // 화면이 없는 세부 카드는 같은 장의 다른 화면으로 채우지 않고 뺀다(없는 장면을 보여 주지 않게).
    const details = shot.details.filter(([s]) => existsSync(path.join(raw, L.locale, `${s}.png`)));
    if (!existsSync(path.join(raw, L.locale, `${shot.main}.png`)) || details.length === 0) {
      problems.push(`${L.locale}/${shot.id}: 화면 없음 (${[shot.main, ...shot.details.map(([s]) => s)].filter((s) => !existsSync(path.join(raw, L.locale, `${s}.png`))).join(", ")})`);
      continue;
    }
    const used = { ...shot, details };
    const scenes = [used.main, ...details.map(([s]) => s)];
    const files = Object.fromEntries(scenes.map((s) => [s, uri(path.join(raw, L.locale, `${s}.png`))]));
    await page.setContent(html(L, used, i, files), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      const fit = (el, start, min, maxLines) => {
        const lines = () => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight));
        for (let size = start; lines() > maxLines && size > min; size -= 2) el.style.fontSize = `${size - 2}px`;
      };
      fit(document.querySelector("h1"), 80, 54, 2);
      fit(document.querySelector(".sub"), 34, 24, 2);
    });
    const bottom = await page.evaluate(() => document.querySelector(".chips").getBoundingClientRect().bottom);
    if (bottom > H - 20) problems.push(`${L.locale}/${shot.id}: 아래가 ${Math.round(bottom)}px까지 — 넘침`);
    await page.screenshot({ path: path.join(dir, `${i + 1}-${shot.id}.png`) });
  }
}
await browser.close();
console.log(problems.length ? `확인할 것:\n${problems.join("\n")}` : "합성 끝, 넘친 것 없음");

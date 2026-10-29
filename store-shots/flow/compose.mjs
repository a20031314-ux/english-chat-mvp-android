// 스토어 학습 흐름 세트 합성(1080×1920): 1장 하루 흐름 → 2~5장 단계 하나씩 → 6~8장 세부 기능.
// 글: store-shots/flow/strings.mjs, 단계 이름: 앱 버튼 문구(copy.ts). 화면: tmp/store-raw/<locale>/<장면>.png
// (npm run build:capacitor 뒤 capture-whats-new.mjs store-flow — fastlane/STORE_AUTOMATION.md "스토어 학습 흐름 8장").
//
// 결과: store-shots/out/flow/<등록정보>/1~8-<장>.png. FLOW_ONLY=ko,ko-ja 로 일부만.
// Run: node --experimental-strip-types store-shots/flow/compose.mjs
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LISTINGS } from "../combo/strings.mjs";
import { loadUiCopy } from "../uiCopy.mjs";
import { COPY, KICKER, SHOTS } from "./strings.mjs";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const raw = path.join(root, "tmp", "store-raw");
const out = path.join(here, "..", "out", "flow");
const ui = await loadUiCopy(root);
const ACCENT = "#FFD15C";
const STEP_COLORS = ["#FFD15C", "#FF8A6B", "#7CC4FF", "#C6F25A"];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const uri = (file) => `data:image/png;base64,${readFileSync(file).toString("base64")}`;
const SRC_W = 824;
const SRC_H = 1830;

/** 앱 버튼 문구에서 단계 이름 넷(이모지 뺌). */
function stepNames(base) {
  const c = ui[base] ?? ui.en;
  const clean = (s) => String(s).replace(/^[^\p{L}\p{N}]+/u, "").trim();
  return [clean(c.planTitle), clean(c.scriptSay), clean(c.keepTitle), clean(c.homeTabTalk)];
}

/** 화면 한 장을 폭 w에, 위쪽 crop부터 높이 h만큼 보이게. */
function screen(file, w, h, crop, cls = "") {
  const scale = w / SRC_W;
  const y = crop * SRC_H * scale; // 화면보다 길면 아래는 검게(폰이 그림 밖으로 넘침)
  return `<div class="screen ${cls}" style="width:${w}px;height:${h}px"><img src="${file}" style="width:${w}px;transform:translateY(-${Math.max(0, y)}px)"></div>`;
}

const css = (L) => `
  html,body{margin:0}
  body{width:1080px;height:1920px;overflow:hidden;background:#14151A;color:#fff;font-family:${L.font};box-sizing:border-box;position:relative}
  .kicker{font-size:30px;font-weight:800;letter-spacing:.08em;color:${ACCENT};text-align:center}
  h1{margin:18px auto 0;font-size:80px;line-height:1.14;font-weight:900;text-align:center;letter-spacing:-.02em;white-space:pre-line;max-width:990px}
  .sub{margin:22px auto 0;font-size:34px;line-height:1.35;color:#B9BAC2;text-align:center;max-width:940px}
  .screen{overflow:hidden;background:#000}
  .screen img{display:block}
  .phone{position:absolute;left:50%;transform:translateX(-50%);border:16px solid #050507;border-bottom:0;border-radius:64px 64px 0 0;outline:2px solid #34353C;overflow:hidden}
  .phone .screen{border-radius:48px 48px 0 0}
  .bar{display:flex;gap:10px;justify-content:center;align-items:center;padding:0 40px}
  .pill{display:flex;align-items:center;gap:10px;font-size:25px;font-weight:700;color:#7C7E88;padding:10px 18px;border-radius:999px;border:2px solid #2C2D35;white-space:nowrap}
  .pill b{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#2C2D35;color:#9a9ca6;font-size:21px}
  .pill.on{color:#14151A;border-color:transparent}
  .pill.on b{background:#14151A}
  .pill.done{color:#C9CAD1}
  .arrow{color:#4A4B55;font-size:24px}
`;

function overviewHtml(L, shot, copy, names, files) {
  const [kicker, title, rows] = copy.overview;
  const k = KICKER[L.locale] ? `${KICKER[L.locale]} · ${kicker}` : kicker;
  const row = ([scene, crop], i) => `
    <div class="row">
      <div class="num" style="background:${STEP_COLORS[i]}">${i + 1}</div>
      <div class="txt"><div class="name" style="color:${STEP_COLORS[i]}">${esc(names[i])}</div><div class="desc">${esc(rows[i])}</div></div>
      <div class="thumb" style="outline-color:${STEP_COLORS[i]}55">${screen(files[scene], 340, 286, crop)}</div>
    </div>${i < 3 ? `<div class="link"></div>` : ""}`;
  return `<!doctype html><html lang="${L.lang}" dir="${L.dir ?? "ltr"}"><head><meta charset="utf-8"><style>${css(L)}
    body{padding:96px 56px 0}
    .rows{margin-top:56px;display:flex;flex-direction:column}
    .row{display:flex;align-items:center;gap:28px;background:#1C1D24;border-radius:36px;padding:22px 22px 22px 30px}
    .num{flex:none;width:72px;height:72px;border-radius:50%;display:grid;place-items:center;font-size:40px;font-weight:900;color:#14151A}
    .txt{flex:1;min-width:0}
    .name{font-size:28px;font-weight:800;margin-bottom:8px}
    .desc{font-size:38px;font-weight:800;line-height:1.25}
    .thumb{flex:none;border-radius:24px;overflow:hidden;outline:3px solid}
    .link{width:4px;height:28px;background:#34353C;margin:0 0 0 64px}
  </style></head><body>
    <div class="kicker">${esc(k)}</div><h1>${esc(title)}</h1>
    <div class="rows">${shot.rows.map(row).join("")}</div>
  </body></html>`;
}

function stepHtml(L, shot, copy, names, files) {
  const [title, sub] = copy[shot.id];
  const pills = names
    .map((n, i) => {
      const state = i === shot.step ? "on" : i < shot.step ? "done" : "";
      const style = i === shot.step ? ` style="background:${STEP_COLORS[i]}"` : "";
      return `<span class="pill ${state}"${style}><b>${i < shot.step ? "✓" : i + 1}</b>${esc(n)}</span>`;
    })
    .join(`<span class="arrow">›</span>`);
  const W = 780;
  // float = [장면, 위 끝, 아래 끝]: 화면 아래쪽에 크게 띄우는 카드(예: 지속 학습 카드 위에 푼 문제).
  let float = "";
  if (shot.float) {
    const [scene, from, to] = shot.float;
    const FW = 880;
    const scale = FW / SRC_W;
    const h = (to - from) * SRC_H * scale;
    float = `<div class="float" style="border-color:${STEP_COLORS[shot.step]}"><div class="screen" style="width:${FW}px;height:${h}px"><img src="${files[scene]}" style="width:${FW}px;transform:translateY(-${from * SRC_H * scale}px)"></div></div>`;
  }
  return `<!doctype html><html lang="${L.lang}" dir="${L.dir ?? "ltr"}"><head><meta charset="utf-8"><style>${css(L)}
    body{padding:84px 0 0}
    .float{position:absolute;left:50%;bottom:70px;transform:translateX(-50%);border:4px solid;border-radius:36px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.75),0 0 0 14px rgba(20,21,26,.9)}
  </style></head><body>
    <div class="bar">${pills}</div>
    <h1 style="margin-top:56px">${esc(title)}</h1>
    <p class="sub">${esc(sub)}</p>
    <div class="phone" data-follow style="top:620px">${screen(files[shot.scene], W, 1500, shot.crop)}</div>
    ${float}
  </body></html>`;
}

function detailHtml(L, shot, copy, files) {
  const [title, labels, sub] = copy[shot.id];
  const W = 486;
  const full = (SRC_H * W) / SRC_W;
  // 화면 아래 끝(입력칸·하단 탭)을 그림 아래 끝에 맞춘다 — 위쪽 상단바부터 잘린다. 높이는 배치 뒤 정함(data-full).
  const col = ([scene], i) => `<div class="col"><div class="label">${esc(labels[i])}</div>
      <div class="frame"><div class="screen" data-full="${full}" style="width:${W}px;height:${full}px"><img src="${files[scene]}" style="width:${W}px"></div></div></div>`;
  return `<!doctype html><html lang="${L.lang}" dir="${L.dir ?? "ltr"}"><head><meta charset="utf-8"><style>${css(L)}
    body{padding:100px 0 0}
    .cols{position:absolute;left:0;right:0;display:flex;justify-content:center;gap:34px;top:600px}
    .label{font-size:32px;font-weight:800;text-align:center;margin-bottom:22px;color:#E9E9EE}
    .frame{border:12px solid #050507;border-radius:48px;overflow:hidden;outline:2px solid #34353C}
    .frame .screen{border-radius:36px;position:relative}
    .frame .screen img{position:absolute;left:0;bottom:0}
  </style></head><body>
    <div class="kicker" style="color:#9A9CA6">${esc(copy.more)}</div>
    <h1>${esc(title)}</h1>
    ${sub ? `<p class="sub">${esc(sub)}</p>` : ""}
    <div class="cols" data-cols>${shot.scenes.map(col).join("")}</div>
  </body></html>`;
}

const only = process.env.FLOW_ONLY?.split(",");
const targets = LISTINGS.filter((L) => !only || only.includes(L.locale));
if (!only) rmSync(out, { recursive: true, force: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const problems = [];
for (const L of targets) {
  const base = L.locale.split("-")[0];
  const copy = COPY[base];
  if (!copy) {
    problems.push(`${L.locale}: 글 없음`);
    continue;
  }
  const names = stepNames(base);
  const dir = path.join(out, L.folder);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const [i, shot] of SHOTS.entries()) {
    const scenes = shot.kind === "overview" ? shot.rows.map(([s]) => s) : shot.kind === "step" ? [shot.scene, ...(shot.float ? [shot.float[0]] : [])] : shot.scenes.map(([s]) => s);
    const missing = scenes.filter((s) => !existsSync(path.join(raw, L.locale, `${s}.png`)));
    if (missing.length) {
      problems.push(`${L.locale}/${shot.id}: 화면 없음 ${missing.join(", ")}`);
      continue;
    }
    const files = Object.fromEntries(scenes.map((s) => [s, uri(path.join(raw, L.locale, `${s}.png`))]));
    const html = shot.kind === "overview" ? overviewHtml(L, shot, copy, names, files) : shot.kind === "step" ? stepHtml(L, shot, copy, names, files) : detailHtml(L, shot, copy, files);
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    // 긴 말: 제목 두 줄·설명 두 줄·단계 막대 한 줄·1장 설명 두 줄 안에 맞게 줄인다.
    await page.evaluate(() => {
      const lines = (el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight));
      const fit = (el, start, min, maxLines) => {
        if (!el) return;
        for (let size = start; lines(el) > maxLines && size > min; size -= 2) el.style.fontSize = `${size - 2}px`;
      };
      fit(document.querySelector("h1"), 80, 50, 2);
      fit(document.querySelector(".sub"), 34, 24, 2);
      document.querySelectorAll(".desc").forEach((el) => fit(el, 38, 26, 2));
      const bar = document.querySelector(".bar");
      if (bar) for (let size = 25; bar.scrollWidth > bar.clientWidth + 1 && size > 15; size -= 1) bar.querySelectorAll(".pill").forEach((p) => (p.style.fontSize = `${size - 1}px`));
    });
    // 글 아래에 화면을 붙인다: 단계 장은 설명 아래 60px, 세부 장은 제목 아래(라벨 포함) 화면을 아래 끝에 맞춰 키운다.
    await page.evaluate(() => {
      const textBottom = Math.max(...[...document.querySelectorAll("h1,.sub")].map((el) => el.getBoundingClientRect().bottom));
      const phone = document.querySelector("[data-follow]");
      if (phone) phone.style.top = `${Math.max(520, textBottom + 64)}px`;
      const cols = document.querySelector("[data-cols]");
      if (cols) {
        // 폰 둘을 글 아래 남은 자리 가운데에. 자리가 모자라면 화면 위쪽(상단바)부터 잘린다.
        const need = cols.getBoundingClientRect().height;
        const room = 1920 - textBottom;
        if (need + 120 > room) {
          const cut = need + 120 - room;
          cols.querySelectorAll("[data-full]").forEach((el) => (el.style.height = `${Number(el.dataset.full) - cut}px`));
          cols.style.top = `${textBottom + 70}px`;
        } else cols.style.top = `${textBottom + (room - need) / 2 + 10}px`;
      }
    });
    const over = await page.evaluate(() => {
      const bar = document.querySelector(".bar");
      const rows = document.querySelector(".rows");
      return { bar: bar ? bar.scrollWidth > bar.clientWidth + 1 : false, rows: rows ? rows.getBoundingClientRect().bottom : 0, h1: document.querySelector("h1").getBoundingClientRect().bottom, sub: document.querySelector(".sub")?.getBoundingClientRect().bottom ?? 0 };
    });
    if (over.bar) problems.push(`${L.locale}/${shot.id}: 단계 막대가 넘침`);
    if (over.rows > 1880) problems.push(`${L.locale}/${shot.id}: 흐름 칸이 ${Math.round(over.rows)}px까지`);
    if (shot.kind === "step" && over.sub > 640) problems.push(`${L.locale}/${shot.id}: 글이 길어 화면이 작아짐(${Math.round(over.sub)}px)`);
    await page.screenshot({ path: path.join(dir, `${i + 1}-${shot.id}.png`) });
  }
}
await browser.close();
console.log(problems.length ? `확인할 것:\n${problems.join("\n")}` : `${SHOTS.length}장 × ${targets.length}개 등록정보 합성, 넘친 것 없음`);

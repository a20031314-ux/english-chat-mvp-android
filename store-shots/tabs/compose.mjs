// 탭별 세부 기능 스크린샷: 실제 앱 화면(tmp/store-raw/<locale>/<장면>.png) 위에
// 그 언어 헤드라인을 올려 1080×1920 스토어 이미지로 만든다.
//
//   store-shots/out/tabs/<등록정보>/all/NN-<장면>.png   찍힌 장면 전부(탭 순서)
//   store-shots/out/tabs/<등록정보>/upload-8/1~8-…png   Play에 올릴 8장 추천
//
// 화면 찍기: npm run build:capacitor 뒤
//   CAPTURE_RUN=<새 이름> node --experimental-strip-types scripts/capture-whats-new.mjs store-my --only en,ko,ja,zh,es,hi
//   CAPTURE_RUN=<새 이름> node --experimental-strip-types scripts/capture-whats-new.mjs store-tabs --only en,ko,ja,zh,es,hi
// 그다음: node store-shots/tabs/compose.mjs
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { HEADS, LISTINGS, SCENES } from "./strings.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");
const raw = path.join(root, "tmp", "store-raw");
const out = path.join(here, "..", "out", "tabs");
const frame = readFileSync(path.join(here, "..", "frame.html"), "utf8");
const ACCENTS = ["#FF8A6B", "#7CC4FF", "#C6F25A", "#FFD15C"];
/** 올릴 8장: 첫 장은 기능을 넓게, 탭마다 하나 이상. */
const UPLOAD_8 = ["mapview", "chat-expression", "chat-ask", "growth", "mission", "meant", "video-study", "ledger"];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

rmSync(out, { recursive: true, force: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const problems = [];
for (const L of LISTINGS) {
  const heads = HEADS[L.locale];
  const all = path.join(out, L.folder, "all");
  const up = path.join(out, L.folder, "upload-8");
  mkdirSync(all, { recursive: true });
  mkdirSync(up, { recursive: true });
  for (const [i, scene] of SCENES.entries()) {
    const src = path.join(raw, L.locale, `${scene}.png`);
    if (!existsSync(src)) {
      problems.push(`${L.locale}/${scene}: 화면 없음`);
      continue;
    }
    const [kicker, title, subtitle] = heads[scene];
    const html = frame
      .replace("<html>", `<html lang="${L.lang}">`)
      .replaceAll("{{font}}", L.font)
      .replaceAll("{{accent}}", ACCENTS[i % ACCENTS.length])
      .replaceAll("{{kicker}}", esc(kicker))
      .replaceAll("{{title}}", esc(title))
      .replaceAll("{{subtitle}}", esc(subtitle))
      .replaceAll("{{screen}}", `data:image/png;base64,${readFileSync(src).toString("base64")}`);
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    // 큰 제목이 두 줄을 넘으면 글자를 줄인다(스페인어 같은 긴 말). 그래도 넘치면 보고.
    await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const lines = () => Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
      for (let size = 84; lines() > 2 && size > 56; size -= 4) h1.style.fontSize = `${size - 4}px`;
    });
    const lines = await page.evaluate(() => {
      const count = (el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight || "1"));
      const p = document.querySelector("p");
      return { h1: count(document.querySelector("h1")), p: Math.round(p.getBoundingClientRect().height / 44) };
    });
    if (lines.h1 > 2 || lines.p > 2) problems.push(`${L.locale}/${scene}: 제목 ${lines.h1}줄, 설명 ${lines.p}줄`);
    const png = await page.screenshot();
    const name = `${String(i + 1).padStart(2, "0")}-${scene}.png`;
    writeFileSync(path.join(all, name), png);
    const at = UPLOAD_8.indexOf(scene);
    if (at >= 0) writeFileSync(path.join(up, `${at + 1}-${scene}.png`), png);
  }
}
await browser.close();
console.log(problems.length ? `확인할 것:\n${problems.join("\n")}` : "모든 장면 합성, 넘친 글자 없음");

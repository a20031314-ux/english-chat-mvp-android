// My 큰 칸 "?" 설명 그림(2026-10-31, lib/guide/banks.ts SHOTS): 앱 언어마다 실제 화면을 찍어 public/guide/<앱 언어>/bank-*.webp.
// 순서(저장소 맨 위에서): npm run build:capacitor → node scripts/capture-bank-guide.mjs [ko,en,ja…]
// /api는 운영으로(시험 사용자 simcheck-bankshot-…, 끝나면 지움). 학습 언어는 영어(영어 앱이면 스페인어).
// ONLY=log node scripts/capture-bank-guide.mjs → Logbank 그림만(육각형 bank-log-week · 꼭짓점 bank-log-axis · 그날 bank-log-day, 2026-11-02 육각형 개편).
// Logbank 그림은 이 폰 기록(Quizbank 날마다·통화 차례 셈)을 넣어 육각형이 비지 않게 한다 — 서버 기록은 문장구조 둘·상황 하나 통과.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium, serve, state, api, ROOT } from "./ux-check/lib.mjs";

const LOCALES = ["ko", "en", "es", "ja", "zh", "th", "vi", "id", "hi", "ar", "fr", "it", "pt", "ru"];
const locales = process.argv[2] ? process.argv[2].split(",") : LOCALES;
const learnFor = (locale) => (locale === "en" ? "es" : "en");
const PORT = Number(process.env.PORT || 4560);
const ONLY = process.env.ONLY || "";
const server = await serve(PORT);
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const work = path.join(ROOT, "tmp", "bank-shots");
fs.mkdirSync(work, { recursive: true });

/** png → webp(너비 720 이하, 높이 1100 이하는 위쪽만). */
function toWebp(png, out) {
  execFileSync("python3", ["-c", `
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert("RGB")
if im.height>1100*im.width//720: im=im.crop((0,0,im.width,1100*im.width//720))
if im.width>720: im=im.resize((720,round(im.height*720/im.width)),Image.LANCZOS)
im.save(sys.argv[2],"WEBP",quality=82)
`, png, out]);
}

for (const locale of locales) {
  const learn = learnFor(locale);
  state.uid = `simcheck-bankshot-${Date.now().toString(36)}-${locale}`;
  await api("/api/learner/self-check", { language: learn, stage: `${learn}-1` });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark" });
  await ctx.addInitScript(([learn, locale]) => {
    localStorage.setItem("appTargetLanguage", learn);
    localStorage.setItem("appUiLocale", locale);
    localStorage.setItem("whatsNewSeenVersion", "9.99");
    localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true }));
  }, [learn, locale]);
  const page = await ctx.newPage();
  const outDir = path.join(ROOT, "public", "guide", locale);
  fs.mkdirSync(outDir, { recursive: true });
  const done = [];
  const save = async (name, target, clip) => {
    const png = path.join(work, `${locale}-${name}.png`);
    try {
      if (target) await target.screenshot({ path: png, timeout: 8000 });
      else await page.screenshot({ path: png, ...(clip ? { clip } : {}) });
      toWebp(png, path.join(outDir, `${name}.webp`));
      fs.rmSync(png, { force: true });
      done.push(name);
    } catch (error) {
      console.log(`${locale} ${name}: 못 찍음 ${String(error).slice(0, 80)}`);
    }
  };
  const wait = (ms) => page.waitForTimeout(ms);
  const close = async () => {
    await page.keyboard.press("Escape").catch(() => {});
    const x = page.locator('div.fixed button:has-text("✕")').last();
    if (await x.count()) await x.click({ timeout: 2000 }).catch(() => {});
    await wait(800);
  };

  await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 40 && !(await page.locator("[data-today-current]").count()); i += 1) await wait(500);
  await wait(3000);
  if (ONLY !== "log") {
  const stage = page.locator('[data-my-layer="stage"]').first();
  await stage.scrollIntoViewIfNeeded();
  // Stagebank = 맨 위 오늘 할 것 + 그 아래 단계 화면이 늘 펼쳐 있음(2026-11-02) — 칸 머리부터 오늘 할 것까지만.
  const stageBox = await stage.boundingBox();
  const todayBox = await page.locator("[data-stage-today]").first().boundingBox();
  if (stageBox && todayBox) await save("bank-stage-today", null, { x: stageBox.x, y: Math.max(0, stageBox.y), width: stageBox.width, height: Math.min(844, todayBox.y + todayBox.height + 12) - Math.max(0, stageBox.y) });
  else await save("bank-stage-today", stage);
  // 문장구조 수업(설명 › 퀴즈 › 대화) — 화면 전체.
  await page.locator("[data-today-current]").first().click().catch(() => {});
  await wait(6000);
  await save("bank-stage-lesson");
  await close();
  // 단계 화면(사다리·연습 방식·문장구조 목록 ☑ 이 단계 스킵) — 오늘 할 것 아래에 늘 펼쳐 있음(2026-11-02, 옛 "n단계 ›" 없음).
  // 닫으면 아래에 뜨는 다음 추천 줄은 그림에 안 들어가게 거둔다.
  await page.locator("[data-up-next-bar] button[aria-label]").first().click({ timeout: 1500 }).catch(() => {});
  const view = page.locator("[data-stage-view]").first();
  // 위에 붙는 칸 이름 줄(sticky)이 단계 사다리를 가리지 않게 이 그림 동안만 숨긴다.
  await page.evaluate(() => document.querySelectorAll("[data-my-jump]").forEach((el) => { el.style.visibility = "hidden"; }));
  await view.scrollIntoViewIfNeeded();
  await wait(1200);
  await save("bank-stage-ladder", view);
  await page.evaluate(() => document.querySelectorAll("[data-my-jump]").forEach((el) => { el.style.visibility = ""; }));
  // Quizbank: 문제 → 답한 뒤(뜻·예문·다음) → ⚙.
  // 칸 이름 줄이 탭(2026-11-02) — 그 칸을 누른 뒤에만 그려진다.
  await page.locator('[data-my-jump-to="keep"]').first().click().catch(() => {});
  await wait(1500);
  const keep = page.locator('[data-my-layer="keep"]').first();
  await keep.scrollIntoViewIfNeeded();
  for (let i = 0; i < 30 && !(await keep.locator("section[data-kind]").count()); i += 1) await wait(500);
  await wait(1500);
  await save("bank-keep-quiz", keep);
  const question = keep.locator("section[data-kind]").first();
  const kind = await question.getAttribute("data-kind").catch(() => null);
  if (kind === "choose") await question.locator("button.rounded-xl").first().click().catch(() => {});
  else {
    await question.locator("input").first().fill("the").catch(() => {});
    await question.locator("input").first().press("Enter").catch(() => {});
  }
  await wait(5000);
  await save("bank-keep-answer", keep);
  await keep.locator('[data-quiz-settings="keep"]').first().click().catch(() => {});
  await wait(1500);
  // ⚙는 아래에서 올라오는 시트라 화면 아래쪽.
  await save("bank-keep-settings", null, { x: 0, y: 844 - 470, width: 390, height: 470 });
  }
  // Logbank(2026-11-02 육각형): 서버 기록(문장구조 둘·상황 하나 통과) + 이 폰 기록(Quizbank 열흘·통화 둘)을 넣고 다시 연다.
  for (const id of [`${learn}-f1-01`, `${learn}-f1-02`, `${learn}-1-1`]) await api("/api/curriculum/scripts", { language: learn, id });
  await page.evaluate(([learn]) => {
    const now = Date.now();
    const day = (n) => { const d = new Date(now - n * 86400000); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
    const words = learn === "es" ? ["agua", "casa", "comer", "hablar", "grande", "tiempo", "libro", "perro", "noche", "trabajo"] : ["water", "house", "eat", "speak", "big", "time", "book", "dog", "night", "work"];
    const quiz = {};
    for (let i = 0; i < 10; i += 1) {
      const pick = (a, n) => Array.from({ length: n }, (_, k) => `w|${words[(i + a + k) % words.length]}`);
      quiz[day(i)] = { n: 14, right: 10, okc: pick(0, 4), okt: pick(3, 3), wrong: pick(7, 2), wt: pick(8, 1), miss: { [pick(8, 1)[0]]: "form" } };
    }
    const turns = (stage, smooth, snag, stuck) => ({ stage, turns: smooth + snag + stuck, smooth, snag, stuck, lead: 3, follow: smooth - 2, min: 2, asked: smooth + snag, heardYes: smooth, heardAfter: 1, why: { slow: snag, hint: stuck }, leadHow: { ask: 2, extend: 1 }, fn: { self: 4, time: 2 } });
    const calls = {
      a: { day: day(1), at: now - 86400000, seconds: 480, fixed: 2, redone: 1, turns: turns(2, 14, 4, 2) },
      b: { day: day(4), at: now - 4 * 86400000, seconds: 360, fixed: 1, redone: 0, turns: turns(1, 9, 3, 2) },
    };
    localStorage.setItem(`quizDays.v1.${learn}`, JSON.stringify(quiz));
    localStorage.setItem(`callDays.v1.${learn}`, JSON.stringify(calls));
    localStorage.setItem("fillCheck.v1", JSON.stringify({ [learn]: "beginner" }));
  }, [learn]);
  await page.reload({ waitUntil: "domcontentloaded" });
  for (let i = 0; i < 40 && !(await page.locator('[data-my-jump-to="log"]').count()); i += 1) await wait(500);
  await page.locator('[data-my-jump-to="log"]').first().click().catch(() => {});
  for (let i = 0; i < 40 && !(await page.locator("[data-skill-hexagon]").count()); i += 1) await wait(500);
  await wait(2500);
  const log = page.locator('[data-my-layer="log"]').first();
  await log.scrollIntoViewIfNeeded();
  await save("bank-log-week", log);
  // 꼭짓점(어휘 활용) → 게이지·세부 칸 [품사] 칩(▼ 부족이 보이게).
  await page.locator('[data-skill-axis="vocabUse"]').first().dispatchEvent("click").catch(() => {});
  for (let i = 0; i < 20 && !(await page.locator("[data-skill-detail]").count()); i += 1) await wait(300);
  await page.locator('[data-skill-tab="pos"]').first().click({ timeout: 3000 }).catch(() => {});
  await wait(1500);
  await save("bank-log-axis");
  await close();
  // ⏱ 한 줄 → 학습 시간 막대 → 오늘 막대 → 그날 세부.
  await page.locator("[data-log-time]").first().click().catch(() => {});
  await wait(800);
  const bars = page.locator("[data-log-bar]");
  const count = await bars.count();
  for (let i = count - 1; i >= 0; i -= 1) {
    const label = (await bars.nth(i).getAttribute("aria-label")) ?? "";
    if (/ [1-9]/.test(label)) { await bars.nth(i).click().catch(() => {}); break; }
  }
  for (let i = 0; i < 20 && !(await page.locator("[data-log-sheet]").count()); i += 1) await wait(300);
  await wait(1500);
  await save("bank-log-day");
  await close();
  console.log(`${locale}: ${done.length}/${ONLY === "log" ? 3 : 9} ${done.join(" ")}`);
  await api("/api/simcheck/forget", { prefix: state.uid });
  await ctx.close();
}
await browser.close();
server.close();
fs.rmSync(work, { recursive: true, force: true });

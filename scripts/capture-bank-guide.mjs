// My 큰 칸 "?" 설명 그림(2026-10-31, lib/guide/banks.ts SHOTS): 앱 언어마다 실제 화면을 찍어 public/guide/<앱 언어>/bank-*.webp.
// 순서(저장소 맨 위에서): npm run build:capacitor → node scripts/capture-bank-guide.mjs [ko,en,ja…]
// /api는 운영으로(시험 사용자 simcheck-bankshot-…, 끝나면 지움). 학습 언어는 영어(영어 앱이면 스페인어).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium, serve, state, api, ROOT } from "./ux-check/lib.mjs";

const LOCALES = ["ko", "en", "es", "ja", "zh", "th", "vi", "id", "hi", "ar", "fr", "it", "pt", "ru"];
const locales = process.argv[2] ? process.argv[2].split(",") : LOCALES;
const learnFor = (locale) => (locale === "en" ? "es" : "en");
const PORT = Number(process.env.PORT || 4560);
const server = await serve(PORT);
const browser = await chromium.launch();
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
  const stage = page.locator('[data-my-layer="stage"]').first();
  await stage.scrollIntoViewIfNeeded();
  await save("bank-stage-today", stage);
  // 문장구조 수업(설명 › 퀴즈 › 대화) — 화면 전체.
  await page.locator("[data-today-current]").first().click().catch(() => {});
  await wait(6000);
  await save("bank-stage-lesson");
  await close();
  // 단계 화면(사다리·연습 방식·다음 단계까지).
  await page.locator("[data-peek-stage]").first().click().catch(() => {});
  await wait(2500);
  await stage.scrollIntoViewIfNeeded();
  await save("bank-stage-ladder", stage);
  await page.locator("[data-back-today]").first().click().catch(() => {});
  await wait(1000);
  // Quizbank: 문제 → 답한 뒤(뜻·예문·다음) → ⚙.
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
  // Logbank: 문장구조 둘·상황 하나 통과로 기록을 만든 뒤 다시 연다.
  for (const id of [`${learn}-f1-01`, `${learn}-f1-02`, `${learn}-1-1`]) await api("/api/curriculum/scripts", { language: learn, id });
  await page.reload({ waitUntil: "domcontentloaded" });
  for (let i = 0; i < 40 && !(await page.locator("[data-log-week]").count()); i += 1) await wait(500);
  await wait(1500);
  const log = page.locator('[data-my-layer="log"]').first();
  await log.scrollIntoViewIfNeeded();
  await save("bank-log-week", log);
  await save("bank-log-day", page.locator("[data-log-day]").first());
  console.log(`${locale}: ${done.length}/8 ${done.join(" ")}`);
  await api("/api/simcheck/forget", { prefix: state.uid });
  await ctx.close();
}
await browser.close();
server.close();
fs.rmSync(work, { recursive: true, force: true });

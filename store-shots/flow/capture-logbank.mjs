// 스토어 4장 Logbank(2026-11-02 사용자 "스토어 스크린샷도 Logbank 부분만 — 04 지속 학습 자리 교체"): 화면 둘만 찍는다.
//   logbank-hex  = Logbank 전체 화면(육각형 · ⏱ 한 줄)
//   logbank-axis = 꼭짓점(어휘 활용) 화면 [품사] 칩
// www + 운영 /api(시험 사용자 simcheck-storelog-…, 끝나면 지움). 서버 기록(문장구조 둘·상황 하나 통과) + 이 폰 Quizbank 열흘·통화 둘.
// 순서(저장소 맨 위): npm run build:capacitor → node store-shots/flow/capture-logbank.mjs [ko,en,ja,zh,es,hi]
//   → FLOW_ONLY=… node --experimental-strip-types store-shots/flow/compose.mjs (4-logbank만 나옴 — 다른 장은 화면이 없어 건너뜀)
// 결과 화면: tmp/store-raw/<locale>/logbank-*.png (824×1830, 다른 장면과 같은 크기).
import fs from "node:fs";
import path from "node:path";
import { chromium, serve, state, api, ROOT } from "../../scripts/ux-check/lib.mjs";

const locales = (process.argv[2] ?? "ko,en,ja,zh,es,hi").split(",");
const learnFor = (locale) => (locale === "en" ? "es" : "en");
const PORT = Number(process.env.PORT || 4590);
const server = await serve(PORT);
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});

for (const locale of locales) {
  const learn = learnFor(locale);
  state.uid = `simcheck-storelog-${Date.now().toString(36)}-${locale}`;
  await api("/api/learner/self-check", { language: learn, stage: `${learn}-1` });
  for (const id of [`${learn}-f1-01`, `${learn}-f1-02`, `${learn}-1-1`]) await api("/api/curriculum/scripts", { language: learn, id });
  const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: "dark" });
  await ctx.addInitScript(([learn, locale]) => {
    if (localStorage.getItem("appUiLocale")) return;
    localStorage.setItem("appTargetLanguage", learn);
    localStorage.setItem("appUiLocale", locale);
    localStorage.setItem("whatsNewSeenVersion", "9.99");
    localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true }));
    const now = Date.now();
    const day = (n) => { const d = new Date(now - n * 86400000); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
    const words = learn === "es" ? ["agua", "casa", "comer", "hablar", "grande", "tiempo", "libro", "perro", "noche", "trabajo"] : ["water", "house", "eat", "speak", "big", "time", "book", "dog", "night", "work"];
    const quiz = {};
    for (let i = 0; i < 10; i += 1) {
      const pick = (a, n) => Array.from({ length: n }, (_, k) => `w|${words[(i + a + k) % words.length]}`);
      // 대부분 맞힘(그림이 비지 않게), 틀림은 날마다 하나.
      quiz[day(i)] = { n: 12, right: 11, okc: pick(0, 6), okt: pick(2, 5), wrong: pick(8, 1), wt: pick(8, 1), miss: { [pick(8, 1)[0]]: "form" } };
    }
    const turns = (stage, smooth, snag, stuck) => ({ stage, turns: smooth + snag + stuck, smooth, snag, stuck, lead: 3, follow: smooth - 2, min: 2, asked: smooth + snag, heardYes: smooth, heardAfter: 1, why: { slow: snag, hint: stuck }, leadHow: { ask: 2, extend: 1 }, fn: { self: 4, time: 2 } });
    localStorage.setItem(`quizDays.v1.${learn}`, JSON.stringify(quiz));
    localStorage.setItem(`callDays.v1.${learn}`, JSON.stringify({
      a: { day: day(1), at: now - 86400000, seconds: 480, fixed: 2, redone: 1, turns: turns(3, 22, 4, 1) },
      b: { day: day(4), at: now - 4 * 86400000, seconds: 360, fixed: 1, redone: 0, turns: turns(2, 16, 3, 1) },
    }));
    localStorage.setItem("fillCheck.v1", JSON.stringify({ [learn]: "mid" }));
  }, [learn, locale]);
  const page = await ctx.newPage();
  const wait = (ms) => page.waitForTimeout(ms);
  const outDir = path.join(ROOT, "tmp", "store-raw", locale);
  fs.mkdirSync(outDir, { recursive: true });
  await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 40 && !(await page.locator('[data-my-jump-to="log"]').count()); i += 1) await wait(500);
  await page.locator('[data-my-jump-to="log"]').first().click().catch(() => {});
  for (let i = 0; i < 40 && !(await page.locator("[data-skill-hexagon]").count()); i += 1) await wait(500);
  await page.locator('[data-my-layer="log"] [data-my-enlarge]').first().click().catch(() => {});
  await wait(2500);
  await page.screenshot({ path: path.join(outDir, "logbank-hex.png") });
  await page.locator('[data-skill-axis="vocabUse"]').first().dispatchEvent("click").catch(() => {});
  for (let i = 0; i < 20 && !(await page.locator("[data-skill-detail]").count()); i += 1) await wait(300);
  await page.locator('[data-skill-tab="pos"]').first().click({ timeout: 3000 }).catch(() => {});
  await wait(1500);
  await page.screenshot({ path: path.join(outDir, "logbank-axis.png") });
  console.log(`${locale}: ${fs.readdirSync(outDir).filter((f) => f.startsWith("logbank-")).join(" ")}`);
  await api("/api/simcheck/forget", { prefix: state.uid });
  await ctx.close();
}
await browser.close();
server.close();

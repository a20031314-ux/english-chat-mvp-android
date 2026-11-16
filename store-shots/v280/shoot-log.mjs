// 스토어 Logbank 장 재료: 학습 곡선(그래프)을 찍는다. 한 번 찍은 시험 사용자에겐 답한 날이 하루뿐이라 곡선이 안 그려져서,
// 이 폰 사건 장부(logbank.v1.<학습 언어>, curriculum/logLedger.ts)에 지난 14일 퀴즈 답을 넣어 둔 화면이다(보여 주기용 — 서버엔 아무것도 안 남김).
// 저장소 맨 위에서(npm run build:capacitor 뒤): LOCALE=ko node store-shots/v280/shoot-log.mjs → tmp/guide-slides/raw/<앱 언어>/log-curve.png
import fs from "node:fs";
import { chromium, serve, state, api } from "../../scripts/ux-check/lib.mjs";

const LOCALE = process.env.LOCALE || "ko";
const LEARN = LOCALE === "en" ? "es" : "en";
const PORT = Number(process.env.PORT || 4576), OUT = `tmp/guide-slides/raw/${LOCALE}`;
fs.mkdirSync(OUT, { recursive: true });

// 날마다 [푼 수, 맞힌 비율] — 오래된 날부터, 마지막이 오늘.
const DAYS = [[8, 0.5], [12, 0.55], [10, 0.55], [16, 0.6], [14, 0.62], [18, 0.6], [15, 0.62], [20, 0.66], [24, 0.7], [20, 0.74], [26, 0.76], [30, 0.8], [27, 0.84], [28, 0.86]];
// 날마다 통화·채팅에서 쓴 수(활용) — 선이 지금까지 활용 누적.
const USED = [0, 1, 1, 2, 1, 2, 2, 3, 2, 3, 3, 4, 3, 4];
const KEYS = ["w|man", "w|people", "w|friend", "w|family", "w|meet", "w|life", "w|time", "w|work", "g|be-present", "g|past-simple", "g|article", "e|how-are-you", "e|nice-to-meet", "f|i-want-to", "f|can-i"];
const rows = [];
const now = Math.floor(Date.now() / 1000);
let seq = 0;
DAYS.forEach(([n, rate], back) => {
  const day = now - (DAYS.length - 1 - back) * 86400 - 3600;
  for (let i = 0; i < n; i++) {
    const key = KEYS[seq++ % KEYS.length];
    rows.push([key, "quiz", i < Math.round(n * rate) ? "ok" : "miss", "pick", day + i * 40]);
  }
  for (let i = 0; i < USED[back]; i++) rows.push([KEYS[(back * 3 + i) % KEYS.length], "call", "used", "", day + 2000 + i * 60]);
});

const server = await serve(PORT);
const browser = await chromium.launch();
state.uid = `simcheck-storelog-${Date.now().toString(36)}`;
await api("/api/learner/self-check", { language: LEARN, stage: `${LEARN}-1` });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark" });
await ctx.addInitScript(([learn, locale, ledger]) => {
  localStorage.setItem("appTargetLanguage", learn); localStorage.setItem("appUiLocale", locale);
  localStorage.setItem("whatsNewSeenVersion", "9.99"); localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true }));
  if (!localStorage.getItem(`logbank.v1.${learn}`)) localStorage.setItem(`logbank.v1.${learn}`, JSON.stringify({ v: 1, migrated: true, rows: ledger }));
}, [LEARN, LOCALE, rows]);
const page = await ctx.newPage();
const wait = (ms) => page.waitForTimeout(ms);
await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
for (let i = 0; i < 40 && !(await page.locator('[data-my-jump-to="log"]').count()); i++) await wait(500);
await wait(2500);
if (await page.locator("[data-first-skip]").count()) { await page.locator("[data-first-skip]").first().click().catch(() => {}); await wait(2500); }
await page.locator('[data-my-jump-to="log"]').first().click(); await wait(1500);
await page.locator('[data-my-layer="log"] [data-my-enlarge]').first().dispatchEvent("click"); await wait(3000);
// 주는 월요일부터라 지난 날이 안 들어갈 수 있다 — 월로 바꿔 지난 7일이 다 들어가게.
await page.locator("[data-log-period] button").nth(1).dispatchEvent("click").catch(() => {}); await wait(2000);
const curve = page.locator("[data-learn-curve]").first();
for (let i = 0; i < 20 && !(await curve.count()); i++) await wait(500);
if (await curve.count()) {
  await curve.evaluate((el) => el.scrollIntoView({ block: "center" })); await wait(800);
  await curve.screenshot({ path: `${OUT}/log-curve.png` });
  console.log("찍음 log-curve");
} else {
  await page.screenshot({ path: `${OUT}/log-curve-failed.png` });
  console.log("곡선 없음");
}
await api("/api/simcheck/forget", { prefix: "storelog-" }).catch(() => {});
await browser.close();
server.close?.();
process.exit(0);

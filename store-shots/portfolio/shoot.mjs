// 포트폴리오 표지·기능 장(2026-11-18). 저장소 밖 빈 폴더에서 playwright 설치 뒤 shoot.mjs → call.mjs → build.mjs 순서(경로 raw/·out/은 그 폴더 기준, shoot.mjs의 OUT도 맞춰 고칠 것). 운영 웹을 찍고 시험 사용자 simcheck-portfolio-…는 끝에 지움. Logbank 숫자·곡선은 이 폰 장부에 넣은 보여 주기용 기록.
// 포트폴리오용 전체 화면 캡처 — 운영 웹(www.languagebank.net)을 폰 크기로, 시험 사용자 simcheck-portfolio-… (끝나면 지움).
import { chromium } from "playwright";
import fs from "node:fs";
const API = "https://www.languagebank.net";
const UID = `simcheck-portfolio-${Date.now().toString(36)}`;
const LEARN = "en", LOC = "ko", OUT = "/home/claude/pf/raw";
fs.mkdirSync(OUT, { recursive: true });
const api = async (p, body) => { const r = await fetch(API + p, { method: "POST", headers: { "content-type": "application/json", "x-rc-user": UID, "x-app-version": "2.80.0" }, body: JSON.stringify(body ?? {}) }); return r.status; };
console.log("self-check", await api("/api/learner/self-check", { language: LEARN, stage: `${LEARN}-2` }));

// 지난 14일 장부(보여 주기용, 이 폰 localStorage만)
const DAYS = [[8, 0.5], [12, 0.55], [10, 0.55], [16, 0.6], [14, 0.62], [18, 0.6], [15, 0.62], [20, 0.66], [24, 0.7], [20, 0.74], [26, 0.76], [30, 0.8], [27, 0.84], [14, 0.86]];
const USED = [0, 1, 1, 2, 1, 2, 2, 3, 2, 3, 3, 4, 3, 2];
const KEYS = ["w|man", "w|people", "w|friend", "w|family", "w|meet", "w|life", "w|time", "w|work", "w|beach", "w|weekend", "w|coffee", "w|movie", "w|travel", "w|busy", "w|happy", "w|always", "w|tomorrow"];
const rows = []; const now = Math.floor(Date.now() / 1000); let seq = 0;
DAYS.forEach(([n, rate], back) => {
  const day = now - (DAYS.length - 1 - back) * 86400 - 3600;
  for (let i = 0; i < n; i++) rows.push([KEYS[seq++ % KEYS.length], "quiz", i < Math.round(n * rate) ? "ok" : "miss", "pick", day + i * 40]);
  for (let i = 0; i < USED[back]; i++) rows.push([KEYS[(back * 3 + i) % KEYS.length], "call", "used", "", day + 2000 + i * 60]);
});

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: "dark", locale: "ko-KR" });
await ctx.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": UID, "x-app-version": "2.80.0" } }));
await ctx.addInitScript(([l, u, ledger]) => {
  localStorage.setItem("appTargetLanguage", l); localStorage.setItem("appUiLocale", u);
  localStorage.setItem("whatsNewSeenVersion", "9.99"); localStorage.removeItem("resumeSpot.v1"); localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true }));
  if (!localStorage.getItem(`logbank.v1.${l}`)) localStorage.setItem(`logbank.v1.${l}`, JSON.stringify({ v: 1, migrated: true, rows: ledger }));
}, [LEARN, LOC, rows]);
const page = await ctx.newPage();
const wait = (ms) => page.waitForTimeout(ms);
const shot = async (name) => { await wait(800); await page.screenshot({ path: `${OUT}/${name}.png` }); console.log("찍음", name); };
const openMy = async () => {
  await page.goto(`${API}/?screen=map`, { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 40 && !(await page.locator('[data-my-jump-to="keep"], [data-first-skip]').count()); i++) await wait(500);
  await wait(2500);
  if (await page.locator("[data-first-skip]").count()) { await page.locator("[data-first-skip]").first().click().catch(() => {}); await wait(3000); }
  for (let i = 0; i < 20 && !(await page.locator('[data-my-jump-to="keep"]').count()); i++) await wait(500);
  await wait(1500);
};
const enlarge = async (k) => {
  await page.locator(`[data-my-jump-to="${k}"]`).first().dispatchEvent("click"); await wait(1500);
  await page.locator(`[data-my-layer="${k}"] [data-my-enlarge]`).first().dispatchEvent("click"); await wait(3000);
};

if (!process.env.SKIP_QUIZ) {
// 1. My 첫 화면
await openMy();
await shot("my-home");
await page.mouse.wheel(0, 500); await shot("my-home-2");

if (process.env.ONLY_MY) { await api("/api/simcheck/forget", { prefix: "portfolio-" }); await browser.close(); process.exit(0); }
// 2. Quizbank
await openMy(); await enlarge("keep");
const q = () => page.locator("section[data-kind]").first();
for (let i = 0; i < 40 && !(await q().count()); i++) await wait(500);
await wait(1500);
await shot("quiz-1");
const kinds = new Set(); let after = false;
for (let n = 0; n < 25 && (kinds.size < 3 || !after); n++) {
  const one = q(); if (!(await one.count())) { await wait(2000); continue; }
  const kind = await one.getAttribute("data-kind");
  const meta = JSON.parse((await one.getAttribute("data-quiz-meta")) || "{}");
  await one.evaluate((el) => el.scrollIntoView({ block: "center" })).catch(() => {});
  if (!kinds.has(kind)) { kinds.add(kind); await shot(`quiz-${kind}`); }
  try {
    if (kind === "choose" || kind === "meaning") await one.locator("button.rounded-xl").nth(Number(meta.answer ?? 0)).click({ timeout: 3000 });
    else if (kind === "type") { const inp = one.locator("input").first(); await inp.fill(String(meta.right ?? meta.answer ?? "a")); await inp.press("Enter"); }
    else if (await one.locator("[data-quiz-giveup]").count()) await one.locator("[data-quiz-giveup]").first().click({ timeout: 3000 });
  } catch { console.log("답 실패", kind); }
  await wait(3000);
  if (!after && (await one.locator("[data-quiz-again]").count())) { after = true; await shot(`quiz-after-${kind}`); }
  const next = one.locator("button", { hasText: /^(다음|다음 ›)$/ }).last();
  if (await next.count()) await next.click().catch(() => {});
  await wait(1500);
}
console.log("모양", [...kinds]);
}

// 3. Logbank
await openMy(); await enlarge("log");
for (let i = 0; i < 20 && !(await page.locator("[data-learned-table]").count()); i++) await wait(500);
await shot("log-1");
await page.locator("[data-log-period] button").nth(1).dispatchEvent("click").catch(() => {}); await wait(2000);
const curve = page.locator("[data-learn-curve]").first();
if (await curve.count()) { await curve.evaluate((el) => el.scrollIntoView({ block: "center" })); await shot("log-curve"); }
await page.locator("[data-day-row]").first().dispatchEvent("click").catch(() => {}); await wait(3000);
await shot("log-day");

// 4. Languagebank
await openMy(); await enlarge("lang");
await shot("lang-1");
const lk = page.locator("[data-lb-kind]");
await lk.nth(0).locator("button").first().click().catch(() => {}); await wait(2500);
await page.locator("[data-lb-cell]").first().click().catch(() => {}); await wait(2500);
await shot("lang-bundle");
const bundle = page.locator("[data-lb-bundle]").first();
await bundle.locator("[data-lb-flip]").first().click().catch(() => {}); await wait(2500);
await shot("lang-flip");

// 5. 통화 미리 보기(운영 /dev/call-preview, 마이크 없이)
for (const [name, qs] of [["call-fix", "v=ai&card=fix&quiet=1&caption=1"], ["call-lesson", "v=ai&card=fix"], ["call-end", "v=ai-end&note=1"]]) {
  await page.goto(`${API}/dev/call-preview?${qs}&lang=ko&learn=en`, { waitUntil: "domcontentloaded" }); await wait(5000); await shot(name);
}

console.log("forget", await api("/api/simcheck/forget", { prefix: "portfolio-" }));
await browser.close();

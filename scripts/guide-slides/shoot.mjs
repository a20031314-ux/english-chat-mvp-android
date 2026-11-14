// 사용법 넘겨 보기 장면(lib/guide/slides.ts)의 재료 — 실제 앱에서 기능이 보이는 부분만 잘라 찍는다(겹쳐 그리기 없음).
// 저장소 맨 위에서: npm run build:capacitor → node scripts/guide-slides/shoot.mjs → node scripts/guide-slides/compose.mjs
// 지금은 한국어 앱 · 영어 학습(시험 사용자 simcheck-guidemy-…, 끝나면 지움). 다른 앱 언어는 문구(copy)로 고르는 자리를 바꿔야 한다("다음" 버튼·"문장" 물음).
import fs from "node:fs";
import { chromium, serve, state, api } from "../ux-check/lib.mjs";
const PORT = 4575, OUT = "tmp/guide-slides/raw";
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const server = await serve(PORT);
const browser = await chromium.launch();
state.uid = `simcheck-guidemy-${Date.now().toString(36)}`;
await api("/api/learner/self-check", { language: "en", stage: "en-1" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark" });
await ctx.addInitScript(() => {
  localStorage.setItem("appTargetLanguage", "en"); localStorage.setItem("appUiLocale", "ko");
  localStorage.setItem("whatsNewSeenVersion", "9.99"); localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true }));
});
const page = await ctx.newPage();
const wait = (ms) => page.waitForTimeout(ms);
const got = [];
async function cut(name, locators, { maxH = 520, pad = 10 } = {}) {
  let b = null;
  for (const l of locators) {
    await l.evaluate((el) => el.scrollIntoView({ block: "center" })).catch(() => {});
  }
  await wait(500);
  for (const l of locators) {
    const o = await l.boundingBox().catch(() => null);
    if (!o) continue;
    b = b ? { x: Math.min(b.x, o.x), y: Math.min(b.y, o.y), r: Math.max(b.r, o.x + o.width), bt: Math.max(b.bt, o.y + o.height) } : { x: o.x, y: o.y, r: o.x + o.width, bt: o.y + o.height };
  }
  if (!b) { console.log("못 찍음", name); return; }
  const x = Math.max(0, b.x - pad), y = Math.max(0, b.y - pad);
  const w = Math.min(390, b.r + pad) - x, h = Math.min(844 - y, Math.min(maxH, b.bt + pad - y));
  await page.screenshot({ path: `${OUT}/${name}.png`, clip: { x, y, width: w, height: h } });
  got.push(name); console.log("찍음", name, Math.round(w), Math.round(h));
}
const top = (l, off = 120) => l.evaluate((el, off) => { el.scrollIntoView({ block: "start" }); (el.closest("[data-my-full]") ?? document.scrollingElement).scrollBy?.(0, -off); }, off).catch(() => {});

await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
for (let i = 0; i < 40 && !(await page.locator('[data-my-jump-to="keep"]').count()); i++) await wait(500);
await wait(3000);

// Quizbank
await page.locator('[data-my-jump-to="keep"]').first().click(); await wait(1500);
await page.locator('[data-my-layer="keep"] [data-my-enlarge]').first().click(); await wait(2000);
const q = () => page.locator("section[data-kind]").first();
for (let i = 0; i < 40 && !(await q().count()); i++) await wait(500);
await wait(1500);
await cut("keep-core", [page.locator("[data-quiz-gauge]").first(), q()]);
for (let k = 0; k < 2; k++) { await page.locator("[data-quiz-gauge] button").last().click().catch(() => {}); await wait(2500); }
const kinds = new Set(); let after = false;
for (let n = 0; n < 30 && (n < 12 || kinds.size < 4); n++) {
  const one = q();
  if (!(await one.count())) { await wait(2000); continue; }
  const kind = await one.getAttribute("data-kind");
  const meta = JSON.parse((await one.getAttribute("data-quiz-meta")) || "{}");
  await top(one); await wait(500);
  if (["meaning", "spot", "type", "spots", "order"].includes(kind) && !kinds.has(kind)) { kinds.add(kind); await cut(`type-${kind}`, [q()], { maxH: 380 }); }
  try {
    if (kind === "choose" || kind === "meaning") await one.locator("button.rounded-xl").nth(Number(meta.answer ?? 0)).click({ timeout: 3000 });
    else if (kind === "type") { const inp = one.locator("input").first(); await inp.fill(String(meta.right ?? meta.answer ?? "a")); await inp.press("Enter"); }
    else if (await one.locator("[data-spot-words] button").count()) {
      for (let t = 0; t < 4; t++) {
        const b = one.locator("[data-spot-words] button:not([disabled])");
        if (!(await b.count()) || (await one.locator("button", { hasText: /^다음$/ }).count())) break;
        await b.nth(t).click({ timeout: 2000 }).catch(() => {}); await wait(800);
      }
      if (!(await one.locator("button", { hasText: /^다음$/ }).count()) && (await one.locator("[data-quiz-giveup]").count())) await one.locator("[data-quiz-giveup]").first().click({ timeout: 2000 }).catch(() => {});
    } else if (await one.locator("[data-quiz-giveup]").count()) await one.locator("[data-quiz-giveup]").first().click({ timeout: 3000 });
  } catch (e) { console.log("답 실패", kind); }
  await wait(3500);
  if (!after && (await one.locator("[data-quiz-again]").count())) { after = true; await top(one, 60); await cut("keep-after", [q()], { maxH: 460 }); }
  const next = one.locator("button", { hasText: /^다음$/ }).last();
  if (await next.count()) await next.click().catch(() => {});
  await wait(1500);
}
await page.locator("[data-my-full-close]").first().click().catch(() => {}); await wait(2000);

// Logbank
await page.locator('[data-my-jump-to="log"]').first().click(); await wait(1500);
await page.locator('[data-my-layer="log"] [data-my-enlarge]').first().click(); await wait(3000);
for (let i = 0; i < 20 && !(await page.locator("[data-learned-table]").count()); i++) await wait(500);
await cut("log-core", [page.locator("[data-log-period]").first()], { maxH: 360 });
await page.locator("[data-day-row]").first().click(); await wait(3000);
await cut("log-timeline", [page.locator("[data-timeline]").first()], { maxH: 400 });
const open = page.locator("[data-timeline-open]").first();
if (await open.count()) { await open.click(); await wait(2500); await top(page.locator("[data-timeline-session]").first(), 10); await wait(400); await cut("log-session", [page.locator("[data-timeline-session]").first()], { maxH: 420 }); }

// Languagebank
await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
for (let i = 0; i < 40 && !(await page.locator('[data-my-jump-to="lang"]').count()); i++) await wait(500);
await wait(2500);
if (await page.locator("[data-my-full-close]").count()) { await page.locator("[data-my-full-close]").first().click().catch(() => {}); await wait(1500); }
await page.locator('[data-my-jump-to="lang"]').first().click(); await wait(1500);
await page.locator('[data-my-layer="lang"] [data-my-enlarge]').first().click(); await wait(3000);
const lk = page.locator("[data-lb-kind]");
await cut("lang-core", [page.locator("[data-lb-search]").first(), lk.nth(0), lk.nth(2)], { maxH: 640 });
await lk.nth(0).locator("button").first().click(); await wait(2500);
await page.locator("[data-lb-cell]").first().click(); await wait(2500);
const bundle = page.locator("[data-lb-bundle]").first();
await top(bundle, 20); await wait(500);
await cut("lang-bundle", [bundle], { maxH: 300 });
await bundle.locator("[data-lb-flip]").first().click(); await wait(2500);
await cut("lang-flip", [page.locator("[data-flip-card]").first()], { maxH: 420 });
await page.locator("[data-flip-reveal]").first().click().catch(() => {}); await wait(1500);
await cut("lang-flip-open", [page.locator("[data-bank-flip]").first()], { maxH: 640 });
await page.keyboard.press("Escape"); await wait(800);
const x = page.locator("[data-bank-flip] button", { hasText: "✕" }).first();
if (await x.count()) { await x.click().catch(() => {}); await wait(800); }
await bundle.locator("button.rounded-lg.border").filter({ hasNotText: /퀴즈|대화/ }).first().click().catch(() => {});
await wait(3500);
await cut("lang-word", [page.locator("[data-dictionary-entry], [data-dictionary-card]").first()], { maxH: 460 });

console.log("모양", [...kinds]);
await api("/api/simcheck/forget", { prefix: "guidemy-" });
await ctx.close(); await browser.close(); server.close();

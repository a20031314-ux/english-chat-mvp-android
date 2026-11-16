import fs from "node:fs";
import { chromium, serve, state, api } from "../../scripts/ux-check/lib.mjs";
const PORT = 4572, OUT = "tmp/guide-my/explore";
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const server = await serve(PORT);
const browser = await chromium.launch();
state.uid = `simcheck-guidemy-${Date.now().toString(36)}`;
await api("/api/learner/self-check", { language: "en", stage: "en-1" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark" });
await ctx.addInitScript(() => { localStorage.setItem("appTargetLanguage", "en"); localStorage.setItem("appUiLocale", "ko"); localStorage.setItem("whatsNewSeenVersion", "9.99"); localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true })); });
const page = await ctx.newPage();
const wait = (ms) => page.waitForTimeout(ms);
await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
await wait(8000);
await page.locator('[data-my-jump-to="keep"]').first().click();
const keep = page.locator('[data-my-layer="keep"]').first();
for (let i = 0; i < 30 && !(await keep.locator("section[data-kind]").count()); i++) await wait(500);
const log = [];
for (let n = 0; n < 16; n++) {
  const q = keep.locator("section[data-kind]").first();
  if (!(await q.count())) { log.push(`${n} no question`); await wait(3000); continue; }
  const kind = await q.getAttribute("data-kind"); const meta = JSON.parse((await q.getAttribute("data-quiz-meta")) || "{}");
  const key = await q.getAttribute("data-quiz-key");
  await keep.evaluate((el) => el.scrollIntoView({ block: "start" })); await page.evaluate(() => window.scrollBy(0, -60));
  await page.screenshot({ path: `${OUT}/${String(n).padStart(2, "0")}a-${kind}.png` });
  let did = "none";
  try {
    if (kind === "choose" || kind === "meaning") { await q.locator("button.rounded-xl").nth(Number(meta.answer ?? 0)).click({ timeout: 3000 }); did = "pick"; }
    else if (kind === "type") { const inp = q.locator("input").first(); await inp.fill(String(meta.right ?? meta.answer ?? "a")); await inp.press("Enter"); did = "type"; }
    else if (await q.locator("[data-quiz-giveup]").count()) { await q.locator("[data-quiz-giveup]").first().click({ timeout: 3000 }); did = "giveup"; }
  } catch (e) { did = "err " + String(e).slice(0, 60); }
  await wait(3500);
  await page.screenshot({ path: `${OUT}/${String(n).padStart(2, "0")}b-${kind}.png` });
  log.push(`${n} ${kind} ${key} ${did} ${JSON.stringify(meta).slice(0, 120)}`);
  const next = q.locator("button", { hasText: /^다음$/ }).last();
  if (await next.count()) await next.click().catch(() => {}); else await wait(1500);
  await wait(1500);
}
console.log(log.join("\n"));
fs.writeFileSync(`${OUT}/uid.txt`, state.uid);
const cookies = await ctx.storageState(); fs.writeFileSync(`${OUT}/storage.json`, JSON.stringify(cookies));
await ctx.close(); await browser.close(); server.close();

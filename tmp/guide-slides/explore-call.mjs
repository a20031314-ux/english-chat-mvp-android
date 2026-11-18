import fs from "node:fs";
import { chromium, serve, state, api } from "../../scripts/ux-check/lib.mjs";
const PORT = 4582, OUT = "tmp/guide-slides/call-explore";
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const server = await serve(PORT);
const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
state.uid = `simcheck-guidemy-call-${Date.now().toString(36)}`;
await api("/api/learner/self-check", { language: "en", stage: "en-1" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", permissions: ["microphone"] });
await ctx.addInitScript(() => { localStorage.setItem("appTargetLanguage", "en"); localStorage.setItem("appUiLocale", "ko"); localStorage.setItem("whatsNewSeenVersion", "9.99"); localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true })); localStorage.setItem("roleplayCaptions", "1"); });
const page = await ctx.newPage();
await page.route("**/api/entitlement*", async (route) => { const r = await route.fetch().catch(() => null); if (!r) return route.fallback(); const b = await r.json(); Object.assign(b, { plan: "plus", tier: "plus", isPremium: true, callDailyMinutes: 10, callTodayLeftSeconds: 600 }); route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(b) }); });
await page.route("**/api/roleplay/listen", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ text: "" }) }));
const wait = (ms) => page.waitForTimeout(ms);
let n = 0; const shot = (name) => page.screenshot({ path: `${OUT}/${String(n++).padStart(2, "0")}-${name}.png` });
await page.goto(`http://localhost:${PORT}/?screen=talk`, { waitUntil: "domcontentloaded" }); await wait(8000);
await shot("talk");
for (const kind of ["talk", "lesson", "twenty", "teach"]) {
  const door = page.locator(`[data-tutor-row="main"] [data-call-choice="${kind}"]`).first();
  if (!(await door.count())) { console.log("no door", kind); await shot("nodoor-" + kind); continue; }
  await door.click();
  for (let i = 0; i < 40 && !(await page.locator("[data-call-stage]").count()); i++) await wait(500);
  await wait(2500); await shot(kind + "-sheet");
  console.log(kind, "sheet", await page.locator("[data-call-mode-sheet]").count());
  await page.mouse.click(195, 100); await wait(10000); await shot(kind + "-stage");
  await page.getByRole("button", { name: "통화 끝내기" }).first().click({ timeout: 3000 }).catch(async () => { await page.locator('button:has(span:text-is("📞"))').last().click().catch(() => {}); });
  await wait(6000); await shot(kind + "-end");
  const attrs = await page.evaluate(() => [...new Set([...document.querySelectorAll("*")].flatMap((el) => [...el.attributes].map((a) => a.name).filter((x) => x.startsWith("data-call"))))]);
  console.log(kind, attrs.join(" "));
  await page.goto(`http://localhost:${PORT}/?screen=talk`, { waitUntil: "domcontentloaded" }); await wait(7000);
}
fs.writeFileSync(`${OUT}/uid.txt`, state.uid); fs.writeFileSync(`${OUT}/storage.json`, JSON.stringify(await ctx.storageState()));
await ctx.close(); await browser.close(); server.close();

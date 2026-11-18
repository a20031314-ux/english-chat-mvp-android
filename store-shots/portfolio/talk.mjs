import { chromium } from "playwright";
const UID = `simcheck-portfolio2-${Date.now().toString(36)}`;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: "dark", locale: "ko-KR" });
await ctx.route("**/api/**", (r) => r.continue({ headers: { ...r.request().headers(), "x-rc-user": UID, "x-app-version": "2.80.0" } }));
await ctx.addInitScript(() => { localStorage.setItem("appTargetLanguage", "en"); localStorage.setItem("appUiLocale", "ko"); localStorage.setItem("whatsNewSeenVersion", "9.99"); localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true })); localStorage.removeItem("resumeSpot.v1"); });
const p = await ctx.newPage();
await p.goto("https://www.languagebank.net/?screen=talk"); await p.waitForTimeout(8000);
await p.screenshot({ path: "raw/talk.png" });
await p.goto("https://www.languagebank.net/?screen=people"); await p.waitForTimeout(8000);
await p.screenshot({ path: "raw/people.png" });
const t = p.locator("text=Alex").first();
if (await t.count()) { await t.click().catch(() => {}); await p.waitForTimeout(4000); await p.screenshot({ path: "raw/tutor.png" }); }
await fetch("https://www.languagebank.net/api/simcheck/forget", { method: "POST", headers: { "content-type": "application/json", "x-rc-user": UID }, body: JSON.stringify({ prefix: "portfolio2-" }) });
await b.close();

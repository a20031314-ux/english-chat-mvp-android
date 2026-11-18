import fs from "node:fs";
import { chromium, serve, state, api } from "../../scripts/ux-check/lib.mjs";
const PORT = 4571, OUT = "tmp/guide-my/recon";
fs.mkdirSync(OUT, { recursive: true });
const server = await serve(PORT);
const browser = await chromium.launch();
state.uid = process.env.UID_ || `simcheck-guidemy-${Date.now().toString(36)}`;
console.log("uid", state.uid);
console.log(JSON.stringify(await api("/api/learner/self-check", { language: "en", stage: "en-1" })).slice(0, 200));
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark" });
await ctx.addInitScript(() => {
  localStorage.setItem("appTargetLanguage", "en"); localStorage.setItem("appUiLocale", "ko");
  localStorage.setItem("whatsNewSeenVersion", "9.99"); localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true }));
});
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("pageerror", String(e).slice(0, 150)));
await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(9000);
await page.screenshot({ path: `${OUT}/0-my.png`, fullPage: true });
const attrs = await page.evaluate(() => [...new Set([...document.querySelectorAll("*")].flatMap((el) => [...el.attributes].map((a) => a.name).filter((n) => n.startsWith("data-"))))]);
console.log(attrs.join(" "));
for (const id of ["keep", "lang", "log"]) {
  await page.locator(`[data-my-jump-to="${id}"]`).first().click().catch((e) => console.log("nojump", id));
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `${OUT}/1-${id}.png`, fullPage: true });
}
fs.writeFileSync(`${OUT}/uid.txt`, state.uid);
await ctx.close(); await browser.close(); server.close();

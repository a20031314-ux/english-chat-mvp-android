import fs from "node:fs";
import { chromium, serve, state } from "../../scripts/ux-check/lib.mjs";
const PORT = 4572, OUT = "tmp/guide-my/explore3", IN = "tmp/guide-my/explore";
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const server = await serve(PORT);
const browser = await chromium.launch();
state.uid = fs.readFileSync(`${IN}/uid.txt`, "utf8").trim();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", storageState: `${IN}/storage.json` });
const page = await ctx.newPage();
const wait = (ms) => page.waitForTimeout(ms);
let n = 0; const shot = async (name) => page.screenshot({ path: `${OUT}/${String(n++).padStart(2, "0")}-${name}.png` });
const attrs = async () => (await page.evaluate(() => [...new Set([...document.querySelectorAll("*")].flatMap((el) => [...el.attributes].map((a) => a.name).filter((x) => x.startsWith("data-"))))])).join(" ");
await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
await wait(8000);
await page.locator('[data-my-jump-to="lang"]').first().click(); await wait(2000);
await page.locator('[data-my-layer="lang"] [data-my-enlarge]').first().click(); await wait(3000);
await page.locator("[data-lb-kind]").first().click(); await wait(3000); await shot("kind-words");
console.log("A", await attrs());
await page.mouse.wheel(0, 500); await wait(800); await shot("kind-words-2");
const cell = page.locator("[data-lb-cell]").first();
console.log("cells", await page.locator("[data-lb-cell]").count());
if (await cell.count()) { await cell.click(); await wait(3000); await shot("bundle"); console.log("B", await attrs());
  await page.mouse.wheel(0, 500); await wait(800); await shot("bundle-2");
  const flip = page.locator("[data-lb-flip]").first();
  if (await flip.count()) { await flip.click(); await wait(3000); await shot("flip"); const r = page.locator("[data-flip-reveal]").first(); if (await r.count()) { await r.click(); await wait(1500); await shot("flip-reveal"); } await page.keyboard.press("Escape"); await wait(1000); await shot("after-flip"); }
}
await ctx.close(); await browser.close(); server.close();

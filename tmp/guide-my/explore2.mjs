import fs from "node:fs";
import { chromium, serve, state } from "../../scripts/ux-check/lib.mjs";
const PORT = 4572, OUT = "tmp/guide-my/explore2", IN = "tmp/guide-my/explore";
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const server = await serve(PORT);
const browser = await chromium.launch();
state.uid = fs.readFileSync(`${IN}/uid.txt`, "utf8").trim();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", storageState: `${IN}/storage.json` });
const page = await ctx.newPage();
const wait = (ms) => page.waitForTimeout(ms);
let n = 0; const shot = async (name) => page.screenshot({ path: `${OUT}/${String(n++).padStart(2, "0")}-${name}.png` });
await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
await wait(8000);
await shot("my");
// Logbank enlarged
await page.locator('[data-my-jump-to="log"]').first().click(); await wait(2000);
await page.locator('[data-my-layer="log"] [data-my-enlarge]').first().click().catch((e) => console.log("enl", String(e).slice(0, 80))); await wait(3000);
await shot("log-full");
await page.mouse.wheel(0, 600); await wait(1000); await shot("log-full-2");
await page.mouse.wheel(0, 800); await wait(1000); await shot("log-full-3");
const row = page.locator("[data-day-row]").first();
console.log("dayrows", await page.locator("[data-day-row]").count(), "cells", await page.locator("[data-learned-cell]").count(), "curve", await page.locator("[data-learn-curve]").count());
if (await row.count()) { await row.click(); await wait(3000); await shot("day"); await page.mouse.wheel(0, 500); await wait(800); await shot("day-2");
  const open = page.locator("[data-timeline-open]").first(); if (await open.count()) { await open.click(); await wait(2000); await shot("session"); }
  const card = page.locator("[data-timeline-card]").first(); if (await card.count()) { await card.click(); await wait(2500); await shot("card"); }
}
await page.keyboard.press("Escape"); await wait(500);
await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" }); await wait(7000);
await page.locator('[data-my-jump-to="lang"]').first().click(); await wait(2000);
await page.locator('[data-my-layer="lang"] [data-my-enlarge]').first().click().catch(() => {}); await wait(3000);
await shot("lang-full");
await page.mouse.wheel(0, 700); await wait(800); await shot("lang-full-2");
await page.mouse.wheel(0, 900); await wait(800); await shot("lang-full-3");
console.log("often", await page.locator("[data-lb-often]").count(), "kind", await page.locator("[data-lb-kind]").count(), "cell", await page.locator("[data-lb-cell]").count());
await page.mouse.wheel(0, -3000); await wait(500);
const search = page.locator("[data-lb-search] input, input[data-lb-search]").first();
await search.fill("water"); await wait(3500); await shot("search");
await search.fill(""); await wait(1000);
const cell = page.locator("[data-lb-cell]").first();
if (await cell.count()) { await cell.scrollIntoViewIfNeeded(); await cell.click(); await wait(3000); await shot("cell");
  await page.mouse.wheel(0, 500); await wait(800); await shot("cell-2");
  const flip = page.locator("[data-lb-flip]").first(); if (await flip.count()) { await flip.click(); await wait(2500); await shot("flip"); const rev = page.locator("[data-flip-reveal]").first(); if (await rev.count()) { await rev.click(); await wait(1500); await shot("flip-reveal"); } await page.keyboard.press("Escape"); await wait(800); }
  const word = page.locator("[data-lb-bundle] button, [data-lb-bundle] li").first(); if (await word.count()) { await word.click().catch(() => {}); await wait(3000); await shot("word"); await page.mouse.wheel(0, 500); await wait(800); await shot("word-2"); }
}
await ctx.close(); await browser.close(); server.close();

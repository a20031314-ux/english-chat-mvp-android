import fs from "node:fs"; import path from "node:path";
import { chromium, serve, state } from "../../scripts/ux-check/lib.mjs";
const server = await serve(4581); const browser = await chromium.launch();
state.uid = "simcheck-guidemy-verify2";
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark" });
await ctx.addInitScript(() => { localStorage.setItem("appTargetLanguage", "en"); localStorage.setItem("appUiLocale", "ko"); localStorage.setItem("whatsNewSeenVersion", "9.99"); localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true })); });
const page = await ctx.newPage();
const { guideSlides } = await import(path.resolve("src/lib/guide/slides.ts"));
await page.route("**/api/guide?**", async (route) => { const url = new URL(route.request().url()); const body = await (await fetch("https://www.languagebank.net" + url.pathname + url.search)).json(); const s = guideSlides(body.language); if (s && url.searchParams.get("slides") === "1") body.slides = s; route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) }); });
await page.route("**/guide/*/my-*.webp", (route) => route.fulfill({ status: 200, contentType: "image/webp", body: fs.readFileSync(path.resolve("public" + new URL(route.request().url()).pathname)) }));
await page.goto("http://localhost:4581/?screen=video", { waitUntil: "domcontentloaded" }); await page.waitForTimeout(8000);
for (const [section, want] of [["my.next", "keep"], ["my.growth", "log"], ["my.map", "keep"]]) {
  await page.evaluate((s) => window.dispatchEvent(new CustomEvent("talkbank:openGuide", { detail: { section: s } })), section);
  await page.waitForTimeout(3500);
  const on = await page.locator('[data-guide-slide-group][aria-selected="true"]').getAttribute("data-guide-slide-group").catch(() => null);
  const box = await page.locator("[data-guide-slides]").boundingBox().catch(() => null);
  console.log(section, "→ 고른 칸", on, "(바람", want + ")", "넘겨 보기 위치 y", box && Math.round(box.y));
  if (section === "my.next") await page.screenshot({ path: "tmp/verify/2026-11-14/guide-whatsnew-my-next.png" });
  await page.getByRole("button", { name: "닫기" }).first().click().catch(() => {}); await page.waitForTimeout(800);
}
await browser.close(); server.close();

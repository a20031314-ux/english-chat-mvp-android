import fs from "node:fs"; import path from "node:path";
import { chromium, serve, state } from "../../scripts/ux-check/lib.mjs";
const { guideSlides } = await import(path.resolve("src/lib/guide/slides.ts"));
const server = await serve(4580); const browser = await chromium.launch();
state.uid = "simcheck-guidemy-verify";
for (const [learn, ui] of [["en", "ja"], ["es", "en"], ["es", "ar"], ["en", "th"]]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark" });
  await ctx.addInitScript(([l, u]) => { localStorage.setItem("appTargetLanguage", l); localStorage.setItem("appUiLocale", u); localStorage.setItem("whatsNewSeenVersion", "9.99"); localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true })); }, [learn, ui]);
  const page = await ctx.newPage();
  // 아직 배포 전 서버: /api/guide 답에 이 커밋의 slides를 붙이고, 새 그림은 이 폴더에서.
  await page.route("**/api/guide?**", async (route) => {
    const url = new URL(route.request().url()); const res = await fetch("https://www.languagebank.net" + url.pathname + url.search); const body = await res.json();
    const s = url.searchParams.get("slides") === "1" ? guideSlides(body.language) : undefined; if (s) body.slides = s;
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
  await page.route("**/guide/*/{my,call,tab}-*.webp", (route) => { const f = path.resolve("public" + new URL(route.request().url()).pathname); route.fulfill({ status: 200, contentType: "image/webp", body: fs.readFileSync(f) }); });
  await page.goto("http://localhost:4580/?screen=rooms", { waitUntil: "domcontentloaded" }); await page.waitForTimeout(8000);
  await page.locator('button[aria-label]').filter({ hasText: /^\?$/ }).first().click(); await page.waitForTimeout(4000);
  const deck = await page.locator('[data-guide-chapter="ai-call"] [data-guide-slides]').count();
  const tag = `${learn}-${ui}`;
  await page.screenshot({ path: `tmp/verify/2026-11-14/guide-tabs-${tag}.png` });
  if (deck) {
    const decks = await page.locator('[data-guide-chapter] [data-guide-slides]').evaluateAll((els) => els.map((e) => e.closest('[data-guide-chapter]').getAttribute('data-guide-chapter')));
    console.log("넘겨 보기 있는 장", decks.join(","));
    await page.locator('[data-guide-chapter="rooms"]').first().scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
    const next = page.locator('[data-guide-chapter="rooms"] [data-guide-slides] button').last(); await next.click(); await page.waitForTimeout(1200);
    await page.screenshot({ path: `tmp/verify/2026-11-14/guide-tabs-${tag}-next.png` });
    const imgs = await page.locator('[data-guide-chapter="rooms"] [data-guide-slides] img').evaluateAll((els) => els.map((e) => e.naturalWidth));
    console.log(tag, "넘겨 보기 있음, 그림 폭", imgs.join(","));
  } else console.log(tag, "넘겨 보기 없음(예전 글)");
  await ctx.close();
}
await browser.close(); server.close();

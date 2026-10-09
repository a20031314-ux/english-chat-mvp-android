/**
 * The browser half of the language check (AGENTS.md, "Language combinations"):
 * the built app, phone-sized, in the three combinations besides
 * English-in-Korean that most often show what only works for that pair.
 *
 *   ja learner, Korean app      — a spaceless script through chat and the sentence sheet
 *   en learner, Japanese app    — a generated locale over every tab
 *   es learner, Arabic app      — right to left
 *
 * For each it opens every tab, reads the screen, and reports facts: the page
 * direction, Latin-only lines left in a non-Latin interface (a string that
 * missed its translation), and — for the Japanese learner — whether a sentence
 * sheet cuts the line into several words. One screenshot per combination goes
 * to tmp/verify/<date>/.
 *
 * It serves www/ itself and sends /api/* to the deployed API (API_BASE, the
 * production deployment by default) as test user LANGUAGE_PASS_USER, so build
 * first: npm run build:capacitor. The Japanese chat turn spends one chat of
 * that user's daily allowance.
 *
 * Needs Playwright and a Chromium: PLAYWRIGHT_MODULE (path to the playwright
 * package) and CHROMIUM (executable) when they are not where Node finds them.
 *
 * Run: npm run check:browser-languages
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("www");
const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const USER = process.env.LANGUAGE_PASS_USER || "language-pass-check";
const PORT = Number(process.env.PORT || 4199);
const day = new Date().toISOString().slice(0, 10);
const OUT = path.resolve("tmp/verify", day);

if (!fs.existsSync(path.join(ROOT, "index.html"))) {
  console.error("www/ is not built. Run npm run build:capacitor first.");
  process.exit(2);
}
let chromium;
try {
  ({ chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright"));
} catch {
  console.error("Playwright is not installed here. Set PLAYWRIGHT_MODULE or npm i -D playwright.");
  process.exit(2);
}

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".webp": "image/webp" };
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/")) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const headers = { ...req.headers };
    for (const h of ["host", "origin", "referer", "content-length"]) delete headers[h];
    headers["x-rc-user"] ||= USER;
    try {
      const upstream = await fetch(API + req.url, {
        method: req.method,
        headers,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks),
      });
      res.writeHead(upstream.status, { "content-type": upstream.headers.get("content-type") || "application/octet-stream" });
      res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      res.writeHead(502);
      res.end();
    }
    return;
  }
  let file = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (file.endsWith(path.sep)) file += "index.html";
  if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
const BASE = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const results = [];
const LATIN_TARGETS = new Set(["en", "es", "fr", "it", "pt", "id", "vi"]);

async function combination({ name, target, ui, latinUi, chatLine }) {
  const context = await browser.newContext({ viewport: { width: 412, height: 860 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(([t, u]) => {
    localStorage.setItem("appTargetLanguage", t);
    localStorage.setItem("appUiLocale", u);
  }, [target, ui]);
  const found = { name, dir: "", latinLeft: [], sheetWords: null, problems: [] };
  for (const screen of ["map", "chat", "roleplay", "video", "vocab"]) {
    await page.goto(`${BASE}/?screen=${screen}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    found.dir = await page.evaluate(() => document.documentElement.dir);
    // Only where neither language is written in Latin letters: a Latin line is
    // then a string that missed its translation. With a Latin learning
    // language, video titles and chat lines are Latin by right, and the
    // untranslated-string check is check:strings, which reads every key.
    if (!latinUi && !LATIN_TARGETS.has(target)) {
      const lines = (await page.locator("body").innerText()).split("\n").map((l) => l.trim());
      for (const line of lines) {
        if (/^[A-Za-z][A-Za-z ,.'’…:·()!?-]{14,}$/.test(line) && !found.latinLeft.includes(line)) {
          found.latinLeft.push(`${screen}: ${line}`);
        }
      }
    }
  }
  if (chatLine) {
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "networkidle" });
    await page.locator("textarea:visible").first().fill(chatLine);
    await page.getByRole("button", { name: /^(전송|送信|发送|Send|Enviar|إرسال)$/ }).first().click();
    const buttons = page.getByRole("button", { name: /^(분석|分析|Analy\w*|تحليل)$/ });
    for (let i = 0; i < 30 && (await buttons.count()) < 2; i += 1) await page.waitForTimeout(1000);
    if ((await buttons.count()) > 0) {
      await buttons.last().click();
      await page.waitForTimeout(5000);
      found.sheetWords = await page.locator("[role=dialog] p button").allInnerTexts();
      if (found.sheetWords.length < 2) found.problems.push("sentence sheet did not cut the line into words");
    } else {
      found.problems.push("no analyse button after the chat reply");
    }
  }
  if (found.latinLeft.length) found.problems.push(`${found.latinLeft.length} Latin line(s) in a non-Latin interface`);
  if (ui === "ar" && found.dir !== "rtl") found.problems.push("Arabic interface is not right to left");
  fs.mkdirSync(OUT, { recursive: true });
  await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, `lang-${target}-${ui}.png`) });
  await context.close();
  results.push(found);
}

try {
  await combination({ name: "ja learner, Korean app", target: "ja", ui: "ko", latinUi: false, chatLine: "昨日カフェに行ったけど、混んでて座れなかった。" });
  await combination({ name: "en learner, Japanese app", target: "en", ui: "ja", latinUi: false });
  await combination({ name: "es learner, Arabic app", target: "es", ui: "ar", latinUi: false });
} finally {
  await browser.close();
  server.close();
}

let failed = 0;
for (const r of results) {
  const ok = r.problems.length === 0;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.name}  (dir=${r.dir || "ltr"})`);
  if (r.sheetWords) console.log(`      sheet words: ${r.sheetWords.join(" / ")}`);
  for (const p of r.problems) console.log(`      - ${p}`);
  for (const l of r.latinLeft.slice(0, 8)) console.log(`        ${l}`);
}
console.log(`screenshots: ${OUT}`);
process.exitCode = failed ? 1 : 0;

/**
 * 의견 반영 소식의 "고치기 전·후" 그림 — UI 언어별로 같은 화면을 두 번 찍는다.
 *
 *   public/feedback-fix/<카드>/<언어>/before.webp   main(고치기 전)으로 만든 www
 *   public/feedback-fix/<카드>/<언어>/after.webp    고친 브랜치로 만든 www
 *
 * 웹사이트가 내주고 앱 묶음에서는 뺀다(scripts/build-capacitor.mjs). 쓰는 곳:
 * src/components/FeedbackFixedSheet.tsx, 절차: hub/feedback/README.md "반영 소식".
 *
 * 순서(같은 브랜치에서):
 *   1. 고치기 전: npm run build:capacitor
 *      node scripts/capture-feedback-fix.mjs <카드> before --locales ko,ja --screen chat [--steps <파일>]
 *   2. 고친 뒤: npm run build:capacitor 후 같은 명령에 after
 * 두 번 모두 같은 테스트 사용자(x-rc-user `feedback-fix-<카드>-<언어>`)라 같은 기록으로 찍힌다.
 *
 * --screen: 앱의 ?screen= 값(AppHome.tsx resolveTab: talk·chat·roleplay·video·map(My)·people …). 거기까지만 가면 되면 이것만.
 * --steps:  화면 안에서 더 눌러야 하면 `export default async ({ page, locale, target, wait }) => {}`
 *           파일(카드마다 scripts/feedback-fix-steps/<카드>.mjs, 고치기 전에도 그대로 돌아야 함).
 * --target: 학습 언어(기본: en, 영어 앱이면 es).
 *
 * Playwright·sharp 필요(check:browser-languages와 같음: PLAYWRIGHT_MODULE / CHROMIUM).
 * 운영 API를 부르므로 화면이 모델을 부르면 그만큼 비용이 든다.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const [CARD, STAGE] = args;
const opt = (name) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : null);
const LOCALES = (opt("locales") || "ko").split(",").map((s) => s.trim()).filter(Boolean);
const SCREEN = opt("screen");
const STEPS = opt("steps");
const TARGET = opt("target");

if (!CARD || !/^[a-z0-9][a-z0-9_-]{0,47}$/.test(CARD) || !["before", "after"].includes(STAGE)) {
  console.error("사용법: capture-feedback-fix.mjs <카드> before|after --locales ko,ja [--screen chat] [--steps 파일] [--target en]");
  process.exit(2);
}

const ROOT = process.cwd();
const WWW = path.join(ROOT, "www");
const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const PORT = Number(process.env.PORT || 4199);
if (!fs.existsSync(path.join(WWW, "index.html"))) {
  console.error("www/가 없습니다. 먼저 npm run build:capacitor");
  process.exit(2);
}

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const sharp = (await import("sharp")).default;
const step = STEPS ? (await import(pathToFileURL(path.resolve(STEPS)).href)).default : null;

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".webp": "image/webp", ".mp3": "audio/mpeg" };
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/")) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const headers = { ...req.headers };
    for (const h of ["host", "origin", "referer", "content-length"]) delete headers[h];
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
  let file = path.join(WWW, decodeURIComponent(req.url.split("?")[0]));
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
let failed = 0;
for (const locale of LOCALES) {
  const target = TARGET || (locale === "en" ? "es" : "en");
  const context = await browser.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const user = `${process.env.CAPTURE_USER || `feedback-fix-${CARD}`}-${locale}`;
  await page.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": user } }));
  // 이 그림 위에 반영 소식 시트 자신이 뜨지 않게.
  await page.route("**/api/feedback/news**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"news":[]}' }));
  const wait = (ms) => page.waitForTimeout(ms);
  try {
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.evaluate(([t, ui]) => {
      localStorage.setItem("appTargetLanguage", t);
      localStorage.setItem("appUiLocale", ui);
      localStorage.setItem("chatOwnLanguageTipSeen", "1");
      localStorage.setItem("whatsNewSeenVersion", "999");
      localStorage.setItem("callDataNoticeSeen.v1", "1");
    }, [target, locale]);
    await page.goto(BASE + (SCREEN ? `/?screen=${encodeURIComponent(SCREEN)}` : "/"), { waitUntil: "networkidle" });
    await wait(1200);
    if (step) await step({ page, locale, target, wait });
    const png = await page.screenshot();
    const dir = path.join(ROOT, "public", "feedback-fix", CARD, locale);
    fs.mkdirSync(dir, { recursive: true });
    await sharp(png).resize({ width: 480 }).webp({ quality: 72 }).toFile(path.join(dir, `${STAGE}.webp`));
    console.log(`${locale} ${STAGE} → public/feedback-fix/${CARD}/${locale}/${STAGE}.webp`);
  } catch (error) {
    failed += 1;
    console.log(`${locale} 실패: ${String(error).slice(0, 300)}`);
  }
  await context.close();
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);

/**
 * The pictures for the "what's new" sheet, one set per interface language.
 *
 * The sheet shows a change in the learner's own interface language, so a
 * picture taken in Korean would contradict the text under it for everyone
 * else. This drives the built app through each changed flow once per
 * interface language, with a realistic line written in that language, and
 * saves the result where the server hands it out:
 *
 *   public/whats-new/<version>/<locale>/<shot>.webp
 *
 * Those files are served by the website and left out of the app bundle
 * (scripts/build-capacitor.mjs removes them), so the app downloads only the
 * set for its own language.
 *
 * It talks to the deployed API, so every run costs a chat line, a quick
 * question and a map per language. Each language uses its own test user so
 * the daily chat limit does not stop the run halfway.
 *
 * Needs www/ built (npm run build:capacitor), Playwright, and sharp.
 *
 * Run: node --experimental-strip-types scripts/capture-whats-new.mjs 2.64 [--only ko,ar]
 *   PLAYWRIGHT_MODULE / CHROMIUM as for check:browser-languages.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const VERSION = args[0];
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const ROOT = process.cwd();
const WWW = path.join(ROOT, "www");
const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const PORT = Number(process.env.PORT || 4198);

if (!VERSION) {
  console.error("Usage: capture-whats-new.mjs <version> [--only ko,ar]");
  process.exit(2);
}
if (!fs.existsSync(path.join(WWW, "index.html"))) {
  console.error("www/ is not built. Run npm run build:capacitor first.");
  process.exit(2);
}

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const sharp = (await import("sharp")).default;

/** copy.ts imports through "@/", which Node cannot resolve; read it through a copy that does not. */
async function loadModules() {
  const dir = path.join(ROOT, "tmp", "copycheck");
  fs.mkdirSync(dir, { recursive: true });
  const source = fs
    .readFileSync(path.join(ROOT, "src/lib/copy.ts"), "utf8")
    .replace('"@/lib/locales/generated.json"', '"../../src/lib/locales/generated.json" with { type: "json" }')
    .replace('"@/lib/locales/overlays.json"', '"../../src/lib/locales/overlays.json" with { type: "json" }')
    .replace('"@/lib/learningLanguages"', '"../../src/lib/learningLanguages.ts"');
  const file = path.join(dir, `capture-${Date.now()}.ts`);
  fs.writeFileSync(file, source);
  try {
    const { copy } = await import(`file://${file.replace(/\\/g, "/")}`);
    const { RELEASE_NOTES } = await import(`file://${path.join(ROOT, "src/lib/whatsNew.ts").replace(/\\/g, "/")}`);
    return { copy, RELEASE_NOTES };
  } finally {
    fs.rmSync(file, { force: true });
  }
}

const { copy, RELEASE_NOTES } = await loadModules();
const note = RELEASE_NOTES.find((entry) => entry.version === VERSION);
if (!note) {
  console.error(`No release note for ${VERSION} in src/lib/whatsNew.ts.`);
  process.exit(2);
}

/** Something a learner might really write when stuck, in each interface language. */
const STUCK_LINE = {
  ko: "주말에 친구랑 약속 있었는데 바람맞았어",
  en: "I had plans with a friend this weekend but they stood me up",
  es: "Tenía planes con un amigo el fin de semana, pero me dejó plantado",
  ja: "週末に友達と約束してたのに、すっぽかされちゃった",
  zh: "周末跟朋友约好了，结果被放鸽子了",
  vi: "Cuối tuần mình có hẹn với bạn mà bị cho leo cây",
  fr: "J'avais prévu de voir un ami ce week-end, mais il m'a posé un lapin",
  it: "Avevo un appuntamento con un amico nel weekend, ma mi ha dato buca",
  pt: "Eu tinha combinado com um amigo no fim de semana, mas ele me deu um bolo",
  ru: "На выходных договорился встретиться с другом, а он меня продинамил",
  id: "Akhir pekan aku ada janji sama teman, tapi dia nggak datang",
  ar: "كان عندي موعد مع صديق في عطلة نهاية الأسبوع، لكنه لم يأتِ",
  th: "สุดสัปดาห์นัดเพื่อนไว้ แต่โดนเทซะงั้น",
  hi: "वीकेंड पर दोस्त के साथ प्लान था, पर वो आया ही नहीं",
};

/** A goal for the study map, in each interface language. */
const GOAL = {
  ko: "해외 출장에서 회의 끝나고 동료들과 저녁 먹으면서 자연스럽게 스몰토크하고 싶어요",
  en: "I want to make easy small talk with colleagues over dinner on a business trip",
  es: "Quiero charlar con naturalidad con mis colegas durante la cena en un viaje de trabajo",
  ja: "海外出張で、会議のあと同僚と夕食をとりながら自然に雑談したい",
  zh: "出差时想在会后和同事吃晚饭时自然地闲聊",
  vi: "Tôi muốn nói chuyện tự nhiên với đồng nghiệp trong bữa tối khi đi công tác nước ngoài",
  fr: "Je veux bavarder naturellement avec mes collègues au dîner pendant un voyage d'affaires",
  it: "Voglio chiacchierare in modo naturale con i colleghi a cena durante un viaggio di lavoro",
  pt: "Quero conversar naturalmente com colegas no jantar durante uma viagem de negócios",
  ru: "Хочу непринуждённо болтать с коллегами за ужином в командировке",
  id: "Saya ingin ngobrol santai dengan rekan kerja saat makan malam di perjalanan dinas",
  ar: "أريد أن أتحدث بشكل طبيعي مع زملائي على العشاء خلال رحلة عمل",
  th: "อยากคุยเล่นกับเพื่อนร่วมงานได้อย่างเป็นธรรมชาติตอนกินข้าวเย็นระหว่างไปทำงานต่างประเทศ",
  hi: "बिज़नेस ट्रिप पर डिनर के दौरान सहकर्मियों से सहज होकर बातचीत करना चाहता हूँ",
};

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

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exactly = (text) => new RegExp(`^${escape(text)}$`);

/**
 * How to reach each picture. Keyed by the `shot` names release notes use; a
 * release that needs a new picture adds a step here.
 */
const STEPS = {
  async chat({ page, ui, locale, wait }) {
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "networkidle" });
    await wait(1200);
    await page.locator("textarea:visible").first().fill(STUCK_LINE[locale]);
    await page.getByRole("button", { name: exactly(ui.send) }).click();
    const show = page.getByRole("button", { name: exactly(ui.chatShowExpression) });
    for (let i = 0; i < 40 && !(await show.count()); i++) await wait(500);
    await wait(1500);
    await show.first().click();
    const use = page.getByRole("button", { name: exactly(ui.chatUseExpression) });
    for (let i = 0; i < 40 && !(await use.count()); i++) await wait(1000);
    await wait(600);
  },
  async ask({ page, ui, wait }) {
    // Continues from the chat step: the tutor's reply is the sentence asked about.
    await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).last().click();
    await wait(4500);
    const slider = page.locator("[role=slider]");
    const box = await slider.boundingBox();
    const count = await page.locator("[role=slider] > span").count();
    const x = (i) => box.x + (box.width * (i + 0.5)) / count;
    const y = box.y + box.height / 2;
    await page.mouse.move(x(Math.max(0, count - 3)), y);
    await page.mouse.down();
    await page.mouse.move(x(count - 1), y, { steps: 5 });
    await page.mouse.up();
    await wait(700);
    await page.getByRole("button", { name: ui.quickAskMeaning }).click();
    const loading = ui.askLoading.replace("…", "");
    for (let i = 0; i < 40; i++) {
      await wait(1000);
      if (!(await page.locator("[role=dialog]").innerText()).includes(loading)) break;
    }
    await wait(800);
  },
  async map({ page, ui, locale, wait }) {
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(1500);
    await page.locator("textarea:visible").first().fill(GOAL[locale]);
    await page.getByRole("radio", { name: ui.mapLevelIntermediate }).click();
    await page.getByRole("button", { name: ui.mapDraw }).click();
    const drawing = ui.mapDrawing.split("…")[0];
    for (let i = 0; i < 120; i++) {
      await wait(1000);
      if (!(await page.locator("body").innerText()).includes(drawing)) break;
    }
    await wait(1200);
  },
};

/** Without the header and the tab bar, which say nothing about the change. */
async function save(png, locale, shot) {
  const dir = path.join(ROOT, "public", "whats-new", VERSION, locale);
  fs.mkdirSync(dir, { recursive: true });
  const image = sharp(png);
  const { width, height } = await image.metadata();
  const top = Math.round(height * 0.092);
  const bottom = Math.round(height * 0.07);
  await image
    .extract({ left: 0, top, width, height: height - top - bottom })
    .resize({ width: 600 })
    .webp({ quality: 72 })
    .toFile(path.join(dir, `${shot}.webp`));
}

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
let failed = 0;
for (const locale of only ?? Object.keys(copy)) {
  const ui = copy[locale];
  const context = await browser.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.route("**/api/**", (route) =>
    route.continue({ headers: { ...route.request().headers(), "x-rc-user": `whats-new-capture-${day}-${locale}` } }),
  );
  const wait = (ms) => page.waitForTimeout(ms);
  try {
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.evaluate(([target, uiLocale]) => {
      localStorage.setItem("appTargetLanguage", target);
      localStorage.setItem("appUiLocale", uiLocale);
      localStorage.setItem("chatOwnLanguageTipSeen", "1");
      localStorage.setItem("whatsNewSeenVersion", "999");
    }, [locale === "en" ? "es" : "en", locale]);
    for (const item of note.items) {
      const step = STEPS[item.shot];
      if (!step) throw new Error(`no capture step for "${item.shot}"`);
      await step({ page, ui, locale, wait });
      await save(await page.screenshot(), locale, item.shot);
      console.log(`${locale} ${item.shot}`);
    }
  } catch (error) {
    failed += 1;
    console.log(`${locale} FAILED: ${String(error).slice(0, 300)}`);
  }
  await context.close();
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);

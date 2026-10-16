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
 * What each picture should show: PRODUCT.md, "대표 장면".
 *
 * Run: node --experimental-strip-types scripts/capture-whats-new.mjs 2.64 [--only ko,ar]
 *   PLAYWRIGHT_MODULE / CHROMIUM as for check:browser-languages.
 *   CAPTURE_RUN=2 starts from fresh test users, when today's run left data behind.
 *   CAPTURE_USER=<prefix> reuses earlier test users (<prefix>-<locale>), for
 *   pictures that need a history: a map, phrases in the ledger.
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
/**
 * `guide` instead of a version takes the pictures for the map's how-to
 * (src/lib/guide/content.ts, sections with a `shot`) into public/guide/<locale>/.
 * Run it with CAPTURE_RUN set to something new: the first picture is the empty
 * goal form, which only a learner without a map sees.
 */
const GUIDE = VERSION === "guide";
const GUIDE_ITEMS = [
  { shot: "goal" },
  { shot: "map" },
  { shot: "mission" },
  { shot: "progress" },
  { shot: "ledger" },
  { shot: "chat", save: false },
  { shot: "pick" },
];
const note = GUIDE ? { version: "guide", items: GUIDE_ITEMS } : RELEASE_NOTES.find((entry) => entry.version === VERSION);
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

/**
 * The same kind of mistake twice, in the language being learned (English, or
 * Spanish for the English interface), so the map takes it in as a weak spot.
 */
const REPEATED_MISTAKE = {
  en: ["Yesterday I go to the office early and eat breakfast there.", "Last weekend I meet my friends and we watch a movie."],
  // One kind of mistake only (ser for estar); "Ayer yo soy…" also changed the
  // tense and was read as a different kind.
  es: ["Hoy yo soy muy cansado después del trabajo.", "Mi hermana es enferma desde el lunes.", "Ahora yo soy muy contento con mi trabajo."],
};

/** A call already had, read back, with one sentence rebuilt into what was meant. */
const PAST_CALL = {
  en: [
    { who: "tutor", text: "Hi! How was your weekend?" },
    { who: "learner", text: "I am go cafe yesterday and drink coffee much", meant: "I went to a cafe yesterday and drank a lot of coffee." },
    { who: "tutor", text: "Oh, nice! Which cafe did you go to?" },
    { who: "learner", text: "The new one near my office." },
    { who: "tutor", text: "I've heard good things about it. Was it busy?" },
    { who: "learner", text: "Yes, very busy. I wait long time", better: "Yes, it was very busy. I waited a long time." },
    { who: "tutor", text: "That's the price of a good coffee!" },
  ],
  es: [
    { who: "tutor", text: "¡Hola! ¿Qué tal tu fin de semana?" },
    { who: "learner", text: "Ayer yo ir café y tomar mucho café", meant: "Ayer fui a una cafetería y tomé mucho café." },
    { who: "tutor", text: "¡Qué bien! ¿A qué cafetería fuiste?" },
    { who: "learner", text: "La nueva cerca de mi oficina." },
    { who: "tutor", text: "Me han hablado bien de ella. ¿Había mucha gente?" },
    { who: "learner", text: "Sí, mucha gente. Yo esperé mucho tiempo", better: "Sí, había mucha gente. Esperé mucho tiempo." },
    { who: "tutor", text: "¡Es el precio de un buen café!" },
  ],
};

/**
 * Phrases the ledger already holds before a picture of "My phrases" is taken,
 * and where each was met, so the sheet shows more than one source.
 */
const LEDGER_SEED = {
  en: [["catch up", "video"], ["on the same page", "vocab"], ["make it up to you", "chat"], ["no worries", "roleplay"], ["stood me up", "video"]],
  es: [["ponerse al día", "video"], ["estar en la misma onda", "vocab"], ["no pasa nada", "roleplay"], ["me dejó plantado", "video"]],
};

/** A line using a phrase met in a video, so the chat says where it came from. */
const LINK_LINE = {
  en: "My friend stood me up again last night, so I had dinner alone.",
  es: "Mi amigo me dejó plantado otra vez anoche y cené solo.",
};

/** "Try saying:", for the help shown when a learner was stuck in a call. */
const TIP_LEAD = {
  ko: "이렇게 말해 보세요:", en: "Try saying:", es: "Prueba a decir:", ja: "こう言ってみましょう:", zh: "可以这样说：",
  vi: "Thử nói:", fr: "Essayez de dire :", it: "Prova a dire:", pt: "Tente dizer:", ru: "Попробуйте сказать:",
  id: "Coba katakan:", ar: "جرّب أن تقول:", th: "ลองพูดว่า:", hi: "ऐसे बोलकर देखें:",
};

/** An answer with one slip in it, so the check has something to correct. */
function withSlip(answer) {
  const swaps = [[/\bI am\b/, "I is"], [/\bis\b/, "are"], [/\bwent\b/, "go"], [/\bestá\b/, "es"], [/\bsoy\b/, "estoy"], [/\bfui\b/, "voy"]];
  for (const [from, to] of swaps) if (from.test(answer)) return answer.replace(from, to);
  const words = answer.split(" ");
  return words.length > 3 ? [...words.slice(0, 1), ...words.slice(2)].join(" ") : answer;
}

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
  async goal({ page, ui, locale, wait }) {
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(1500);
    await page.locator("textarea:visible").first().fill(GOAL[locale]);
    await page.getByRole("radio", { name: ui.mapLevelIntermediate }).click();
    await page.getByRole("button", { name: ui.mapDraw }).scrollIntoViewIfNeeded();
    await wait(600);
  },
  async ledger({ page, ui, locale, wait, target }) {
    await page.evaluate(async ([language, seed]) => {
      await fetch("/api/learner/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, meets: seed.map(([text, tab]) => ({ kind: "save", text, tab })) }),
      });
    }, [target, LEDGER_SEED[target]]);
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(1500);
    // The pick picture needs a map to put the phrase on.
    if (await page.getByRole("button", { name: ui.mapDraw }).count()) await STEPS.map({ page, ui, locale, wait });
    await page.getByRole("button", { name: new RegExp(escape(ui.ledgerTitle)) }).first().click();
    await wait(2500);
  },
  async links({ page, ui, wait, target }) {
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "networkidle" });
    await wait(2000);
    const before = await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count();
    await page.locator("textarea:visible").first().fill(LINK_LINE[target]);
    await page.getByRole("button", { name: exactly(ui.send) }).click();
    for (let i = 0; i < 60; i++) {
      await wait(500);
      if ((await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count()) > before) break;
    }
    await wait(2500);
    const link = ui.linkMetIn.split("{place}")[1]?.trim() || ui.linkMetIn.split("{place}")[0].trim();
    await page.getByText(link).last().scrollIntoViewIfNeeded().catch(() => undefined);
    await wait(600);
  },
  async pick({ page, ui, wait }) {
    // Continues from the links step: a phrase from the tutor's reply.
    await STEPS.ask({ page, ui, wait });
    await page.getByRole("button", { name: exactly(ui.markUnknown) }).first().click();
    await wait(800);
    await page.getByRole("button", { name: exactly(ui.markToMap) }).first().click();
    const done = ui.markedToMap.split("{topic}")[0].trim();
    for (let i = 0; i < 60; i++) {
      await wait(1000);
      if (done && (await page.locator("[role=dialog]").innerText()).includes(done)) break;
    }
    await page.getByRole("button", { name: exactly(ui.markOpenMap) }).first().scrollIntoViewIfNeeded().catch(() => undefined);
    await wait(800);
  },
  async calltools({ page, ui, locale, wait, target }) {
    const said = PAST_CALL[target].map((line, i) =>
      // The help offered when they stalled before "I waited…", not the correction.
      i === 5 ? { ...line, tip: `${TIP_LEAD[locale]} “${line.better.split(". ").pop()}”` } : line,
    );
    await STEPS.meant({ page, ui, wait, target, said });
    await page.getByRole("button", { name: exactly(ui.roleplaySayAgain) }).first().scrollIntoViewIfNeeded();
    await wait(800);
  },
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
  async mission({ page, ui, locale, wait }) {
    await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
    await wait(1500);
    if (await page.getByRole("button", { name: ui.mapDraw }).count()) await STEPS.map({ page, ui, locale, wait });
    await page.getByRole("button", { name: new RegExp(escape(ui.mapContinue)) }).first().click();
    await wait(1000);
    const missions = page.waitForResponse((r) => r.url().includes("/api/curriculum/missions"), { timeout: 90000 });
    await page.getByRole("button", { name: new RegExp(escape(ui.missionStart)) }).first().click();
    const data = await (await missions).json();
    const order = [...data.missions.filter((m) => m.weak), ...data.missions.filter((m) => !m.weak)];
    await wait(1200);
    await page.getByRole("button", { name: exactly(ui.missionHint) }).click();
    await wait(500);
    await page.locator("textarea:visible").last().fill(withSlip(order[0].answer));
    await page.getByRole("button", { name: exactly(ui.missionCheck) }).click();
    const checking = ui.missionChecking.replace("…", "");
    for (let i = 0; i < 45; i++) {
      await wait(1000);
      if (!(await page.locator("body").innerText()).includes(checking)) break;
    }
    await wait(1500);
  },
  async progress({ page, ui, wait }) {
    // Continues from the mission: back on the map, the topic's phrases by state.
    await page.getByRole("button", { name: ui.billingClose }).first().click();
    // The map reloads its counts when the task screen closes.
    await page.waitForResponse((r) => r.url().includes("/api/curriculum?"), { timeout: 30000 }).catch(() => undefined);
    await wait(2000);
    await page.getByRole("button", { name: new RegExp(escape(ui.mapContinue)) }).first().click();
    for (let i = 0; i < 20 && !(await page.getByText(ui.topicItemsTitle).count()); i++) await wait(500);
    await wait(1200);
  },
  async weak({ page, ui, wait, target }) {
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "networkidle" });
    await wait(1200);
    for (const line of REPEATED_MISTAKE[target]) {
      const before = await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count();
      await page.locator("textarea:visible").first().fill(line);
      await page.getByRole("button", { name: exactly(ui.send) }).click();
      for (let i = 0; i < 60; i++) {
        await wait(500);
        if ((await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count()) > before) break;
      }
      await wait(1500);
    }
    // The map takes the mistake in after the reply has gone out.
    const chip = ui.mapWeakChip.split("{n}")[0].trim();
    for (let i = 0; i < 24; i++) {
      await wait(5000);
      await page.goto(`${BASE}/?screen=map`, { waitUntil: "networkidle" });
      await wait(1500);
      if ((await page.locator("body").innerText()).includes(chip)) break;
    }
    await page.getByText(ui.mapOrderTitle).first().scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, -260);
    await wait(800);
  },
  async meant({ page, ui, wait, target, said: lines }) {
    const now = Date.now();
    await page.evaluate(([said, language, at]) => {
      const saved = [{
        id: "whats-new-capture", scenarioId: "cafe-order", language,
        title: said.find((l) => l.who === "learner").text, startedAt: at - 600000, updatedAt: at, finishedAt: at,
        state: { scenarioId: "cafe-order", nodeId: "done", mode: "free", difficulty: {}, attempts: 0, hintShown: false,
          listeningSince: null, visited: [], queue: [], pending: null, freeTurns: 0, directedTurns: 0, history: [],
          closing: false, finished: true },
        said, memory: { text: "", upTo: 0 },
      }];
      localStorage.setItem("roleplayConversations", JSON.stringify(saved));
    }, [lines ?? PAST_CALL[target], target, now]);
    // The call tab can keep a request open, so "networkidle" may never come.
    await page.goto(`${BASE}/?screen=roleplay`, { waitUntil: "domcontentloaded" });
    await wait(4000);
    await page.getByRole("button", { name: new RegExp(escape(PAST_CALL[target][1].text)) }).first().click();
    await wait(1500);
  },
};

/** Without the header and the tab bar, which say nothing about the change. */
async function save(png, locale, shot) {
  const dir = GUIDE
    ? path.join(ROOT, "public", "guide", locale)
    : path.join(ROOT, "public", "whats-new", VERSION, locale);
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
    route.continue({ headers: { ...route.request().headers(), "x-rc-user": `${process.env.CAPTURE_USER || `whats-new-capture-${day}${process.env.CAPTURE_RUN ? `-${process.env.CAPTURE_RUN}` : ""}`}-${locale}` } }),
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
    const target = locale === "en" ? "es" : "en";
    // CAPTURE_SHOTS=chat,pick retakes only those, for a language whose run stopped partway.
    const onlyShots = process.env.CAPTURE_SHOTS?.split(",");
    for (const item of note.items) {
      if (onlyShots && !onlyShots.includes(item.shot)) continue;
      const step = STEPS[item.shot];
      if (!step) throw new Error(`no capture step for "${item.shot}"`);
      await step({ page, ui, locale, wait, target });
      if (item.save === false) continue;
      await save(await page.screenshot(), locale, item.shot);
      console.log(`${locale} ${item.shot}`);
    }
  } catch (error) {
    await page.screenshot({ path: path.join(ROOT, "tmp", `capture-failed-${locale}.png`) }).catch(() => undefined);
    failed += 1;
    console.log(`${locale} FAILED: ${String(error).slice(0, 300)}`);
  }
  await context.close();
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);

// 사용법 통화 장(ai-call) 넘겨 보기 재료 — 실제 통화 화면(가짜 마이크, 받아쓰기는 빈 답)·통화 미리 보기(/dev/call-preview, next dev)·지난 통화(끼움)에서
// 기능이 보이는 부분만 잘라 찍는다 → tmp/guide-slides/raw/call-*.png. 다음은 compose.mjs.
// 저장소 맨 위에서: npm run build:capacitor → (따로) npx next dev -p 3011 → node scripts/guide-slides/shoot-call.mjs
// LOCALE=<앱 언어>(기본 ko) — 학습 언어는 영어(en 앱이면 스페인어), 버튼 이름은 copy에서, 그림은 tmp/guide-slides/raw/<앱 언어>/. 통화 넷은 운영 서버의 튜터 첫 마디를 부른다(시험 사용자 simcheck-guidemy-call-…, 끝나면 지움). 통화 화면만 플러스로 보이게(앱이 받는 답만).
import fs from "node:fs";
import { chromium, serve, state, api, loadCopy } from "../ux-check/lib.mjs";
const LOCALE = process.env.LOCALE || "ko";
// CAPTURE_TARGET=<배우는 언어>: 검색어 맞춤 등록정보용(앱 언어 × 다른 배우는 언어) — 그림은 raw/<앱>-<배우는>/.
const LEARN = process.env.CAPTURE_TARGET || (LOCALE === "en" ? "es" : "en");
const RAWKEY = process.env.CAPTURE_TARGET ? `${LOCALE}-${process.env.CAPTURE_TARGET}` : LOCALE;
const ui = (await loadCopy())[LOCALE];
/** 고친 말 카드의 까닭 한 줄(미리 보기 화면에 넣음) — 앱 언어로. */
const WHY = {
  ko: "어제 일이라 go가 아니라 went예요.", en: "It happened yesterday, so use the past: fui.", es: "Pasó ayer, así que usa el pasado: went.",
  ja: "昨日のことなので go ではなく went。", zh: "这是昨天的事，所以用 went 而不是 go。", vi: "Chuyện hôm qua nên dùng went, không phải go.",
  fr: "C'était hier, donc went et non go.", it: "È successo ieri, quindi went e non go.", pt: "Foi ontem, então went, não go.",
  ru: "Это было вчера, поэтому went, а не go.", id: "Itu kemarin, jadi went, bukan go.", ar: "حدث ذلك أمس، لذا نقول went وليس go.",
  th: "เป็นเรื่องเมื่อวาน จึงใช้ went ไม่ใช่ go", hi: "यह कल हुआ था, इसलिए go नहीं went।",
};
const PORT = 4583, DEV = process.env.DEV_URL || "http://localhost:3011", OUT = `tmp/guide-slides/raw/${RAWKEY}`;
fs.mkdirSync(OUT, { recursive: true });
const server = await serve(PORT);
const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
state.uid = `simcheck-guidemy-call-${Date.now().toString(36)}`;
await api("/api/learner/self-check", { language: LEARN, stage: `${LEARN}-1` });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", permissions: ["microphone"] });
await ctx.addInitScript(([learn, locale]) => {
  localStorage.setItem("appTargetLanguage", learn); localStorage.setItem("appUiLocale", locale); localStorage.setItem("whatsNewSeenVersion", "9.99");
  localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true })); localStorage.setItem("roleplayCaptions", "1");
  localStorage.setItem("callInfoSeen.v1", "1");
}, [LEARN, LOCALE]);
const page = await ctx.newPage();
await page.route("**/api/entitlement*", async (route) => {
  const r = await route.fetch().catch(() => null); if (!r) return route.fallback();
  const b = await r.json(); Object.assign(b, { plan: "plus", tier: "plus", isPremium: true, callDailyMinutes: 10, callTodayLeftSeconds: 600 });
  route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(b) });
});
await page.route("**/api/roleplay/listen", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ text: "" }) }));
const wait = (ms) => page.waitForTimeout(ms);
async function cut(name, locators, { pad = 10, maxH = 520, top = 0 } = {}) {
  let b = null;
  for (const l of locators) {
    const o = await l.boundingBox().catch(() => null);
    if (!o) continue;
    b = b ? { x: Math.min(b.x, o.x), y: Math.min(b.y, o.y), r: Math.max(b.r, o.x + o.width), bt: Math.max(b.bt, o.y + o.height) } : { x: o.x, y: o.y, r: o.x + o.width, bt: o.y + o.height };
  }
  if (!b) { console.log("못 찍음", name); return; }
  const x = Math.max(0, b.x - pad), y = Math.max(0, b.y - pad + top);
  await page.screenshot({ path: `${OUT}/${name}.png`, clip: { x, y, width: Math.min(390, b.r + pad) - x, height: Math.min(844 - y, maxH, b.bt + pad - y) } });
  console.log("찍음", name);
}

// 통화 넷: 튜터 줄 문 → 통화 화면, 튜터 첫 마디(자막)까지.
await page.goto(`http://localhost:${PORT}/?screen=talk`, { waitUntil: "domcontentloaded" }); await wait(8000);
for (const kind of ["talk"]) {
  await page.locator(`[data-tutor-row="main"] [data-call-door]`).first().click();
  for (let i = 0; i < 40 && !(await page.locator("[data-call-stage]").count()); i++) await wait(500);
  await page.locator("[data-call-mode-sheet] button").last().click({ timeout: 1500 }).catch(() => {});
  await wait(11000);
  await cut(`call-${kind}`, [page.locator("[data-call-mode-info]").first(), page.locator("[data-call-tutor]").first()], { maxH: 440 });
  await page.goto(`http://localhost:${PORT}/?screen=talk`, { waitUntil: "domcontentloaded" }); await wait(7000);
}

// 지난 통화(끼움): 튜터 프로필 → 통화 기록 → 돌아보기 → 맨 뒤 통화 정리.
const saidEn = [
  { who: "tutor", text: "Hi! How was your weekend?" },
  { who: "learner", text: "I am go cafe yesterday and drink coffee much", meant: "I went to a cafe yesterday and drank a lot of coffee." },
  { who: "tutor", text: "Oh, nice! Which cafe did you go to?" },
  { who: "learner", text: "The new one near my office." },
  { who: "tutor", text: "I've heard good things about it. Was it busy?" },
  { who: "learner", text: "Yes, very busy. I wait long time", better: "Yes, it was very busy. I waited a long time." },
  { who: "tutor", text: "That's the price of a good coffee!" },
];
const saidEs = [
  { who: "tutor", text: "¡Hola! ¿Qué tal tu fin de semana?" },
  { who: "learner", text: "Yo ir a un café ayer y beber mucho café", meant: "Ayer fui a un café y bebí mucho café." },
  { who: "tutor", text: "¡Qué bien! ¿A qué café fuiste?" },
  { who: "learner", text: "El nuevo cerca de mi oficina." },
  { who: "tutor", text: "He oído cosas buenas. ¿Había mucha gente?" },
  { who: "learner", text: "Sí, mucho gente. Yo esperar mucho tiempo", better: "Sí, había mucha gente. Esperé mucho tiempo." },
  { who: "tutor", text: "¡Es el precio de un buen café!" },
];
const said = LEARN === "es" ? saidEs : saidEn;
await page.evaluate(([said, learn]) => {
  const at = Date.now();
  localStorage.setItem("roleplayConversations", JSON.stringify([{
    id: "guide-capture", scenarioId: "cafe-order", language: learn, title: said[1].text, startedAt: at - 600000, updatedAt: at, finishedAt: at,
    state: { scenarioId: "cafe-order", nodeId: "done", mode: "free", difficulty: {}, attempts: 0, hintShown: false, listeningSince: null, visited: [], queue: [], pending: null, freeTurns: 0, directedTurns: 0, history: [], closing: false, finished: true },
    said, memory: { text: "", upTo: 0 },
  }]));
}, [said, LEARN]);
await page.goto(`http://localhost:${PORT}/?screen=people`, { waitUntil: "domcontentloaded" }); await wait(6000);
await page.getByRole("button", { name: ui.talkAiTutor, exact: true }).first().click().catch(() => page.locator("[data-tutor-row]").first().click());
await wait(1500);
const records = page.getByRole("button", { name: ui.callRecordsTitle, exact: true }).first();
await records.click(); await wait(1500);
const retro = page.getByRole("button", { name: ui.packSeeRetro, exact: true }).first();
await cut("call-records", [retro.locator("xpath=ancestor::*[self::li or self::div][1]")], { pad: 14, maxH: 200 });
await retro.click(); await wait(2500);
const chip = page.getByRole("button", { name: ui.chatCorrectionChip, exact: true }).first();
if (await chip.count()) { await chip.click().catch(() => {}); await wait(1500); }
const pages = page.locator("[data-call-pages]").first();
await cut("call-review", [pages], { maxH: 520 });
const next = page.locator(`[data-call-pages] button[aria-label="${ui.studyChapterNext}"]`).last();
for (let i = 0; i < 12 && (await next.count()) && (await next.isEnabled().catch(() => false)); i++) { await next.click(); await wait(700); }
const recap = page.locator("[data-call-recap]").first();
for (let i = 0; i < 20 && !(await recap.count()); i++) await wait(500);
await recap.evaluate((el) => el.scrollIntoView({ block: "start" })).catch(() => {}); await wait(800);
await cut("call-recap", [recap], { maxH: 480 });

// 통화 미리 보기(개발 서버): 코치 띠.
const why = WHY[LOCALE];
await page.goto(`${DEV}/dev/call-preview?v=ai&lang=${LOCALE}&learn=${LEARN}&why=${encodeURIComponent(why)}`); await page.locator("[data-call-coach]").first().waitFor({ timeout: 20000 }).catch(() => {}); await wait(1500);
// 내 얼굴 + 그 아래 고친 말 카드(얼굴 없는 코치 띠, 2026-11-20).
await cut("call-quiet", [page.locator("[data-call-me]").first()], { pad: 4 });

await api("/api/simcheck/forget", { prefix: "guidemy-" });
await ctx.close(); await browser.close(); server.close();

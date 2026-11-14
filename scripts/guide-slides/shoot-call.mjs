// 사용법 통화 장(ai-call) 넘겨 보기 재료 — 실제 통화 화면(가짜 마이크, 받아쓰기는 빈 답)·통화 미리 보기(/dev/call-preview, next dev)·지난 통화(끼움)에서
// 기능이 보이는 부분만 잘라 찍는다 → tmp/guide-slides/raw/call-*.png. 다음은 compose.mjs.
// 저장소 맨 위에서: npm run build:capacitor → (따로) npx next dev -p 3011 → node scripts/guide-slides/shoot-call.mjs
// 한국어 앱 · 영어 학습. 통화 넷은 운영 서버의 튜터 첫 마디를 부른다(시험 사용자 simcheck-guidemy-call-…, 끝나면 지움). 통화 화면만 플러스로 보이게(앱이 받는 답만).
import fs from "node:fs";
import { chromium, serve, state, api } from "../ux-check/lib.mjs";
const PORT = 4583, DEV = process.env.DEV_URL || "http://localhost:3011", OUT = "tmp/guide-slides/raw";
fs.mkdirSync(OUT, { recursive: true });
const server = await serve(PORT);
const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
state.uid = `simcheck-guidemy-call-${Date.now().toString(36)}`;
await api("/api/learner/self-check", { language: "en", stage: "en-1" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", permissions: ["microphone"] });
await ctx.addInitScript(() => {
  localStorage.setItem("appTargetLanguage", "en"); localStorage.setItem("appUiLocale", "ko"); localStorage.setItem("whatsNewSeenVersion", "9.99");
  localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true })); localStorage.setItem("roleplayCaptions", "1");
  localStorage.setItem("callModeSeen.v1", JSON.stringify({ talk: 1, lesson: 1, twenty: 1, teach: 1 }));
});
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
for (const kind of ["talk", "lesson", "twenty", "teach"]) {
  await page.locator(`[data-tutor-row="main"] [data-call-choice="${kind}"]`).first().click();
  for (let i = 0; i < 40 && !(await page.locator("[data-call-stage]").count()); i++) await wait(500);
  await page.locator("[data-call-mode-sheet] button").last().click({ timeout: 1500 }).catch(() => {});
  await wait(11000);
  await cut(`call-${kind}`, [page.locator("[data-call-mode-info]").first(), page.locator("[data-call-tutor]").first()], { maxH: 440 });
  await page.goto(`http://localhost:${PORT}/?screen=talk`, { waitUntil: "domcontentloaded" }); await wait(7000);
}

// 지난 통화(끼움): 튜터 프로필 → 통화 기록 → 돌아보기 → 맨 뒤 통화 정리.
const said = [
  { who: "tutor", text: "Hi! How was your weekend?" },
  { who: "learner", text: "I am go cafe yesterday and drink coffee much", meant: "I went to a cafe yesterday and drank a lot of coffee." },
  { who: "tutor", text: "Oh, nice! Which cafe did you go to?" },
  { who: "learner", text: "The new one near my office." },
  { who: "tutor", text: "I've heard good things about it. Was it busy?" },
  { who: "learner", text: "Yes, very busy. I wait long time", better: "Yes, it was very busy. I waited a long time." },
  { who: "tutor", text: "That's the price of a good coffee!" },
];
await page.evaluate((said) => {
  const at = Date.now();
  localStorage.setItem("roleplayConversations", JSON.stringify([{
    id: "guide-capture", scenarioId: "cafe-order", language: "en", title: said[1].text, startedAt: at - 600000, updatedAt: at, finishedAt: at,
    state: { scenarioId: "cafe-order", nodeId: "done", mode: "free", difficulty: {}, attempts: 0, hintShown: false, listeningSince: null, visited: [], queue: [], pending: null, freeTurns: 0, directedTurns: 0, history: [], closing: false, finished: true },
    said, memory: { text: "", upTo: 0 },
  }]));
}, said);
await page.goto(`http://localhost:${PORT}/?screen=people`, { waitUntil: "domcontentloaded" }); await wait(6000);
await page.getByRole("button", { name: "AI 튜터", exact: true }).first().click().catch(() => page.locator("[data-tutor-row]").first().click());
await wait(1500);
const records = page.getByRole("button", { name: "통화 기록", exact: true }).first();
await records.click(); await wait(1500);
const retro = page.getByRole("button", { name: "돌아보기", exact: true }).first();
await cut("call-records", [retro.locator("xpath=ancestor::*[self::li or self::div][1]")], { pad: 14, maxH: 200 });
await retro.click(); await wait(2500);
const chip = page.getByRole("button", { name: "고칠 곳이 있어요", exact: true }).first();
if (await chip.count()) { await chip.click().catch(() => {}); await wait(1500); }
const pages = page.locator("[data-call-pages]").first();
await cut("call-review", [pages], { maxH: 520 });
const next = page.locator(`[data-call-pages] button[aria-label="다음"]`).last();
for (let i = 0; i < 12 && (await next.count()) && (await next.isEnabled().catch(() => false)); i++) { await next.click(); await wait(700); }
const recap = page.locator("[data-call-recap]").first();
for (let i = 0; i < 20 && !(await recap.count()); i++) await wait(500);
await recap.evaluate((el) => el.scrollIntoView({ block: "start" })).catch(() => {}); await wait(800);
await cut("call-recap", [recap], { maxH: 480 });

// 통화 미리 보기(개발 서버): 자유대화 고친 말 카드 · 수업 짚기 카드.
const why = "어제 일이라 go가 아니라 went예요.";
await page.goto(`${DEV}/dev/call-preview?v=ai&lang=ko&learn=en&quiet=1&why=${encodeURIComponent(why)}`); await wait(5000);
await cut("call-quiet", [page.locator("[data-call-coach]").first()], { pad: 12 });
await page.goto(`${DEV}/dev/call-preview?v=ai&lang=ko&learn=en&card=fix&board=1&why=${encodeURIComponent(why)}`); await wait(5000);
await cut("call-fix-card", [page.locator("[data-call-coach]").first()], { pad: 12 });

await api("/api/simcheck/forget", { prefix: "guidemy-" });
await ctx.close(); await browser.close(); server.close();

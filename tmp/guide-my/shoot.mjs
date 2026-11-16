// My 탭 사용법 장면(한국어 앱, 영어 학습) — 칸마다 핵심 1장 + 세부 장면. 실제 화면에 쓰는 부분만 밝게 + 기능 이름·설명 말풍선.
// 저장소 맨 위에서: npm run build:capacitor → node tmp/guide-my/shoot.mjs → tmp/guide-my/slides/*.png + slides.json
import fs from "node:fs";
import { chromium, serve, state, api } from "../../scripts/ux-check/lib.mjs";
const PORT = 4574, OUT = "tmp/guide-my/slides";
if (!process.env.ONLY) fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const server = await serve(PORT);
const browser = await chromium.launch();
state.uid = `simcheck-guidemy-${Date.now().toString(36)}`;
await api("/api/learner/self-check", { language: "en", stage: "en-1" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark" });
await ctx.addInitScript(() => {
  localStorage.setItem("appTargetLanguage", "en"); localStorage.setItem("appUiLocale", "ko");
  localStorage.setItem("whatsNewSeenVersion", "9.99"); localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true }));
});
const page = await ctx.newPage();
const wait = (ms) => page.waitForTimeout(ms);
const slides = [];

async function boxOf(...locators) {
  let b = null;
  for (const l of locators) {
    const o = await l.boundingBox().catch(() => null);
    if (!o) continue;
    b = b ? { x: Math.min(b.x, o.x), y: Math.min(b.y, o.y), r: Math.max(b.r, o.x + o.width), bt: Math.max(b.bt, o.y + o.height) } : { x: o.x, y: o.y, r: o.x + o.width, bt: o.y + o.height };
  }
  return b;
}
/** 상자 하나만 밝게, 그 아래(자리가 없으면 위)에 이름 + 한 줄. */
async function slide(bank, id, title, desc, box, { core = false } = {}) {
  if (!box) { console.log(`못 찍음 ${bank}/${id}`); return; }
  let focus = null;
  const pad = 6;
  const hole = { x: Math.max(2, box.x - pad), y: Math.max(2, box.y - pad), r: Math.min(388, box.r + pad), b: Math.min(842, box.bt + pad) };
  await page.evaluate(([hole, title, desc]) => {
    document.getElementById("__g")?.remove();
    const root = document.createElement("div"); root.id = "__g";
    root.style.cssText = "position:fixed;inset:0;z-index:2147483646;pointer-events:none";
    const h = document.createElement("div");
    h.style.cssText = `position:absolute;left:${hole.x}px;top:${hole.y}px;width:${hole.r - hole.x}px;height:${hole.b - hole.y}px;border-radius:14px;border:3px solid #FFD60A;box-shadow:0 0 0 2000px rgba(0,0,0,.62)`;
    root.appendChild(h);
    const cap = document.createElement("div");
    cap.style.cssText = "position:absolute;left:16px;right:16px;padding:12px 16px;border-radius:16px;background:#FFD60A;color:#111;font-family:-apple-system,'Noto Sans CJK KR','Noto Sans KR',sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.5)";
    cap.innerHTML = `<div style="font-weight:800;font-size:19px;line-height:1.3;margin-bottom:4px"></div><div style="font-weight:500;font-size:15px;line-height:1.45"></div>`;
    cap.children[0].textContent = title; cap.children[1].textContent = desc;
    root.appendChild(cap);
    document.body.appendChild(root);
    const ch = cap.getBoundingClientRect().height;
    const below = hole.b + 14 + ch < 836;
    const above = hole.y - 14 - ch > 8;
    cap.style.top = `${below ? hole.b + 14 : above ? hole.y - 14 - ch : 836 - ch}px`;
    const c = cap.getBoundingClientRect();
    return { y: Math.min(hole.y, c.top), b: Math.max(hole.b, c.bottom) };
  }, [hole, title, desc]).then((u) => (focus = u));
  await wait(300);
  const file = `${bank}-${String(slides.filter((s) => s.bank === bank).length + 1).padStart(2, "0")}-${id}.png`;
  await page.screenshot({ path: `${OUT}/${file}` });
  await page.evaluate(() => document.getElementById("__g")?.remove());
  slides.push({ bank, id, title, desc, file, core, focus });
  console.log("찍음", file);
}
const center = (l) => l.evaluate((el) => el.scrollIntoView({ block: "center" })).catch(() => {});
const top = (l, off = 80) => l.evaluate((el, off) => { el.scrollIntoView({ block: "start" }); const s = el.closest("[data-my-full]") ?? document.scrollingElement; s.scrollBy?.(0, -off); }, off).catch(() => {});

await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
for (let i = 0; i < 40 && !(await page.locator("[data-today-cards]").count()); i++) await wait(500);
await wait(3000);

const ONLY = process.env.ONLY || "";
if (ONLY !== "lang") {
// ── 오늘의 학습(처음 — 아직 ✓ 없음)
const today = page.locator("[data-today-cards]").first();
await center(today); await wait(600);
await slide("today", "core", "오늘의 학습", "오늘 할 것만 한 줄씩 — 누르면 바로 시작해요", await boxOf(today), { core: true });

// ── Quizbank(전체 화면)
await page.locator('[data-my-jump-to="keep"]').first().click(); await wait(1500);
await page.locator('[data-my-layer="keep"] [data-my-enlarge]').first().click(); await wait(2000);
const q = () => page.locator("section[data-kind]").first();
for (let i = 0; i < 40 && !(await q().count()); i++) await wait(500);
await wait(1500);
await slide("keep", "core", "Quizbank", "다시 볼 것과 새 문제가 한 흐름으로 이어져요", await boxOf(q()), { core: true });
await slide("keep", "gauge", "난이도", "− · + 로 문제를 쉽게·어렵게 바꿔요", await boxOf(page.locator("[data-quiz-gauge]").first()));
for (let k = 0; k < 2; k++) { await page.locator("[data-quiz-gauge] button").last().click().catch(() => {}); await wait(2500); }
const want = { meaning: ["word", "단어 문제", "예문 속에서 이 단어의 뜻을 골라요"], type: ["type", "빈칸 쓰기", "문법·표현은 고르기 → 빈칸 쓰기 → 틀린 곳 → 문장 순서로 어려워져요"], spots: ["spots", "문단 틀린 곳", "긴 글을 읽고 틀린 단어를 찾아요"], spot: ["spot", "틀린 곳 찾기", "문장에서 틀린 곳을 눌러 찾아요"], order: ["order", "문장 만들기", "단어를 순서대로 놓아 문장을 만들어요"] };
const got = new Set(); let answered = 0, againShot = false, notesShot = false;
for (let n = 0; n < 30 && (answered < 11 || got.size < 4); n++) {
  const one = q();
  if (!(await one.count())) { await wait(2000); continue; }
  const kind = await one.getAttribute("data-kind");
  const meta = JSON.parse((await one.getAttribute("data-quiz-meta")) || "{}");
  await top(one, 120); await wait(500);
  if (want[kind] && !got.has(want[kind][0])) {
    got.add(want[kind][0]);
    let w = want[kind];
    const ask = (await one.locator("[data-quiz-ask]").first().innerText().catch(() => "")) || "";
    if (kind === "type" && /문장/.test(ask)) w = ["type", "문장 쓰기", "문법·표현은 고르기 → 빈칸 → 틀린 곳 → 문장 쓰기 순서로 어려워져요"];
    await slide("keep", ...w, await boxOf(q()));
  }
  try {
    if (kind === "choose" || kind === "meaning") await one.locator("button.rounded-xl").nth(Number(meta.answer ?? 0)).click({ timeout: 3000 });
    else if (kind === "type") { const inp = one.locator("input").first(); await inp.fill(String(meta.right ?? meta.answer ?? "a")); await inp.press("Enter"); }
    else if (await one.locator("[data-spot-words] button").count()) {
      for (let t = 0; t < 4; t++) {
        const b = one.locator("[data-spot-words] button:not([disabled])");
        if (!(await b.count()) || (await one.locator("button", { hasText: /^다음$/ }).count())) break;
        await b.nth(t).click({ timeout: 2000 }).catch(() => {}); await wait(800);
      }
      if (!(await one.locator("button", { hasText: /^다음$/ }).count()) && (await one.locator("[data-quiz-giveup]").count())) await one.locator("[data-quiz-giveup]").first().click({ timeout: 2000 }).catch(() => {});
    }
    else if (await one.locator("[data-quiz-giveup]").count()) await one.locator("[data-quiz-giveup]").first().click({ timeout: 3000 });
    else { console.log("못 푼 모양", kind); }
  } catch (e) { console.log("답 실패", kind, String(e).slice(0, 60)); }
  answered++;
  await wait(3500);
  const again = one.locator("[data-quiz-again]").first();
  if (!againShot && (await again.count())) {
    againShot = true;
    const row = again.locator("xpath=..");
    await center(row); await wait(400);
    await slide("keep", "after", "답한 뒤", "[다시]를 누르면 또 나와요 · 📕 Languagebank는 사전으로", await boxOf(row));
  }
  const notes = one.locator("[data-dict-notes]").first();
  if (!notesShot && (await notes.count())) {
    notesShot = true;
    await center(notes); await wait(400);
    await slide("keep", "notes", "📕 사전 주석", "답한 뒤 문장 속 단어·표현을 누르면 사전·수업이 열려요", await boxOf(notes));
  }
  const next = one.locator("button", { hasText: /^다음$/ }).last();
  if (await next.count()) await next.click().catch(() => {});
  await wait(1500);
}
console.log("답한 수", answered, [...got]);
await page.locator("[data-my-full-close]").first().click().catch(() => page.keyboard.press("Escape")); await wait(2000);

// ── 오늘의 학습(Quizbank ✓ 뒤)
const cards = page.locator("[data-today-card]");
await center(today); await wait(600);
await slide("today", "quiz", "▶ Quizbank", "오늘 10문제 답하면 ✓", await boxOf(cards.nth(0)));
await slide("today", "lesson", "📞 수업", "튜터와 수업 통화를 하면 ✓ — 숙제가 생기면 줄이 하나 더 생겨요", await boxOf(cards.nth(1)));

// ── Logbank(전체 화면)
await page.locator('[data-my-jump-to="log"]').first().click(); await wait(1500);
await page.locator('[data-my-layer="log"] [data-my-enlarge]').first().click(); await wait(3000);
const table = page.locator("[data-learned-table]").first();
for (let i = 0; i < 20 && !(await table.count()); i++) await wait(500);
await slide("log", "core", "Logbank", "배운 것 — 퀴즈로 배운 수(학습) · 대화에서 쓴 수(활용)", await boxOf(table), { core: true });
await slide("log", "period", "주 · 월", "기간을 바꾸고 ‹ › 로 지난 기록을 넘겨 봐요", await boxOf(page.locator("[data-log-period] button").first(), page.locator("[data-log-period-label]").first()));
const dayRow = page.locator("[data-day-row]").first();
await slide("log", "days", "날마다 한 줄", "그날 학습한 수 — 누르면 그날 기록", await boxOf(dayRow));
await slide("log", "time", "⏱ 학습 시간 · 📅 공부한 날", "누르면 날마다 학습 시간 막대", await boxOf(page.locator("[data-log-time]").first()));
await dayRow.click(); await wait(3000);
await slide("log", "timeline", "그날 학습 타임라인", "언제 무엇을 했는지 시간 순서로", await boxOf(page.locator("[data-timeline]").first()));
const open = page.locator("[data-timeline-open]").first();
if (await open.count()) {
  await open.click(); await wait(2500);
  const sess = page.locator("[data-timeline-session]").first();
  const box = await boxOf(sess);
  if (box) box.bt = Math.min(box.bt, 470);
  await slide("log", "session", "한 번 한 공부", "단어·문법·표현마다 맞음 ✓ · 틀림 ✗", box);
  const card = page.locator("[data-timeline-card]").first();
  if (await card.count()) {
    await card.click(); await wait(2500);
    const ct = page.locator("[data-card-timeline]").first();
    await slide("log", "card", "카드 지난 기록", "그 단어를 언제 어떻게 풀었는지", await boxOf(ct));
  }
}
fs.writeFileSync(`${OUT}/slides-main.json`, JSON.stringify(slides, null, 2));
} // ONLY 끝
await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
for (let i = 0; i < 40 && !(await page.locator('[data-my-jump-to="lang"]').count()); i++) await wait(500);
await wait(2500);
if (await page.locator("[data-my-full-close]").count()) { await page.locator("[data-my-full-close]").first().click().catch(() => {}); await wait(1500); }

if (ONLY !== "main") {
// ── Languagebank(전체 화면)
await page.locator('[data-my-jump-to="lang"]').first().click(); await wait(1500);
await page.locator('[data-my-layer="lang"] [data-my-enlarge]').first().click(); await wait(3000);
const kinds = page.locator("[data-lb-kind]");
await slide("lang", "core", "Languagebank", "배울 단어·표현·문법이 단계별로 모두 — 숫자는 개수", await boxOf(kinds.nth(0), kinds.nth(1), kinds.nth(2)), { core: true });
const search = page.locator("[data-lb-search] input, input[data-lb-search]").first();
await search.fill("water"); await wait(3500);
const sb = await boxOf(search);
await slide("lang", "search", "찾기", "단어나 뜻을 쓰면 바로 찾아요", sb ? { ...sb, bt: sb.bt + 110 } : null);
await search.fill(""); await wait(1500);
await kinds.nth(0).locator("button").first().click(); await wait(2500);
const grid = page.locator("[data-lb-cell]");
const gb = await boxOf(grid.first(), grid.last());
await slide("lang", "grid", "종류 × 단계", "[주제 | 품사]로 나누고 칸을 누르면 그 묶음", gb ? { ...gb, y: gb.y - 30 } : null);
await grid.first().click(); await wait(2500);
const bundle = page.locator("[data-lb-bundle]").first();
await top(bundle, 60); await wait(600);
const bb = await boxOf(bundle);
if (bb) bb.bt = Math.min(bb.bt, bb.y + 300);
await slide("lang", "bundle", "묶음", "[퀴즈 | 대화] 순서로 보고, ▶로 넘겨 보기", bb);
await bundle.locator("[data-lb-flip]").first().click(); await wait(2500);
const flipCard = page.locator("[data-bank-flip]").first();
await slide("lang", "flip", "▶ 넘겨 보기", "뜻·단어·예문 중 하나를 가리고 떠올려요 → [다시 | 됐어요]", await boxOf(flipCard));
await page.locator("[data-flip-reveal]").first().click().catch(() => {}); await wait(1500);
await page.keyboard.press("Escape"); await wait(800);
const x = page.locator("[data-bank-flip] button", { hasText: "✕" }).first();
if (await x.count()) { await x.click().catch(() => {}); await wait(800); }
await bundle.locator("button.rounded-lg.border").filter({ hasNotText: /퀴즈|대화/ }).first().click().catch((e) => console.log("단어 못 누름", String(e).slice(0, 60)));
await wait(3500);
const entry = page.locator("[data-dictionary-entry], [data-dictionary-card]").first();
await slide("lang", "word", "단어 화면", "뜻 여러 개와 예문 — 🔊로 들어 봐요", await boxOf(entry));

}
fs.writeFileSync(`${OUT}/slides-lang.json`, JSON.stringify(slides.filter((x) => x.bank === "lang"), null, 2));
await api("/api/simcheck/forget", { prefix: state.uid });
await ctx.close(); await browser.close(); server.close();

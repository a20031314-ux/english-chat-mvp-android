/**
 * 광고 자리 점검용 캡처 — 사람이 실제로 머무는 화면을 한 장씩 찍어 큰 빈 공간(광고 후보)을 찾게 한다.
 * 사용자 2026-11-01 "앱 내 UI에서 빈 공간 더 있는지 점검해줘"(퀴즈 아래 큰 빈 공간처럼).
 *
 *   npm run build:capacitor                     (www가 없거나 오래됐으면 먼저 — 도는 동안 git 명령 금지)
 *   NODE_USE_ENV_PROXY=1 node scripts/watch/blank-capture.mjs [--combos en:ko,ja:ko] [--scenes my-home,quiz-vocab] [--chat 1]
 *   python3 scripts/watch/blank.py tmp/ads-blank --min 0.12 --out tmp/ads-blank/blank.json
 *
 * 방식은 scripts/sim-users/screens.mjs와 같다: www를 띄우고 /api는 운영으로 프록시, 점검 사용자
 * x-rc-user `simcheck-adsblank-<날짜>-<학습><앱>`, Playwright chromium, 폰 크기 390×844. 로그인은 하지 않는다
 * (사람·Room·메시지는 로그인 카드가 보이는 그대로 찍음). 모델을 부르는 동작은 채팅 한 번(--chat 0이면 안 보냄).
 *
 * 결과: tmp/ads-blank/<학습>-<앱>/<장면>.png, tmp/ads-blank/shots.json(장면마다 ok·실패 이유).
 * 장면마다 따로 시도한다 — 하나가 막혀도 나머지는 찍는다. 끝에 점검 데이터를 지운다(forget.mjs).
 * 웹 화면이라 안드로이드 배너·네이티브(웹 위에 떠 있는 AdMob 층)는 그림에 없다 — 빈 공간 판단 때 감안.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { forgetAtEnd } from "../sim-users/forget.mjs";

const args = process.argv.slice(2);
const value = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 || at + 1 >= args.length ? fallback : args[at + 1];
};
const ROOT = process.cwd();
const WWW = path.join(ROOT, "www");
const API = (value("api", process.env.API_BASE) || "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const PORT = Number(process.env.PORT || 4198);
const COMBOS = value("combos", "en:ko").split(",").map((c) => {
  const [target, ui] = c.split(":");
  return { target, ui };
});
const ONLY = value("scenes", null)?.split(",") ?? null;
const CHAT_SENDS = Number(value("chat", "1"));
const DAY = new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10).replace(/-/g, "");
const RUN_ID = value("run-id", `adsblank-${DAY}`);
const OUT = path.join(ROOT, value("out", "tmp/ads-blank"));

if (!fs.existsSync(path.join(WWW, "index.html"))) {
  console.error("www/가 없어요. npm run build:capacitor를 먼저.");
  process.exit(2);
}
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const bank = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/sim-users/bank.json"), "utf8"));

/** copy.ts는 "@/"로 불러와 Node가 못 읽는다 — 경로를 바꾼 사본으로 읽고 바로 지운다(screens.mjs와 같은 방법). */
async function loadCopy() {
  const dir = path.join(ROOT, "tmp", "copycheck");
  fs.mkdirSync(dir, { recursive: true });
  const source = fs
    .readFileSync(path.join(ROOT, "src/lib/copy.ts"), "utf8")
    .replace('"@/lib/locales/generated.json"', '"../../src/lib/locales/generated.json" with { type: "json" }')
    .replace('"@/lib/locales/overlays.json"', '"../../src/lib/locales/overlays.json" with { type: "json" }')
    .replace('"@/lib/learningLanguages"', '"../../src/lib/learningLanguages.ts"');
  const file = path.join(dir, `ads-blank-${Date.now()}.ts`);
  fs.writeFileSync(file, source);
  try {
    return (await import(`file://${file}`)).copy;
  } finally {
    fs.rmSync(file, { force: true });
  }
}
const copy = await loadCopy();

// ── www + /api 프록시 (screens.mjs와 같음) ──
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".webp": "image/webp", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".jpg": "image/jpeg" };
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/")) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const headers = { ...req.headers };
    for (const h of ["host", "origin", "referer", "content-length"]) delete headers[h];
    try {
      const upstream = await fetch(API + req.url, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
      const type = upstream.headers.get("content-type") || "application/octet-stream";
      res.writeHead(upstream.status, { "content-type": type });
      if (type.includes("ndjson") && upstream.body) {
        for await (const chunk of upstream.body) res.write(chunk);
        res.end();
      } else {
        res.end(Buffer.from(await upstream.arrayBuffer()));
      }
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
const exactly = (text) => new RegExp(`^\\s*${escape(text)}\\s*$`);

// ── 도우미 ──
async function openMy(page, wait, ui) {
  await page.goto(`${BASE}/?screen=map`, { waitUntil: "domcontentloaded" });
  await wait(4500);
  // 처음 쓰는 점검 사용자는 단계 고르기 한 장(StageCheck)이 먼저 — "이 단계로 시작"을 눌러 지도를 만든다.
  const begin = ui ? page.getByRole("button", { name: exactly(ui.stageBegin) }) : null;
  if (begin && (await begin.count())) {
    await begin.first().click();
    for (let i = 0; i < 30 && !(await page.locator("[data-my-jump]").count()); i++) await wait(1000);
    await wait(2000);
  }
}
/** 화면 가운데에 손가락(마우스)을 두고 굴려 dy만큼 내린다 — 스크롤 칸이 탭 안쪽이라 위치가 있어야 먹는다. */
async function scrollBy(page, dy) {
  await page.mouse.move(195, 560);
  await page.mouse.wheel(0, dy);
}
async function openBank(page, wait, title, ui) {
  await openMy(page, wait, ui);
  const jump = page.locator("[data-my-jump] button", { hasText: title }).first();
  await jump.waitFor({ state: "visible", timeout: 8000 });
  await jump.click();
  await wait(2500);
}
/** 칸 안 문제 하나에 답한다: 쓰는 칸이면 틀린 낱말을 쓰고 Enter, 고르기면 첫 보기. */
async function answerOne(page, wait, ui, scope = "[data-inline-quiz]") {
  const box = page.locator(scope).last();
  await box.waitFor({ state: "visible", timeout: 8000 });
  const input = box.locator("input:visible, textarea:visible").first();
  if (await input.count()) {
    await input.fill("xyz");
    await input.press("Enter");
    await wait(1500);
    // 키보드는 없지만 쓰는 칸에서 손을 뗀 상태로 찍는다.
    await page.locator("body").click({ position: { x: 5, y: 5 } }).catch(() => undefined);
    const dunno = box.getByRole("button", { name: new RegExp(escape(ui.quizDontKnow ?? "@@none")) });
    if (await dunno.count()) await dunno.first().click().catch(() => undefined);
  } else {
    const choices = box.locator("button:visible:not([disabled])");
    if (!(await choices.count())) throw new Error("답할 보기·입력칸이 없음");
    await choices.nth(Math.min(1, (await choices.count()) - 1)).click();
    // 순서 맞추기(조각을 차례로 누르고 "확인")면 남은 조각을 다 눌러 넣고 확인한다.
    const confirm = box.getByRole("button", { name: /^\s*(확인|Check|Confirmar|確認)\s*$/ });
    if (await confirm.count()) {
      for (let i = 0; i < 14; i++) {
        const clicked = await box.evaluate((root) => {
          const pool = [...root.querySelectorAll("button:not([disabled])")].filter((b) => b.offsetParent && !b.closest(".border-dashed") && !/^(확인|Check|Confirmar|確認)$/.test(b.textContent.trim()) && b.textContent.trim().length && !b.getAttribute("aria-label"));
          if (!pool.length) return false;
          pool[0].click();
          return true;
        });
        if (!clicked) break;
        await wait(200);
      }
    }
    if (await confirm.count()) await confirm.first().click().catch(() => undefined);
  }
  await wait(1800);
}
/** Stagebank 전체 화면 → 단계 화면(오늘 할 것 아래 "n단계 ›", 오늘 끝났으면 이미 단계 화면). */
async function openStage(page, wait, ui) {
  await openBank(page, wait, ui.stagebankTitle, ui);
  const peek = page.locator("[data-peek-stage]");
  if (await peek.count()) {
    await peek.first().click();
    await wait(2500);
  }
}
async function quizTab(page, wait, ui, tab) {
  await openBank(page, wait, ui.keepTitle, ui);
  const button = page.locator(`[data-focus="${tab}"]`).first();
  await button.waitFor({ state: "visible", timeout: 8000 });
  await button.click();
  await wait(2500);
}

// ── 장면 ── run이 끝난 화면을 찍는다. ctx.shot(name)으로 중간 그림도.
const SCENES = [
  { id: "my-home", label: "My 첫 화면(세 칸 펼친 채)", run: async ({ page, wait, ui, shot }) => {
    await openMy(page, wait, ui);
    await shot("top");
    await scrollBy(page, 650);
    await wait(900);
    await shot("scroll1");
    await scrollBy(page, 650);
    await wait(900);
    await shot("scroll2");
    // Logbank 탭(2026-11-02 칸 이름 줄이 탭).
    await page.locator('[data-my-jump-to="log"]').first().click().catch(() => undefined);
    await wait(1500);
    await page.locator('[data-my-layer]').last().evaluate((el) => el.scrollIntoView({ block: "start" })).catch(() => undefined);
    await wait(900);
  } },
  { id: "stagebank-full", label: "Stagebank 탭(오늘 할 것 카드)", run: async ({ page, wait, ui }) => openBank(page, wait, ui.stagebankTitle, ui) },
  { id: "stage-screen", label: "Stagebank — n단계 화면(오늘 할 것 아래 n단계 ›)", run: async ({ page, wait, ui }) => {
    await openBank(page, wait, ui.stagebankTitle, ui);
    const more = page.getByRole("button", { name: /\d+\s*(단계|stage)|›/i }).last();
    if (!(await more.count())) throw new Error("n단계 버튼 없음");
    await more.click();
    await wait(2500);
  } },
  { id: "quizbank-full", label: "Quizbank 전체 화면", run: async ({ page, wait, ui }) => openBank(page, wait, ui.keepTitle, ui) },
  { id: "logbank-full", label: "Logbank 전체 화면", run: async ({ page, wait, ui }) => openBank(page, wait, ui.logbankTitle, ui) },
  { id: "quiz-vocab", label: "Quizbank 어휘 — 풀기 전", run: async ({ page, wait, ui }) => quizTab(page, wait, ui, "vocab") },
  { id: "quiz-vocab-answered", label: "Quizbank 어휘 — 답한 뒤", run: async ({ page, wait, ui }) => {
    await quizTab(page, wait, ui, "vocab");
    await answerOne(page, wait, ui);
  } },
  { id: "quiz-exam", label: "Quizbank 시험 탭", run: async ({ page, wait, ui }) => quizTab(page, wait, ui, "exam") },
  { id: "quiz-review", label: "Quizbank 다시 보기 탭", run: async ({ page, wait, ui }) => quizTab(page, wait, ui, "review") },
  { id: "quiz-review-answered", label: "Quizbank 다시 보기 — 답한 뒤", run: async ({ page, wait, ui }) => {
    await quizTab(page, wait, ui, "review");
    await answerOne(page, wait, ui);
  } },
  { id: "wordbook", label: "단어장 시트", run: async ({ page, wait, ui }) => {
    await quizTab(page, wait, ui, "vocab");
    await page.getByRole("button", { name: new RegExp(`^${escape(ui.vocabTitle)} \\d+`) }).first().click();
    await wait(2500);
  } },
  { id: "today-card", label: "오늘 할 것 카드(My 첫 화면 Stagebank 안)", run: async ({ page, wait, ui }) => {
    await openMy(page, wait, ui);
    const card = page.locator("[data-today-plan]").first();
    await card.waitFor({ state: "visible", timeout: 8000 });
    await card.evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.mouse.wheel(0, -60);
    await wait(900);
  } },
  { id: "lesson", label: "오늘 할 것 ▶ — 수업(설명 → 퀴즈 → 대화)", run: async ({ page, wait, ui, shot, state }) => {
    await openMy(page, wait, ui);
    // 오늘 할 것의 지금 항목이 퀴즈면(칸 안 문제) 하나 풀어 다음 항목으로 넘긴다(최대 6번).
    for (let i = 0; i < 6; i++) {
      if (await page.locator("[data-today-current]").count()) break;
      const inline = page.locator("[data-today-plan] [data-inline-quiz]");
      if (!(await inline.count())) break;
      await answerOne(page, wait, ui, "[data-today-plan] [data-inline-quiz]");
      const next = page.locator("[data-today-plan]").getByRole("button", { name: new RegExp(escape(ui.quizNext ?? "Next")) });
      if (await next.count()) await next.first().click().catch(() => undefined);
      await wait(1500);
    }
    const current = page.locator("[data-today-current]").first();
    await current.waitFor({ state: "visible", timeout: 8000 });
    state.lessonKind = await current.getAttribute("data-today-current");
    await current.click();
    await wait(5000);
    if (!(await page.locator("[data-lesson-steps]").count())) {
      await shot("opened");
      throw new Error(`지금 항목이 수업이 아님(${state.lessonKind}) — 연 화면만 -opened로 찍음`);
    }
    for (let i = 0; i < 20 && !(await page.locator("[data-lesson-explain]").count()); i++) await wait(1000);
    await shot("explain");
    await page.locator("[data-lesson-explain]").evaluate((el) => el.closest(".overflow-y-auto")?.scrollTo(0, 99999)).catch(() => undefined);
    await wait(600);
    await shot("explain-bottom");
    await page.locator("[data-lesson-next]").first().click();
    await wait(2000);
    await shot("quiz");
    await answerOne(page, wait, ui, "[data-lesson-quiz]").catch(() => undefined);
    await shot("quiz-answered");
    // 대화 단계는 지나간 단계만 누를 수 있다 — 퀴즈 세 문제를 넘겨 본다.
    for (let i = 0; i < 6 && !(await page.locator("[data-lesson-talk]").count()); i++) {
      const go = page.locator("[data-lesson-quiz]").getByRole("button", { name: new RegExp(`${escape(ui.quizNext ?? "Next")}|${escape(ui.scriptNext ?? "Next")}`) });
      if (await go.count()) await go.first().click().catch(() => undefined);
      await wait(1200);
      if (await page.locator("[data-lesson-talk]").count()) break;
      await answerOne(page, wait, ui, "[data-lesson-quiz]").catch(() => undefined);
    }
    if (!(await page.locator("[data-lesson-talk]").count())) {
      await shot("stuck");
      throw new Error("대화 단계로 못 감 — -stuck 그림");
    }
    await wait(1200);
    // 끝 화면(data-lesson-done)은 대화 세 줄을 말해야(마이크) 열려 여기서는 찍지 않는다 — 이 장면은 대화 단계 그림.
  } },
  { id: "talk-list", label: "대화 탭 목록", run: async ({ page, wait }) => {
    await page.goto(`${BASE}/?screen=talk`, { waitUntil: "domcontentloaded" });
    await wait(5000);
  } },
  { id: "chat-first", label: "AI 채팅 첫 화면", run: async ({ page, wait }) => {
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
    await wait(4500);
  } },
  { id: "chat-after", label: "AI 채팅 — 한 줄 오간 뒤", run: async ({ page, wait, ui, target }) => {
    if (!CHAT_SENDS) throw new Error("--chat 0: 채팅 안 보냄");
    await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
    await wait(4000);
    if (!(await page.locator("textarea:visible:not([disabled])").count())) throw new Error("입력칸이 없거나 잠김(2.76~ 무료는 채팅 없음 — 대본 플랜부터)");
    const lines = (bank.learner[target] ?? bank.learner.en).filter((l) => l.ok).map((l) => l.text);
    for (const line of lines.slice(0, CHAT_SENDS)) {
      const before = await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count();
      await page.locator("textarea:visible").first().fill(line);
      await page.getByRole("button", { name: exactly(ui.send) }).click();
      for (let i = 0; i < 60; i++) {
        await wait(500);
        if ((await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count()) > before) break;
      }
      await wait(2500);
    }
  } },
  { id: "video", label: "영상 학습 탭", run: async ({ page, wait, shot }) => {
    await page.goto(`${BASE}/?screen=video`, { waitUntil: "domcontentloaded" });
    await wait(5000);
    await shot("top");
    await scrollBy(page, 650);
    await wait(1200);
  } },
  { id: "people", label: "사람 탭", run: async ({ page, wait }) => {
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "domcontentloaded" });
    await wait(5000);
  } },
  { id: "rooms", label: "Room 로비", run: async ({ page, wait }) => {
    await page.goto(`${BASE}/?screen=rooms`, { waitUntil: "domcontentloaded" });
    await wait(5000);
  } },
  { id: "guide", label: "사용법(?)", run: async ({ page, wait, ui }) => {
    await openMy(page, wait, ui);
    await page.getByRole("button", { name: exactly(ui.guideOpen) }).first().click();
    await wait(3000);
  } },
  // ── 학습과 떨어진 자리(사용자 2026-11-01 23시 "학습에 영향을 주지 않는 자리 더") — 둘러보기·설정·안내 시트·고르기 화면 ──
  { id: "stage-bottom", label: "Stagebank 단계 화면 — 문장구조 목록 맨 아래", run: async ({ page, wait, ui, shot }) => {
    await openStage(page, wait, ui);
    await scrollBy(page, 900);
    await wait(900);
    await shot("mid");
    await page.locator("[data-my-layer]").last().evaluate((el) => {
      const box = el.closest(".overflow-y-auto") ?? el;
      box.scrollTo(0, 99999);
    }).catch(() => undefined);
    await scrollBy(page, 6000);
    await wait(1200);
  } },
  { id: "scope-sheet", label: "📖 배울 수 있는 것 시트", run: async ({ page, wait, ui, shot }) => {
    await openStage(page, wait, ui);
    await page.locator("[data-scope-open]").first().click();
    await wait(2500);
    await shot("top");
    await page.locator("[data-scope-sheet]").evaluate((el) => el.scrollTo(0, 99999));
    await wait(800);
  } },
  { id: "progress-sheet", label: "📈 내 진척 시트", run: async ({ page, wait, ui }) => {
    await openStage(page, wait, ui);
    await page.locator("[data-my-progress-open]").first().click();
    await wait(2500);
  } },
  { id: "way-sheet", label: "연습 방식 고르기 시트", run: async ({ page, wait, ui }) => {
    await openStage(page, wait, ui);
    await page.locator('[data-my-layer] button[aria-haspopup="dialog"]').first().click();
    await wait(2500);
  } },
  { id: "bank-help", label: "칸 ? 설명 시트(Stagebank)", run: async ({ page, wait, ui, shot }) => {
    await openBank(page, wait, ui.stagebankTitle, ui);
    await page.locator("[data-bank-help]").last().click();
    await wait(3000);
    await shot("top");
    await page.locator("[data-bank-help-sheet]").evaluate((el) => el.scrollTo(0, 99999));
    await wait(1000);
  } },
  { id: "tutor-sheet", label: "사람 탭 — AI 튜터 프로필 시트", run: async ({ page, wait, ui }) => {
    await page.goto(`${BASE}/?screen=people`, { waitUntil: "domcontentloaded" });
    await wait(5000);
    await page.getByRole("button", { name: exactly(ui.talkAiTutor) }).first().click();
    await wait(2000);
  } },
  { id: "lang-sheet", label: "언어 설정 시트(상단 국기)", run: async ({ page, wait, ui }) => {
    await openMy(page, wait, ui);
    await page.locator("[data-language-settings]").first().click();
    await wait(2000);
  } },
  { id: "feedback-sheet", label: "의견 보내기 시트", run: async ({ page, wait, ui }) => {
    await openMy(page, wait, ui);
    await page.getByRole("button", { name: exactly(ui.feedbackOpen) }).first().click();
    await wait(2000);
  } },
  { id: "guide-bottom", label: "사용법(?) — 맨 아래", run: async ({ page, wait, ui }) => {
    await openMy(page, wait, ui);
    await page.getByRole("button", { name: exactly(ui.guideOpen) }).first().click();
    await wait(3000);
    await scrollBy(page, 20000);
    await wait(1200);
  } },
  { id: "video-deep", label: "영상 학습 — 목록 더 아래", run: async ({ page, wait, shot }) => {
    await page.goto(`${BASE}/?screen=video`, { waitUntil: "domcontentloaded" });
    await wait(5000);
    await scrollBy(page, 1400);
    await wait(1200);
    await shot("1400");
    await scrollBy(page, 20000);
    await wait(1500);
  } },
  { id: "billing", label: "결제 화면", run: async ({ page, wait, ui }) => {
    await openMy(page, wait, ui);
    const open = page.getByRole("button", { name: new RegExp(escape(ui.billingOpen)) }).first();
    await open.click();
    await wait(3000);
  } },
];

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const results = [];
for (const { target, ui: locale } of COMBOS) {
  const ui = copy[locale];
  const dir = path.join(OUT, `${target}-${locale}`);
  fs.mkdirSync(dir, { recursive: true });
  const uid = `simcheck-${RUN_ID}-${target}${locale}`;
  const row = { combo: `${target}:${locale}`, uid, shots: [] };
  results.push(row);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: locale });
  const page = await context.newPage();
  const wait = (ms) => page.waitForTimeout(ms);
  const state = {};
  try {
    await page.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": uid } }));
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    // 처음 설치 언어 고르기(firstLanguage.ts needsLanguagePick)는 appTargetLanguage·appUiLocale이 있으면 안 뜬다.
    await page.evaluate(([t, l]) => {
      localStorage.setItem("appTargetLanguage", t);
      localStorage.setItem("appUiLocale", l);
      localStorage.setItem("chatOwnLanguageTipSeen", "1");
      localStorage.setItem("whatsNewSeenVersion", "999");
      localStorage.setItem("myViewMode.stageShown", "1");
    }, [target, locale]);
    for (const scene of SCENES) {
      if (ONLY && !ONLY.includes(scene.id)) continue;
      const file = path.join(dir, `${scene.id}.png`);
      const extra = [];
      const shot = async (name) => {
        const f = path.join(dir, `${scene.id}-${name}.png`);
        await page.screenshot({ path: f });
        extra.push(path.relative(ROOT, f));
      };
      try {
        await page.keyboard.press("Escape").catch(() => undefined);
        await scene.run({ page, ui, wait, target, locale, state, shot });
        await page.screenshot({ path: file });
        row.shots.push({ id: scene.id, label: scene.label, file: path.relative(ROOT, file), extra, ok: true });
        console.log(`${target}:${locale} ✓ ${scene.id}`);
      } catch (error) {
        const reason = String(error?.message ?? error).split("\n")[0].slice(0, 200);
        row.shots.push({ id: scene.id, label: scene.label, extra, ok: false, error: reason });
        console.log(`${target}:${locale} ✗ ${scene.id}: ${reason}`);
      }
    }
  } catch (error) {
    row.error = String(error?.message ?? error).slice(0, 300);
    console.log(`${target}:${locale} 준비 실패: ${row.error}`);
  } finally {
    await context.close();
  }
}
await browser.close();
server.close();
await forgetAtEnd(API, RUN_ID);
fs.writeFileSync(path.join(OUT, "shots.json"), JSON.stringify(results, null, 2));
const fails = results.flatMap((r) => r.shots.filter((s) => !s.ok).map((s) => `${r.combo} ${s.id}`));
console.log(`\n장면 ${results.reduce((n, r) => n + r.shots.filter((s) => s.ok).length, 0)}장 · 실패 ${fails.length}${fails.length ? ` (${fails.join(", ")})` : ""}`);

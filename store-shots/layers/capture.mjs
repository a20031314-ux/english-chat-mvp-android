// 스토어 8장(마케팅 층위 — hub/work/drafts/marketing-layers-2026-11-01.md §3)의 화면 조각 찍기.
// 실제 앱(www, /api는 운영 — 시험 사용자 simcheck-store-…, 끝나면 지움)과 운영 웹의 통화 미리 보기(/dev/call-preview)를 폰 크기로 찍어
// tmp/store-layers/<앱 언어>/<조각>.png 로 남긴다. 합치기는 compose.mjs.
// 순서(저장소 맨 위에서): npm run build:capacitor → CHROMIUM=/usr/bin/google-chrome node store-shots/layers/capture.mjs [ko]
import fs from "node:fs";
import path from "node:path";
import { chromium, serve, state, api, ROOT } from "../../scripts/ux-check/lib.mjs";

const ui = process.argv[2] ?? "ko";
const OUT = path.join(ROOT, "tmp", "store-layers", ui);
fs.mkdirSync(OUT, { recursive: true });
const PORT = Number(process.env.PORT || 4580);
const WEB = "https://english-chat-mvp.vercel.app";
const server = await serve(PORT);
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const run = `simcheck-store-${Date.now().toString(36)}`;
const { loadCopy: loadAllCopy } = await import("../../scripts/ux-check/lib.mjs");
const C = (await loadAllCopy())[ui];
const esc = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const done = [];

async function context(learn, stage) {
  state.uid = `${run}-${learn}`;
  if (stage) await api("/api/learner/self-check", { language: learn, stage: `${learn}-${stage}` });
  const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 3, colorScheme: "dark" });
  await ctx.addInitScript(([learn, ui]) => {
    if (sessionStorage.getItem("store-init")) return;
    sessionStorage.setItem("store-init", "1");
    localStorage.setItem("appTargetLanguage", learn);
    localStorage.setItem("appUiLocale", ui);
    localStorage.setItem("whatsNewSeenVersion", "9.99");
    localStorage.setItem("firstLanguagePicked.v1", "1");
    localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true }));
  }, [learn, ui]);
  return ctx;
}
const wait = (page, ms) => page.waitForTimeout(ms);
async function shot(name, target) {
  try {
    await target.screenshot({ path: path.join(OUT, `${name}.png`), timeout: 10000, animations: "disabled" });
    done.push(name);
  } catch (error) {
    console.log(`${name}: 못 찍음 ${String(error).slice(0, 100)}`);
  }
}
async function until(page, selector, tries = 40) {
  for (let i = 0; i < tries && !(await page.locator(selector).count()); i += 1) await wait(page, 500);
  return page.locator(selector).first();
}
/** 단계 화면 문장구조 목록에서 n번째 카드 → 수업 설명 → 퀴즈. */
async function lesson(learn, stage, index, prefix) {
  const ctx = await context(learn, stage);
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
  await until(page, "[data-stage-view] ul.grid li button");
  await wait(page, 2500);
  await page.locator("[data-up-next-bar] button[aria-label]").first().click({ timeout: 1000 }).catch(() => {});
  await page.locator("[data-stage-view] ul.grid li button").nth(index).click();
  await until(page, "[data-lesson-explain]");
  await wait(page, 4000);
  await shot(`${prefix}-explain`, page.locator("[data-lesson-explain]").first());
  await shot(`${prefix}-screen`, page);
  await page.locator("[data-lesson-next]").first().click().catch(() => {});
  await until(page, "[data-lesson-quiz]");
  await wait(page, 2500);
  await shot(`${prefix}-quiz`, page.locator("[data-lesson-quiz]").first());
  // 한 문제 풀고(고르기면 보기 하나) 결과까지.
  const quiz = page.locator("[data-lesson-quiz] section[data-kind]").first();
  if ((await quiz.getAttribute("data-kind").catch(() => null)) === "choose") await quiz.locator("button.rounded-xl").first().click().catch(() => {});
  await wait(page, 2000);
  await shot(`${prefix}-quiz-answered`, page.locator("[data-lesson-quiz]").first());
  await ctx.close();
}
/** Quizbank 탭(어휘·다시 보기)의 문제와 답한 뒤. wrongFirst면 몇 문제를 틀리고 다시 보기 탭으로. */
async function quizbank(learn, stage, prefix, wrongFirst = false, pick = null) {
  const ctx = await context(learn, stage);
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
  await until(page, '[data-my-jump-to="keep"]');
  await wait(page, 2000);
  await page.locator('[data-my-jump-to="keep"]').first().click();
  const keep = page.locator('[data-my-layer="keep"]').first();
  await until(page, '[data-my-layer="keep"] section[data-kind]');
  await wait(page, 2500);
  let correct = null;
  const answer = async (right) => {
    const q = keep.locator("section[data-kind]").first();
    const kind = await q.getAttribute("data-kind").catch(() => null);
    if (kind === "choose") {
      const options = q.locator("button.rounded-xl");
      // 같은 사용자·같은 날이면 첫 고르기 문제가 같다 — 앞 판에서 본 정답(pick)을 고른다.
      // 악센트·대소문자를 빼고 비교(Él·El) — 못 찾으면 고르지 않고 실패로 남긴다(오답 화면을 찍지 않게).
      const norm = (text) => String(text).normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase();
      let index = right ? 0 : 1;
      // 문제의 정답은 화면 부품(React)이 들고 있는 question.answer에서 읽는다 — 찍을 때만, 앱은 그대로.
      const answer = await q.evaluate((el) => {
        const key = Object.keys(el).find((k) => k.startsWith("__reactFiber$"));
        for (let f = key ? el[key] : null; f; f = f.return) {
          const qq = f.memoizedProps?.question;
          if (qq && Array.isArray(qq.options) && typeof qq.answer === "number") return qq.options[qq.answer];
        }
        return null;
      }).catch(() => null);
      const want = answer ?? pick;
      if (want) {
        const texts = await options.allInnerTexts().catch(() => []);
        const found = texts.findIndex((text) => norm(text) === norm(want));
        if (found >= 0) index = right ? found : texts.findIndex((_, i) => i !== found);
        else console.log(`정답 "${want}"을 보기에서 못 찾음: ${texts.join(" / ")}`);
      }
      await options.nth(Math.max(0, index)).click().catch(() => {});
      await wait(page, 600);
      correct = (await q.locator("button.border-good").first().innerText().catch(() => "")).trim() || null;
    } else {
      await q.locator("input").first().fill(right ? "the" : "zzz").catch(() => {});
      await q.locator("input").first().press("Enter").catch(() => {});
    }
    await wait(page, 3500);
  };
  const next = async () => {
    const button = keep.getByRole("button", { name: new RegExp(`^(${esc(C.scriptNext)}|${esc(C.quizNext)})`) }).last();
    await button.click({ timeout: 2000 }).catch(() => {});
    await wait(page, 2000);
  };
  if (!wrongFirst) {
    // 고르기 문제가 나올 때까지 몇 문제(빈칸 쓰기는 건너뜀 — 모르겠어요).
    for (let i = 0; i < 8; i += 1) {
      const kind = await keep.locator("section[data-kind]").first().getAttribute("data-kind").catch(() => null);
      if (kind === "choose") break;
      await keep.getByRole("button", { name: C.markUnknown, exact: true }).first().click({ timeout: 1500 }).catch(() => {});
      await wait(page, 1500);
      await next();
    }
    await shot(`${prefix}-q1`, keep.locator("section[data-kind]").first());
    await answer(true);
    await shot(`${prefix}-q1-answered`, keep.locator("section[data-kind]").first());
    await shot(`${prefix}-layer`, keep);
  } else {
    for (let i = 0; i < 5; i += 1) {
      await answer(false);
      await next();
    }
    await page.locator('[data-study-focus] [data-focus="review"]').first().click().catch(() => {});
    await wait(page, 4000);
    await shot(`${prefix}-q`, keep.locator("section[data-kind]").first());
    await shot(`${prefix}-layer`, keep);
  }
  await ctx.close();
  return correct;
}
/** 지난 통화(끼움) 돌아보기 — 통화 요약·고친 말·통화 정리. */
async function pastCall(learn, prefix, said) {
  const ctx = await context(learn, 1);
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
  const now = Date.now();
  await page.evaluate(([said, language, at]) => {
    localStorage.setItem("roleplayConversations", JSON.stringify([{
      id: "store-capture", scenarioId: "cafe-order", language,
      title: said.find((l) => l.who === "learner").text, startedAt: at - 312000, updatedAt: at, finishedAt: at,
      state: { scenarioId: "cafe-order", nodeId: "done", mode: "free", difficulty: {}, attempts: 0, hintShown: false, listeningSince: null, visited: [], queue: [], pending: null, freeTurns: 0, directedTurns: 0, history: [], closing: false, finished: true },
      said, memory: { text: "", upTo: 0 },
    }]));
  }, [said, learn, now]);
  await page.goto(`http://localhost:${PORT}/?screen=people`, { waitUntil: "domcontentloaded" });
  await wait(page, 3500);
  const copy = JSON.parse(fs.readFileSync(path.join(ROOT, "tmp", "store-layers", "copy.json"), "utf8"))[ui];
  await page.getByRole("button", { name: copy.talkAiTutor, exact: true }).first().click();
  await wait(page, 800);
  await page.getByRole("button", { name: copy.callRecordsTitle, exact: true }).first().click();
  await wait(page, 800);
  await page.getByRole("button", { name: copy.packSeeRetro, exact: true }).first().click();
  await wait(page, 2500);
  await shot(`${prefix}-review-first`, page);
  const next = page.locator(`[data-call-pages] button[aria-label="${copy.studyChapterNext}"]`).last();
  for (let i = 0; i < 12 && (await next.count()) && (await next.isEnabled().catch(() => false)); i += 1) {
    await next.click();
    await wait(page, 700);
  }
  await until(page, "[data-call-recap]", 20);
  await wait(page, 1500);
  await shot(`${prefix}-recap`, page.locator("[data-call-recap]").first());
  await shot(`${prefix}-recap-screen`, page);
  await ctx.close();
}
/** 운영 웹의 통화 미리 보기(개발용 부품 화면 — 마이크·계정 없이). */
async function preview(name, query) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 3, colorScheme: "dark" });
  const page = await ctx.newPage();
  await page.goto(`${WEB}/dev/call-preview?${query}`, { waitUntil: "networkidle" }).catch(() => {});
  await wait(page, 2500);
  await shot(name, page);
  await ctx.close();
}

// 앱 문구(통화 기록 메뉴 이름 등) — compose와 같이 쓴다.
const { loadCopy } = await import("../../scripts/ux-check/lib.mjs");
const allCopy = await loadCopy();
fs.writeFileSync(path.join(ROOT, "tmp", "store-layers", "copy.json"), JSON.stringify(allCopy));

const PAST_EN = [
  { who: "tutor", text: "Hi! How was your weekend?" },
  { who: "learner", text: "I am go cafe yesterday and drink coffee much", meant: "I went to a cafe yesterday and drank a lot of coffee." },
  { who: "tutor", text: "Oh, nice! Which cafe did you go to?" },
  { who: "learner", text: "The new one near my office." },
  { who: "tutor", text: "I've heard it's great. Was it busy?" },
  { who: "learner", text: "Yes, very busy. I wait long time", better: "Yes, it was really busy. I waited a long time." },
  { who: "tutor", text: "Good coffee is worth the wait!" },
];

const PAST_JA = [
  { who: "tutor", text: "やあ！週末はどうだった？" },
  { who: "learner", text: "昨日カフェ行くとコーヒーたくさん飲むした", meant: "昨日カフェに行って、コーヒーをたくさん飲んだ。" },
  { who: "tutor", text: "いいね！どのカフェに行ったの？" },
  { who: "learner", text: "会社の近くの新しいところ。" },
  { who: "tutor", text: "そこ、評判いいよね。混んでた？" },
  { who: "learner", text: "はい、とても混む。長い待った", better: "うん、すごく混んでた。長く待ったよ。" },
  { who: "tutor", text: "おいしいコーヒーのためならしかたないね！" },
];
const PAST = { en: PAST_EN, ja: PAST_JA };

// 장마다 그림 속 학습 언어(strings.mjs ROLES — 앱 언어와 겹치지 않게), 조각 이름은 역할 이름(lesson1-…·quiz-…·review-…·past-…·call-…).
const { rolesFor, COACH, COACH_WHY } = await import("./strings.mjs");
const R = rolesFor(ui);
// ONLY=quiz,call 처럼 일부만 다시 찍기(lesson·quiz·review·call·preview).
const only = (process.env.ONLY ?? "").split(",").filter(Boolean);
const want = (part) => !only.length || only.includes(part);
try {
  if (want("lesson")) await lesson(R.lesson2, 4, 0, "lesson2");
  if (want("lesson")) await lesson(R.lesson1, 3, 1, "lesson1");
  // 첫 판은 정답을 알아내고, 둘째 판(같은 사용자 — 문제가 같음)에서 정답을 골라 찍는다.
  if (want("quiz")) await quizbank(R.quiz, 4, "quiz");
  if (want("review")) await quizbank(R.review, 3, "review", true);
  if (want("call")) await pastCall(R.past, "past", PAST[R.past] ?? PAST_EN);
  const coach = COACH[R.call] ?? COACH.ja;
  const card = new URLSearchParams({ said: coach.said, right: coach.right, why: COACH_WHY[ui] ?? COACH_WHY.en }).toString();
  if (want("preview")) await preview("call-live", `v=ai&lang=${ui}&learn=${R.call}&card=fix&${card}`);
  if (want("preview")) await preview("call-end", `v=ai-end&lang=${ui}&learn=${R.past}`);
  if (want("preview")) await preview("people-call", `v=call3&lang=${ui}&learn=ja`);
  if (want("preview")) await preview("people-group", `v=group&lang=${ui}&learn=ja`);
} finally {
  for (const learn of new Set(Object.values(R))) await api("/api/simcheck/forget", { prefix: `${run}-${learn}` }).catch(() => {});
  await browser.close();
  server.close();
  console.log(`${ui}: ${done.length}장 ${done.join(" ")}`);
}

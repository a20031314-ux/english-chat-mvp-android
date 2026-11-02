// 홍보 쇼츠 "Logbank" 편 녹화(사용자 2026-11-03 "logbank로도 하나"): My → Logbank 육각형 → 꼭짓점 → 세부 칸 → 부족한 것·추천 → 날마다 막대 → 그날 기록.
// 일주일 공부한 사람처럼 이 폰 기록(Quizbank 날마다·수업 결과·통화·처음 체크)을 넣고 연다 — 서버 기록은 없음(시험 사용자).
// 결과: tmp/promo/logbank/<locale>/raw.mp4 + events.json → node store-shots/promo/make.mjs logbank <locale>
//
// Run: node --experimental-strip-types store-shots/promo/record-logbank.mjs en es
import fs from "node:fs";
import path from "node:path";
import { record } from "./harness.mjs";

const locale = process.argv[2] || "en";
const target = process.argv[3] || "es";
const ROOT = process.cwd();
const OUT = path.join(ROOT, "tmp", "promo", "logbank", locale);
fs.mkdirSync(OUT, { recursive: true });

// 그 언어 빈도 낱말 앞쪽 · 1~3단계 문장구조 id(실제 열쇠여야 육각형이 셈).
const vocabSrc = fs.readFileSync(path.join(ROOT, "src", "lib", "curriculum", "vocab", `${target}.ts`), "utf8");
const words = [...vocabSrc.matchAll(/^\s*\["([^"]+)"/gm)].map((m) => m[1]).slice(20, 520);
const frameSrc = fs.readFileSync(path.join(ROOT, "src", "lib", "curriculum", "frames", `${target}.ts`), "utf8");
const frames = [...frameSrc.matchAll(/"id": "([a-z]+-f[1-3]-\d+)"/g)].map((m) => m[1]);
// 수업 결과 카드 제목 = 그 틀의 모양(앱이 남기는 것과 같게).
const patterns = Object.fromEntries([...frameSrc.matchAll(/"id": "([a-z]+-f\d-\d+)",[\s\S]*?"pattern": "([^"]+)"/g)].map((m) => [m[1], m[2]]));
if (words.length < 200 || frames.length < 20) throw new Error(`not enough keys for ${target}: ${words.length} words, ${frames.length} frames`);

const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const events = await record({
  root: ROOT,
  out: OUT,
  user: `promo-logbank-${day}-${locale}-${target}-${process.pid}`,
  locale,
  target,
  port: 4295,
  path: "/?screen=map",
  routes: async (context) => {
    await context.addInitScript(([t, words, frames, patterns]) => {
      if (sessionStorage.getItem("promoSeeded")) return;
      sessionStorage.setItem("promoSeeded", "1");
      const now = Date.now();
      const D = (k) => {
        const d = new Date(now - k * 864e5);
        return [d, `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`];
      };
      const quiz = {};
      const results = [];
      const calls = {};
      let w = 0;
      let f = 0;
      for (const k of [6, 5, 4, 3, 2, 1, 0]) {
        const [d, dayKey] = D(k);
        const okc = words.slice(w, w + 22).map((x) => `w|${x}`);
        const okt = words.slice(w + 22, w + 34).map((x) => `w|${x}`);
        w += 40;
        const fOk = frames.slice(f, f + 3).map((x) => `f|${x}`);
        const fBad = frames.slice(f + 3, f + 4).map((x) => `f|${x}`);
        f += 3;
        const wrong = [...words.slice(w - 6, w - 3).map((x) => `w|${x}`), ...fBad];
        quiz[dayKey] = { n: okc.length + okt.length + fOk.length + wrong.length, right: okc.length + okt.length + fOk.length, okc, okt: [...okt, ...fOk], wrong, wt: fBad };
        if (k % 2 === 0) {
          const id = frames[(6 - k) * 2];
          results.push({ kind: "lesson", item: id, key: `f|${id}`, title: patterns[id] ?? id, right: 3, total: 3, passed: true, said: [], at: d.getTime(), day: dayKey, secs: 260 + k * 20 });
        }
        if (k % 3 !== 1) calls[`c${k}`] = { day: dayKey, at: d.getTime() + 3600e3, seconds: 240 + k * 50, fixed: 2, redone: 1, turns: { n: 9, ok: 6, lead: 2, native: 1, hint: 1, missed: 1 } };
      }
      localStorage.setItem(`quizDays.v1.${t}`, JSON.stringify(quiz));
      localStorage.setItem(`dayLog.v1.${t}`, JSON.stringify(results));
      localStorage.setItem(`callDays.v1.${t}`, JSON.stringify(calls));
      localStorage.setItem("fillCheck.v1", JSON.stringify({ [t]: "mid" }));
      localStorage.setItem("appLearningLanguages", JSON.stringify([t]));
    }, [target, words, frames, patterns]);
  },
  scene: async (page, { tap, mark, events, startScreencast }) => {
    // 처음이면 단계 고르기 — 1단계로 시작.
    const start = page.locator("button").filter({ hasText: /^Start here$/ }).last();
    await page.waitForTimeout(4000);
    if (await start.count()) {
      await start.click();
      await page.waitForTimeout(5000);
    }
    await page.locator("[data-my-jump-to=log]").last().waitFor({ timeout: 30000 });
    await startScreencast();
    await page.waitForTimeout(1200);
    mark("my");
    await tap(page.locator("[data-my-jump-to=log]").last());
    await page.locator("[data-skill-hexagon]").first().waitFor({ timeout: 30000 });
    // 이번 주는 월요일부터라 날이 적다 — 지난 주(일주일 꽉 찬 기록)로.
    await page.waitForTimeout(800);
    await tap(page.locator('[data-log-period] button[aria-label="‹"]').first()).catch(() => {});
    mark("hexagon");
    await page.waitForTimeout(3200);
    events.axes = await page.locator("[data-skill-axis]").allInnerTexts().catch(() => []);
    // 꼭짓점: 말해 보기(대화) 쪽이 보통 약함 — 문장 활용 꼭짓점.
    // <g> 상자 가운데는 빈 곳일 수 있어 그 꼭짓점의 이름 글자를 누른다.
    await tap(page.locator('[data-skill-axis="sentUse"] text').first());
    mark("axisTap");
    await page.locator("[data-skill-detail]").first().waitFor({ timeout: 15000 });
    await page.waitForTimeout(3000);
    events.detail = (await page.locator("[data-skill-detail]").first().innerText()).slice(0, 600);
    // 📎 기록: 그 갈래의 날마다 막대 → 오늘을 누르면 그날 한 일.
    await tap(page.locator('[data-skill-tab="records"]').last());
    mark("records");
    const chart = page.locator("[data-log-chart]").last();
    await chart.waitFor({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2600);
    mark("chart");
    // 가장 높은 막대(한 일이 가장 많은 날).
    const at = await page.evaluate(() => {
      const bars = [...document.querySelectorAll("[data-log-bar]")];
      const h = bars.map((b) => [...b.querySelectorAll("rect, div")].reduce((n, r) => n + r.getBoundingClientRect().height, 0));
      return h.indexOf(Math.max(...h));
    });
    const bar = page.locator("[data-log-bar]").nth(Math.max(0, at));
    if (await bar.count()) {
      await tap(bar);
      mark("barTap");
      await page.waitForTimeout(3400);
      events.daySheet = (await page.locator("[data-log-sheet]").last().innerText().catch(() => "")).slice(0, 600);
    }
    mark("sheet");
  },
});
console.log(JSON.stringify(events, null, 2));

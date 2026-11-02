// 홍보 쇼츠 "통화" 편 녹화: AI 튜터에게 📞 → 튜터가 먼저 말을 걸고 → 내가 틀리게 말하면 내 말 아래 "이렇게 말하려던 거죠?" → 이어서 한 마디 더.
// 마이크는 가짜(그 언어 TTS로 만든 짧은 말 + 쉼을 반복), 받아쓰기(/api/roleplay/listen)만 정해 둔 줄로 — 나머지(튜터 답·고친 말)는 운영.
// 결과: tmp/promo/call/<locale>-<target>/raw.mp4 + events.json. 그다음 node store-shots/promo/make.mjs call <locale> --target <target>.
//
// Run: node --experimental-strip-types store-shots/promo/record-call.mjs en ko
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { SPEECH } from "./combos.mjs";
import { loadCopy, record } from "./harness.mjs";

const locale = process.argv[2] || "en";
const target = process.argv[3] || "ko";
const ROOT = process.cwd();
const OUT = path.join(ROOT, "tmp", "promo", "call", `${locale}-${target}`);
const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";

/** 내가 할 말(받아쓰기 결과로 돌려줌): 첫 줄은 시제·조사 틀림, 둘째 줄은 맞게. */
const LINES = {
  ko: ["어제 카페 가요 커피 많이 마셔요", "회사 근처에 새로 생긴 곳이에요"],
  es: ["Ayer yo voy a un café y bebo mucho café", "Es un sitio nuevo cerca de mi trabajo"],
  ja: ["昨日カフェに行きます、コーヒーたくさん飲みます", "会社の近くに新しくできた店です"],
  fr: ["Hier je vais au café et je bois beaucoup de café", "C'est un nouvel endroit près de mon travail"],
  en: ["Yesterday I go to cafe and drink coffee a lot", "It's a new place near my office"],
  zh: ["昨天我去咖啡店，喝很多咖啡", "是我公司附近新开的店"],
};
const lines = LINES[target];
if (!lines) throw new Error(`no lines for ${target}`);

// 가짜 마이크: 첫 줄을 그 언어 목소리로 + 2.5초 쉼(말이 끝났다고 알아듣게).
fs.mkdirSync(OUT, { recursive: true });
const mic = path.join(OUT, "mic.wav");
if (!fs.existsSync(mic)) {
  const pcm = path.join(OUT, "mic.pcm");
  execFileSync("curl", ["-sSf", "-o", pcm, "-H", `x-rc-user: promo-voice-${target}`, `${API}/api/tts?text=${encodeURIComponent(lines[0])}&lang=${SPEECH[target] ?? "en-US"}`]);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", pcm, "-af", "apad=pad_dur=2.5", "-ar", "48000", mic]);
}

const ui = (await loadCopy(ROOT))[locale];
const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
let said = 0;
let coachRight = "";
const heardAt = [];

// 2026-11-03 새 통화 화면(위 튜터 얼굴·자막 한 줄, 아래 내 얼굴, 🎓 튜터 수업 카드)으로 다시 씀:
// 📞 → 튜터 인사(자막) → 자막을 눌러 해석 → 틀리게 말함 → 🎓 카드(✎ 틀린 곳 → 🔁 고친 문장) → 고친 문장을 다시 말함 → ✓ → 끝내기 → 통화 요약·정리.
const events = await record({
  root: ROOT,
  out: OUT,
  user: `promo-call-${day}-${locale}-${target}-${process.pid}`,
  locale,
  target,
  port: 4294,
  micWav: mic,
  routes: async (context) => {
    // 통화는 유료 기능 — 이 장면만 플러스로 보이게(앱이 받는 답만).
    await context.route("**/api/entitlement*", async (route) => {
      const response = await route.fetch().catch(() => null);
      if (!response) return route.fallback();
      const body = await response.json();
      const terms = body.plans?.plus ?? {};
      Object.assign(body, { plan: "plus", tier: "plus", isPremium: true, dailyLimit: terms.dailyChat ?? 50, callDailyMinutes: 10, callTodayLeftSeconds: 600 });
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
    });
    await context.addInitScript(() => {
      localStorage.setItem("roleplayCaptions", "1");
      localStorage.setItem("callCoach.v1", "1");
    });
    await context.route("**/api/roleplay/listen", async (route) => {
      // 첫 줄은 틀린 말, 둘째는 카드가 고쳐 준 문장 그대로(다시 말하기), 그다음은 둘째 준비 줄.
      let text = "";
      if (said === 0) text = lines[0];
      else if (said === 1) {
        for (let i = 0; i < 60 && !coachRight; i++) await new Promise((r) => setTimeout(r, 500));
        text = coachRight || lines[1];
      } else if (said === 2) text = lines[1];
      if (text) {
        said += 1;
        heardAt.push(Date.now() / 1000);
      }
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ text }) });
    });
  },
  scene: async (page, { tap, mark, events, startScreencast }) => {
    await page.locator("textarea:visible").first().waitFor();
    await page.waitForTimeout(2500);
    await startScreencast();
    await page.waitForTimeout(1000);
    await tap(page.locator("button", { hasText: "📞" }).first());
    mark("callTap");
    await page.locator("[data-call-stage]").first().waitFor({ timeout: 30000 });
    mark("stage");
    // 튜터 첫 인사가 자막에 뜨면 눌러 해석.
    const caption = page.locator("[data-call-caption]").first();
    await caption.waitFor({ timeout: 60000 });
    await page.waitForFunction(() => (document.querySelector("[data-call-caption]")?.textContent ?? "").trim().length > 3, null, { timeout: 60000 });
    await page.waitForTimeout(1800);
    mark("greet");
    await tap(caption);
    mark("captionTap");
    await page.waitForTimeout(2600);
    events.caption = await caption.innerText().catch(() => "");
    // 틀린 말 → 🎓 카드.
    await page.locator("[data-call-coach]").first().waitFor({ timeout: 120000 });
    mark("coach");
    await page.waitForTimeout(800);
    coachRight = ((await page.locator("[data-call-redo]").first().innerText()) || "").replace(/^[🔁✓💡]\s*/u, "").trim();
    events.coachRight = coachRight;
    events.coachCard = await page.locator("[data-call-coach]").first().innerText();
    // 다시 말해 맞히면 ✓.
    await page.waitForFunction(() => /^\s*✓/.test(document.querySelector("[data-call-redo]")?.textContent ?? ""), null, { timeout: 120000 }).catch(() => {});
    mark("pass");
    events.passCard = await page.locator("[data-call-coach]").first().innerText().catch(() => "");
    await page.waitForTimeout(4500);
    mark("afterPass");
    // 끝내기 → 요약·정리.
    await tap(page.getByRole("button", { name: ui.roleplayPause }).last());
    mark("endTap");
    await page.locator("[data-call-summary]").first().waitFor({ timeout: 60000 });
    mark("summary");
    await page.waitForTimeout(3500);
    events.summaryText = (await page.locator("body").innerText()).slice(0, 1500);
    events.heard = said;
  },
});
events.heardAt = heardAt.map((t) => +(t - (events.start ?? 0)).toFixed(3));
fs.writeFileSync(path.join(OUT, "events.json"), JSON.stringify(events, null, 2));
console.log(JSON.stringify(events, null, 2));

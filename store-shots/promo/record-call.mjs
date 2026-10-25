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
const heardAt = [];

const events = await record({
  root: ROOT,
  out: OUT,
  user: `promo-call-${day}-${locale}-${target}-${process.pid}`,
  locale,
  target,
  port: 4294,
  micWav: mic,
  routes: async (context) => {
    await context.route("**/api/roleplay/listen", async (route) => {
      // 정해 둔 줄을 차례로, 다 하면 빈 말(아무 말 안 함).
      const text = said < lines.length ? lines[said] : "";
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
    await page.waitForTimeout(1200);
    const call = page.locator("button", { hasText: "📞" }).first();
    await tap(call);
    mark("callTap");
    // 튜터 말에 번역을 켠다(영어 시청자가 따라오게).
    const trans = page.getByRole("button", { name: new RegExp(`^${ui.roleplayTranslations}$`) }).first();
    await trans.waitFor({ timeout: 30000 });
    await page.waitForTimeout(600);
    await tap(trans);
    mark("transTap");
    // 튜터의 첫 인사.
    const tutorLines = page.locator("main, body").locator("div").filter({ hasText: /\S/ });
    await page.waitForFunction((t) => !document.body.innerText.includes(t) && document.querySelectorAll("button").length > 0, "\u0000");
    // 내 첫 줄이 보일 때까지.
    await page.getByText(lines[0], { exact: false }).first().waitFor({ timeout: 90000 });
    mark("said1");
    const chip = page.getByRole("button", { name: new RegExp(ui.chatCorrectionChip) }).filter({ visible: true }).last();
    await chip.waitFor({ timeout: 60000 });
    mark("chip");
    // 튜터 답이 다 올라온 뒤에 누른다(줄이 다시 그려지면 열린 게 닫힘). 열린 걸 "이렇게 말하려던 거죠?/이렇게 말해도 돼요" 글로 확인, 안 열리면 다시.
    const opened = () => page.evaluate(([a, b]) => document.body.innerText.toUpperCase().includes(a.toUpperCase()) || document.body.innerText.toUpperCase().includes(b.toUpperCase()), [ui.roleplayMeant, ui.roleplayBetter]);
    await page.waitForTimeout(3500);
    for (let k = 0; k < 4 && !(await opened()); k++) {
      if (k === 0) mark("chipTap");
      await tap(page.getByRole("button", { name: new RegExp(ui.chatCorrectionChip) }).filter({ visible: true }).last()).catch(() => {});
      await page.waitForTimeout(1500);
    }
    mark("open");
    events.opened = await opened();
    events.fixText = (await page.locator("body").innerText()).slice(0, 1500);
    // 둘째 줄과 튜터의 다음 말.
    await page.getByText(lines[1], { exact: false }).first().waitFor({ timeout: 90000 });
    mark("said2");
    let last = "";
    let steady = 0;
    for (let i = 0; i < 40 && steady < 5; i++) {
      await page.waitForTimeout(600);
      const now = await page.locator("body").innerText();
      steady = now === last ? steady + 1 : 0;
      last = now;
    }
    mark("reply2");
    events.finalText = last.slice(0, 1500);
    await page.waitForTimeout(1500);
    events.heard = said;
  },
});
events.heardAt = heardAt.map((t) => +(t - (events.start ?? 0)).toFixed(3));
console.log(JSON.stringify(events, null, 2));

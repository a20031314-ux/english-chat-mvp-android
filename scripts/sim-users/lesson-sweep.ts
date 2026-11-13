/**
 * 수업 통화 전수 점검 — 14 학습 언어 × 14 앱 언어 = 196조합, 조합마다 수업 통화 한 바퀴(첫 틀 → 다음 틀, 9차례 안팎).
 * lesson-call.ts(4조합, 실수 넣은 학습자)와 달리 학습자는 틀 예문만 말한다 — 흐름이 모든 조합에서 도는지 본다.
 *   학습자: 보여 주기 뒤 빈칸 낱말만 → 끌어내기에 바른 틀 → 옮겨 쓰기에 바른 틀 → "새로운 거 해 봐요"(학습 언어)
 * 자동 판정(조합마다):
 *   fail  — 응답 오류(200 아님) · 넘어가기 실패(좋다고 해도 move 없음) · 바른 틀 말에 다시 말해 보기(retry=ask)
 *   warn  — 첫 마디 "들렸어요?" · 보여 주기에 틀이 안 나옴 · 튜터 말에 앱 언어 글자(라틴 아닌 앱 언어, 다시 말해 보기 차례 빼고)
 * 실행: NODE_USE_ENV_PROXY=1 node --experimental-strip-types scripts/sim-users/lesson-sweep.ts <실행 이름> [동시 수=6] [학습:앱,…]
 * 결과: tmp/sim-users/lesson-sweep-<실행>.json · 끝나면 forget.mjs lsweep<실행>-
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { allFramesFor } from "../../src/lib/curriculum/frames.ts";
import { advanceRun, currentItem, lessonRequestOf, patternIn, pickLesson, startRun } from "../../src/lib/roleplay/lessonPlan.ts";
import { CAUGHT_IT } from "../../src/lib/roleplay/director.ts";
import { sentencesOf } from "../../src/lib/roleplay/reactions.ts";

const API = process.env.API_BASE ?? "https://english-chat-mvp.vercel.app";
const RUN = process.argv[2] ?? "x";
const PARALLEL = Number(process.argv[3] ?? 6);
const ONLY = process.argv[4]?.split(",") ?? null;
const LANGS = ["en", "ja", "es", "zh", "th", "ko", "vi", "fr", "it", "pt", "ru", "id", "ar", "hi"];
const YES: Record<string, string> = {
  en: "Sure, let's try something new.",
  ja: "はい、新しいことをやりましょう。",
  es: "Sí, vamos a probar algo nuevo.",
  zh: "好的，我们试试新的吧。",
  th: "ได้ครับ ลองอย่างอื่นกัน",
  ko: "네, 다른 거 해 봐요.",
  vi: "Vâng, mình thử cái mới nhé.",
  fr: "Oui, essayons quelque chose de nouveau.",
  it: "Sì, proviamo qualcosa di nuovo.",
  pt: "Sim, vamos tentar algo novo.",
  ru: "Да, давайте попробуем что-то новое.",
  id: "Ya, ayo coba yang baru.",
  ar: "نعم، لنجرّب شيئًا جديدًا.",
  hi: "हाँ, चलिए कुछ नया करते हैं।",
};
const NATIVE_SCRIPT: Partial<Record<string, RegExp>> = {
  ko: /\p{Script=Hangul}/u,
  ja: /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
  ar: /\p{Script=Arabic}/u,
  th: /\p{Script=Thai}/u,
  hi: /\p{Script=Devanagari}/u,
  ru: /\p{Script=Cyrillic}/u,
};
const say = (d: { react?: { text?: string }; say?: string | { text?: string } }) =>
  [d.react?.text, typeof d.say === "string" ? d.say : d.say?.text].filter(Boolean).join(" ");

type Turn = { step?: string; pattern: string; heard: string; tutor: string; status: number; retry: string; move: boolean };
type Result = { combo: string; turns: Turn[]; fails: string[]; warns: string[] };

async function one(lang: string, ui: string): Promise<Result> {
  const frames = allFramesFor(lang);
  let run = startRun(pickLesson({ frames, events: [], start: 1, spot: null }).items);
  const history: { who: string; text: string }[] = [];
  const turns: Turn[] = [];
  const fails: string[] = [];
  const warns: string[] = [];
  let heard = "";
  let moves = 0;
  let askedYes = 0;
  for (let at = 0; at < 11 && run && run.at < 2; at += 1) {
    const frame = frames.find((f) => `f|${f.id}` === currentItem(run)?.key)!;
    const lesson = lessonRequestOf(frames, run, at === 0 ? "open" : undefined);
    const body = { scenarioId: `open-talk-${lang}`, nodeId: "talk", heard, history, mode: "free", freeTurns: at, directedTurns: at, level: 1, nativeLanguage: ui, tutorGender: at % 2 ? "m" : "f", coach: true, ...(lesson ? { lesson } : {}) };
    let status = 0;
    let d: Record<string, unknown> = {};
    for (let tries = 0; tries < 2 && status !== 200; tries += 1) {
      const res = await fetch(`${API}/api/roleplay/turn`, { method: "POST", headers: { "content-type": "application/json", "x-rc-user": `simcheck-lsweep${RUN}-${lang}${ui}`, "x-app-version": "sim-users", "x-tz-offset": "540" }, body: JSON.stringify(body) }).catch(() => null);
      status = res?.status ?? 0;
      d = res ? ((await res.json().catch(() => ({}))) as Record<string, unknown>) : {};
    }
    const text = say(d as Parameters<typeof say>[0]);
    const retry = String(d.retry ?? "");
    turns.push({ step: lesson?.step, pattern: frame.pattern, heard, tutor: text, status, retry, move: Boolean(d.move) });
    if (status !== 200) { fails.push(`응답 ${status}(${lesson?.step})`); break; }
    if (at === 0 && CAUGHT_IT[ui] && ui !== lang && text.startsWith(CAUGHT_IT[ui]!)) warns.push("첫 마디 들렸어요?");
    if (lesson?.step === "show" && !sentencesOf(text).some((s) => patternIn(frame.pattern, s))) warns.push(`보여 주기에 틀 없음(${frame.pattern})`);
    if (heard && retry === "ask" && patternIn(frame.pattern, heard)) fails.push(`바른 틀에 다시 말해 보기: "${heard}" → ${String(d.better ?? d.meant ?? "")}`);
    const script = NATIVE_SCRIPT[ui];
    if (script && NATIVE_SCRIPT[lang] !== script && !(lang === "zh" && ui === "ja") && retry !== "ask" && script.test(text)) warns.push(`튜터 말에 앱 언어(${lesson?.step}): ${text.slice(0, 60)}`);
    if (lesson?.step === "ask" && lesson.asked) {
      askedYes += 1;
      if (!d.move) fails.push("좋다고 했는데 다음 틀로 안 넘어감");
    }
    if (heard) history.push({ who: "learner", text: heard });
    history.push({ who: "tutor", text });
    if (d.move && run) { moves += 1; run = advanceRun(run, { spoke: true, used: false, move: true }); }
    if (!run || run.at >= 2) break;
    const now = frames.find((f) => `f|${f.id}` === currentItem(run)?.key)!;
    const slot = (i: number) => now.examples[i % now.examples.length]!.slot;
    const fill = (i: number) => now.pattern.replace("___", slot(i));
    if (retry === "ask") heard = String(d.better ?? d.meant ?? fill(2));
    else if (run.step === "show") heard = slot(1);
    else if (run.step === "draw") heard = fill(2);
    else if (run.step === "move") heard = fill(3);
    else heard = YES[lang]!;
    if (retry !== "ask") run = advanceRun(run, { spoke: true, used: patternIn(now.pattern, heard), move: false });
  }
  if (!moves && !fails.length) fails.push(`첫 틀에서 못 넘어감(물음 ${askedYes})`);
  return { combo: `${lang}/${ui}`, turns, fails, warns };
}

const combos = LANGS.flatMap((lang) => LANGS.map((ui) => [lang, ui] as const)).filter(([l, u]) => !ONLY || ONLY.includes(`${l}:${u}`));
const results: Result[] = [];
let next = 0;
const started = Date.now();
await Promise.all(
  Array.from({ length: PARALLEL }, async () => {
    while (next < combos.length) {
      const [lang, ui] = combos[next++]!;
      const result = await one(lang, ui);
      results.push(result);
      const mark = result.fails.length ? "✗" : result.warns.length ? "△" : "✓";
      console.log(`${mark} ${result.combo} ${result.turns.length}차례${result.fails.length ? ` · ${result.fails.join(" · ")}` : ""}${result.warns.length ? ` · ${result.warns.join(" · ")}` : ""}`);
    }
  }),
);
results.sort((a, b) => a.combo.localeCompare(b.combo));
mkdirSync("tmp/sim-users", { recursive: true });
writeFileSync(`tmp/sim-users/lesson-sweep-${RUN}.json`, JSON.stringify(results, null, 1));
const count = (f: (r: Result) => boolean) => results.filter(f).length;
console.log(`\n수업 통화 전수 ${results.length}조합 · ${Math.round((Date.now() - started) / 60000)}분 · 통과 ${count((r) => !r.fails.length && !r.warns.length)} · 경고만 ${count((r) => !r.fails.length && r.warns.length > 0)} · 실패 ${count((r) => r.fails.length > 0)} · 차례 ${results.reduce((n, r) => n + r.turns.length, 0)}`);

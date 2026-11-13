/**
 * 수업 통화 점검(수업 계획 P4, hub/work/drafts/lesson-plan-2026-11-12.md) — 운영 /api/roleplay/turn에 가상 학습자로 수업 통화 한 바퀴.
 * 조합 en/ko · ja/ko · es/ar · th/ko, 학습자는 단계마다: 보여 주기 뒤 틀 없는 짧은 답 → 끌어내기에 틀 안 꼴 실수(첫 틀) · 틀 밖 큰 실수(둘째 틀) → 바른 틀 → "다음 거 해요".
 * 볼 것: 보여 주기에서 틀 두 번 · 끌어내기 질문이 그 틀을 부르나 · 틀 실수는 되받기만(retry 없음) · 큰 실수는 retry=ask · move로 다음 틀 · 502 없음.
 * 실행: NODE_USE_ENV_PROXY=1 node --experimental-strip-types scripts/sim-users/lesson-call.ts <실행 이름>
 * 끝나면: NODE_USE_ENV_PROXY=1 API_BASE=https://english-chat-mvp.vercel.app node scripts/sim-users/forget.mjs p4<실행 이름>-
 */
import { allFramesFor } from "../../src/lib/curriculum/frames.ts";
import { pickLesson, startRun, advanceRun, lessonRequestOf, currentItem, patternIn } from "../../src/lib/roleplay/lessonPlan.ts";
import { sentencesOf } from "../../src/lib/roleplay/reactions.ts";
const API = "https://english-chat-mvp.vercel.app";
const RUN = process.argv[2] ?? "a";
const say = (d: any) => [d.react?.text, typeof d.say === "string" ? d.say : d.say?.text].filter(Boolean).join(" ");
type Combo = { lang: string; ui: string; gender: string; slip: string; big: string; yes: string };
const combos: Combo[] = [
  { lang: "en", ui: "ko", gender: "f", slip: "My name are Kenji.", big: "I'm from Busan. Yesterday I go to the beach with my sister.", yes: "Sure, let's do something new." },
  { lang: "ja", ui: "ko", gender: "f", slip: "わたしがキムです。", big: "韓国から来ました。昨日は学校に行きます。", yes: "はい、次をやりましょう。" },
  { lang: "es", ui: "ar", gender: "m", slip: "Me llama Ana.", big: "Soy de Busan. Ayer yo ir a la playa con mi hermana.", yes: "Sí, vamos a otra cosa." },
  { lang: "th", ui: "ko", gender: "m", slip: "ผมชื่อว่ามินจุนค่ะ", big: "ผมมาจากโซลครับ เมื่อวานผมจะไปทะเลกับพี่สาว", yes: "ได้ครับ ลองอย่างอื่นกัน" },
];
const out: any[] = [];
for (const c of combos) {
  const frames = allFramesFor(c.lang);
  const items = pickLesson({ frames, events: [], start: 1, spot: null }).items;
  let run = startRun(items);
  const history: { who: string; text: string }[] = [];
  const log: any[] = [];
  const slipDone = new Set<number>();
  let heard = "";
  for (let turn = 0; turn < 14 && run; turn++) {
    const frame = frames.find((f) => `f|${f.id}` === currentItem(run)?.key)!;
    const lesson = lessonRequestOf(frames, run, turn === 0 ? "open" : undefined);
    const body = { scenarioId: `open-talk-${c.lang}`, nodeId: "talk", heard, history, mode: "free", freeTurns: turn, directedTurns: turn, level: 1, nativeLanguage: c.ui, tutorGender: c.gender, coach: true, ...(lesson ? { lesson } : {}) };
    const res = await fetch(`${API}/api/roleplay/turn`, { method: "POST", headers: { "content-type": "application/json", "x-rc-user": `simcheck-p4${RUN}-20261113`, "x-app-version": "sim-users", "x-tz-offset": "540" }, body: JSON.stringify(body) });
    const d: any = await res.json().catch(() => ({}));
    const text = say(d);
    const shows = sentencesOf(text).filter((s) => patternIn(frame.pattern, s)).length;
    log.push({ step: lesson?.step, pattern: frame.pattern, heard, tutor: text, status: res.status, retry: d.retry ?? "", better: d.better ?? d.meant ?? "", move: d.move ?? false, shows });
    if (heard) history.push({ who: "learner", text: heard });
    history.push({ who: "tutor", text });
    if (d.move && run) run = advanceRun(run, { spoke: true, used: false, move: true });
    if (!run) break;
    // 학습자 다음 말 — 지금 단계에 따라
    const idx = run.at;
    const f2 = frames.find((f) => `f|${f.id}` === currentItem(run)?.key)!;
    const slot = (i: number) => f2.examples[i % f2.examples.length].slot;
    const fill = (i: number) => f2.pattern.replace("___", slot(i));
    if (d.retry === "ask") heard = d.better || d.meant || fill(2); // 다시 말해 보기엔 고친 말로
    else if (run.step === "show") heard = `${slot(1)}${c.lang === "th" ? "ครับ" : "."}`;
    else if (run.step === "draw") heard = idx === 0 && !slipDone.has(0) ? (slipDone.add(0), c.slip) : idx === 1 && !slipDone.has(1) ? (slipDone.add(1), c.big) : fill(2);
    else if (run.step === "move") heard = fill(3);
    else heard = c.yes;
    const used = patternIn(f2.pattern, heard);
    if (d.retry !== "ask") run = advanceRun(run, { spoke: true, used, move: false });
  }
  out.push({ combo: `${c.lang}/${c.ui}`, log });
}
const fs = await import("node:fs");
fs.mkdirSync("tmp/sim-users", { recursive: true });
fs.writeFileSync(`tmp/sim-users/lesson-call-${RUN}.json`, JSON.stringify(out, null, 1));
for (const o of out) {
  console.log(`\n===== ${o.combo}`);
  for (const t of o.log) console.log(`${t.heard ? `  나: ${t.heard}\n` : ""}  [${t.pattern} · ${t.step}] 튜터(${t.status}): ${t.tutor}${t.retry ? `  ⟨retry=${t.retry} better=${t.better}⟩` : ""}${t.move ? "  ⟨move⟩" : ""}${t.step === "show" ? `  ⟨틀 ${t.shows}번⟩` : ""}`);
}

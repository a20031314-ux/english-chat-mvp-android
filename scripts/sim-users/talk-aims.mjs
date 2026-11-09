/**
 * 자유대화 채우기 점검(2026-11-06, hub/work/drafts/call-modes-2026-11-06.md 6-4) — 학습자 역을 맡은 에이전트가 한 줄씩 말하고,
 * 이 도구가 앱처럼 겨냥(talkAims.ts)을 골라 운영 /api/roleplay/turn에 보낸다. 에이전트에게는 튜터 말만 보여 준다(겨냥은 모름).
 *
 *   node --experimental-strip-types scripts/sim-users/talk-aims.mjs start <이름> --lang ja --ui ko --level 2 --mode aim|plain \
 *        [--fix "<틀린 점>|<고친 문장>"] [--lead] [--fn time] [--gender f|m]
 *   node --experimental-strip-types scripts/sim-users/talk-aims.mjs say <이름> "<학습자 말>"
 *   node --experimental-strip-types scripts/sim-users/talk-aims.mjs report            모든 통화 요약(JSON)
 *
 * 상태는 TALK_AIMS_DIR(기본 tmp/talk-aims/)에. 사용자 id는 simcheck-talkaims-<이름> — 끝나면 sim-users/forget.mjs로 지운다.
 * mode plain은 같은 인물·같은 고침 목록으로 겨냥만 뺀 비교군. 되받기 규칙은 둘 다 같다(서버).
 */
import { mkdirSync, readFileSync, readdirSync, rmdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterTurn, beforeTurn, planAims, startAims } from "../../src/lib/roleplay/talkAims.ts";

const API = (process.env.API_BASE || "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const DIR = process.env.TALK_AIMS_DIR || "tmp/talk-aims";
const GREETING = {
  en: "Hey! Good to see you. How's your day going?",
  ja: "やあ！会えてうれしいよ。今日はどんな一日だった？",
  es: "¡Hola! Qué bueno verte. ¿Cómo va tu día?",
  ko: "안녕! 얼굴 보니까 좋다. 오늘 하루 어땠어?",
};

const [, , cmd, name, ...rest] = process.argv;
const flag = (key) => {
  const at = rest.indexOf(`--${key}`);
  if (at === -1) return undefined;
  const next = rest[at + 1];
  return next && !next.startsWith("--") ? next : true;
};
const file = (run) => join(DIR, `${run}.json`);
const load = (run) => JSON.parse(readFileSync(file(run), "utf8"));
const save = (run, data) => writeFileSync(file(run), JSON.stringify(data, null, 1));

function sayText(d) {
  const parts = [];
  if (d.react?.text) parts.push(d.react.text);
  const say = typeof d.say === "string" ? d.say : d.say?.text;
  if (say) parts.push(say);
  return parts.join(" ").trim();
}

async function start() {
  mkdirSync(DIR, { recursive: true });
  const lang = flag("lang");
  const fix = typeof flag("fix") === "string" ? flag("fix").split("|") : null;
  const fixes = fix ? [{ point: fix[0], right: fix[1], day: "11-03" }] : [];
  const aims = planAims({
    fixes,
    wantsLead: flag("lead") === true,
    // 고른 갈래만 드물게(나머지 늘이는 갈래는 넉넉히) — 그 갈래 하나가 겨냥이 되게.
    fnCounts: typeof flag("fn") === "string" ? { self: 30, ask: 10, time: 5, reason: 5, compare: 5, mind: 5, [flag("fn")]: 0 } : {},
  });
  const data = {
    name,
    lang,
    ui: flag("ui"),
    level: Number(flag("level") ?? 3),
    mode: flag("mode") === "aim" ? "aim" : "plain",
    gender: flag("gender") === "m" ? "m" : "f",
    fixesText: fixes.map((f) => `${f.day} | ${f.point} | ${f.right}`).join("\n"),
    aims,
    aimState: startAims(aims),
    history: [{ who: "tutor", text: GREETING[lang] ?? "" }],
    turns: [],
  };
  save(name, data);
  console.log(`튜터: ${data.history[0].text}`);
}

// 학습자 역이 두 줄을 한꺼번에 보내도 차례가 섞이지 않게 통화마다 한 줄씩(점검 2026-11-06에 두 번 겪음).
async function withLock(run, work) {
  const lock = join(DIR, `${run}.lock`);
  for (let i = 0; ; i += 1) {
    try {
      mkdirSync(lock);
      break;
    } catch {
      if (i > 600) throw new Error("lock");
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  try {
    return await work();
  } finally {
    rmdirSync(lock);
  }
}

async function say() {
  return withLock(name, sayLocked);
}

async function sayLocked() {
  const data = load(name);
  const heard = rest.join(" ").trim();
  let aim = null;
  let aimCheck = null;
  if (data.mode === "aim") {
    const step = beforeTurn(data.aimState);
    data.aimState = step.state;
    aim = step.aim;
    aimCheck = step.aimCheck;
  }
  const i = data.turns.length;
  const body = {
    scenarioId: `open-talk-${data.lang}`,
    nodeId: "talk",
    heard,
    history: data.history,
    mode: "free",
    freeTurns: i,
    directedTurns: i,
    level: data.level,
    nativeLanguage: data.ui,
    tutorGender: data.gender,
    ...(data.fixesText ? { fixes: data.fixesText } : {}),
    ...(aim ? { aim } : {}),
    ...(aimCheck ? { aimCheck } : {}),
  };
  const started = Date.now();
  const res = await fetch(`${API}/api/roleplay/turn`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-rc-user": `simcheck-talkaims-${data.name}`, "x-app-version": "sim-users", "x-tz-offset": "540" },
    body: JSON.stringify(body),
  });
  const d = await res.json().catch(() => ({}));
  const text = sayText(d);
  if (data.mode === "aim") {
    data.aimState = afterTurn(data.aimState, { lead: d.lead, heard: d.heard, aim: d.aim, flow: d.assessment === "stuck" ? "stuck" : undefined });
  }
  data.turns.push({ heard, aim, aimCheck, status: res.status, ms: Date.now() - started, tutor: text, measure: { assessment: d.assessment, heard: d.heard, lead: d.lead, how: d.leadHow, fn: d.fnGroup, native: d.native, aim: d.aim }, next: d.next });
  data.history.push({ who: "learner", text: heard }, { who: "tutor", text });
  save(name, data);
  if (res.status !== 200) console.log(`(오류 ${res.status}) ${JSON.stringify(d).slice(0, 200)}`);
  console.log(`튜터: ${text}${d.next?.end ? "\n(통화 끝)" : ""}`);
}

function report() {
  const runs = readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")));
  const out = runs.map((r) => {
    const tutorLines = r.turns.map((t) => t.tutor);
    const checked = r.turns.filter((t) => t.aimCheck);
    return {
      name: r.name,
      lang: `${r.lang}/${r.ui}`,
      mode: r.mode,
      aims: r.aims.map((a) => a.key),
      turns: r.turns.length,
      errors: r.turns.filter((t) => t.status !== 200).length,
      aimsSent: r.turns.filter((t) => t.aim).length,
      aimChecked: checked.length,
      aimUsed: checked.filter((t) => t.measure.aim === "used").length,
      aimWrong: checked.filter((t) => t.measure.aim === "wrong").length,
      lead: r.turns.filter((t) => t.measure.lead === "lead").length,
      min: r.turns.filter((t) => t.measure.lead === "min").length,
      fn: r.turns.reduce((acc, t) => (t.measure.fn ? { ...acc, [t.measure.fn]: (acc[t.measure.fn] ?? 0) + 1 } : acc), {}),
      noQuestion: tutorLines.filter((l) => l && !/[?？؟]/u.test(l)).length,
      msP50: r.turns.map((t) => t.ms).sort((a, b) => a - b)[Math.floor(r.turns.length / 2)] ?? 0,
    };
  });
  console.log(JSON.stringify(out, null, 1));
}

await ({ start, say, report }[cmd] ?? (() => console.log("start | say | report")))();

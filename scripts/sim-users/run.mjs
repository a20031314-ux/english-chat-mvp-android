/**
 * 가상 사용자 수백 명이 채팅을 실제로 해 보고 오류를 모은다.
 *
 *   npm run sim:users -- --dry-run                 계획과 예상 요청 수만 (요청 0)
 *   npm run sim:users -- --users 28 --turns 3      작게 (스모크)
 *   npm run sim:users                              196명 × 6턴 — 14×14 조합 전부
 *   npm run sim:users -- --only ja:ko,th:*         조합 좁히기 (학습:앱, *는 전부)
 *   npm run sim:users -- --persona p042            한 사람만 다시 (같은 --seed·--users로)
 *   npm run sim:users -- --judge                   + LLM 평가 (OPENAI_API_KEY 필요)
 *   npm run sim:users -- --llm-persona             + 페르소나가 문장을 직접 지어냄 (키 필요)
 *   npm run sim:users -- --rescan tmp/sim-users/<실행>   저장된 대화를 지금 규칙으로 다시 검사 (요청 0)
 *
 * 운영 API(API_BASE)를 부른다 — 요청마다 서버의 OpenAI 비용이 든다. 사용자 id는
 * `simcheck-<실행>-<사람>`이라 비용 보고(cost-report.mjs TEST_USER)에서 빠지고,
 * 실행마다 새로 만들어서 무료 하루 채팅 10번에 걸리지 않는다(턴은 8 이하로).
 *
 * 결과: tmp/sim-users/<실행>/results.json, report.html
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { writtenInLearningLanguage } from "../../src/lib/inputLanguage.ts";
import { buildPersonas, describePersona, loadBank, planTurns } from "./personas.mjs";
import { detectCard, detectStart, detectTurn, SEVERITY_WEIGHT } from "./detect.mjs";
import { judgeConversation, openaiKey, personaLine } from "./llm.mjs";
import { renderReport } from "./report.mjs";

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 || at + 1 >= args.length ? fallback : args[at + 1];
};

const API = (value("api", process.env.API_BASE) || "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const USERS = Math.max(1, Number(value("users", 196)));
const TURNS = Math.min(8, Math.max(1, Number(value("turns", 6))));
const CONCURRENCY = Math.max(1, Number(value("concurrency", 8)));
const SEED = Number(value("seed", 7));
const MAX_REQUESTS = Number(value("max-requests", 3000));
const TIMEOUT_MS = 40_000;
const ONLY = value("only", "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => {
    const [target, ui] = s.split(":");
    return { target: target || "*", ui: ui || "*" };
  });
const ONE = value("persona", null);
const JUDGE = flag("judge");
const LLM_PERSONA = flag("llm-persona");
const NO_CARD = flag("no-card");

const stamp = new Date(Date.now() + 9 * 3600_000).toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
const RUN_ID = value("run-id", stamp);
const OUT = value("out", `tmp/sim-users/${RUN_ID}`);

let requestCount = 0;

async function post(userId, body) {
  if (requestCount >= MAX_REQUESTS) return { status: 0, ms: 0, error: "MAX_REQUESTS 도달 — 보내지 않음" };
  requestCount += 1;
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${API}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-rc-user": userId, "x-app-version": "sim-users" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    let parsed = null;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text.slice(0, 300) }; }
    return { status: response.status, ms: Date.now() - started, body: parsed };
  } catch (error) {
    return { status: 0, ms: Date.now() - started, error: error.name === "AbortError" ? `시간 초과 ${TIMEOUT_MS / 1000}초` : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

function langsFor(p) {
  return { targetLanguage: p.target, interfaceLanguage: p.ui, locale: p.ui };
}

async function runPersona(persona, bank) {
  const userId = `simcheck-${RUN_ID}-${persona.id}`;
  const plan = planTurns(persona, bank, { turns: TURNS, seed: SEED });
  const record = { persona, description: describePersona(persona), userId, transcript: [], issues: [] };
  const recent = [];
  const replies = [];

  const start = await post(userId, { mode: "start", ...langsFor(persona) });
  const startIssues = detectStart({ persona, response: start });
  const opening = String(start.body?.assistantMessage ?? "");
  record.transcript.push({ turn: 0, kind: "start", text: "(첫 인사)", status: start.status, ms: start.ms, reply: opening, issues: startIssues });
  record.issues.push(...startIssues.map((i) => ({ ...i, turn: 0 })));
  if (opening) { recent.push(`other: ${opening}`); replies.push(opening); }

  for (let t = 0; t < plan.length; t += 1) {
    const turn = { ...plan[t] };
    if (LLM_PERSONA && turn.kind === "practice") {
      turn.text = await personaLine(persona, recent, turn.text);
      turn.expect = {};
    }
    const ownLanguage = turn.kind !== "misbehavior" && !writtenInLearningLanguage(turn.text, persona.target, persona.ui);
    const effective = ownLanguage ? { ...turn, kind: "own" } : turn;
    const response = await post(userId, {
      mode: "chat",
      message: turn.text,
      ...langsFor(persona),
      ...(ownLanguage ? { ownLanguage: true } : {}),
      recent: recent.slice(-8),
    });
    const issues = detectTurn({ persona, turn: effective, response, previousReplies: replies });
    const reply = String(response.body?.assistantMessage ?? "");
    const entry = {
      turn: t + 1,
      kind: effective.kind,
      misbehavior: turn.misbehavior,
      expect: turn.expect ?? {},
      text: turn.text,
      ownLanguage,
      status: response.status,
      ms: response.ms,
      reply,
      spoken: response.body?.spokenReply ?? "",
      corrected: response.body?.correction?.corrected ?? "",
      natural: response.body?.correction?.natural ?? "",
      explanation: response.body?.correction?.explanation ?? "",
      issues,
    };

    // 앱 언어로 쓴 줄이면 사용자는 그 아래 "표현 보기"를 누른다 (채팅 횟수 안 줄어듦).
    if (ownLanguage && !NO_CARD && response.status === 200) {
      const card = await post(userId, { mode: "how_to_say", expressionOnly: true, message: turn.text, ...langsFor(persona), recent: recent.slice(-8) });
      entry.card = { status: card.status, ms: card.ms, expression: card.body?.expression ?? "", example: card.body?.example ?? "" };
      const cardIssues = detectCard({ persona, response: card });
      entry.issues.push(...cardIssues);
    }

    record.transcript.push(entry);
    record.issues.push(...entry.issues.map((i) => ({ ...i, turn: t + 1 })));
    if (!ownLanguage && turn.kind !== "misbehavior") recent.push(`me: ${turn.text}`);
    if (reply) { recent.push(`other: ${reply}`); replies.push(reply); }
    if (issues.some((i) => i.kind === "daily_limit") || response.error?.startsWith("MAX_REQUESTS")) break;
  }

  if (JUDGE) {
    const judged = await judgeConversation(persona, record.transcript.filter((x) => x.turn > 0));
    for (const j of judged) {
      record.issues.push({ severity: j.severity === "error" ? "error" : "warn", kind: `judge_${j.kind ?? "issue"}`, note: j.note ?? "", turn: j.turn ?? null, judge: true });
    }
  }
  record.score = record.issues.reduce((s, i) => s + (SEVERITY_WEIGHT[i.severity] ?? 0), 0);
  return record;
}

async function pool(items, limit, worker, onDone) {
  const results = new Array(items.length);
  let next = 0;
  let done = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index]);
      done += 1;
      onDone?.(done, results[index]);
    }
  }));
  return results;
}

/**
 * 저장된 대화를 지금 규칙으로 다시 검사한다 (요청 0, 돈 0).
 * 검출 규칙을 고치거나 더한 뒤 지난 실행에 무엇이 새로 잡히는지 볼 때.
 */
function rescan(dir, bank) {
  const data = JSON.parse(readFileSync(`${dir}/results.json`, "utf8"));
  const { meta } = data;
  for (const record of data.records) {
    const { persona } = record;
    const plan = planTurns(persona, bank, { turns: meta.turns, seed: meta.seed });
    const replies = [];
    record.issues = [];
    for (const entry of record.transcript) {
      if (entry.turn === 0) {
        entry.issues = detectStart({ persona, response: { status: entry.status, body: { assistantMessage: entry.reply } } });
      } else {
        const planned = plan[entry.turn - 1];
        const expect = entry.expect ?? (planned?.text === entry.text ? planned.expect : {});
        const turn = { kind: entry.kind, text: entry.text, misbehavior: entry.misbehavior, expect };
        const body = entry.status === 200
          ? { assistantMessage: entry.reply, spokenReply: entry.spoken, correction: entry.corrected || entry.explanation ? { corrected: entry.corrected, natural: entry.natural, explanation: entry.explanation } : undefined }
          : { error: "stored" };
        entry.issues = detectTurn({ persona, turn, response: { status: entry.status, ms: entry.ms, body }, previousReplies: replies });
        if (entry.card) {
          entry.issues.push(...detectCard({ persona, response: { status: entry.card.status, ms: entry.card.ms, body: { expression: entry.card.expression, example: entry.card.example } } }));
        }
      }
      if (entry.reply) replies.push(entry.reply);
      record.issues.push(...entry.issues.map((i) => ({ ...i, turn: entry.turn })));
    }
    record.score = record.issues.reduce((s, i) => s + (SEVERITY_WEIGHT[i.severity] ?? 0), 0);
  }
  meta.rescannedAt = new Date().toISOString();
  writeFileSync(`${dir}/results.json`, `${JSON.stringify(data, null, 2)}\n`);
  writeFileSync(`${dir}/report.html`, renderReport(data));
  summarize(data.records, meta, dir);
}

function summarize(records, meta, dir) {
  const all = records.flatMap((r) => r.issues);
  const byKind = new Map();
  for (const i of all) byKind.set(`${i.severity} ${i.kind}`, (byKind.get(`${i.severity} ${i.kind}`) ?? 0) + 1);
  console.log(`\n요청 ${meta.requests}건 · ${meta.seconds}초`);
  console.log(`오류 ${all.filter((i) => i.severity === "error").length} · 경고 ${all.filter((i) => i.severity === "warn").length}`);
  for (const [key, n] of [...byKind.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${key}: ${n}`);
  console.log(`\n리포트: ${dir}/report.html`);
  process.exitCode = all.some((i) => i.severity === "error") ? 1 : 0;
}

async function main() {
  const bank = loadBank();
  const rescanDir = value("rescan", null);
  if (rescanDir) return rescan(rescanDir, bank);
  let { personas, rows } = buildPersonas({ count: USERS, seed: SEED, only: ONLY });
  if (ONE) personas = personas.filter((p) => p.id === ONE);
  if (personas.length === 0) throw new Error(`페르소나 ${ONE}가 없어요 (같은 --users·--seed인지 확인)`);

  const combos = new Set(personas.map((p) => `${p.target}:${p.ui}`));
  const ownTurns = personas.reduce((s, p) => s + planTurns(p, bank, { turns: TURNS, seed: SEED }).filter((t) => t.kind === "own" || !writtenInLearningLanguage(t.text, p.target, p.ui)).length, 0);
  const chatCalls = personas.length * TURNS;
  const estimate = personas.length + chatCalls + (NO_CARD ? 0 : ownTurns);
  console.log(`가상 사용자 ${personas.length}명 · 조합 ${combos.size}/196 · 속성 pairwise ${rows.length}행 · 턴 ${TURNS} · 동시 ${CONCURRENCY}`);
  console.log(`예상 요청 ${estimate}건 (첫 인사 ${personas.length} + 채팅 ${chatCalls} + 표현 카드 ${NO_CARD ? 0 : ownTurns}) → ${API}`);
  console.log(`예상 서버 비용(대략): 채팅 한 턴에 모델 호출 3~4번 → 약 $${(chatCalls * 0.003).toFixed(2)} 안팎`);
  if ((JUDGE || LLM_PERSONA) && !openaiKey()) {
    console.log("OPENAI_API_KEY가 없어 --judge/--llm-persona는 건너뜁니다.");
  }

  if (flag("dry-run")) {
    for (const p of personas.slice(0, Math.min(personas.length, Number(value("show", 5))))) {
      console.log(`\n${p.id} ${describePersona(p)}`);
      for (const t of planTurns(p, bank, { turns: TURNS, seed: SEED })) console.log(`  [${t.kind}] ${t.text.slice(0, 90)}`);
    }
    return;
  }

  const started = Date.now();
  const records = await pool(personas, CONCURRENCY, (p) => runPersona(p, bank), (done, r) => {
    const errors = r.issues.filter((i) => i.severity === "error").length;
    const warns = r.issues.filter((i) => i.severity === "warn").length;
    process.stdout.write(`\r${done}/${personas.length} 완료 · 방금 ${r.persona.id} ${r.persona.target}:${r.persona.ui} 오류 ${errors} 경고 ${warns}      `);
  });
  process.stdout.write("\n");

  const meta = {
    runId: RUN_ID, api: API, users: personas.length, turns: TURNS, seed: SEED, only: ONLY, judge: JUDGE && Boolean(openaiKey()),
    llmPersona: LLM_PERSONA && Boolean(openaiKey()), requests: requestCount, seconds: Math.round((Date.now() - started) / 1000),
    startedAt: new Date(started).toISOString(),
  };
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/results.json`, `${JSON.stringify({ meta, records }, null, 2)}\n`);
  writeFileSync(`${OUT}/report.html`, renderReport({ meta, records }));

  summarize(records, meta, OUT);
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});

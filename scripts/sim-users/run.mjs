/**
 * 가상 사용자 수백 명이 앱 기능을 실제로 써 보고 오류를 모은다.
 *
 *   npm run sim:users -- --dry-run                     계획과 예상 요청 수만 (요청 0)
 *   npm run sim:users -- --users 28 --turns 3          작게 (스모크, 채팅만)
 *   npm run sim:users                                  196명 × 6턴 채팅 — 14×14 조합 전부
 *   npm run sim:users -- --suite all                   모든 기능 묶음 (묶음마다 정한 비율의 사람만)
 *   npm run sim:users -- --suite chat,map,next         고른 묶음만 (목록: --list)
 *   npm run sim:users -- --suite map --full            묶음 비율 무시하고 모든 사람에게
 *   npm run sim:users -- --only ja:ko,th:*             조합 좁히기 (학습:앱, *는 전부)
 *   npm run sim:users -- --persona p042                한 사람만 다시 (같은 --seed·--users·--suite로)
 *   npm run sim:users -- --api https://미리보기주소     운영 대신 미리보기 배포에
 *   npm run sim:users -- --judge / --llm-persona       LLM 평가·페르소나 (OPENAI_API_KEY 필요)
 *   npm run sim:users -- --model-routes '{"basic":"anthropic: claude-haiku-5-5"}'   이 점검만 다른 모델(서버 llm.ts, simcheck- 사용자만)
 *   npm run sim:users -- --chat-stream   채팅을 새 앱처럼 스트림으로(답 먼저, 교정 나중)
 *   npm run sim:users -- --rescan tmp/sim-users/<실행>  저장된 채팅을 지금 규칙으로 다시 검사 (요청 0)
 *
 * 운영 API(API_BASE)를 부른다 — 요청마다 서버의 OpenAI 비용이 든다. 사용자 id는
 * `simcheck-<실행>-<사람>`이라 비용 보고(cost-report.mjs TEST_USER)에서 빠지고,
 * 실행마다 새로 만들어서 무료 하루 채팅 10번에 걸리지 않는다(턴은 8 이하로).
 * 묶음은 한 사람 안에서 차례로 돈다: 채팅이 먼저 기록을 쌓고, 그다음 묶음이 그 기록을 읽는다.
 *
 * 결과: tmp/sim-users/<실행>/results.json, report.html
 */
import { forgetAtEnd } from "./forget.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { buildPersonas, describePersona, loadBank, planTurns } from "./personas.mjs";
import { detectCard, detectStart, detectTurn, SEVERITY_WEIGHT } from "./detect.mjs";
import { judgeConversation, openaiKey } from "./llm.mjs";
import { renderReport } from "./report.mjs";
import { makeClient } from "./client.mjs";
import { SUITES, suiteById } from "./suites/index.mjs";

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 || at + 1 >= args.length ? fallback : args[at + 1];
};

const pkgVersion = JSON.parse(readFileSync("package.json", "utf8")).version;
const API = (value("api", process.env.API_BASE) || "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const USERS = Math.max(1, Number(value("users", 196)));
const TURNS = Math.min(8, Math.max(1, Number(value("turns", 6))));
// 프록시를 거쳐야 하는 작업 공간(클라우드)에서 node fetch는 프록시를 쓰지 않고 바로 나가 Vercel 앞단에 막힐 수 있다(2026-10-19 겪음).
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && process.env.NODE_USE_ENV_PROXY !== "1") {
  console.log("⚠ HTTPS_PROXY가 있는데 NODE_USE_ENV_PROXY=1이 아니에요 — 요청이 프록시를 안 거쳐요. NODE_USE_ENV_PROXY=1 npm run sim:users …");
}
const CONCURRENCY = Math.max(1, Number(value("concurrency", 8)));
const SEED = Number(value("seed", 7));
const MAX_REQUESTS = Number(value("max-requests", 8000));
const APP_VERSION = value("app-version", pkgVersion);
const ONLY = value("only", "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => {
    const [target, ui] = s.split(":");
    return { target: target || "*", ui: ui || "*" };
  });
const ONE = value("persona", null);
const FULL = flag("full");
const SUITE_IDS = (() => {
  const raw = value("suite", "chat");
  const ids = raw === "all" ? SUITES.map((s) => s.id) : raw.split(",").map((s) => s.trim()).filter(Boolean);
  for (const id of ids) if (!suiteById(id)) throw new Error(`없는 묶음: ${id} (목록: ${SUITES.map((s) => s.id).join(", ")})`);
  // 등록 순서대로(채팅이 먼저).
  return SUITES.map((s) => s.id).filter((id) => ids.includes(id));
})();

const opts = {
  turns: TURNS,
  seed: SEED,
  judge: flag("judge"),
  llmPersona: flag("llm-persona"),
  noCard: flag("no-card"),
};

const stamp = new Date(Date.now() + 9 * 3600_000).toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
const RUN_ID = value("run-id", stamp);
const OUT = value("out", `tmp/sim-users/${RUN_ID}`);

// --model-routes '{"basic":"anthropic: claude-haiku-5-5"}' — 이 점검만 다른 모델로(서버가 simcheck- 사용자에게만 허용).
const MODEL_ROUTES = value("model-routes", null);
// --chat-stream — 채팅 턴을 새 앱처럼 스트림으로(답 먼저 → 교정). firstMs가 답이 뜨는 시간.
const CHAT_STREAM = flag("chat-stream");
const client = makeClient({ api: API, maxRequests: MAX_REQUESTS, appVersion: APP_VERSION, modelRoutes: MODEL_ROUTES, chatStream: CHAT_STREAM });

/** 이 사람이 이 묶음을 도나: 묶음마다 정한 비율(every)대로, 조합이 고르게 퍼지게. */
function suitesFor(persona, index) {
  return SUITE_IDS.map(suiteById).filter((suite) => {
    if (FULL || ONE) return true;
    if (suite.applies && !suite.applies(persona)) return false;
    return index % (suite.every ?? 1) === 0;
  });
}

async function runPersona(persona, index, bank) {
  const userId = `simcheck-${RUN_ID}-${persona.id}`;
  const record = { persona, description: describePersona(persona), userId, suites: [], transcript: [], issues: [] };
  const shared = {};
  let seq = 0;
  for (const suite of suitesFor(persona, index)) {
    record.suites.push(suite.id);
    const step = (entry) => {
      const full = { suite: suite.id, seq: seq++, ...entry, issues: entry.issues ?? [] };
      record.transcript.push(full);
      record.issues.push(...full.issues.map((i) => ({ ...i, suite: suite.id, turn: full.turn ?? null, step: full.title ?? null })));
    };
    try {
      await suite.run({ persona, userId, call: client.call, bank, opts, step, shared });
    } catch (error) {
      step({ title: "묶음 실행 오류", issues: [{ severity: "error", kind: `${suite.id}_crash`, note: `점검 코드 오류: ${String(error?.stack ?? error).slice(0, 200)}` }] });
    }
  }
  if (opts.judge && record.suites.includes("chat")) {
    const judged = await judgeConversation(persona, record.transcript.filter((x) => x.suite === "chat" && x.turn > 0));
    for (const j of judged) {
      record.issues.push({ severity: j.severity === "error" ? "error" : "warn", kind: `judge_${j.kind ?? "issue"}`, note: j.note ?? "", turn: j.turn ?? null, suite: "chat", judge: true });
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
      results[index] = await worker(items[index], index);
      done += 1;
      onDone?.(done, results[index]);
    }
  }));
  return results;
}

/**
 * 저장된 채팅을 지금 규칙으로 다시 검사한다 (요청 0, 돈 0). 다른 묶음의 결과는 그대로 둔다.
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
      const suite = entry.suite ?? "chat";
      entry.suite = suite;
      if (suite === "chat") {
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
      }
      record.issues.push(...(entry.issues ?? []).map((i) => ({ ...i, suite, turn: entry.turn ?? null, step: entry.title ?? null })));
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
  if (flag("list")) {
    for (const s of SUITES) console.log(`${s.id.padEnd(10)} ${s.label} — ${s.every === 1 ? "모든 사람" : `${s.every}명 중 1명`}${s.note ? ` · ${s.note}` : ""}`);
    return;
  }
  const bank = loadBank();
  const rescanDir = value("rescan", null);
  if (rescanDir) return rescan(rescanDir, bank);
  const built = buildPersonas({ count: USERS, seed: SEED, only: ONLY });
  let personas = built.personas.map((p, index) => ({ p, index }));
  if (ONE) personas = personas.filter(({ p }) => p.id === ONE);
  if (personas.length === 0) throw new Error(`페르소나 ${ONE}가 없어요 (같은 --users·--seed인지 확인)`);

  // 예상
  const perSuite = new Map(SUITE_IDS.map((id) => [id, { people: 0, requests: 0, usd: 0, combos: new Set() }]));
  for (const { p, index } of personas) {
    for (const suite of suitesFor(p, index)) {
      const e = suite.estimate ? suite.estimate({ persona: p, bank, opts }) : { requests: 1, usd: 0 };
      const s = perSuite.get(suite.id);
      s.people += 1; s.requests += e.requests; s.usd += e.usd; s.combos.add(`${p.target}:${p.ui}`);
    }
  }
  const totalReq = [...perSuite.values()].reduce((a, s) => a + s.requests, 0);
  const totalUsd = [...perSuite.values()].reduce((a, s) => a + s.usd, 0);
  console.log(`가상 사용자 ${personas.length}명 · 속성 pairwise ${built.rows.length}행 · 턴 ${TURNS} · 동시 ${CONCURRENCY} → ${API} (앱 ${APP_VERSION})`);
  for (const [id, s] of perSuite) console.log(`  ${id.padEnd(9)} ${String(s.people).padStart(3)}명 · 조합 ${String(s.combos.size).padStart(3)} · 요청 약 ${s.requests} · 약 $${s.usd.toFixed(2)}`);
  console.log(`예상 요청 약 ${totalReq}건 · 서버 비용 약 $${totalUsd.toFixed(2)} (상한 --max-requests ${MAX_REQUESTS})`);
  if ((opts.judge || opts.llmPersona) && !openaiKey()) console.log("OPENAI_API_KEY가 없어 --judge/--llm-persona는 건너뜁니다.");
  if (totalReq > MAX_REQUESTS) console.log(`※ 예상이 상한보다 많아요 — 상한에서 멈춥니다.`);

  if (flag("dry-run")) {
    for (const { p, index } of personas.slice(0, Math.min(personas.length, Number(value("show", 5))))) {
      console.log(`\n${p.id} ${describePersona(p)} · 묶음 ${suitesFor(p, index).map((s) => s.id).join(",")}`);
      if (SUITE_IDS.includes("chat")) for (const t of planTurns(p, bank, { turns: TURNS, seed: SEED })) console.log(`  [${t.kind}] ${t.text.slice(0, 90)}`);
    }
    return;
  }

  const started = Date.now();
  const records = await pool(personas, CONCURRENCY, ({ p, index }) => runPersona(p, index, bank), (done, r) => {
    const errors = r.issues.filter((i) => i.severity === "error").length;
    const warns = r.issues.filter((i) => i.severity === "warn").length;
    process.stdout.write(`\r${done}/${personas.length} 완료 · 방금 ${r.persona.id} ${r.persona.target}:${r.persona.ui} [${r.suites.join(",")}] 오류 ${errors} 경고 ${warns}      `);
  });
  process.stdout.write("\n");

  const meta = {
    runId: RUN_ID, api: API, appVersion: APP_VERSION, users: built.personas.length, ran: personas.length, turns: TURNS, seed: SEED, only: ONLY,
    suites: SUITE_IDS, full: FULL, judge: opts.judge && Boolean(openaiKey()), llmPersona: opts.llmPersona && Boolean(openaiKey()),
    requests: client.state.count, edgeBlocks: client.state.edgeBlocks ?? 0, byPath: Object.fromEntries(client.state.byPath), seconds: Math.round((Date.now() - started) / 1000),
    startedAt: new Date(started).toISOString(),
  };
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/results.json`, `${JSON.stringify({ meta, records }, null, 2)}\n`);
  writeFileSync(`${OUT}/report.html`, renderReport({ meta, records }));
  summarize(records, meta, OUT);
  await forgetAtEnd(API, RUN_ID);
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});

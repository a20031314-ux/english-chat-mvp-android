// 모델 교체 — 후보 모델로 바꾸면 손익이 어떻게 되는지 계산하고, 돈이 되는 후보만 품질을 시험해서 교체를 권한다
// (사용자 2026-11-01 "새 API가 나오거나 AI 서비스가 종료되는 경우를 대비해 계속 서치하고 기능·비용 계산 후 교체를 권유").
// 예약 작업 "AI 모델 살피기"(매주 월요일)가 조사 → 후보 기록 → 이 스크립트 → 보고·알림 순으로 부른다. 바꾸기는 사람이 "바꿔줘" 한 뒤에만.
//
// 후보 목록: hub/model-candidates.json (조사가 쓰고 이 스크립트가 cost·trial 칸을 채움)
//   [{ "id": "haiku-6-chat", "model": "claude-haiku-6", "provider": "anthropic", "kind": "text",
//      "tasks": ["chat","howToSay"],                       글 모델이면 바꿀 기능(aiDefaults.ts 기능 이름)
//      "speech": { "turnTranscribe": "…" },                받아쓰기·목소리면 SPEECH_DEFAULTS에 덮을 값
//      "price": { "input": 0.1, "output": 0.5 } | { "perMinute": 0.003 },
//      "replaces": "claude-haiku-5-5", "deadline": "2027-01-14" | null,   바꿀 모델과 그 종료일(있으면)
//      "why": "한 줄", "source": "가격 근거 링크", "checked": "YYYY-MM-DD" }]
//
//   node scripts/models/whatif.mjs cost              후보마다 비용표·손익을 다시 계산(모델 호출 없음, 후보 하나에 약 5초) → cost 칸 + hub/model-swap.md
//   node scripts/models/whatif.mjs trial <id>        품질 시험 준비·실행: 운영 서버에 점검 사용자로 지금 모델·후보 모델을 같은 사람·같은 문장으로
//                                                    (sim:users tiers, 헤더 x-sim-model-routes) → 두 결과를 섞고 이름을 가린 평가 묶음
//                                                    tmp/models/trial-<id>/judge/batch-NN.json — 평가는 하위 에이전트가 RUBRIC.md대로 *.verdicts.json
//   node scripts/models/whatif.mjs trial-result <id> 평가를 풀어 큰 문제 비율·응답 시간·오류를 지금 모델과 비교 → trial 칸 + hub/model-swap.md
//   node scripts/models/whatif.mjs render            hub/model-swap.md만 다시(그리고 알릴 것을 tmp/models/notify.json에)
//
// 품질 시험 비용 상한: 후보 한 번 시험에 모델 값 약 $2(TRIAL_USD) — 단가로 사람 수를 줄인다(14~28명).
// 품질은 채팅 교정·답으로 본다(가장 많이 쓰고 이미 평가 기준·점검이 있는 기능) — 다른 기능 후보도 이 값을 대리 지표로 쓴다고 카드에 적는다.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { numberOf, tableCells } from "../watch/tables.mjs";

const ROOT = process.cwd();
const FILE = path.join(ROOT, process.env.MODEL_CANDIDATES ?? "hub/model-candidates.json"); // 시험용으로 바꿀 수 있음
const DOC = path.join(ROOT, process.env.MODEL_SWAP_DOC ?? "hub/model-swap.md");
const OUT = path.join(ROOT, "tmp/models");
const NODE = ["--experimental-strip-types", "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON"];
const MONEY = 500; // 원 — 변경 감시와 같은 기준(사용자 2026-11-01)
const SOON_DAYS = 90; // 종료까지 이만큼 안 남으면 알림
const TRIAL_USD = 2;
const QUALITY_SLACK = 2; // 큰 문제 비율이 지금 모델보다 %p 이만큼까지 높아도 "같음"
// 운영 서버가 점검 헤더로 받아 주는 모델(src/lib/server/llm.ts SIM_ALLOWED와 같게).
const TRIALABLE = /^(anthropic:\s*claude-(haiku|sonnet)-\d[\w.-]*|openai:\s*gpt-[\w.-]+)$/;

const today = () => new Date().toISOString().slice(0, 10);
const readList = () => (fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : []);
const writeList = (list) => fs.writeFileSync(FILE, JSON.stringify(list, null, 1) + "\n");
const won = (n) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("ko-KR")}원`;
const daysUntil = (date) => (date ? Math.round((Date.parse(date) - Date.parse(today())) / 86_400_000) : null);
const routeOf = (c) => `${c.provider === "openai" ? "openai" : "anthropic"}: ${c.model}`;
const trialable = (c) => c.kind === "text" && (c.provider === "openai" || c.provider === "anthropic") && TRIALABLE.test(`${c.provider}: ${c.model}`);

function specOf(c) {
  const spec = { routes: {}, speech: { ...(c.speech ?? {}) }, prices: { text: {}, stt: {}, tts: {} } };
  if (c.kind === "text") {
    for (const task of c.tasks ?? []) spec.routes[task] = routeOf(c); // 제공자가 openai·anthropic이 아니어도 단가는 모델 이름으로 찾음
    if (c.price?.input !== undefined) spec.prices.text[c.model] = { input: c.price.input, output: c.price.output };
  }
  if (c.kind === "stt" && c.price?.perMinute !== undefined) spec.prices.stt[c.model] = c.price.perMinute;
  if (c.kind === "tts" && c.price?.perMinute !== undefined) spec.prices.tts[c.model] = c.price.perMinute;
  return spec;
}

function tables(spec) {
  const env = { ...process.env, MODEL_WHATIF: JSON.stringify(spec ?? {}) };
  const run = (script) => execFileSync("node", [...NODE, "--import", "./scripts/models/patch.mjs", script, ...(script.includes("plan-cost") ? ["--stdout"] : [])], { cwd: ROOT, env, encoding: "utf8", maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
  return { costs: tableCells(run("scripts/plan-cost.mjs")), economics: tableCells(run("scripts/sim-users/economics.mjs")) };
}

// 머리 숫자: 요금별 "유형 비율대로 섞으면"(한 사람 한 달) + 서비스 전체 1,000명당(광고 단가 중간·전환 2%).
const HEAD = [
  [/^2\. 유료 요금 손익분기점 · (.+) · 유형 비율대로 섞으면$/, (m) => `${m[1]} 한 사람`],
  [/^4\. 서비스 전체.* · 광고 단가 중간 · 2%$/, () => "가입자 1,000명당(광고 중간·전환 2%)"],
  [/^요금별 한 달 비용 \(30일\) · (.+) · 그때 남는 돈$/, (m) => `${m[1]} 많이 쓰는 사람`],
];

function costOf(base, c) {
  const after = tables(specOf(c));
  const head = [];
  let changed = 0;
  let biggest = 0;
  for (const doc of ["costs", "economics"]) {
    for (const [key, a] of Object.entries(base[doc])) {
      const b = after[doc][key];
      if (b === undefined || a === b) continue;
      changed += 1;
      const na = numberOf(a);
      const nb = numberOf(b);
      const diff = na && nb && na.unit === "원" && nb.unit === "원" ? nb.value - na.value : null;
      for (const [re, label] of HEAD) {
        const m = key.match(re);
        if (m && diff !== null) head.push({ what: label(m), before: na.value, after: nb.value, diff });
      }
      if (diff !== null && !key.startsWith("4.")) biggest = Math.abs(diff) > Math.abs(biggest) ? diff : biggest;
    }
  }
  const perPerson = head.filter((h) => !h.what.startsWith("가입자"));
  const best = perPerson.reduce((x, h) => Math.max(x, h.diff), 0);
  const worst = perPerson.reduce((x, h) => Math.min(x, h.diff), 0);
  return { at: today(), commit: execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(), changed, head, best, worst };
}

/** 권함 단계 — 카드 머리와 알림이 이것을 쓴다. */
function stateOf(c) {
  const days = daysUntil(c.deadline);
  const soon = days !== null && days <= SOON_DAYS;
  const money = c.cost ? (c.cost.best >= MONEY ? "better" : c.cost.worst <= -MONEY ? "worse" : "same") : "unknown";
  if (!c.cost) return { state: "지켜봄", why: "단가 확인 못 함 — 계산 전" };
  const t = c.trial;
  const trialOk = t && t.majorPct !== null && t.majorPct <= t.baseMajorPct + QUALITY_SLACK && t.errorPct <= t.baseErrorPct + QUALITY_SLACK;
  if (t && !trialOk) return { state: "안 함", why: `품질 시험에서 큰 문제 ${t.majorPct}% (지금 ${t.baseMajorPct}%)` };
  if (trialOk && (money === "better" || (soon && money !== "worse"))) return { state: "권함", why: soon ? `종료 ${days}일 전 · 품질 같음 이상` : "더 싸고 품질 같음 이상" };
  if (trialOk && soon) return { state: "권함", why: `종료 ${days}일 전 — 비용은 늘지만 대체가 필요` };
  if (money === "worse" && !soon) return { state: "안 함", why: "더 비쌈(종료 일정 없음)" };
  if ((money === "better" || soon) && !trialable(c)) return { state: "시험 불가", why: c.kind === "text" ? "운영 서버에 이 제공자 길이 없음 — 코드 작업 뒤 시험" : "받아쓰기·목소리는 자동 시험 없음 — 샘플을 사람이 듣고 판단" };
  if (money === "better" || soon) return { state: "시험 필요", why: soon ? `종료 ${days}일 전` : "더 쌈" };
  return { state: "지켜봄", why: "손익 차이 작음" };
}

function render() {
  const list = readList();
  const order = { 권함: 0, "시험 필요": 1, "시험 불가": 2, 지켜봄: 3, "안 함": 4 };
  const rows = list.map((c) => ({ c, ...stateOf(c) })).sort((x, y) => order[x.state] - order[y.state] || (y.c.cost?.best ?? 0) - (x.c.cost?.best ?? 0));
  const lines = [
    "# 모델 교체 후보 (자동)",
    "",
    "> 매주 월요일 예약 작업 **\"AI 모델 살피기\"**가 새 모델·종료 공지를 찾아 `hub/model-candidates.json`에 후보로 적고,",
    "> `scripts/models/whatif.mjs`가 후보마다 **비용표·손익을 다시 계산**하고, 돈이 되거나 종료가 다가온 후보만 **운영 서버에서 품질을 시험**(점검 사용자, 이름 가린 평가)합니다.",
    "> 이 파일은 그 결과로 다시 만들어집니다 — 손으로 고치지 않습니다. 바꾸는 것은 사용자가 \"바꿔줘\" 한 뒤에만(대부분 `src/lib/aiDefaults.ts` 한 줄 또는 Vercel `MODEL_ROUTES`, 서버만 — 앱 빌드 필요 없음).",
    `> 단계: 권함 · 시험 필요 · 시험 불가(사람 판단) · 지켜봄 · 안 함. 돈 기준 ${MONEY}원(한 사람 한 달), 종료 ${SOON_DAYS}일 전부터 알림, 품질은 채팅 교정 큰 문제 비율이 지금보다 ${QUALITY_SLACK}%p 넘게 높지 않으면 같음.`,
    "",
  ];
  if (!rows.length) lines.push("아직 후보 없음.");
  else {
    lines.push("| 단계 | 후보 | 바꿀 곳 | 지금 → 후보 | 손익(한 사람 한 달, 가장 크게 바뀐 요금) | 품질 시험 | 종료 | 왜 |", "|---|---|---|---|---|---|---|---|");
    for (const { c, state, why } of rows) {
      const where = c.kind === "text" ? (c.tasks ?? []).join("·") : Object.keys(c.speech ?? {}).join("·");
      const top = (c.cost?.head ?? []).filter((h) => !h.what.startsWith("가입자")).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))[0];
      const money = c.cost ? (top ? `${top.what} ${won(top.diff)}` : "변화 없음") : "계산 전";
      const t = c.trial;
      const quality = t ? `큰 문제 ${t.majorPct}% (지금 ${t.baseMajorPct}%) · ${t.ms}ms (지금 ${t.baseMs}ms) · ${t.judged}줄` : trialable(c) ? "아직" : "—";
      const days = daysUntil(c.deadline);
      lines.push(`| **${state}** | ${c.model} (${c.provider}) | ${where} | ${c.replaces ?? "—"} → ${c.model} | ${money} | ${quality} | ${c.deadline ? `${c.deadline} (${days}일)` : "—"} | ${why}${c.why ? ` — ${c.why}` : ""} |`);
    }
    for (const { c, state } of rows.filter((r) => r.c.cost?.head?.length)) {
      lines.push("", `## ${c.model} — ${state}`, "", `- 가격: ${c.price ? JSON.stringify(c.price) : "확인 못 함"} · 근거 ${c.source ?? "—"} · 확인 ${c.checked ?? "—"}`);
      lines.push(`- 계산: ${c.cost.at} · 커밋 ${c.cost.commit} · 바뀐 칸 ${c.cost.changed}`);
      for (const h of c.cost.head) lines.push(`  - ${h.what}: ${won(h.before).replace(/^\+/, "")} → ${won(h.after).replace(/^\+/, "")} (${won(h.diff)})`);
      if (c.trial) lines.push(`- 품질 시험 ${c.trial.at}: 같은 ${c.trial.users}명·같은 문장 — 큰 문제 ${c.trial.majorPct}% vs 지금 ${c.trial.baseMajorPct}%, 오류 ${c.trial.errorPct}% vs ${c.trial.baseErrorPct}%, 응답 중앙 ${c.trial.ms}ms vs ${c.trial.baseMs}ms. 채팅 교정으로 본 대리 지표.${c.trial.notes?.length ? ` 후보만 틀린 예: ${c.trial.notes.slice(0, 2).join(" / ")}` : ""}`);
      lines.push(`- 바꾸는 법: ${c.kind === "text" ? `Vercel \`MODEL_ROUTES\`에 ${JSON.stringify(Object.fromEntries((c.tasks ?? []).map((t) => [t, routeOf(c)])))} (먼저 운영 확인) → 좋으면 \`src/lib/aiDefaults.ts\` DEFAULT_ROUTES${c.provider === "openai" || c.provider === "anthropic" ? "" : " — 이 제공자는 `server/llm.ts`에 길부터 필요"}` : "`src/lib/aiDefaults.ts` SPEECH_DEFAULTS + 단가 `modelPrices.ts`"}`);
    }
  }
  fs.writeFileSync(DOC, lines.join("\n") + "\n");
  // 알림: 새로 "권함"이 됐거나, 종료가 90일 안으로 들어온 것(지난번 알림과 다를 때만 — notified 칸).
  const notify = [];
  for (const { c, state, why } of rows) {
    const days = daysUntil(c.deadline);
    const key = `${state}|${days !== null && days <= SOON_DAYS ? "soon" : ""}`;
    if ((state === "권함" || (days !== null && days <= SOON_DAYS)) && c.notified !== key) {
      notify.push({ id: c.id, line: `${state}: ${c.replaces ?? "?"} → ${c.model} — ${why}` });
      c.notified = key;
    }
  }
  writeList(list);
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "notify.json"), JSON.stringify(notify, null, 1) + "\n");
  console.log(`후보 ${rows.length} · ${Object.entries(rows.reduce((a, r) => ((a[r.state] = (a[r.state] ?? 0) + 1), a), {})).map(([k, v]) => `${k} ${v}`).join(" · ") || "—"} · 알릴 것 ${notify.length}`);
}

function cost() {
  const list = readList();
  if (!list.length) return render();
  const started = Date.now();
  const base = tables(null);
  for (const c of list) {
    try {
      c.cost = costOf(base, c);
      console.log(`${c.id}: 바뀐 칸 ${c.cost.changed}, 가장 좋아짐 ${won(c.cost.best)}, 가장 나빠짐 ${won(c.cost.worst)}`);
    } catch (error) {
      c.cost = null;
      console.log(`${c.id}: 계산 실패 — ${String(error.message ?? error).split("\n").find((l) => /단가|Error/.test(l)) ?? error}`);
    }
  }
  writeList(list);
  console.log(`계산 ${((Date.now() - started) / 1000).toFixed(0)}초`);
  render();
}

// ---------- 품질 시험 ----------
const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

function usersFor(c) {
  // 한 사람 약 7턴 × 호출 2번(교정+답·다시 읽기) × 2,000/300 토큰.
  const perCall = ((c.price?.input ?? 1) * 2000 + (c.price?.output ?? 5) * 300) / 1e6;
  return Math.max(14, Math.min(28, Math.floor(TRIAL_USD / (7 * 2 * perCall))));
}

function trial() {
  const id = process.argv[3];
  const c = readList().find((x) => x.id === id);
  if (!c) throw new Error(`후보 없음: ${id}`);
  if (!trialable(c)) throw new Error(`${id}: 자동 품질 시험 대상 아님(${c.kind}, ${c.provider}) — 카드에 "시험 불가"로 남김`);
  const users = Number(arg("users", usersFor(c)));
  const seed = Number(arg("seed", today().replace(/-/g, "")));
  const dir = path.join(OUT, `trial-${id}`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, "judge"), { recursive: true });
  const routes = JSON.stringify(Object.fromEntries([...new Set(["chat", "howToSay", ...(c.tasks ?? [])])].map((t) => [t, routeOf(c)])));
  const runs = {};
  for (const side of ["base", "cand"]) {
    const runId = `models-${id}-${side}-${seed}`.slice(0, 60);
    const args = ["run", "sim:users", "--", "--suite", "tiers", "--users", String(users), "--concurrency", "4", "--seed", String(seed), "--run-id", runId];
    if (side === "cand") args.push("--model-routes", routes);
    console.log(`${side}: ${users}명 tiers${side === "cand" ? ` (${routes})` : ""}`);
    try {
      execFileSync("npm", args, { cwd: ROOT, stdio: ["ignore", "inherit", "inherit"], env: { ...process.env, NODE_USE_ENV_PROXY: "1" } });
    } finally {
      const results = path.join(ROOT, "tmp/sim-users", runId, "results.json");
      if (fs.existsSync(results)) execFileSync("node", ["scripts/sim-users/cleanup.mjs", results], { cwd: ROOT, stdio: "ignore", env: { ...process.env, NODE_USE_ENV_PROXY: "1" } });
    }
    execFileSync("node", ["scripts/sim-users/judge-export.mjs", path.join("tmp/sim-users", runId), "--size", "1000"], { cwd: ROOT, stdio: "ignore" });
    runs[side] = runId;
  }
  // 두 쪽을 섞고 이름을 가린다(평가자가 어느 모델인지 모르게).
  const items = [];
  for (const [side, runId] of Object.entries(runs)) {
    const file = path.join(ROOT, "tmp/sim-users", runId, "judge/batch-01.json");
    for (const it of fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : []) items.push({ side, it });
  }
  let s = seed;
  const rand = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  items.sort(() => rand() - 0.5);
  const key = {};
  const blind = items.map(({ side, it }, i) => {
    const hid = `t${String(i + 1).padStart(4, "0")}`;
    key[hid] = { side, id: it.id };
    return { ...it, id: hid };
  });
  for (let i = 0; i < blind.length; i += 40) fs.writeFileSync(path.join(dir, "judge", `batch-${String(i / 40 + 1).padStart(2, "0")}.json`), JSON.stringify(blind.slice(i, i + 40), null, 1));
  fs.copyFileSync(path.join(ROOT, "scripts/sim-users/judge-rubric.md"), path.join(dir, "judge/RUBRIC.md"));
  fs.writeFileSync(path.join(dir, "key.json"), JSON.stringify({ runs, users, seed, routes, key }, null, 1));
  console.log(`평가 묶음 ${Math.ceil(blind.length / 40)}개(${blind.length}줄) → ${path.relative(ROOT, path.join(dir, "judge"))} — 하위 에이전트가 RUBRIC.md대로 batch-NN.verdicts.json`);
}

function trialResult() {
  const id = process.argv[3];
  const list = readList();
  const c = list.find((x) => x.id === id);
  if (!c) throw new Error(`후보 없음: ${id}`);
  const dir = path.join(OUT, `trial-${id}`);
  const { runs, users, key } = JSON.parse(fs.readFileSync(path.join(dir, "key.json"), "utf8"));
  const verdicts = fs.readdirSync(path.join(dir, "judge")).filter((f) => /\.verdicts\.json$/.test(f)).flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, "judge", f), "utf8")));
  const side = { base: { judged: 0, major: 0 }, cand: { judged: 0, major: 0, notes: [] } };
  for (const v of verdicts) {
    const k = key[v.id];
    if (!k) continue;
    side[k.side].judged += 1;
    if (v.severity === "major") {
      side[k.side].major += 1;
      if (k.side === "cand" && v.note) side.cand.notes.push(v.note);
    }
  }
  const runStats = (runId) => {
    const run = JSON.parse(fs.readFileSync(path.join(ROOT, "tmp/sim-users", runId, "results.json"), "utf8"));
    const steps = run.records.flatMap((r) => r.transcript.filter((t) => t.suite === "tiers" && t.kind !== "start" && t.turn > 0));
    const ok = steps.filter((t) => t.status === 200);
    const ms = ok.map((t) => t.ms).filter(Boolean).sort((a, b) => a - b);
    return { errorPct: steps.length ? Math.round(((steps.length - ok.length) / steps.length) * 100) : 0, ms: ms.length ? ms[Math.floor(ms.length / 2)] : null };
  };
  const pct = (s) => (s.judged ? Math.round((s.major / s.judged) * 1000) / 10 : null);
  const b = runStats(runs.base);
  const a = runStats(runs.cand);
  c.trial = { at: today(), users, judged: side.base.judged + side.cand.judged, majorPct: pct(side.cand), baseMajorPct: pct(side.base), errorPct: a.errorPct, baseErrorPct: b.errorPct, ms: a.ms, baseMs: b.ms, notes: side.cand.notes.slice(0, 5) };
  writeList(list);
  console.log(`${id}: 큰 문제 ${c.trial.majorPct}% (지금 ${c.trial.baseMajorPct}%) · 오류 ${a.errorPct}% (${b.errorPct}%) · ${a.ms}ms (${b.ms}ms) · 평가 ${c.trial.judged}줄`);
  render();
}

const COMMANDS = { cost, trial, "trial-result": trialResult, render };
const command = COMMANDS[process.argv[2]];
if (command) command();
else {
  console.log("cost | trial <id> | trial-result <id> | render");
  process.exitCode = 1;
}

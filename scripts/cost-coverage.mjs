/**
 * 모델을 쓰는 서버 경로가 모두 사용량을 기록하는지 확인한다.
 *
 * 비용 계산은 `meterRequest(request, op)` 기록에 단가(opCost.ts)를 곱해서 나온다.
 * 새 기능이 모델을 부르면서 기록을 빠뜨리면 그 비용은 보고서에도, 요금별
 * 비용 표에도 영영 안 보인다 — 2026-10-18 이 검사를 처음 돌렸을 때 영상 찾기
 * (content-discovery)와 자막 준비(prepare-from-stt)가 그랬다.
 *
 * 방법: src/app/api/**\/route.ts마다 import를 따라가(@/·상대 경로, 타입 import 제외)
 * 그 안에 OpenAI를 부르는 코드(getOpenAIClient( 또는 api.openai.com)가 있으면,
 * 그 route 파일에 meterRequest( 가 있어야 한다. 일부러 안 세는 경로는 아래
 * UNMETERED에 이유와 함께 적는다.
 *
 * 두 번째 검사(2026-10-22): opCost.ts의 op마다 적은 기능(task — 그 기능의 코드 기본 모델로 값을 매김)이, 그 op를 기록하는
 * route가 실제로 부르는 기능(completeChat·routeFor·openaiModel의 첫 글자 인자) 중 하나인지. 틀리면 비용 표가 엉뚱한 모델 단가로
 * 계산되므로 실패한다.
 *
 * 실행: node scripts/cost-coverage.mjs        (빠진 곳이 있으면 실패)
 *       node scripts/cost-coverage.mjs --json (plan-cost.mjs가 읽음)
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** 일부러 기록하지 않는 경로와 이유. */
export const UNMETERED = {};

const IMPORT = /(?:import|export)\s+([^"';]*?)\s*from\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;
const MODEL_CALL = /getOpenAIClient\(|api\.openai\.com/;

function resolveSpec(from, spec) {
  let base;
  if (spec.startsWith("@/")) base = join(root, "src", spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(from), spec);
  else return null;
  for (const c of [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts")]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

function closure(file, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);
  for (const m of readFileSync(file, "utf8").matchAll(IMPORT)) {
    if (m[1] !== undefined && /^type\b/.test(m[1].trim())) continue;
    const next = resolveSpec(file, m[2] ?? m[3]);
    if (next) closure(next, seen);
  }
  return seen;
}

function routeFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...routeFiles(path));
    else if (entry === "route.ts") out.push(path);
  }
  return out;
}

const OWN_CLIENT = join(root, "src/lib/server/openai.ts");

/** 모델을 쓰는 route마다 { route, metered, allowed, via }. */
export function scanRoutes() {
  return routeFiles(join(root, "src/app/api"))
    .sort()
    .flatMap((file) => {
      const via = [...closure(file)].filter((f) => f !== OWN_CLIENT && MODEL_CALL.test(readFileSync(f, "utf8")));
      if (via.length === 0) return [];
      const route = relative(root, file);
      return [{
        route,
        metered: /meterRequest\(/.test(readFileSync(file, "utf8")),
        allowed: UNMETERED[route] ?? null,
        via: via.map((f) => relative(root, f)),
      }];
    });
}

const LLM_FILE = join(root, "src/lib/server/llm.ts");
const TASK_CALL = /(?:completeChat|routeFor|openaiModel)\(\s*(?:[\w.]+,\s*)?["'](\w+)["']/g;
const METER = /meterRequest\([^,]+,\s*(?:[^"'()]*\?\s*)?["'](\w+)["'](?:\s*:\s*["'](\w+)["'])?/g;

/** opCost.ts에서 op → 기능(task). 글로 읽는다(이 스크립트는 .ts를 가져올 수 없음). */
export function opTasks() {
  const text = readFileSync(join(root, "src/lib/billing/opCost.ts"), "utf8");
  const table = text.slice(text.indexOf("export const OP_COST"));
  const out = {};
  for (const m of table.matchAll(/^\s*(\w+):\s*(?:llm|estimated)\(\s*"(\w+)"/gm)) out[m[1]] = m[2];
  for (const m of table.matchAll(/^\s*(\w+):\s*\{\s*kind:\s*"llm",\s*task:\s*"(\w+)"/gm)) out[m[1]] = m[2];
  return out;
}

/** route마다 기록하는 op와 부르는 기능을 맞대어, op의 기능이 그 route에 없으면 { route, op, task, tasks }. */
export function mismatchedOpTasks() {
  const tasksOf = opTasks();
  const out = [];
  for (const file of routeFiles(join(root, "src/app/api")).sort()) {
    const ops = [...new Set([...readFileSync(file, "utf8").matchAll(METER)].flatMap((m) => [m[1], m[2]].filter(Boolean)))];
    const known = ops.filter((op) => tasksOf[op]);
    if (!known.length) continue;
    const tasks = new Set();
    for (const f of closure(file)) {
      if (f === LLM_FILE) continue;
      for (const m of readFileSync(f, "utf8").matchAll(TASK_CALL)) tasks.add(m[1]);
    }
    for (const op of known) {
      if (!tasks.has(tasksOf[op])) out.push({ route: relative(root, file), op, task: tasksOf[op], tasks: [...tasks] });
    }
  }
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rows = scanRoutes();
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    const missing = rows.filter((r) => !r.metered && !r.allowed);
    console.log(`모델을 쓰는 경로 ${rows.length}개: 기록함 ${rows.filter((r) => r.metered).length}, 일부러 뺌 ${rows.filter((r) => !r.metered && r.allowed).length}, 빠짐 ${missing.length}`);
    for (const r of missing) {
      console.error(`빠짐: ${r.route} — 모델 호출 위치 ${r.via.slice(0, 3).join(", ")}`);
    }
    const wrong = mismatchedOpTasks();
    console.log(`op의 모델 기능: 어긋남 ${wrong.length}`);
    for (const w of wrong) {
      console.error(`어긋남: ${w.route} — op ${w.op}의 기능 "${w.task}"를 이 경로가 부르지 않음(부르는 기능: ${w.tasks.join(", ") || "없음"}). src/lib/billing/opCost.ts를 고치세요.`);
    }
    if (wrong.length) process.exitCode = 1;
    if (missing.length) {
      console.error(
        "\n이 경로에 meterRequest(request, \"<op>\")를 넣고, op를 src/lib/server/modelCalls.ts와 src/lib/billing/opCost.ts에 더하세요." +
          "\n일부러 세지 않는 경로면 scripts/cost-coverage.mjs UNMETERED에 이유와 함께 적으세요.",
      );
      process.exitCode = 1;
    }
  }
}

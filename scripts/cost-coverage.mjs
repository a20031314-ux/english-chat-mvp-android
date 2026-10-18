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
 * 실행: node scripts/cost-coverage.mjs        (빠진 곳이 있으면 실패)
 *       node scripts/cost-coverage.mjs --json (plan-cost.mjs가 읽음)
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** 일부러 기록하지 않는 경로와 이유. */
export const UNMETERED = {
  "src/app/api/realtime/call/route.ts": "예전 실시간 통화. 앱에서 더 이상 열지 않고, 열리면 자체 추정을 로그로 남김(cost.ts callMinuteUsd)",
};

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
    if (missing.length) {
      console.error(
        "\n이 경로에 meterRequest(request, \"<op>\")를 넣고, op를 src/lib/server/modelCalls.ts와 src/lib/billing/opCost.ts에 더하세요." +
          "\n일부러 세지 않는 경로면 scripts/cost-coverage.mjs UNMETERED에 이유와 함께 적으세요.",
      );
      process.exitCode = 1;
    }
  }
}

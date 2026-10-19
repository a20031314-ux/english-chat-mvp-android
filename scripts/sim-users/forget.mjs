/**
 * 점검이 운영 저장소에 남긴 데이터 지우기(/api/simcheck/forget). 지우는 것은 키 이름에 simcheck-가 든 것뿐.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/sim-users/forget.mjs <실행 이름>- [--dry-run]   (그 실행만)
 *   NODE_USE_ENV_PROXY=1 node scripts/sim-users/forget.mjs --all [--dry-run]           (모든 점검 데이터 — 다른 점검이 돌고 있지 않을 때만)
 *
 * run.mjs·screens.mjs·load.mjs·load-voice.mjs는 끝날 때 자기 실행 것을 저절로 지운다(--keep-data면 남김).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_API = "https://english-chat-mvp.vercel.app";

export async function forgetRun(api, target, { dryRun = false } = {}) {
  const all = target === "--all";
  const caller = `simcheck-${all ? "sweep" : target}cleanup`;
  const body = JSON.stringify(all ? { all: true, dryRun } : { prefix: target, dryRun });
  let last;
  for (const wait of [0, 3000, 10000]) {
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
    try {
      const response = await fetch(`${(api || DEFAULT_API).replace(/\/$/, "")}/api/simcheck/forget`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-rc-user": caller },
        body,
        signal: AbortSignal.timeout(90_000),
      });
      last = { status: response.status, body: await response.json().catch(() => null) };
      if (response.status === 200 || response.status === 400 || response.status === 429) return last;
    } catch (error) {
      last = { status: 0, body: { error: String(error?.message ?? error) } };
    }
  }
  return last;
}

/** 끝난 점검이 부르는 한 줄. 실패해도 점검 결과는 그대로(남은 것은 다음 --all 정리나 400일 만료로). */
export async function forgetAtEnd(api, runId, argv = process.argv) {
  if (argv.includes("--keep-data")) {
    console.log(`점검 데이터 남김(--keep-data): simcheck-${runId}-*`);
    return null;
  }
  const r = await forgetRun(api, `${runId}-`);
  console.log(r?.status === 200 ? `점검 데이터 지움: ${r.body.deleted}개 키 (simcheck-${runId}-*)` : `점검 데이터 지우기 실패 ${r?.status} ${JSON.stringify(r?.body)} — 나중에 node scripts/sim-users/forget.mjs ${runId}-`);
  return r;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  if (!target) {
    console.log("사용: node scripts/sim-users/forget.mjs <실행 이름>- | --all [--dry-run]");
    process.exit(1);
  }
  const r = await forgetRun(process.env.API_BASE, target, { dryRun: process.argv.includes("--dry-run") });
  console.log(JSON.stringify(r, null, 1));
  if (r?.status !== 200) process.exit(1);
}

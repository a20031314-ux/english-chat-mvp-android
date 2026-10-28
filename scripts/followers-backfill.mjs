/**
 * 팔로워 목록 채우기(한 번만, 2026-10-28) — 팔로워 목록(`social:v1:followerset:<계정>`)은 2026-10-28부터
 * 팔로우할 때 쌓인다. 그 전 팔로우는 관계 줄(`social:v1:edge:<나>:<상대>`)에만 있어 목록에 안 보이고,
 * 화면은 그만큼을 "외 n명"으로 보여 준다. 이 스크립트가 관계 줄을 훑어 목록에 넣는다(점수 0 = 날짜 모름, 목록 맨 뒤).
 *
 *   node --experimental-strip-types scripts/followers-backfill.mjs [--dry-run]
 *
 * KV 키: KV_REST_API_URL·KV_REST_API_TOKEN(또는 UPSTASH_REDIS_REST_*) — data-sweep.mjs와 같음(사용자 PC).
 * 키 공간을 훑으므로 요청 길이 아니라 여기서만 한다(kv.ts kvScanKeys 주석). 여러 번 돌려도 같다(이미 있으면 점수를 0으로 덮지 않음).
 */
import { kvConfigured, kvScanKeys, kvZRevRange, kvZAdd } from "../src/lib/server/kv.ts";

const dryRun = process.argv.includes("--dry-run");

if (!kvConfigured()) {
  console.error("KV 키가 없어요. KV_REST_API_URL·KV_REST_API_TOKEN을 넣고 다시 돌리세요(Vercel 환경 변수와 같은 값).");
  process.exit(1);
}

const keys = await kvScanKeys("social:v1:edge:*", 1000);
const byTarget = new Map();
for (const key of keys) {
  const [, , , from, to] = key.split(":");
  if (!/^lb_[0-9a-f]{24}$/.test(from ?? "") || !/^lb_[0-9a-f]{24}$/.test(to ?? "")) continue;
  if (!byTarget.has(to)) byTarget.set(to, []);
  byTarget.get(to).push(from);
}

let added = 0;
for (const [target, followers] of byTarget) {
  const have = new Set((await kvZRevRange(`social:v1:followerset:${target}`, 0, -1)).map((row) => row.member));
  for (const follower of followers) {
    if (have.has(follower)) continue;
    added += 1;
    if (!dryRun) await kvZAdd(`social:v1:followerset:${target}`, 0, follower);
  }
}
console.log(`관계 줄 ${keys.length}개 · 팔로워가 있는 계정 ${byTarget.size}개 · 목록에 ${dryRun ? "넣을" : "넣은"} 줄 ${added}개${dryRun ? " (--dry-run, 쓰지 않음)" : ""}`);

import { test } from "node:test";
import assert from "node:assert/strict";
import { canOperate, liftBan, markDone, readBan, readDone, reportId, setBan } from "./opsStore.ts";
import { addReport, readReportRows } from "./socialStore.ts";
import { randomOpsView, recordAdult, recordStrike, setRandomOff, setRandomPause, pausedUntil } from "./randomStore.ts";
import { openCounts, parseReports, reportKind } from "../ops/reports.ts";

// KV 접속 정보 없이 메모리로 돈다(kv.ts). 운영 저장소에 닿지 않는다.
delete process.env.KV_REST_API_URL;
delete process.env.UPSTASH_REDIS_REST_URL;

const NOW = Date.UTC(2026, 9, 21, 3, 0, 0);

test("운영자 키: OPS_KEY가 있으면 그것만, 없으면 의견함 키(틀리면 거절)", () => {
  assert.equal(canOperate(null, {}), false);
  assert.equal(canOperate("wrong", { OPS_KEY: "secret-ops" } as NodeJS.ProcessEnv), false);
  assert.equal(canOperate(" secret-ops ", { OPS_KEY: "secret-ops" } as NodeJS.ProcessEnv), true);
  assert.equal(canOperate("anything", {}), false);
});

test("사람 기능 정지: 기한 있으면 지나면 풀림, 풀 때까지는 남음, 풀기", async () => {
  await setBan("acct_ops_a", NOW + 60_000, "욕설", NOW);
  assert.equal((await readBan("acct_ops_a", NOW))?.note, "욕설");
  assert.equal(await readBan("acct_ops_a", NOW + 120_000), null);
  await setBan("acct_ops_b", null, "", NOW);
  assert.equal((await readBan("acct_ops_b", NOW + 400 * 86_400_000))?.until, null);
  await liftBan("acct_ops_b");
  assert.equal(await readBan("acct_ops_b", NOW), null);
});

test("신고 읽기: 최신순, 사람/AI 구분, 깨진 줄 버림, 처리 표시·처리 안 한 수", async () => {
  await addReport({ at: "2026-10-21T01:00:00Z", reporter: "acct_r1", target: "acct_t1", reason: "스팸", roomId: null, lines: ["buy now", "สวัสดี"] });
  await addReport({ at: "2026-10-21T02:00:00Z", reporter: "ai", target: "acct_t1", reason: "ai_video_self", roomId: null, lines: [] });
  const rows = (await readReportRows()).map((raw) => ({ id: reportId(raw), raw }));
  rows.push({ id: "000000000000", raw: "{not json" });
  const first = parseReports(rows, {});
  assert.equal(first.length, 2);
  assert.equal(first[0].kind, "ai");
  assert.equal(first[1].kind, "user");
  assert.deepEqual(first[1].lines, ["buy now", "สวัสดี"]);
  assert.equal(openCounts(first).get("acct_t1"), 2);

  await markDone(first[1].id, true, "경고만", NOW);
  const after = parseReports(rows, await readDone());
  assert.equal(after[1].done?.note, "경고만");
  assert.equal(openCounts(after).get("acct_t1"), 1);
  await markDone(first[1].id, false, "", NOW);
  assert.equal((await readDone())[first[1].id], undefined);
  assert.equal(reportKind("acct_x", "ai_video_other"), "ai");
});

test("랜덤 운영: 멈춤·풀기, 막기는 ci 기준·풀면 AI로 막힌 것도 풀림, 인증 전이면 대상 없음", async () => {
  assert.equal(await setRandomOff("acct_ops_none", true, NOW), "UNVERIFIED");
  await recordAdult("acct_ops_r", "iv_opsops01", { birthDate: "1990-01-01", ci: "CI-OPS" }, NOW);
  await setRandomPause("acct_ops_r", NOW + 3_600_000, NOW);
  assert.equal(await pausedUntil("acct_ops_r", NOW), NOW + 3_600_000);
  await setRandomPause("acct_ops_r", null, NOW);
  assert.equal(await pausedUntil("acct_ops_r", NOW), null);

  await setRandomOff("acct_ops_r", true, NOW);
  assert.equal((await randomOpsView("acct_ops_r", NOW)).off, true);
  // 같은 사람(ci)이 새 계정으로 인증해도 막힘.
  assert.equal(await recordAdult("acct_ops_r2", "iv_opsops02", { birthDate: "1990-01-01", ci: "CI-OPS" }, NOW), "OFF");
  await setRandomOff("acct_ops_r", false, NOW);
  assert.equal((await randomOpsView("acct_ops_r", NOW)).off, false);

  // ci 없는 계정: AI에 두 번 걸려 막힘 → 운영자가 풀면 성인으로 돌아옴.
  await recordAdult("acct_ops_n", "iv_opsops03", { birthDate: "1991-01-01", ci: null }, NOW);
  await recordStrike("acct_ops_n", NOW);
  await recordStrike("acct_ops_n", NOW + 1000);
  const blocked = await randomOpsView("acct_ops_n", NOW + 2000);
  assert.equal(blocked.off, true);
  assert.equal(blocked.strikes, 2);
  assert.equal(blocked.adult, true);
  await setRandomOff("acct_ops_n", false, NOW + 2000);
  await setRandomPause("acct_ops_n", null, NOW + 2000);
  const lifted = await randomOpsView("acct_ops_n", NOW + 3000);
  assert.deepEqual([lifted.off, lifted.adult, lifted.strikes, lifted.pausedUntil], [false, true, 0, null]);
});

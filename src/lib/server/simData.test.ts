import assert from "node:assert/strict";
import test from "node:test";
import { kvGetJson, kvSetJson } from "./kv.ts";
import { SIM_FORGET_DAILY_MAX, forgetSimData, isSimCaller, isSimRequest, simForgetPattern } from "./simData.ts";

test("패턴은 점검 데이터 안으로만: 잘못된 접두어·패턴 글자는 거절", () => {
  assert.equal(simForgetPattern({ prefix: "regress2-20261020-" }), "*simcheck-regress2-20261020-*");
  assert.equal(simForgetPattern({ all: true }), "*simcheck-*");
  for (const bad of ["", "ab", "a*b", "x?", "[a]", "a b", 12, undefined, "a".repeat(81)]) assert.equal(simForgetPattern({ prefix: bad }), null, String(bad));
  assert.equal(simForgetPattern({ all: "true" }), null);
});

test("점검 사용자만 부를 수 있다", () => {
  assert.ok(isSimCaller("rc:simcheck-run1-p001"));
  assert.ok(!isSimCaller("rc:$RCAnonymousID:abc"));
  assert.ok(!isSimCaller("acct:simcheck-x"));
});

test("점검 요청: 로그인 없이 simcheck- 사용자만(문제은행 성장·셈에서 뺌)", () => {
  const req = (h: Record<string, string>) => ({ headers: new Headers(h) });
  assert.ok(isSimRequest(req({ "x-rc-user": "simcheck-quizsweep-ja-ko" })));
  assert.ok(!isSimRequest(req({ "x-rc-user": "$RCAnonymousID:abc" })));
  assert.ok(!isSimRequest(req({ "x-rc-user": "simcheck-x", "x-auth-token": "t" })));
  assert.ok(!isSimRequest(req({})));
});

test("그 실행의 점검 데이터만 지우고 실제 사용자·다른 실행은 남긴다", async () => {
  await kvSetJson("ledger:v1:rc:simcheck-runA-p001:ja", { a: 1 });
  await kvSetJson("growth:v1:rc:simcheck-runA-p002:en", { a: 1 });
  await kvSetJson("ledger:v1:rc:simcheck-runAB-p001:ja", { a: 1 });
  await kvSetJson("ledger:v1:rc:$RCAnonymousID:real:ja", { a: 1 });
  const dry = await forgetSimData({ prefix: "runA-", dryRun: true });
  assert.ok(dry.ok && dry.found === 2 && dry.deleted === 0);
  assert.ok(await kvGetJson("ledger:v1:rc:simcheck-runA-p001:ja"));
  const done = await forgetSimData({ prefix: "runA-" });
  assert.ok(done.ok && done.deleted === 2);
  assert.equal(await kvGetJson("ledger:v1:rc:simcheck-runA-p001:ja"), null);
  assert.ok(await kvGetJson("ledger:v1:rc:simcheck-runAB-p001:ja"));
  assert.ok(await kvGetJson("ledger:v1:rc:$RCAnonymousID:real:ja"));
});

test("하루 횟수를 넘으면 LIMIT", async () => {
  const day = Date.UTC(2031, 0, 1);
  let last;
  for (let i = 0; i <= SIM_FORGET_DAILY_MAX; i += 1) last = await forgetSimData({ prefix: "none-" }, day);
  assert.deepEqual(last, { ok: false, error: "LIMIT" });
});

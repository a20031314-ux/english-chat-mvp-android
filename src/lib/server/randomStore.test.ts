import { test } from "node:test";
import assert from "node:assert/strict";
import { isAdultBirthDate, languageFit } from "../random/protocol.ts";
import { readPortoneVerification } from "./identityVerify.ts";
import { forgetRandom, isOff, joinOrPoll, leaveQueue, readAdult, recordAdult, type JoinInput } from "./randomStore.ts";

// KV 접속 정보 없이 메모리로 돈다(kv.ts). 운영 저장소에 닿지 않는다.
delete process.env.KV_REST_API_URL;
delete process.env.UPSTASH_REDIS_REST_URL;

const NOW = Date.UTC(2026, 9, 21, 3, 0, 0); // 2026-10-21 12:00 KST

test("성인: 만 19세가 되는 해의 1월 1일부터(청소년보호법) — 한국 시간의 올해", () => {
  assert.equal(isAdultBirthDate("2007-12-31", NOW), true); // 2026 − 2007 = 19
  assert.equal(isAdultBirthDate("2008-01-01", NOW), false);
  assert.equal(isAdultBirthDate("1990-05-05", NOW), true);
  assert.equal(isAdultBirthDate("bad", NOW), false);
  // 12월 31일 15시(UTC) = 1월 1일 0시(KST): 이미 새해로 센다.
  assert.equal(isAdultBirthDate("2008-06-01", Date.UTC(2026, 11, 31, 15, 0, 0)), true);
});

test("언어 맞춤: 서로 맞음 2, 한쪽만 1, 안 맞음 0", () => {
  assert.equal(languageFit({ learn: "ja", ui: "ko" }, { learn: "ko", ui: "ja" }), 2);
  assert.equal(languageFit({ learn: "ja", ui: "ko" }, { learn: "en", ui: "ja" }), 1);
  assert.equal(languageFit({ learn: "es", ui: "ar" }, { learn: "th", ui: "vi" }), 0);
  assert.equal(languageFit({ learn: null, ui: null }, { learn: "ko", ui: "ja" }), 0);
});

test("포트원 응답 읽기: VERIFIED만, 생년월일 필수, ci·외국인·customData", () => {
  assert.deepEqual(
    readPortoneVerification({ status: "VERIFIED", verifiedCustomer: { name: "x", birthDate: "1999-02-03", ci: "CI", isForeigner: true }, customData: "lb_1" }),
    { ok: true, birthDate: "1999-02-03", ci: "CI", foreigner: true, customData: "lb_1" },
  );
  assert.deepEqual(readPortoneVerification({ status: "READY" }), { ok: false, reason: "NOT_VERIFIED" });
  assert.deepEqual(readPortoneVerification({ status: "VERIFIED", verifiedCustomer: {} }), { ok: false, reason: "NO_BIRTHDATE" });
  assert.deepEqual(readPortoneVerification(null), { ok: false, reason: "ERROR" });
});

test("성인인증 기록: 인증 번호는 한 계정만, 같은 사람(ci)도 한 계정만, 미성년은 막힘으로 남음", async () => {
  assert.equal(await recordAdult("acct_rand_a", "iv_aaaaaaaa1", { birthDate: "1995-01-01", ci: "CI-A" }, NOW), "adult");
  assert.equal((await readAdult("acct_rand_a"))?.adult, true);
  // 이름·생년월일은 두지 않는다.
  assert.equal(JSON.stringify(await readAdult("acct_rand_a")).includes("1995"), false);
  assert.equal(await recordAdult("acct_rand_b", "iv_aaaaaaaa1", { birthDate: "1995-01-01", ci: "CI-B" }, NOW), "USED");
  assert.equal(await recordAdult("acct_rand_b", "iv_bbbbbbbb1", { birthDate: "1995-01-01", ci: "CI-A" }, NOW), "CI_TAKEN");
  assert.equal(await recordAdult("acct_rand_kid", "iv_kkkkkkkk1", { birthDate: "2010-03-03", ci: "CI-K" }, NOW), "minor");
  assert.equal((await readAdult("acct_rand_kid"))?.adult, false);
  assert.equal(await isOff(await readAdult("acct_rand_a")), false);
  // 계정을 지우면 기록이 사라지고, 같은 사람이 새 계정으로 다시 인증할 수 있다(막힌 사람이 아니면).
  await forgetRandom("acct_rand_a");
  assert.equal(await readAdult("acct_rand_a"), null);
  assert.equal(await recordAdult("acct_rand_a2", "iv_aaaaaaaa2", { birthDate: "1995-01-01", ci: "CI-A" }, NOW), "adult");
});

function input(me: string, side: { learn: string | null; ui: string | null }, now: number, extra: Partial<JoinInput> = {}): JoinInput {
  return {
    me,
    mode: "video",
    side,
    now,
    blocked: async () => false,
    connect: async (a, b) => ({ threadId: `t_${[a.id, b.id].sort().join("_")}`, roomId: "roomxx", names: { [a.id]: `n-${a.id}`, [b.id]: `n-${b.id}` } }),
    ...extra,
  };
}

test("짝 맞추기: 먼저 온 사람은 기다리고, 언어가 맞는 사람이 오면 둘이 같은 대화·방으로", async () => {
  const t0 = NOW + 1_000;
  assert.equal(await joinOrPoll(input("acct_q_ja", { learn: "ko", ui: "ja" }, t0)), null);
  // 언어가 안 맞는 사람은 잇지 않는다.
  assert.equal(await joinOrPoll(input("acct_q_th", { learn: "vi", ui: "th" }, t0 + 500)), null);
  const mine = await joinOrPoll(input("acct_q_ko", { learn: "ja", ui: "ko" }, t0 + 1_000));
  assert.ok(mine);
  assert.equal(mine.other, "acct_q_ja");
  assert.equal(mine.nickname, "n-acct_q_ja");
  assert.equal(mine.roomId, "roomxx");
  // 기다리던 사람은 다음 물음에 같은 짝을 받는다.
  const theirs = await joinOrPoll(input("acct_q_ja", { learn: "ko", ui: "ja" }, t0 + 2_000));
  assert.ok(theirs);
  assert.equal(theirs.other, "acct_q_ko");
  assert.equal(theirs.threadId, mine.threadId);
  // 방금 만난 사람과는 24시간 안 다시 잇지 않는다.
  assert.equal(await joinOrPoll(input("acct_q_ja", { learn: "ko", ui: "ja" }, t0 + 3_000)), null);
  assert.equal(await joinOrPoll(input("acct_q_ko", { learn: "ja", ui: "ko" }, t0 + 3_500)), null);
  await leaveQueue("acct_q_ja");
  await leaveQueue("acct_q_ko");
  await leaveQueue("acct_q_th");
});

test("짝 맞추기: 차단한 사람·오래 소식 없는 사람·모드가 다른 사람은 건너뜀", async () => {
  const t0 = NOW + 100_000;
  assert.equal(await joinOrPoll(input("acct_b_old", { learn: "es", ui: "ar" }, t0)), null);
  assert.equal(await joinOrPoll(input("acct_b_chat", { learn: "es", ui: "ar" }, t0 + 25_000, { mode: "chat" })), null);
  assert.equal(await joinOrPoll(input("acct_b_blocked", { learn: "es", ui: "ar" }, t0 + 26_000)), null);
  // 25초가 지나 old는 빠졌고, chat 모드는 영상과 섞이지 않고, blocked는 차단.
  const found = await joinOrPoll(
    input("acct_b_me", { learn: "ar", ui: "es" }, t0 + 27_000, { blocked: async (other) => other === "acct_b_blocked" }),
  );
  assert.equal(found, null);
  for (const id of ["acct_b_old", "acct_b_chat", "acct_b_blocked", "acct_b_me"]) await leaveQueue(id);
});

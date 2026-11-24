import { test } from "node:test";
import assert from "node:assert/strict";
import { isStaffAccount, staffList } from "./staffGrant.ts";

test("STAFF_PREMIUM: 계정 id·이메일을 나눠 읽고, 로그인 안 한 요청에는 안 줌", async () => {
  const { ids, emails } = staffList(" lb_0123456789abcdef01234567 , Tester@Example.com ,, ");
  assert.deepEqual([...ids], ["lb_0123456789abcdef01234567"]);
  assert.deepEqual([...emails], ["tester@example.com"]);
  assert.equal(await isStaffAccount("lb_0123456789abcdef01234567", "lb_0123456789abcdef01234567"), true);
  assert.equal(await isStaffAccount(null, "lb_0123456789abcdef01234567"), false);
  assert.equal(await isStaffAccount("lb_ffffffffffffffffffffffff", "lb_0123456789abcdef01234567"), false);
  assert.equal(await isStaffAccount("lb_0123456789abcdef01234567", ""), false);
});

test("STAFF_PREMIUM: 로그인 아이디도 받음(시험 앱은 Google 로그인이 안 됨)", async () => {
  const { ids, emails, usernames } = staffList("lb_0123456789abcdef01234567, Tester01, a@b.co");
  assert.deepEqual([...ids], ["lb_0123456789abcdef01234567"]);
  assert.deepEqual([...emails], ["a@b.co"]);
  assert.deepEqual([...usernames], ["tester01"]);
  const lookup = async (id: string) => (id === "lb_aaaaaaaaaaaaaaaaaaaaaaaa" ? { email: null, username: "tester01" } : { email: null, username: "other" });
  assert.equal(await isStaffAccount("lb_aaaaaaaaaaaaaaaaaaaaaaaa", "tester01", 0, lookup), true);
  assert.equal(await isStaffAccount("lb_bbbbbbbbbbbbbbbbbbbbbbbb", "tester01", 0, lookup), false);
});

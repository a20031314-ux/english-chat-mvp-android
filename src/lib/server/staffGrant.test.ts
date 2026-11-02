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

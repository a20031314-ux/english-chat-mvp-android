import { test } from "node:test";
import assert from "node:assert/strict";
import { block, blockedEitherWay, counts, follow, readFollowing, unblock, unfollow } from "./socialStore.ts";

// KV 접속 정보 없이 메모리로(kv.ts).
delete process.env.KV_REST_API_URL;
delete process.env.UPSTASH_REDIS_REST_URL;

const A = "lb_" + "a".repeat(24);
const B = "lb_" + "b".repeat(24);
const C = "lb_" + "c".repeat(24);

test("팔로우는 두 번 눌러도 한 번, 언팔로우하면 줄어든다", async () => {
  assert.equal(await follow(A, B), "ok");
  assert.equal(await follow(A, B), "ok");
  assert.equal(await follow(C, B), "ok");
  assert.equal((await counts(B)).followers, 2);
  assert.deepEqual(await readFollowing(A), [B]);
  await unfollow(A, B);
  await unfollow(A, B);
  assert.equal((await counts(B)).followers, 1);
  assert.equal(await follow(A, A), "SELF");
});

test("차단하면 서로의 팔로우가 끊기고 다시 팔로우할 수 없다", async () => {
  await follow(A, C);
  await follow(C, A);
  assert.equal(await block(A, C), "ok");
  assert.equal(await blockedEitherWay(C, A), true);
  assert.equal((await counts(C)).followers, 0);
  assert.equal((await counts(A)).followers, 0);
  assert.equal(await follow(C, A), "BLOCKED");
  await unblock(A, C);
  assert.equal(await follow(C, A), "ok");
});

import { test } from "node:test";
import assert from "node:assert/strict";
// 운영 저장소에 닿지 않게 메모리 저장소로.
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
console.warn = () => {};

const { forgetInvites, inviteCodeFor, inviterOf, isInviteLinkCode } = await import("./inviteLinkStore.ts");

test("초대 코드: 계정마다 하나, 다시 불러도 같은 코드, 코드로 초대한 사람 찾기", async () => {
  const code = await inviteCodeFor("acct-invite-a");
  assert.ok(code && isInviteLinkCode(code));
  assert.equal(await inviteCodeFor("acct-invite-a"), code);
  assert.equal(await inviterOf(code!), "acct-invite-a");
  assert.notEqual(await inviteCodeFor("acct-invite-b"), code);
  assert.equal(await inviterOf("zzzzzzzz"), null);
  assert.equal(isInviteLinkCode("abc0l1io"), false);
});

test("계정을 지우면 그 사람의 링크는 더는 열리지 않는다", async () => {
  const code = await inviteCodeFor("acct-invite-f");
  await forgetInvites("acct-invite-f");
  assert.equal(await inviterOf(code!), null);
  assert.notEqual(await inviteCodeFor("acct-invite-f"), null);
});

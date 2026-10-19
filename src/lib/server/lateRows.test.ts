import { test } from "node:test";
import assert from "node:assert/strict";

// KV 접속 정보 없이 메모리로(kv.ts).
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
console.warn = () => {};

const { rowsAfter, pollFrom, LATE_WINDOW } = await import("./lateRows.ts");
const store = await import("./groupStore.ts");

const id = (c: string) => "lb_" + c.repeat(24);
const OWNER = id("o");
const B = id("p");
const C = id("q");

test("이어 받기: 받은 번호보다 앞에 늦게 들어온 줄도 다시 주고, 번호 순으로", () => {
  // 목록에 7이 6보다 먼저 들어감(동시에 보냄).
  const rows = [5, 7, 6, 8].map((seq) => ({ seq }));
  assert.deepEqual(rowsAfter(rows, pollFrom(7)).map((r) => r.seq), [5, 6, 7, 8], "7까지 받은 사람도 6을 받는다");
  assert.deepEqual(rowsAfter(rows, 6).map((r) => r.seq), [7, 8], "가게에서 직접 물으면 그대로");
  assert.equal(pollFrom(0), 0, "처음 열기는 전부");
  assert.equal(pollFrom(50), 50 - LATE_WINDOW);
});

test("단체방: 둘이 동시에 초대를 받아도 둘 다 들어가고, 동시에 보낸 줄은 목록 순서 = 번호 순서", async () => {
  const group = await store.createGroup({ owner: OWNER, name: "[test] race", languages: ["ja", "ko"], invite: [B, C] });
  await Promise.all([store.answerInvite(B, group.id, true), store.answerInvite(C, group.id, true)]);
  const after = await store.readGroup(group.id);
  assert.deepEqual([...(after?.members ?? [])].sort(), [OWNER, B, C].sort(), "한 사람이 빠지지 않음");

  await Promise.all(
    [OWNER, B, C].flatMap((from) => [1, 2, 3].map((n) => store.sendToGroup({ id: group.id, from, text: `${from.slice(-1)}${n}` }))),
  );
  const raw = (await store.readGroupMessages(group.id)).map((m) => m.seq);
  assert.deepEqual(raw, [...raw].sort((a, b) => a - b));
  assert.equal(new Set(raw).size, raw.length, "같은 번호 두 번 없음");
  const texts = (await store.readGroupMessages(group.id)).filter((m) => m.kind === "text");
  assert.equal(texts.length, 9);
});

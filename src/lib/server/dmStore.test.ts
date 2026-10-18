import { test } from "node:test";
import assert from "node:assert/strict";
import { DM_PENDING_LIMIT, threadIdFor } from "../rooms/dm.ts";
import { claimCallLog, decline, inbox, markRead, readMessages, send } from "./dmStore.ts";

// KV 접속 정보 없이 메모리로(kv.ts).
delete process.env.KV_REST_API_URL;
delete process.env.UPSTASH_REDIS_REST_URL;

const A = "lb_" + "a".repeat(24);
const B = "lb_" + "b".repeat(24);
const C = "lb_" + "c".repeat(24);

test("첫 메시지는 요청: 보낸 사람은 몇 줄만, 받는 사람이 답하면 열린다", async () => {
  for (let i = 0; i < DM_PENDING_LIMIT; i += 1) {
    const sent = await send({ from: A, to: B, kind: "text", text: `こんにちは ${i}` });
    assert.ok(sent.ok && sent.thread.status === "pending");
  }
  const over = await send({ from: A, to: B, kind: "text", text: "もう一回" });
  assert.deepEqual(over, { ok: false, error: "PENDING_LIMIT" });
  // 통화는 열린 대화에서만.
  assert.equal((await send({ from: A, to: B, kind: "call", text: "", roomId: "abcdef" })).ok, false);

  const boxB = await inbox(B);
  assert.equal(boxB[0].request, true);
  assert.equal(boxB[0].other, A);
  assert.ok(boxB[0].unread > 0);
  assert.equal((await inbox(A))[0].request, false);

  const reply = await send({ from: B, to: A, kind: "text", text: "안녕하세요!" });
  assert.ok(reply.ok && reply.thread.status === "open");
  assert.equal((await send({ from: A, to: B, kind: "text", text: "ありがとう" })).ok, true);
  const call = await send({ from: A, to: B, kind: "call", text: "", roomId: "abcdef" });
  assert.ok(call.ok && call.message.roomId === "abcdef");

  const id = threadIdFor(A, B);
  const all = await readMessages(id);
  await markRead(B, id, all[all.length - 1].seq);
  assert.equal((await inbox(B))[0].unread, 0);
  assert.deepEqual((await readMessages(id, all[all.length - 2].seq)).map((m) => m.kind), ["call"]);
});

test("받은 요청을 거절하면 보낸 사람은 못 보내고, 받은 쪽 목록에서 빠진다", async () => {
  assert.ok((await send({ from: C, to: A, kind: "text", text: "Hola" })).ok);
  assert.equal(await decline(C, threadIdFor(A, C)), false); // 보낸 사람은 거절 못 함
  assert.equal(await decline(A, threadIdFor(A, C)), true);
  assert.deepEqual(await send({ from: C, to: A, kind: "text", text: "¿Hola?" }), { ok: false, error: "DECLINED" });
  assert.ok(!(await inbox(A)).some((row) => row.other === C));
});

test("통화 기록은 방 하나에 한 번", async () => {
  assert.equal(await claimCallLog("room01"), true);
  assert.equal(await claimCallLog("room01"), false);
});

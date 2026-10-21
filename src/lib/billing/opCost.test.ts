import assert from "node:assert/strict";
import test from "node:test";
import { MODEL_CALLS_PER_REQUEST } from "../server/modelCalls.ts";
import { PACK_ITEMS, PACK_FOLLOWS } from "../pack/pack.ts";
import { CALL_TRANSCRIBE_USD_PER_MINUTE, ROLEPLAY_TURN, TTS_USD_PER_MINUTE } from "./cost.ts";
import { OP_COST, PACK, assumedOps, chatMessageTypicalUsd, chatMessageUsd, opUsd, packUsd } from "./opCost.ts";

test("기록되는 기능(op)마다 단가가 정해져 있다", () => {
  // 새 기능이 modelCalls.ts에 op를 더하고 여기를 빠뜨리면, 비용 계산은 그 기능을
  // "gpt-4o-mini 한 번"으로 짐작한다. 그 짐작을 조용히 두지 않으려는 검사.
  const missing = Object.keys(MODEL_CALLS_PER_REQUEST).filter((op) => !(op in OP_COST));
  assert.deepEqual(missing, [], `src/lib/billing/opCost.ts OP_COST에 단가를 더하세요: ${missing.join(", ")}`);
  const stale = Object.keys(OP_COST).filter((op) => !(op in MODEL_CALLS_PER_REQUEST));
  assert.deepEqual(stale, [], `modelCalls.ts에 없는 op가 OP_COST에 남아 있어요: ${stale.join(", ")}`);
});

test("돈이 안 드는 기록과 모델 호출 0번이 서로 맞다", () => {
  for (const [op, calls] of Object.entries(MODEL_CALLS_PER_REQUEST)) {
    const counter = OP_COST[op]?.kind === "counter";
    assert.equal(counter, calls === 0, `${op}: 호출 ${calls}번인데 단가 종류가 ${OP_COST[op]?.kind}`);
  }
});

test("모든 단가가 0 이상이고 한 번에 10센트를 넘지 않는다", () => {
  for (const op of Object.keys(OP_COST)) {
    const usd = opUsd(op);
    assert.ok(Number.isFinite(usd) && usd >= 0 && usd < 0.1, `${op}: ${usd}`);
  }
});

test("예전 보고서와 같은 값으로 매긴다", () => {
  assert.equal(opUsd("tts"), (6 / 60) * TTS_USD_PER_MINUTE);
  assert.equal(opUsd("roleplayListen"), (ROLEPLAY_TURN.learnerSpeakingSeconds / 60) * CALL_TRANSCRIBE_USD_PER_MINUTE);
  assert.equal(opUsd("roleplayReview"), 0.002);
  assert.equal(opUsd("videoWindow"), opUsd("videoPrepare"));
  // 문장 분석은 호출 다섯 번
  assert.ok(Math.abs(opUsd("analysisInput") - 5 * opUsd("analysisElement")) < 1e-12);
  // 잰 토큰이 있으면 그 값을 쓴다
  assert.ok(opUsd("chat", { chat: { input: 4000, output: 600 } }) > opUsd("chat"));
});

test("팩 문답 수가 팩 코드와 같다", () => {
  assert.equal(PACK.items, PACK_ITEMS);
  assert.equal(PACK.follows, PACK_FOLLOWS);
  assert.ok(packUsd() > 0 && packUsd() < 0.05);
});

test("채팅 한 통은 교정 + 답(새 앱) + 문장 읽기 + 실수 읽기", () => {
  assert.equal(chatMessageUsd(), opUsd("chat") + opUsd("chatReply") + opUsd("learnerObserve") + opUsd("weakRead"));
  assert.ok(chatMessageTypicalUsd() < chatMessageUsd() && chatMessageTypicalUsd() > opUsd("chat"));
  assert.ok(assumedOps().includes("chat"));
  assert.ok(!assumedOps().includes("roleplayTurn"));
});

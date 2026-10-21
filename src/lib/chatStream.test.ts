import assert from "node:assert/strict";
import test from "node:test";
import { takeNdjsonLines } from "./chatStream.ts";

test("끝난 줄만 꺼내고 조각은 남긴다(일본어·스페인어 답)", () => {
  const first = takeNdjsonLines('{"type":"reply","assistantMessage":"いいね！どこ行くの？"}\n{"type":"corr');
  assert.equal(first.lines.length, 1);
  assert.deepEqual(first.lines[0], { type: "reply", assistantMessage: "いいね！どこ行くの？" });
  const second = takeNdjsonLines(`${first.rest}ection","correction":{"corrected":"Fuimos al mercado.","natural":"Fuimos al mercado.","explanation":""}}\n`);
  assert.equal(second.rest, "");
  assert.equal(second.lines[0].type, "correction");
});

test("깨진 줄·빈 줄은 건너뛴다", () => {
  const { lines } = takeNdjsonLines('\nnot json\n{"type":"error","error":"CHAT_FAILED"}\n');
  assert.deepEqual(lines, [{ type: "error", error: "CHAT_FAILED" }]);
});

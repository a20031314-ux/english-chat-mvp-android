import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCheck, DAY_MS, type ReviewMap } from "./dailyPlan.ts";
const NOW = Date.UTC(2026, 9, 28);
test("학습 끝 체크: 헷갈려요 2일 → 알아요 7일 → 알아요 끝, 처음부터 알아요면 아무것도 안 남김", () => {
  let review: ReviewMap = {};
  review = applyCheck(review, "e|x", true, NOW);
  assert.deepEqual(review, {});
  review = applyCheck(review, "e|x", false, NOW);
  assert.equal(review["e|x"]!.due, NOW + 2 * DAY_MS);
  review = applyCheck(review, "e|x", true, NOW + 2 * DAY_MS);
  assert.equal(review["e|x"]!.due, NOW + 9 * DAY_MS);
  review = applyCheck(review, "e|x", true, NOW + 9 * DAY_MS);
  assert.equal(review["e|x"], undefined);
});

test("직접 묻기: 답과 오늘 열쇠만 남김", async () => {
  const { parseAskAnswer, parseTopics } = await import("./ask.ts");
  const allowed = new Set(["f|th-f1-01", "e|ขอบคุณ"]);
  const parsed = parseAskAnswer('{"answer":"ใช้ ครับ/ค่ะ ท้ายประโยค","about":["e|ขอบคุณ","x|bad","e|ขอบคุณ"]}', allowed);
  assert.deepEqual(parsed?.about, ["e|ขอบคุณ"]);
  assert.equal(parseAskAnswer('{"answer":""}', allowed), null);
  const topics = parseTopics([{ key: "f|th-f1-01", label: " a  b " }, { key: "zz", label: "x" }, "no"], (key) => key.startsWith("f|"));
  assert.deepEqual(topics, [{ key: "f|th-f1-01", label: "a b" }]);
});

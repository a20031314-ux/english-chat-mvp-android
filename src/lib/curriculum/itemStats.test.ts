import assert from "node:assert/strict";
import test from "node:test";
import { askedOf, cleanAsked, statFields, statsFromFields } from "./itemStats.ts";
test("보낼 것: 말하기·건너뛴 것 빼고, 서버는 열쇠 모양·겹침·개수를 거름, 해시 칸 ↔ 통계", () => {
  const asked = askedOf(
    [
      { key: "e|はい", question: { kind: "choose" } },
      { key: "f|es-f1-01", question: { kind: "say" } },
      { key: "e|gracias", question: { kind: "order" } },
      { key: "e|ขอบคุณ", question: { kind: "choose" } },
    ],
    [true, true, false, null],
  );
  assert.deepEqual(asked, [["e|はい", true], ["e|gracias", false]]);
  assert.deepEqual(cleanAsked([["e|はい", true], ["e|はい", false], ["x|bad", true], ["e|ok", "yes"], "nope", ["g|1:2", false]]), [["e|はい", true], ["g|1:2", false]]);
  assert.deepEqual(cleanAsked(Array.from({ length: 50 }, (_, i) => [`e|w${i}`, true])).length, 30);
  const fields = statFields([["e|gracias", true], ["e|ขอบคุณ", false]]);
  assert.deepEqual(statsFromFields({ ...fields, "n|e|gracias": 3, "r|e|gracias": 2 }), { "e|gracias": [2, 3], "e|ขอบคุณ": [0, 1] });
});

test("서버 저장: 모두의 통계에 더하고(사람 id 없음), 점검 사용자는 세지 않음", async () => {
  const { addItemStats, readItemStats } = await import("../server/itemStatsStore.ts");
  await addItemStats("rc:someone", "th", [["e|ขอบคุณ", true], ["e|สวัสดี", false]]);
  await addItemStats("rc:other", "th", [["e|ขอบคุณ", false]]);
  await addItemStats("simcheck-run-1", "th", [["e|ขอบคุณ", true]]);
  await addItemStats("rc:simcheck-run-2", "th", [["e|ขอบคุณ", true]]);
  assert.deepEqual(await readItemStats("th"), { "e|ขอบคุณ": [1, 2], "e|สวัสดี": [0, 1] });
});

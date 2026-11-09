import assert from "node:assert/strict";
import test from "node:test";
import { askedOf, byDifficulty, cleanAsked, difficultyOf, statFields, statsFromFields, STAT_MIN, type ItemStats } from "./itemStats.ts";

test("난이도: 충분히 풀린 것만 판단, 가르는 것 → 모름 → 쉬움 → 막힘 순(같은 무리는 원래 순서)", () => {
  const stats: ItemStats = { "e|a": [1, STAT_MIN], "e|b": [STAT_MIN, STAT_MIN], "e|c": [10, STAT_MIN], "e|d": [0, STAT_MIN - 1], "e|e": [12, STAT_MIN] };
  assert.equal(difficultyOf(stats, "e|a"), "stuck");
  assert.equal(difficultyOf(stats, "e|b"), "easy");
  assert.equal(difficultyOf(stats, "e|c"), "split");
  assert.equal(difficultyOf(stats, "e|d"), "unknown");
  assert.deepEqual(byDifficulty(["e|a", "e|b", "e|c", "e|d", "e|e", "e|z"], stats), ["e|c", "e|e", "e|d", "e|z", "e|b", "e|a"]);
  assert.deepEqual(byDifficulty(["e|b", "e|a"], null), ["e|b", "e|a"]);
});

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

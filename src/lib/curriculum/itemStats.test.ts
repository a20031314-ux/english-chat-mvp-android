import assert from "node:assert/strict";
import test from "node:test";
import { askedOf, byDifficulty, cleanAsked, difficultyOf, statFields, statsFromFields, STAT_MIN, type ItemStats } from "./itemStats.ts";
import { buildStageTest } from "./stageTest.ts";
import { placementBlock, stageKeys } from "./placement.ts";
import { buildCheckup } from "./checkup.ts";

const NOW = Date.UTC(2026, 9, 29, 3);

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

test("시험이 통계를 씀: 막힌 문제는 단계 시험·처음 시험·이번 주 확인에서 뒤로(일본어·스페인어)", () => {
  for (const language of ["ja", "es"]) {
    const keys = stageKeys(language, 1);
    const base = buildStageTest({ language, stage: 1, now: NOW });
    const firstKeys = base.filter((item) => item.stage === 1).map((item) => item.key);
    // 처음 뽑히던 것을 모두 막힘으로 → 다른 것이 앞으로.
    const stuck: ItemStats = Object.fromEntries(firstKeys.map((key) => [key, [0, STAT_MIN * 2]]));
    const tuned = buildStageTest({ language, stage: 1, now: NOW, stats: stuck });
    const spare = keys.length - firstKeys.length;
    const kept = tuned.filter((item) => item.stage === 1 && stuck[item.key]).length;
    assert.ok(kept <= Math.max(0, firstKeys.length - spare), `${language}: ${kept} stuck kept, spare ${spare}`);
    const block = placementBlock({ language, stage: 1, used: new Set(), says: 0, seed: "s", stats: Object.fromEntries(keys.slice(0, keys.length - 4).map((key) => [key, [0, 99]])) });
    assert.ok(block.every((item) => keys.slice(-4).includes(item.key)) || block.length < 4, `${language} placement`);
    const passed = new Set(["x"]);
    const weekly = buildCheckup({ language, stage: 1, passed, review: {}, log: {}, now: NOW, stats: stuck });
    assert.ok(Array.isArray(weekly));
  }
});

test("서버 저장: 모두의 통계에 더하고(사람 id 없음), 점검 사용자는 세지 않음", async () => {
  const { addItemStats, readItemStats } = await import("../server/itemStatsStore.ts");
  await addItemStats("rc:someone", "th", [["e|ขอบคุณ", true], ["e|สวัสดี", false]]);
  await addItemStats("rc:other", "th", [["e|ขอบคุณ", false]]);
  await addItemStats("simcheck-run-1", "th", [["e|ขอบคุณ", true]]);
  await addItemStats("rc:simcheck-run-2", "th", [["e|ขอบคุณ", true]]);
  assert.deepEqual(await readItemStats("th"), { "e|ขอบคุณ": [1, 2], "e|สวัสดี": [0, 1] });
});

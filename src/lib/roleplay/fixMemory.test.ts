import assert from "node:assert/strict";
import test from "node:test";
import { FIX_KEEP_DAYS, fixesFromLines, fixesPrompt, mergeFixes, readFixes, sameFix, settleFixes } from "./fixMemory.ts";

const DAY = 86_400_000;

function store() {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value) };
}

test("다시 말해 맞춘 고침은 남기지 않고, 못 맞춘 것만 남긴다", () => {
  const lines = [
    { who: "learner" as const, text: "Yesterday I go to the gym.", better: "Yesterday, I went to the gym.", about: "시제" },
    { who: "learner" as const, text: "Yesterday, I went to the gym.", redo: "pass" as const },
    { who: "learner" as const, text: "I go store.", better: "I went to the store.", about: "시제" },
  ];
  const kept = fixesFromLines(lines);
  assert.equal(kept.length, 1);
  assert.equal(kept[0]?.right, "I went to the store.");
  assert.equal(kept[0]?.point, "시제");
});

test("같은 통화에서 두 번 적어도 하나, 다음 통화면 날짜가 바뀐다", () => {
  const box = store();
  const now = Date.now();
  const fix = { right: "Yesterday, I went to the gym.", said: "Yesterday I go to the gym.", point: "시제" };
  mergeFixes("en", [fix], now, "call-1", box);
  mergeFixes("en", [fix], now + 1000, "call-1", box);
  assert.equal(readFixes("en", box).length, 1);
  mergeFixes("en", [fix], now + DAY, "call-2", box);
  const next = readFixes("en", box);
  assert.equal(next.length, 1);
  assert.equal(next[0]?.callId, "call-2");
});

test("맞게 말하면 빼고, 또 고치면 그대로 둔다", () => {
  const box = store();
  const now = Date.now();
  mergeFixes("en", [{ right: "Yesterday, I went to the gym.", said: "Yesterday I go.", point: "시제" }], now, "call-1", box);
  const still = settleFixes("en", "Yesterday I go to the gym.", true, box);
  assert.equal(still.length, 1);
  const gone = settleFixes("en", "Yesterday, I went to the gym.", false, box);
  assert.equal(gone.length, 0);
  assert.equal(sameFix("Yesterday, I went to the gym.", "yesterday i went to the gym"), true);
});

test("두 달이 지난 고침은 지시에 없다", () => {
  const now = Date.UTC(2026, 10, 4);
  const text = fixesPrompt(
    [{ right: "Yesterday, I went to the gym.", said: "x", point: "시제", at: now - (FIX_KEEP_DAYS + 1) * DAY, callId: "a" }],
    now,
  );
  assert.equal(text, "");
  const fresh = fixesPrompt(
    [{ right: "Yesterday, I went to the gym.", said: "x", point: "시제", at: now - DAY, callId: "a" }],
    now,
  );
  assert.match(fresh, /시제/);
  assert.match(fresh, /Yesterday, I went to the gym/);
});

import { test } from "node:test";
import assert from "node:assert/strict";

const store = new Map<string, string>();
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
};

test("마지막 자리: 칸을 고치고 지우고, 오래되면 없음", async () => {
  const { noteSpot, freshSpot, FRESH_MS, RESUME_KEY } = await import("./resumeSpot.ts");
  store.delete(RESUME_KEY);
  noteSpot({ tab: "map", my: { bank: "keep", full: true } }, 1_000);
  noteSpot({ item: { language: "ja", stage: 1, id: "ja-f1-05" } }, 2_000);
  assert.deepEqual(freshSpot(3_000)?.my, { bank: "keep", full: true });
  assert.equal(freshSpot(3_000)?.item?.id, "ja-f1-05");
  noteSpot({ item: undefined }, 4_000);
  assert.equal(freshSpot(5_000)?.item, undefined);
  assert.equal(freshSpot(5_000)?.tab, "map");
  assert.equal(freshSpot(4_000 + FRESH_MS + 1), null);
});

import assert from "node:assert/strict";
import test from "node:test";
import { dismissUpNext, goUpNext, offerUpNext, pickUpNext, publishUpNext, setUpNextFallback } from "./upNext.ts";

(globalThis as { window?: unknown }).window = globalThis;

test("다음 추천은 지금 연 수업을 빼고 오늘 할 것 차례대로, 없으면 Quizbank", () => {
  const opened: string[] = [];
  setUpNextFallback({ id: "keep", label: "Quizbank", open: () => opened.push("keep") });
  publishUpNext([
    { id: "f1", label: "Have you ever ___?", open: () => opened.push("f1") },
    { id: "s1", label: "카페에서", open: () => opened.push("s1") },
  ]);
  assert.equal(pickUpNext()?.id, "f1");
  assert.equal(pickUpNext("f1")?.id, "s1");
  publishUpNext([{ id: "f1", label: "Have you ever ___?", open: () => undefined }]);
  assert.equal(pickUpNext("f1")?.id, "keep");
  publishUpNext([]);
  assert.equal(pickUpNext()?.id, "keep");
  setUpNextFallback(null);
  assert.equal(pickUpNext(), null);
  dismissUpNext();
});

test("버튼으로 넘어갈 때는 닫기에서 줄을 띄우지 않고 다음 것을 연다", async () => {
  const opened: string[] = [];
  publishUpNext([{ id: "s1", label: "카페에서", open: () => opened.push("s1") }]);
  let offered = false;
  goUpNext(pickUpNext("f1")!, () => {
    offerUpNext("f1");
    offered = true;
  });
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(offered, true);
  assert.deepEqual(opened, ["s1"]);
  publishUpNext([]);
});

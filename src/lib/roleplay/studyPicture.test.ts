import assert from "node:assert/strict";
import test from "node:test";
import type { FillCell } from "../curriculum/fill.ts";
import { pickStudyCell } from "./studyPicture.ts";

function cell(axis: FillCell["axis"], id: string): FillCell {
  return { axis, id, value: 0.2, n: 10, gap: 0.3, state: "weak" };
}

test("말로 하는 칸만 고르고, 뜻 고르기·철자는 넘긴다", () => {
  const picked = pickStudyCell([
    cell("vocabRead", "pos:verb"),
    cell("vocabUse", "miss:form"),
    cell("vocabUse", "pos:verb"),
    cell("sentUse", "gram:1:0"),
  ]);
  assert.equal(picked?.id, "pos:verb");
  assert.equal(picked?.axis, "vocabUse");
});

test("말로 할 칸이 없으면 그림을 띄울 칸이 없다", () => {
  assert.equal(pickStudyCell([cell("vocabRead", "pos:noun"), cell("sentRead", "stage:1")]), null);
});

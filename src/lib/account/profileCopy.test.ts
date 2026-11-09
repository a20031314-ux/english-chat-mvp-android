import { test } from "node:test";
import assert from "node:assert/strict";
import { fillCount, profileCopy } from "./profileCopy.ts";
test("채우기: 태국어·스페인어, 모르는 언어는 영어", () => {
  assert.equal(fillCount(profileCopy("th").badgeRun, 3), "ติดต่อกัน 3 วัน");
  assert.equal(fillCount(profileCopy("es").shared, 2), "2 intereses en común");
  assert.equal(profileCopy("xx").thank, "🙌 Helpful");
});

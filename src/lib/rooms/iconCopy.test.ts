import { test } from "node:test";
import assert from "node:assert/strict";
import { iconCopy, iconErrorText } from "./iconCopy.ts";
test("오류 코드 → 문구, 모르는 코드는 failed, 모르는 언어는 영어", () => {
  assert.equal(iconErrorText(iconCopy("th"), "TOO_NEW"), "อัปโหลดได้หลังสมัคร 7 วัน");
  assert.equal(iconErrorText(iconCopy("es"), "WHAT"), iconCopy("es").failed);
  assert.equal(iconCopy("xx").tab, "Icons");
});

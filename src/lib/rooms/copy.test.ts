import { test } from "node:test";
import assert from "node:assert/strict";
import { roomCopy } from "./copy.ts";
const LOCALES = ["es", "ja", "zh", "vi", "fr", "it", "pt", "ru", "id", "ar", "th", "hi"];
test("자리 표시 {n}과 신고 이유 5개는 모든 언어에", () => {
  for (const locale of ["ko", "en", ...LOCALES]) {
    const t = roomCopy(locale);
    assert.ok(t.pendingMine.includes("{n}"), locale);
    assert.equal(t.reportReasons.split("|").length, 5, locale);
  }
});

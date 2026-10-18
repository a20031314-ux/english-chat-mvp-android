import { test } from "node:test";
import assert from "node:assert/strict";
import { ROOM_COPY_KEYS, roomCopy } from "./copy.ts";
import { ROOM_COPY_LOCALES } from "./copy.locales.ts";

const LOCALES = ["es", "ja", "zh", "vi", "fr", "it", "pt", "ru", "id", "ar", "th", "hi"];

test("말하는 방 문구: 12개 언어 모두 키가 빠짐없이, 남는 키 없이", () => {
  for (const locale of LOCALES) {
    const local = ROOM_COPY_LOCALES[locale];
    assert.ok(local, locale);
    const missing = ROOM_COPY_KEYS.filter((key) => !local[key]?.trim());
    const extra = Object.keys(local).filter((key) => !(ROOM_COPY_KEYS as string[]).includes(key));
    assert.deepEqual(missing, [], `${locale} missing`);
    assert.deepEqual(extra, [], `${locale} extra`);
  }
});

test("자리 표시 {n}과 신고 이유 5개는 모든 언어에", () => {
  for (const locale of ["ko", "en", ...LOCALES]) {
    const t = roomCopy(locale);
    assert.ok(t.pendingMine.includes("{n}"), locale);
    assert.equal(t.reportReasons.split("|").length, 5, locale);
  }
});

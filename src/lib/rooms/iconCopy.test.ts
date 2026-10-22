import { test } from "node:test";
import assert from "node:assert/strict";
import { ICON_COPY_KEYS, ICON_COPY_LOCALES, iconCopy, iconErrorText } from "./iconCopy.ts";

test("아이콘 문구: 14개 언어 모두 키가 비지 않고 {n}·{name} 자리가 그대로", () => {
  assert.equal(ICON_COPY_LOCALES.length, 14);
  for (const locale of ICON_COPY_LOCALES) {
    const t = iconCopy(locale);
    for (const key of ICON_COPY_KEYS) assert.ok(t[key]?.trim(), `${locale} ${key}`);
    for (const key of ["uses", "count"] as const) assert.ok(t[key].includes("{n}"), `${locale} ${key}`);
    assert.ok(t.by.includes("{name}"), `${locale} by`);
  }
});

test("오류 코드 → 문구, 모르는 코드는 failed, 모르는 언어는 영어", () => {
  assert.equal(iconErrorText(iconCopy("th"), "TOO_NEW"), "อัปโหลดได้หลังสมัคร 7 วัน");
  assert.equal(iconErrorText(iconCopy("es"), "WHAT"), iconCopy("es").failed);
  assert.equal(iconCopy("xx").tab, "Icons");
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { CHIP_GROUPS, PROFILE_COPY_KEYS, PROFILE_COPY_LOCALES, chipLabel, fillCount, profileCopy } from "./profileCopy.ts";

test("프로필 문구: 14개 언어 모두 키가 비지 않고 {n} 자리가 그대로", () => {
  assert.equal(PROFILE_COPY_LOCALES.length, 14);
  for (const locale of PROFILE_COPY_LOCALES) {
    const t = profileCopy(locale);
    for (const key of PROFILE_COPY_KEYS) assert.ok(t[key]?.trim(), `${locale} ${key}`);
    for (const key of ["interestsLimit", "badgeHelp", "badgeWeek", "badgeRun", "badgeMaker", "shared"] as const) {
      assert.ok(t[key].includes("{n}"), `${locale} ${key}`);
    }
  }
});

test("모든 칩 id에 14개 언어 이름이 있다", () => {
  for (const locale of PROFILE_COPY_LOCALES) {
    const t = profileCopy(locale);
    for (const [prefix, ids] of Object.entries(CHIP_GROUPS)) {
      for (const id of ids) assert.notEqual(chipLabel(t, prefix as "i", id), id, `${locale} ${prefix}_${id}`);
    }
  }
});

test("채우기: 태국어·스페인어, 모르는 언어는 영어", () => {
  assert.equal(fillCount(profileCopy("th").badgeRun, 3), "ติดต่อกัน 3 วัน");
  assert.equal(fillCount(profileCopy("es").shared, 2), "2 intereses en común");
  assert.equal(profileCopy("xx").thank, "🙌 Helpful");
});

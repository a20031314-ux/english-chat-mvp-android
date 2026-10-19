import { test } from "node:test";
import assert from "node:assert/strict";
import { FIX_COPY_KEYS, FIX_COPY_LOCALES, fixCopy } from "./feedbackFixCopy.ts";
import { FIX_LOCALES } from "./feedbackFix.ts";

test("반영 소식 문구: 14개 언어 모두, 빈칸 없음, 버전 자리 그대로", () => {
  assert.equal(FIX_COPY_LOCALES.length, 14);
  assert.deepEqual([...FIX_COPY_LOCALES].sort(), [...FIX_LOCALES].sort());
  for (const locale of FIX_COPY_LOCALES) {
    const t = fixCopy(locale);
    for (const key of FIX_COPY_KEYS) assert.ok(t[key]?.trim(), `${locale} ${key}`);
    assert.ok(t.needsUpdate.includes("{v}"), locale);
  }
  assert.equal(fixCopy("ja-JP").title, fixCopy("ja").title);
  assert.equal(fixCopy("xx").title, fixCopy("en").title);
});

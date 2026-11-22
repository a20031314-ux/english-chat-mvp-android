import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { letterSoundPath } from "./letterSoundFile.ts";
import { scriptFor } from "./scripts/index.ts";

test("이름: 글자마다 코드 포인트(일본어 한 박자·두 박자, 아랍어)", () => {
  assert.equal(letterSoundPath("ja", "ン"), "/letter-sounds/ja/30f3.mp3");
  assert.equal(letterSoundPath("ja", "きゃ"), "/letter-sounds/ja/304d-3083.mp3");
  assert.equal(letterSoundPath("ar", " با "), "/letter-sounds/ar/628-627.mp3");
});

test("모든 글자 과정의 소리는 모두 파일이 있다(새 글자를 더하면 scripts/letter-sounds.mjs)", () => {
  for (const lang of ["ja", "ko", "zh", "th", "hi", "ru", "ar", "en", "es", "fr", "it", "pt", "id", "vi"]) {
    const course = scriptFor(lang);
    assert.ok(course, lang);
    const missing = course.groups
      .flatMap((group) => group.items.map((item) => item.say))
      .filter((say) => say && !fs.existsSync(`public${letterSoundPath(lang, say)}`));
    assert.deepEqual(missing, [], lang);
  }
});

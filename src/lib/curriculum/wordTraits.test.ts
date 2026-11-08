import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { loadBank } from "./vocabBank.ts";

const DIR = new URL("./word-traits/", import.meta.url);
const KEYS = new Set(["g", "a", "ap", "cl", "vt", "jt", "ir", "hon", "f", "cnt", "pl", "rom"]);
const VALUES: Record<string, Set<string>> = { g: new Set(["m", "f", "n", "mf", "pl"]), a: new Set(["i", "p", "b"]), vt: new Set(["5", "1", "k", "s"]), jt: new Set(["i", "na"]), cnt: new Set(["c", "u", "b"]) };

test("낱말 성질: 파일마다 낱말이 빈도 목록에 있고, 칸·값이 정한 것만", async () => {
  const files = readdirSync(DIR).filter((name) => name.endsWith(".json"));
  assert.ok(files.length > 0);
  for (const file of files) {
    const language = file.replace(/\.json$/, "");
    const book = JSON.parse(readFileSync(new URL(file, DIR), "utf8")) as Record<string, Record<string, unknown>>;
    const words = new Set((await loadBank(language)).map((one) => one.w));
    let missing = 0;
    for (const [word, traits] of Object.entries(book)) {
      if (!words.has(word)) missing += 1;
      assert.ok(Object.keys(traits).length > 0, `${language} ${word}: 빈 칸`);
      for (const [key, value] of Object.entries(traits)) {
        assert.ok(KEYS.has(key), `${language} ${word}: 모르는 칸 ${key}`);
        if (VALUES[key]) assert.ok(VALUES[key]!.has(String(value)), `${language} ${word}: ${key}=${String(value)}`);
        if (key === "cl") assert.ok(Array.isArray(value) && value.length > 0);
      }
    }
    assert.equal(missing, 0, `${language}: 빈도 목록에 없는 낱말 ${missing}개`);
  }
});

test("러시아어: 성·상 몇 개 (стол m · книга f · окно n · читать i · прочитать p · использовать b)", () => {
  const ru = JSON.parse(readFileSync(new URL("ru.json", DIR), "utf8")) as Record<string, { g?: string; a?: string }>;
  assert.equal(ru["стол"]?.g, "m");
  assert.equal(ru["книга"]?.g, "f");
  assert.equal(ru["окно"]?.g, "n");
  assert.equal(ru["читать"]?.a, "i");
  assert.equal(ru["прочитать"]?.a, "p");
  assert.equal(ru["использовать"]?.a, "b");
});

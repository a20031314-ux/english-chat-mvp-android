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

test("중국어: 양사 (书 本 · 狗 只 · 孩子 个 · 时间 없음)", () => {
  const zh = JSON.parse(readFileSync(new URL("zh.json", DIR), "utf8")) as Record<string, { cl?: string[] }>;
  assert.equal(zh["书"]?.cl?.[0], "本");
  assert.equal(zh["狗"]?.cl?.[0], "只");
  assert.equal(zh["孩子"]?.cl?.[0], "个");
  assert.equal(zh["时间"], undefined, "시간 말은 양사를 정하지 않음");
});

test("일본어: 동사·형용사 종류·경어 (帰る 5 · 食べる 1 · 来る k · する s · 高い i · きれい na · 言う おっしゃる/申す)", () => {
  const ja = JSON.parse(readFileSync(new URL("ja.json", DIR), "utf8")) as Record<string, { vt?: string; jt?: string; hon?: { up?: string; down?: string } }>;
  assert.equal(ja["帰る"]?.vt, "5");
  assert.equal(ja["食べる"]?.vt, "1");
  assert.equal(ja["来る"]?.vt, "k");
  assert.equal(ja["する"]?.vt, "s");
  assert.equal(ja["高い"]?.jt, "i");
  assert.equal(ja["きれい"]?.jt, "na");
  assert.deepEqual(ja["言う"]?.hon, { up: "おっしゃる", down: "申す" });
});

test("한국어: 불규칙 활용·높임 (돕다 ㅂ · 입다 규칙 · 듣다 ㄷ · 모르다 르 · 따르다 규칙 · 하얗다 ㅎ · 좋다 규칙 · 먹다 드시다)", () => {
  const ko = JSON.parse(readFileSync(new URL("ko.json", DIR), "utf8")) as Record<string, { ir?: string; hon?: { up?: string } }>;
  assert.equal(ko["돕다"]?.ir, "ㅂ");
  assert.equal(ko["입다"]?.ir, undefined);
  assert.equal(ko["듣다"]?.ir, "ㄷ");
  assert.equal(ko["모르다"]?.ir, "르");
  assert.equal(ko["따르다"]?.ir, undefined);
  assert.equal(ko["하얗다"]?.ir, "ㅎ");
  assert.equal(ko["좋다"]?.ir, undefined);
  assert.equal(ko["먹다"]?.hon?.up, "드시다");
});

test("영어: 불규칙 꼴·셀 수 없음 (go went gone · walk 없음 · child children · person people · information u)", () => {
  const en = JSON.parse(readFileSync(new URL("en.json", DIR), "utf8")) as Record<string, { f?: { past?: string; pp?: string; pl?: string }; cnt?: string }>;
  assert.deepEqual(en["go"]?.f, { past: "went", pp: "gone" });
  assert.equal(en["walk"], undefined);
  assert.equal(en["child"]?.f?.pl, "children");
  assert.equal(en["person"]?.f?.pl, "people");
  assert.equal(en["information"]?.cnt, "u");
  for (const [word, traits] of Object.entries(en)) for (const form of Object.values(traits.f ?? {})) assert.ok(!/[-\s]/.test(String(form)), `${word}: ${String(form)}`);
});

test("스페인어·프랑스어·이탈리아어·포르투갈어: 명사 성 (el agua는 여성 · 사람 낱말은 둘 다)", () => {
  const read = (language: string) => JSON.parse(readFileSync(new URL(`${language}.json`, DIR), "utf8")) as Record<string, { g?: string }>;
  const es = read("es");
  assert.equal(es["casa"]?.g, "f");
  assert.equal(es["agua"]?.g, "f", "el agua — 강세 a로 시작하는 여성 명사");
  assert.equal(es["artista"]?.g, "mf");
  const fr = read("fr");
  assert.equal(fr["voiture"]?.g, "f");
  assert.equal(fr["tour"]?.g, "mf", "le tour / la tour");
  assert.equal(read("it")["moto"]?.g, "f");
  assert.equal(read("pt")["princípio"]?.g, "m", "a princípio — a는 전치사");
});

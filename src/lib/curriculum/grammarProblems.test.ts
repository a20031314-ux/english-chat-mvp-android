import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { ladderFor } from "./stages/index.ts";
import { segmentWords } from "../wordSegments.ts";

// 문법 고르기 문제 파일(problems/<언어>-g.json, 2026-11-06): 열쇠가 그 언어 문법 칸에 있고, 줄 = 앞 + 정답 + 뒤, 보기 넷 중 정답 하나.
const dir = new URL("./problems/", import.meta.url);
const files = readdirSync(dir).filter((name) => /^[a-z]{2}-g\d*\.json$/.test(name));

test("문법 고르기 문제: 모양·열쇠·보기 (ja·th·es 포함 모든 언어)", () => {
  const langs = new Set<string>();
  for (const name of files) {
    const lang = name.slice(0, 2);
    langs.add(lang);
    const book = JSON.parse(readFileSync(new URL(name, dir), "utf8")) as Record<string, { kind: string; before: string; after: string; answer: string; options: string[]; line: string; gloss: string; why: string }>;
    const stages = ladderFor(lang)?.stages ?? [];
    for (const [key, item] of Object.entries(book)) {
      const [stage, index] = key.slice(2).split(":").map(Number);
      const where = `${name} ${key}`;
      assert.ok(stages.find((one) => one.order === stage)?.grammar[index!], `${where}: 문법 칸 없음`);
      assert.equal(item.kind, "grammar", where);
      assert.equal(item.line, item.before + item.answer + item.after, where);
      // 새 파일(<언어>-g.json)은 넷, 예전 영어 파일(en-g2~5)은 셋인 것도 있음.
      assert.ok(item.options.length === 4 || (/-g\d\.json$/.test(name) && item.options.length === 3), `${where}: 보기 수`);
      assert.equal(new Set(item.options.map((one) => one.trim().toLocaleLowerCase())).size, item.options.length, `${where}: 보기 겹침`);
      assert.equal(item.options.filter((one) => one === item.answer).length, 1, `${where}: 정답이 보기에 하나`);
      assert.ok(item.gloss.trim() && item.why.trim(), where);
      // 정답이 뜻 줄·까닭 앞부분에 그대로 보이면 안 됨은 아님(까닭은 답한 뒤) — 뜻 줄(한국어)에 학습 언어 정답이 새지 않는지만.
      assert.ok(!item.gloss.includes(item.answer), `${where}: 뜻 줄에 정답`);
      assert.ok(segmentWords(item.line, lang).length >= 2, where);
      // 정답이 문장 다른 자리에 그대로 보이면 안 됨(RULES 11 ①, 2026-11-06 "Soy … soy" 고침).
      assert.ok(!`${item.before} ${item.after}`.toLocaleLowerCase().includes(item.answer.trim().toLocaleLowerCase()), `${where}: 문장에 정답이 또`);
    }
  }
  for (const lang of ["ja", "th", "es", "zh", "ar", "hi"]) assert.ok(langs.has(lang), lang);
});

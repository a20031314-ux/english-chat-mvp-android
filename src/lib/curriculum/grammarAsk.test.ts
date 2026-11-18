import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { askWithName, grammarAskName, topicParticle } from "./grammarAsk.ts";
import { ladderFor } from "./stages/index.ts";

const LANGS = ["en", "ja", "es", "zh", "th", "ko", "vi", "fr", "it", "pt", "ru", "id", "ar", "hi"];

test("문법 칸마다 물음 이름(한국어·영어)이 있다", () => {
  for (const language of LANGS) {
    for (const stage of ladderFor(language)!.stages) {
      stage.grammar.forEach((_, index) => {
        const key = `g|${stage.order}:${index}`;
        assert.ok(grammarAskName(language, "ko", key), `${language} ${key} ko`);
        assert.ok(grammarAskName(language, "en", key), `${language} ${key} en`);
      });
    }
  }
});

test("물음 이름에 답이나 보기가 낱말째 보이지 않는다 — 넣어 둔 문제 전부", () => {
  const dir = new URL("./problems/", import.meta.url);
  const leaks: string[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json") || file === "needs-meaning.json") continue;
    const language = file.split(/[-.]/)[0]!;
    const book = JSON.parse(readFileSync(new URL(file, dir), "utf8")) as Record<string, unknown>;
    for (const [key, raw] of Object.entries(book)) {
      if (!key.startsWith("g|")) continue;
      for (const row of (Array.isArray(raw) ? raw : [raw]) as { answer?: string; options?: string[] }[]) {
        for (const bit of [row.answer ?? "", ...(row.options ?? [])].map((one) => one.trim().toLocaleLowerCase()).filter((one) => one.length > 1)) {
          for (const locale of ["ko", "en"]) {
            const name = grammarAskName(language, locale, key).toLocaleLowerCase();
            const at = name.indexOf(bit);
            const edge = (ch?: string) => !ch || !/[\p{L}\p{M}]/u.test(ch);
            if (at >= 0 && edge(name[at - 1]) && edge(name[at + bit.length])) leaks.push(`${language} ${key} ${locale} "${name}" ⊃ "${bit}"`);
          }
        }
      }
    }
  }
  assert.deepEqual(leaks, []);
});

test("앱 언어가 한국어·영어가 아니면 이름 없음(지금 물음 그대로), 문법 칸이 아니어도 없음", () => {
  assert.equal(grammarAskName("en", "ja", "g|3:5"), "");
  assert.equal(grammarAskName("en", "ko", "e|on time"), "");
  assert.equal(grammarAskName("en", "ko", undefined), "");
});

test("한국어 물음: 받침에 따라 은/는, 괄호 안은 보지 않음 — ja(띄어쓰기 없음)·es(라틴)", () => {
  assert.equal(askWithName("빈칸에 들어갈 {kind}?", grammarAskName("en", "ko", "g|3:5"), "ko"), "빈칸에 들어갈 관계사는?");
  assert.equal(askWithName("빈칸에 들어갈 {kind}?", grammarAskName("ja", "ko", "g|2:3"), "ko"), "빈칸에 들어갈 희망 표현(~하고 싶다)은?");
  assert.equal(askWithName("빈칸에 들어갈 {kind}?", grammarAskName("es", "ko", "g|1:2"), "ko"), "빈칸에 들어갈 -ar 동사 현재형은?");
  assert.equal(askWithName("Which {kind} fits the blank?", grammarAskName("es", "en", "g|2:7"), "en"), "Which object pronoun fits the blank?");
  assert.equal(topicParticle("관사"), "는");
  assert.equal(topicParticle("의문사"), "는");
  assert.equal(topicParticle("현재완료 꼴"), "은");
});

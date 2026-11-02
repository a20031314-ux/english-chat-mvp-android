import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { BANK_LANGUAGES, bankGuides } from "./banks.ts";

const LOCALES = ["ko", "en", "es", "ja", "zh", "th", "vi", "id", "hi", "ar", "fr", "it", "pt", "ru"];
const copy = fs.readFileSync(new URL("../copy.ts", import.meta.url), "utf8");

test("My 큰 칸 ? 설명: 14개 언어 모두 같은 줄 수, {ui:키}는 copy에 있는 키, 그림 이름 있음", () => {
  assert.deepEqual([...BANK_LANGUAGES].sort(), [...LOCALES].sort());
  const ko = bankGuides("ko");
  for (const locale of LOCALES) {
    const guide = bankGuides(locale);
    for (const id of ["stage", "keep", "log"] as const) {
      assert.equal(guide[id].can.length, ko[id].can.length, `${locale} ${id} can`);
      assert.equal(guide[id].how.length, ko[id].how.length, `${locale} ${id} how`);
      for (const line of [...guide[id].can, ...guide[id].how.map((step) => step.text)]) {
        assert.ok(line.trim().length > 0 && line.replace(/\{ui:\w+\}/g, "XXXXXXXX").length < 80, `${locale} ${id}: ${line}`);
        for (const [, key] of line.matchAll(/\{ui:(\w+)\}/g)) assert.ok(new RegExp(`^\\s*${key}:`, "m").test(copy), `${locale} 없는 키 ${key}`);
      }
      for (const step of guide[id].how) assert.match(step.shot, /^bank-/);
    }
  }
  // 없는 언어는 영어.
  assert.deepEqual(bankGuides("xx"), bankGuides("en"));
});

test("칸 설명은 핵심 하나(lead)를 맨 앞에, 그 뒤 세부 — 14개 언어 모두 같은 순서·빈 줄 없음", async () => {
  const { bankGuides, BANK_LANGUAGES } = await import("./banks.ts");
  for (const language of BANK_LANGUAGES) {
    const guides = bankGuides(language);
    for (const [bank, guide] of Object.entries(guides)) {
      const blocks = guide.blocks ?? [];
      assert.ok(blocks.length >= 4, `${language} ${bank}`);
      assert.equal(blocks[0]!.lead, true, `${language} ${bank} 첫 조각이 핵심`);
      assert.equal(blocks.filter((one) => one.lead).length, 1, `${language} ${bank} 핵심은 하나`);
      assert.ok(blocks.every((one) => one.text.trim()), `${language} ${bank}`);
      assert.equal(new Set(blocks.map((one) => one.text)).size, blocks.length, `${language} ${bank} 같은 줄 두 번 없음`);
    }
  }
});

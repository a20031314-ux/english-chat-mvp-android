import { test } from "node:test";
import assert from "node:assert/strict";
import { fillBlank } from "./scriptChoice.ts";


test("채팅 빈칸(2026-11-01): 쓴 조각을 줄에 넣어 줄 전체로 대조 — 띄어쓰기 없는 언어는 붙이고", async () => {
  const { typedMatches } = await import("../roleplay/practice.ts");
  // 스페인어
  const es = "Quiero un café con leche, por favor.";
  assert.equal(typedMatches(es, fillBlank(es, "café con leche", "café con leche")).matched, true);
  assert.equal(typedMatches(es, fillBlank(es, "café con leche", "té")).matched, false);
  assert.equal(fillBlank("Hola, Sofía.", "Sofía", "Sofía"), "Hola, Sofía.");
  // 일본어(띄어쓰기 없음)
  const ja = "コーヒーをください。";
  assert.equal(fillBlank(ja, "ください", "ください"), ja);
  assert.equal(typedMatches(ja, fillBlank(ja, "ください", "ください")).matched, true);
  assert.equal(typedMatches(ja, fillBlank(ja, "ください", "くださる")).matched, false);
});

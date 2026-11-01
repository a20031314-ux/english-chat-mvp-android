import { test } from "node:test";
import assert from "node:assert/strict";
import { loadBank } from "./vocabBank.ts";
import { tooEarlyWords } from "./lessonWords.ts";

test("수업 대화 낱말: 1단계에 목록 밖 한자말(緑茶)·한참 위 낱말(tamaño)은 걸러짐, 기본 낱말은 통과 — ja·es·th·en (체감 점검 2026-11-01 #16)", async () => {
  const ja = await loadBank("ja");
  assert.deepEqual(tooEarlyWords("ja", "緑茶をください。", 1, ja), ["緑茶"]);
  assert.deepEqual(tooEarlyWords("ja", "お水をください。", 1, ja), []);
  assert.deepEqual(tooEarlyWords("ja", "コーヒーを一つください。", 1, ja), []);
  const es = await loadBank("es");
  assert.deepEqual(tooEarlyWords("es", "Creo que el tamaño es grande.", 1, es), ["tamaño"]);
  assert.deepEqual(tooEarlyWords("es", "Creo que el tamaño es grande.", 3, es), []);
  assert.deepEqual(tooEarlyWords("es", "¿Qué quieres comer?", 1, es), []);
  const th = await loadBank("th");
  assert.deepEqual(tooEarlyWords("th", "ผมชื่อแดนครับ", 1, th), []);
  const en = await loadBank("en");
  assert.deepEqual(tooEarlyWords("en", "My name is Tom.", 1, en), []);
});

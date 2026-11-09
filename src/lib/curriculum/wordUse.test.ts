import { test } from "node:test";
import assert from "node:assert/strict";
import { keyName, oftenUsed, studyWith, talkCounts, containsWord, framesWith } from "./wordUse.ts";
import type { LogEvent } from "./logLedger.ts";

const T0 = Date.UTC(2026, 10, 2, 3) / 1000;
const DAY = 86400;
const utcDay = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);

test("대화 수: 통화·채팅·사람에서 맞게 쓴 것만 — 퀴즈 답·틀림·찾아봄은 안 셈 (ja·es)", () => {
  const events: LogEvent[] = [
    { k: "w|食べる", src: "call", r: "used", t: T0 },
    { k: "w|食べる", src: "chat", r: "used", t: T0 + DAY },
    { k: "w|食べる", src: "quiz", r: "ok", m: "write", t: T0 },
    { k: "w|comer", src: "people", r: "used", t: T0 },
    { k: "w|comer", src: "call", r: "miss", t: T0 + 10 },
    { k: "w|casa", src: "dict", r: "look", t: T0 },
  ];
  assert.equal(talkCounts(events).get("w|食べる"), 2);
  assert.equal(talkCounts(events).get("w|comer"), 1);
  assert.equal(talkCounts(events).has("w|casa"), false);
  assert.deepEqual(oftenUsed(events).map((one) => `${one.key}:${one.n}`), ["w|食べる:2", "w|comer:1"]);
});

test("자주 쓴 말: 낱말·표현만(문법·문장구조 빼고), 같은 수면 최근 것부터 (es)", () => {
  const events: LogEvent[] = [
    { k: "w|uno", src: "call", r: "used", t: T0 },
    { k: "e|por favor", src: "chat", r: "used", t: T0 + 5 },
    { k: "g|2:4", src: "call", r: "used", t: T0 + 9 },
  ];
  assert.deepEqual(oftenUsed(events).map((one) => one.key), ["e|por favor", "w|uno"]);
});

test("같이 배우기: 예문에 든 문장구조·문법 — 퀴즈로 이틀 넘게 답한 것은 뒤로 (es·ja)", () => {
  const es = studyWith({ language: "es", locale: "ko", word: "comer", lines: ["¿Quieres comer conmigo mañana?"], events: [], dayOf: utcDay });
  assert.ok(es.length >= 1 && es.length <= 3);
  assert.ok(es.every((one) => one.label && !one.key.startsWith("w|")));
  const first = es[0]!;
  const learned: LogEvent[] = [
    { k: first.key, src: "quiz", r: "ok", m: "write", t: T0 },
    { k: first.key, src: "quiz", r: "ok", m: "write", t: T0 + DAY },
  ];
  const again = studyWith({ language: "es", locale: "ko", word: "comer", lines: ["¿Quieres comer conmigo mañana?"], events: learned, dayOf: utcDay });
  if (again.length > 1) assert.equal(again.at(-1)!.key, first.key, "다진 것은 뒤로");
  const ja = studyWith({ language: "ja", locale: "ko", word: "食べる", lines: ["一緒に昼ご飯を食べませんか。"], events: [], dayOf: utcDay });
  assert.ok(ja.some((one) => one.key.startsWith("f|") || one.key.startsWith("g|")), "띄어쓰기 없는 문장에서도 찾음");
  assert.deepEqual(studyWith({ language: "ko", locale: "ko", word: "없는말", lines: [], events: [], dayOf: utcDay }), [], "고를 게 없으면 빈 줄 — 칸이 안 보임");
});

test("이름: 문법은 앱 언어 이름, 없는 열쇠는 빈칸 (es)", () => {
  assert.notEqual(keyName("es", "ko", "g|2:4"), "");
  assert.equal(keyName("es", "ko", "g|9:99"), "");
  assert.equal(keyName("es", "ko", "e|por favor"), "por favor");
});

test("containsWord: 낱말 단위(th เกิน ≠ กิน) · 일본어 용언 줄기 · 라틴 언어는 낱말 하나", () => {
  assert.equal(containsWord("th", "กิน")("เกินคาด"), false);
  assert.equal(containsWord("th", "กิน")("กินข้าวหรือยัง"), true);
  assert.equal(containsWord("ja", "食べる")("一緒に食べませんか。"), true);
  assert.equal(containsWord("es", "ir")("Prefiero ir en tren."), true);
  assert.equal(containsWord("es", "ir")("Quiero salir."), false);
});

test("framesWith: 예문 빈칸에 이 말이 든 틀(es casa · ja 食べる)", () => {
  assert.ok(framesWith("es", "casa").length > 0);
  assert.ok(framesWith("ja", "食べる").includes("ja-f2-03"));
});

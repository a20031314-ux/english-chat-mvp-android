import { test } from "node:test";
import assert from "node:assert/strict";
import { addEvents, eventsFromQuizDays, KEEP_SECONDS, migrateLedger, parseLedger, type LogEvent } from "./logLedger.ts";

const NOW = 1_800_000_000;

test("장부: 사건을 시각 순으로 더하고, 1년 넘은 줄·같은 사건 두 번은 뺀다(ja·th·es 열쇠)", () => {
  const events: LogEvent[] = [
    { k: "w|水", src: "quiz", r: "ok", m: "write", t: NOW - 10 },
    { k: "w|น้ำ", src: "dict", r: "look", t: NOW - 20 },
    { k: "e|¿qué tal?", src: "call", r: "used", t: NOW - 5 },
    // 같은 열쇠·출처·결과가 2초 안에 또 — 한 번만.
    { k: "w|水", src: "quiz", r: "ok", m: "write", t: NOW - 9 },
    // 1년 넘음 — 안 들어감.
    { k: "w|old", src: "quiz", r: "miss", t: NOW - KEEP_SECONDS - 1 },
  ];
  const stored = addEvents({ v: 1, rows: [] }, events, NOW);
  assert.deepEqual(
    stored.rows.map((row) => row[0]),
    ["w|น้ำ", "w|水", "e|¿qué tal?"],
  );
  // 태국어 모음 부호(\p{M})는 열쇠에 그대로.
  assert.equal(stored.rows[0]![0], "w|น้ำ");
  // 다음 해에 다시 더하면 오래된 줄이 빠진다.
  const later = addEvents(stored, [], NOW + KEEP_SECONDS + 100);
  assert.equal(later.rows.length, 0);
});

test("장부: 망가진 저장·모르는 출처는 버리고 읽는다", () => {
  assert.deepEqual(parseLedger("not json"), { v: 1, rows: [] });
  assert.deepEqual(parseLedger(JSON.stringify({ v: 2, rows: [] })), { v: 1, rows: [] });
  const raw = JSON.stringify({ v: 1, migrated: true, rows: [["w|a", "quiz", "ok", "", 1], ["w|b", "nope", "ok", "", 2], ["x", "quiz", "ok", "", 3]] });
  assert.deepEqual(parseLedger(raw), { v: 1, migrated: true, rows: [["w|a", "quiz", "ok", "", 1]] });
});

test("장부: 예전 퀴즈 날 기록 → 고르기·쓰기, 맞음·틀림으로 옮김", () => {
  const events = eventsFromQuizDays({
    "2026-11-03": { okc: ["w|perro"], okt: ["w|猫"], wt: ["g|1:2"], wrong: ["g|1:2", "e|buenos días"] },
    "bad-day": { okc: ["w|x"] },
  });
  assert.deepEqual(
    events.map(({ k, r, m }) => `${k} ${r} ${m}`),
    ["w|perro ok pick", "w|猫 ok write", "g|1:2 miss write", "e|buenos días miss pick"],
  );
  // 시각은 그날 정오(지역 시간).
  assert.equal(new Date(events[0]!.t * 1000).getHours(), 12);
});

test("옮기기: 이미 장부에 있는 같은 날·열쇠·결과는 다시 넣지 않고, 옮겼으면 알림 (ja·es)", () => {
  const store = new Map<string, string>();
  const g = globalThis as unknown as { localStorage?: unknown; dispatchEvent?: unknown };
  const saved = { localStorage: g.localStorage, dispatchEvent: g.dispatchEvent };
  let told = 0;
  g.localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
  g.dispatchEvent = () => {
    told += 1;
    return true;
  };
  try {
    const noon = Math.floor(new Date(2026, 10, 6, 15).getTime() / 1000);
    store.set("logbank.v1.ja", JSON.stringify({ v: 1, rows: [["w|食べる", "quiz", "ok", "write", noon]] }));
    migrateLedger("ja", () => ({ "2026-11-06": { okt: ["w|食べる"], okc: ["w|casa"] } }));
    const rows = (JSON.parse(store.get("logbank.v1.ja")!) as { rows: unknown[][] }).rows;
    assert.deepEqual(rows.map((row) => row[0]).sort(), ["w|casa", "w|食べる"]);
    assert.equal(told, 1);
    migrateLedger("ja", () => ({ "2026-11-06": { okt: ["w|食べる"] } }));
    assert.equal(told, 1);
  } finally {
    g.localStorage = saved.localStorage;
    g.dispatchEvent = saved.dispatchEvent;
  }
});

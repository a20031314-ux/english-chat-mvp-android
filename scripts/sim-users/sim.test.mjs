import { test } from "node:test";
import assert from "node:assert/strict";
import { ATTRIBUTES, LANGUAGES, buildPersonas, loadBank, pairwiseRows, planTurns } from "./personas.mjs";
import { detectTurn, fusedScriptTokens } from "./detect.mjs";
import { renderReport } from "./report.mjs";

test("pairwise 행이 모든 속성 쌍을 덮는다", () => {
  const rows = pairwiseRows(ATTRIBUTES, 7);
  const keys = Object.keys(ATTRIBUTES);
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) {
      for (const a of ATTRIBUTES[keys[i]]) for (const b of ATTRIBUTES[keys[j]]) {
        assert.ok(rows.some((r) => r[keys[i]] === a && r[keys[j]] === b), `${keys[i]}=${a} × ${keys[j]}=${b}`);
      }
    }
  }
  // 전체 곱(1,260)보다 훨씬 적다.
  assert.ok(rows.length < 80, `${rows.length}행`);
});

test("196명이면 196개 학습 조합을 모두 덮고, 같은 시드면 같은 사람", () => {
  const { personas } = buildPersonas({ count: 196, seed: 7 });
  assert.equal(new Set(personas.map((p) => `${p.target}:${p.ui}`)).size, 196);
  const again = buildPersonas({ count: 196, seed: 7 }).personas;
  assert.deepEqual(again, personas);
});

test("--only로 조합을 좁힌다", () => {
  const { personas } = buildPersonas({ count: 10, seed: 7, only: [{ target: "th", ui: "*" }] });
  assert.ok(personas.every((p) => p.target === "th"));
});

test("시드 문장과 앱 언어 문장이 14개 언어 모두 있다", () => {
  const bank = loadBank();
  for (const l of LANGUAGES) {
    assert.ok(bank.learner[l]?.length >= 6, `learner ${l}`);
    assert.ok(bank.learner[l].some((x) => x.ok), `ok 문장 ${l}`);
    assert.ok(bank.ownLanguage[l], `ownLanguage ${l}`);
    assert.ok(bank.askMeaning[l], `askMeaning ${l}`);
  }
});

test("턴 계획: 태도·이상 행동이 반영된다", () => {
  const bank = loadBank();
  const base = { id: "t1", target: "ja", ui: "ko", background: "mono", level: 2, weakness: "particle", inputStyle: "typed" };
  const givesUp = planTurns({ ...base, temperament: "gives_up", misbehavior: "none" }, bank, { turns: 6 });
  assert.equal(givesUp[1].kind, "own");
  assert.equal(givesUp[1].text, bank.ownLanguage.ko);
  const injected = planTurns({ ...base, temperament: "steady", misbehavior: "injection" }, bank, { turns: 6 });
  assert.equal(injected[4].kind, "misbehavior");
  const dictated = planTurns({ ...base, temperament: "steady", misbehavior: "none", inputStyle: "dictation", target: "es", ui: "en" }, bank, { turns: 4 });
  assert.ok(dictated.every((t) => !/[.?¿!]/.test(t.text)));
});

const persona = { id: "p1", target: "ja", ui: "ko", temperament: "steady" };
const ok = (body, ms = 2000) => ({ status: 200, ms, body });

test("검출: 답이 앱 언어로 오면 오류", () => {
  const issues = detectTurn({ persona, turn: { kind: "practice", text: "昨日、映画を見ます。", expect: {} }, response: ok({ assistantMessage: "영화 뭐 봤어?", correction: { corrected: "昨日、映画を見ました。", explanation: "과거형" } }) });
  assert.ok(issues.some((i) => i.kind === "reply_wrong_language" && i.severity === "error"));
});

test("검출: 설명에 문자가 뒤섞인 낱말 (未来형)", () => {
  assert.deepEqual(fusedScriptTokens("「見ます」は未来형이므로 과거형을 써요"), ["は未来형이므로"]);
  assert.deepEqual(fusedScriptTokens("be동사는 영어에서 흔해요"), []);
  assert.deepEqual(fusedScriptTokens("「を」가 아니라 に를 써요"), []);
  assert.deepEqual(fusedScriptTokens("ภาษาไทย ไม่มีช่องว่าง"), []);
});

test("검출: 정상 답에는 문제 없음, 같은 답 반복·내부 글자·느림은 잡는다", () => {
  const good = detectTurn({ persona, turn: { kind: "practice", text: "週末に友達を会いました。", expect: { ok: false, tags: ["particle"] } }, response: ok({ assistantMessage: "いいね！何をしたの？", correction: { corrected: "週末に友達に会いました。", explanation: "‘会う’ 앞에는 を가 아니라 に를 써요." } }) });
  assert.deepEqual(good, []);
  const bad = detectTurn({ persona, turn: { kind: "practice", text: "x", expect: {} }, previousReplies: ["いいね！何をしたの？"], response: ok({ assistantMessage: "いいね！何をしたの？ undefined", correction: { corrected: "x", explanation: "" } }, 30000) });
  const kinds = bad.map((i) => i.kind);
  assert.ok(kinds.includes("leak"));
  assert.ok(kinds.includes("slow"));
  const repeat = detectTurn({ persona, turn: { kind: "practice", text: "x", expect: {} }, previousReplies: ["いいね！何をしたの？"], response: ok({ assistantMessage: "いいね！ 何をしたの?", correction: { corrected: "x" } }) });
  assert.ok(repeat.some((i) => i.kind === "repeated_reply"));
});

test("검출: 고칠 게 없는데 고침, 틀렸는데 안 고침, 수준 표시", () => {
  const es = { id: "p2", target: "es", ui: "en", temperament: "steady" };
  const fc = detectTurn({ persona: es, turn: { kind: "practice", text: "¿Qué tal tu fin de semana?", expect: { ok: true } }, response: ok({ assistantMessage: "¡Muy bien! ¿Y el tuyo?", correction: { corrected: "¿Cómo estuvo tu fin de semana?", explanation: "More natural." } }) });
  assert.ok(fc.some((i) => i.kind === "false_correction"));
  const mc = detectTurn({ persona: es, turn: { kind: "practice", text: "La problema es muy grande.", expect: { ok: false, tags: ["agreement"] } }, response: ok({ assistantMessage: "¿Qué problema tienes? Tu nivel es B1.", correction: { corrected: "La problema es muy grande.", explanation: "" } }) });
  assert.ok(mc.some((i) => i.kind === "missed_correction"));
  assert.ok(mc.some((i) => i.kind === "level_shown"));
});

test("검출: HTTP 오류와 하루 한도", () => {
  assert.equal(detectTurn({ persona, turn: { kind: "practice", text: "x" }, response: { status: 500, ms: 100, body: { error: "CHAT_FAILED" } } })[0].kind, "http");
  assert.equal(detectTurn({ persona, turn: { kind: "practice", text: "x" }, response: { status: 403, ms: 100, body: { error: "DAILY_LIMIT_REACHED" } } })[0].severity, "info");
});

test("리포트가 그려진다", () => {
  const html = renderReport({
    meta: { runId: "t", api: "x", seed: 7, users: 1, turns: 1, requests: 2, seconds: 1, only: [] },
    records: [{ persona: { id: "p1", target: "th", ui: "ar", level: 1, temperament: "steady", weakness: "spelling", background: "mono", inputStyle: "typed", misbehavior: "none" }, description: "d", userId: "u", score: 3,
      issues: [{ severity: "error", kind: "http", note: "HTTP 500", turn: 1 }],
      transcript: [{ turn: 1, kind: "practice", text: "<b>x</b>", status: 500, ms: 10, reply: "", issues: [{ severity: "error", kind: "http", note: "HTTP 500" }] }] }],
  });
  assert.ok(html.includes('data-combo="th:ar"'));
  assert.ok(html.includes("&lt;b&gt;x&lt;/b&gt;"));
});

test("검출: 태국어 튜터가 มึง/วะ를 쓰면 오류", () => {
  const th = { id: "p3", target: "th", ui: "ar", temperament: "steady" };
  const issues = detectTurn({ persona: th, turn: { kind: "own", text: "ماذا تعني هذه الكلمة؟" }, response: ok({ assistantMessage: "คำที่มึงพูดถึงเมื่อกี้อ่ะ มันหมายถึงคำไหนวะ?" }) });
  assert.ok(issues.some((i) => i.kind === "rude_reply"));
  const polite = detectTurn({ persona: th, turn: { kind: "own", text: "x" }, response: ok({ assistantMessage: "คำไหนเหรอคะ? บอกได้เลยนะ" }) });
  assert.ok(!polite.some((i) => i.kind === "rude_reply"));
});

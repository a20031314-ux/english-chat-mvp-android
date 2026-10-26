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
  assert.deepEqual(fusedScriptTokens("استخدمت «मै» بدلاً من «मैं» و«जाउंगा»"), []);
  assert.deepEqual(fusedScriptTokens("необходим助詞 «に»"), ["необходим助詞"]);
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

// ── 기능 묶음 ──
import { checkHttp, checkText, checkShape } from "./detect.mjs";
import { SUITES, suiteById } from "./suites/index.mjs";
import { elementNames } from "./suites/ask.mjs";

test("묶음: id가 겹치지 않고 채팅이 맨 앞, 모두 run·every가 있다", () => {
  const ids = SUITES.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids[0], "chat");
  for (const s of SUITES) {
    assert.equal(typeof s.run, "function", s.id);
    assert.ok(Number.isInteger(s.every) && s.every >= 1, s.id);
  }
  assert.equal(suiteById("map").id, "map");
  assert.equal(suiteById("nope"), null);
});

test("공통 검사: 학습 언어·앱 언어 자리, 빈 값, 내부 글자", () => {
  const p = { target: "th", ui: "es" };
  assert.deepEqual(checkText("x", p, "ไปตลาดแล้วเจออะไรบ้าง?", { lang: "target" }), []);
  assert.ok(checkText("x", p, "¿Qué compraste?", { lang: "target" }).some((i) => i.kind === "x_wrong_language"));
  assert.deepEqual(checkText("x", p, "Saluda a alguien que acabas de conocer.", { lang: "ui" }), []);
  assert.ok(checkText("x", p, "สวัสดีครับ", { lang: "ui" }).some((i) => i.kind === "x_wrong_language"));
  assert.ok(checkText("x", p, "", { required: true })[0].kind === "x_empty");
  assert.ok(checkText("x", p, "hola {ui:mapDraw}", {}).some((i) => i.kind === "x_leak"));
});

test("공통 검사: HTTP와 응답 형태", () => {
  assert.deepEqual(checkHttp("x", { status: 200, ms: 100 }), []);
  assert.equal(checkHttp("x", { status: 502, ms: 100, body: { error: "NO_DIRECTION" } })[0].kind, "x_http");
  assert.equal(checkHttp("x", { status: 403, ms: 100, body: { error: "DAILY_LIMIT_REACHED" } })[0].severity, "info");
  assert.equal(checkHttp("x", { status: 200, ms: 50_000 }, { slowWarnMs: 45_000, slowErrorMs: 85_000 })[0].severity, "warn");
  assert.deepEqual(checkShape("x", { map: { id: "a", topics: [1] } }, ["map.id", "map.topics"]), []);
  assert.ok(checkShape("x", { map: { topics: [] } }, ["map.id", "map.topics"])[0].note.includes("map.id"));
});

test("직접 묻기: 앱이 보내는 요소 이름을 14개 언어 모두 읽는다", () => {
  for (const l of LANGUAGES) {
    const names = elementNames(l);
    assert.equal(Object.keys(names).length, 6, l);
  }
});

test("언어 가리기: 괄호 풀이·로마자 이름·짧은 라틴 글은 오탐하지 않는다", () => {
  const zhIt = { target: "zh", ui: "it" };
  assert.deepEqual(checkText("x", zhIt, "我叫Marco。", { lang: "target" }), []);
  const viFr = { target: "vi", ui: "fr" };
  assert.deepEqual(checkText("x", viFr, "Chào anh", { lang: "target" }), []);
  const arVi = { id: "t", target: "ar", ui: "vi", temperament: "steady" };
  const own = detectTurn({ persona: arVi, turn: { kind: "own", text: "Từ đó nghĩa là gì?" }, response: { status: 200, ms: 1000, body: { assistantMessage: 'كلمة "كتاب" تعني الكتاب. (cái từ "كتاب" nghĩa là sách trong tiếng Ả Rập)' } } });
  assert.ok(!own.some((i) => i.kind === "reply_wrong_language"));
  // 진짜로 앱 언어로만 온 답은 여전히 잡는다
  const idJa = { id: "t", target: "id", ui: "ja", temperament: "steady" };
  const bad = detectTurn({ persona: idJa, turn: { kind: "own", text: "今の単語ってどういう意味？" }, response: { status: 200, ms: 1000, body: { assistantMessage: "単語の意味？それは「エネルギー」って意味だよ。何か他に知りたいことある？" } } });
  assert.ok(bad.some((i) => i.kind === "reply_wrong_language"));
});

test("사람 사이 묶음이 모두 등록돼 있다", () => {
  for (const id of ["rooms", "roomsplus", "dm", "groups", "people", "notes"]) assert.ok(suiteById(id), id);
});

test("내 줄 아래 설명이 상대 말을 설명하면 잡는다(2026-10-25 통화 팁)", async () => {
  const { checkAboutTheirLine } = await import("./detect.mjs");
  const off = checkAboutTheirLine("call", { tip: '누워 있으면서 보는 것 예: "Are you watching something?"', heard: "I am lying on the bed.", otherSaid: ["Sounds relaxing! Are you watching or reading something from bed?"] });
  assert.equal(off[0]?.kind, "call_tip_offtopic");
  assert.deepEqual(checkAboutTheirLine("call", { tip: '"lying in bed"가 자연스러워요', heard: "I am lying on the bed.", otherSaid: ["Nice!"] }), []);
  // 띄어쓰기 없는 말
  assert.equal(checkAboutTheirLine("explanation", { tip: "「今何をしていますか」の意味です", heard: "家にいます", otherSaid: ["今何をしていますか？"] }).length, 1);
});

test("끊긴 말·맥락과 무관한 말·잘려 온 줄(사용자 2026-10-27)", async () => {
  const { checkCutOff, checkDelivered, checkOffContext } = await import("./detect.mjs");
  assert.equal(checkCutOff("reply", "I went to the park and", { lang: "en" }).length, 1);
  assert.equal(checkCutOff("reply", "昨日は公園に行って、", { lang: "ja" }).length, 1);
  assert.equal(checkCutOff("reply", "Ayer fui al cine con mis amigos", { lang: "es" }).length, 0);
  assert.equal(checkCutOff("reply", "Nice! What did you do there?", { lang: "en" }).length, 0);
  const flip = checkOffContext("reply", { reply: "Hey! Yeah, that's me, I joined the team last week.", heard: "Hi", tutorLines: ["Hey, you're the new person on the team, right? Did they say anything about Thursday?"] });
  assert.equal(flip.length, 1);
  const own = checkOffContext("reply", { reply: "I meant the new series you said you began watching last week.", heard: "Start what?", tutorLines: ["I started a new series last week, and now I can't stop watching it."] });
  assert.equal(own.length, 1);
  assert.equal(checkOffContext("reply", { reply: "Oh, you said you like rain? Me too.", heard: "I like rain a lot.", tutorLines: ["Do you like rainy days?"] }).length, 0);
  assert.equal(checkDelivered("rooms", "Hola, ¿cómo estás?", "Hola, ¿cómo").length, 1);
  assert.equal(checkDelivered("rooms", "こんにちは", "こんにちは").length, 0);
});

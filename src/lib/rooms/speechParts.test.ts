import assert from "node:assert/strict";
import test from "node:test";
import { IDLE, END_SILENCE_MS, MAX_PART_MS, MIN_CUT_VOICED_MS, PART_PAUSE_MS, joinPartTexts, stepParts, type PartAction, type PartState } from "./speechParts.ts";
import { directLine, joinParts, type RoomLine } from "./protocol.ts";

/** 소리(true)·조용(false)을 50ms 틱으로 흘려 보내고 나온 일들을 모은다. */
function run(frames: boolean[], ids = ["u1", "u2", "u3"]) {
  let state: PartState = IDLE;
  const actions: (PartAction & { at: number })[] = [];
  let next = 0;
  frames.forEach((voiced, index) => {
    const now = 1_000 + index * 50;
    const step = stepParts(state, { now, voiced, tickMs: 50 }, () => ids[next++]);
    state = step.state;
    for (const action of step.actions) actions.push({ ...action, at: now });
  });
  return actions;
}
const talk = (ms: number) => Array.from({ length: ms / 50 }, () => true);
const quiet = (ms: number) => Array.from({ length: ms / 50 }, () => false);

test("짧게 쉬면 조각을 보내고, 곧 다시 말하면 같은 말(같은 말풍선)로 잇는다", () => {
  const actions = run([...talk(1_500), ...quiet(PART_PAUSE_MS + 100), ...talk(1_000), ...quiet(END_SILENCE_MS + 200)]);
  const finished = actions.filter((a) => a.kind === "finish");
  assert.equal(finished.length, 2);
  assert.deepEqual(finished.map((a) => (a.kind === "finish" ? [a.utterance, a.part, a.keep] : null)), [["u1", 0, true], ["u1", 1, true]]);
  // 첫 조각은 말이 끝나고 0.6초쯤 뒤에 나간다(예전엔 말 전체가 끝나고 1.2초 뒤).
  const firstAt = finished[0].at - (1_000 + 1_500);
  assert.ok(firstAt <= PART_PAUSE_MS + 50, `첫 조각이 ${firstAt}ms 뒤`);
  const begins = actions.filter((a) => a.kind === "begin");
  assert.deepEqual(begins.map((a) => (a.kind === "begin" ? a.newUtterance : null)), [true, false]);
  assert.equal(actions.filter((a) => a.kind === "end").length, 1);
});

test("1.2초 넘게 쉬면 다음 말은 새 말풍선", () => {
  const actions = run([...talk(800), ...quiet(END_SILENCE_MS + 300), ...talk(800), ...quiet(END_SILENCE_MS + 100)]);
  const finished = actions.filter((a): a is Extract<PartAction, { kind: "finish" }> & { at: number } => a.kind === "finish");
  assert.deepEqual(finished.map((a) => [a.utterance, a.part]), [["u1", 0], ["u2", 0]]);
});

test("기침 같은 짧은 소리만 있으면 보내지 않는다", () => {
  const actions = run([...talk(200), ...quiet(END_SILENCE_MS + 100), ...talk(1_000), ...quiet(END_SILENCE_MS + 100)]);
  const finished = actions.filter((a): a is Extract<PartAction, { kind: "finish" }> & { at: number } => a.kind === "finish");
  assert.deepEqual(finished.map((a) => [a.utterance, a.part, a.keep]), [["u1", 0, false], ["u2", 0, true]]);
});

test("말소리가 짧은 동안의 쉼에서는 자르지 않는다(낱말 하나만 따로 받아쓰면 틀리기 쉬움)", () => {
  // 「昨日、」 0.5초 · 쉼 0.75초 · 「友達と」 0.7초 · 쉼 0.6초 · 「公園に行きました」 1.5초 → 한 조각.
  const actions = run([...talk(500), ...quiet(750), ...talk(700), ...quiet(650), ...talk(1_500), ...quiet(END_SILENCE_MS + 100)]);
  const finished = actions.filter((a): a is Extract<PartAction, { kind: "finish" }> & { at: number } => a.kind === "finish");
  assert.equal(finished.length, 1);
  assert.ok(MIN_CUT_VOICED_MS <= 2_700);
});

test("쉬지 않고 길게 말해도 정해진 길이마다 끊어 보낸다", () => {
  const actions = run([...talk(MAX_PART_MS + 2_000), ...quiet(END_SILENCE_MS + 100)]);
  const finished = actions.filter((a): a is Extract<PartAction, { kind: "finish" }> & { at: number } => a.kind === "finish");
  assert.equal(finished.length, 2);
  assert.ok(finished.every((a) => a.utterance === "u1" && a.keep));
});

test("음소거하면 녹음 중인 조각을 닫고 말을 끝낸다", () => {
  let state: PartState = IDLE;
  state = stepParts(state, { now: 0, voiced: true, tickMs: 50 }, () => "m1").state;
  state = stepParts(state, { now: 600, voiced: true, tickMs: 50 }, () => "x").state;
  const step = stepParts(state, { now: 650, voiced: false, tickMs: 50, muted: true }, () => "x");
  assert.deepEqual(step.actions.map((a) => a.kind), ["finish", "end"]);
});

test("조각 글 잇기: 띄어쓰기 없는 글자끼리는 붙이고, 그 밖은 한 칸", () => {
  assert.equal(joinPartTexts(["I went to the park", "and saw a dog."]), "I went to the park and saw a dog.");
  assert.equal(joinPartTexts(["昨日は公園に行って、", "犬を見ました。"]), "昨日は公園に行って、犬を見ました。");
  assert.equal(joinPartTexts(["เมื่อวานไป", "สวนสาธารณะ"]), "เมื่อวานไปสวนสาธารณะ");
  assert.equal(joinPartTexts(["Ayer fui al parque", "", "y vi un perro."]), "Ayer fui al parque y vi un perro.");
  assert.equal(joinPartTexts(["Ayer fui al parque con mi amiga.", "y vimos un perro."]), "Ayer fui al parque con mi amiga y vimos un perro.");
  assert.equal(joinPartTexts(["I went to the park.", "And I saw a dog."]), "I went to the park. And I saw a dog.");
  assert.equal(joinPartTexts(["Espera...", "no sé."]), "Espera... no sé.");
  assert.equal(joinPartTexts(["어제 공원에 갔는데", "강아지를 봤어요"]), "어제 공원에 갔는데 강아지를 봤어요");
});

function line(seq: number, peerId: string, text: string, extra: Partial<RoomLine> = {}): RoomLine {
  return { seq, kind: "speech", peerId, nickname: peerId, text, startedAt: seq * 1_000, endedAt: seq * 1_000 + 500, ...extra };
}

test("같은 말 번호의 조각 줄은 한 줄로(첫 줄 번호·시작, 마지막 끝), 다른 사람·댓글은 그대로", () => {
  const joined = joinParts([
    line(1, "a", "Ayer fui al parque", { uid: "utt1", part: 0 }),
    line(2, "b", "¿Y qué tal?"),
    line(3, "a", "y vi un perro.", { uid: "utt1", part: 1 }),
    line(4, "a", "hola", { kind: "text", uid: "utt1" }),
  ]);
  assert.equal(joined.length, 3);
  assert.equal(joined[0].text, "Ayer fui al parque y vi un perro.");
  assert.equal(joined[0].seq, 1);
  assert.equal(joined[0].endedAt, 3_500);
  assert.equal(joined[2].text, "hola");
});

test("뒷조각이 먼저 와도 순번 순서로 잇는다(일본어는 붙여서)", () => {
  const joined = joinParts([line(5, "a", "犬を見ました。", { uid: "u9xx", part: 1 }), line(4, "a", "公園に行って、", { uid: "u9xx", part: 0 })]);
  assert.equal(joined.length, 1);
  assert.equal(joined[0].text, "公園に行って、犬を見ました。");
  assert.equal(joined[0].seq, 4);
});

test("글 통로로 온 줄: 보낸 사람 자신의 받아쓴 줄만, 이름·계정은 사람 목록에서", () => {
  const members = [{ peerId: "p1", accountId: "acct1", nickname: "Mina" }];
  const sent = JSON.stringify({ t: "line", line: { seq: 7, kind: "speech", peerId: "p1", accountId: "someone-else", nickname: "Admin", text: "hola", startedAt: 1, endedAt: 2, uid: "abcd1", part: 1 } });
  const got = directLine("p1", sent, members);
  assert.equal(got?.nickname, "Mina");
  assert.equal(got?.accountId, "acct1");
  assert.equal(got?.part, 1);
  // 남의 줄인 척, 모르는 사람, 댓글, 깨진 글은 받지 않는다.
  assert.equal(directLine("p2", sent, members), null);
  assert.equal(directLine("p1", JSON.stringify({ t: "line", line: { seq: 8, peerId: "p2", text: "x", startedAt: 1, endedAt: 2 } }), members), null);
  assert.equal(directLine("p1", JSON.stringify({ t: "line", line: { seq: 9, kind: "text", peerId: "p1", text: "x", startedAt: 1, endedAt: 2 } }), members), null);
  assert.equal(directLine("p1", "{oops", members), null);
});

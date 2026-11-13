import assert from "node:assert/strict";
import test from "node:test";
import { allFramesFor } from "../curriculum/frames.ts";
import type { LogEvent } from "../curriculum/logLedger.ts";
import { advanceRun, lastHomework, lessonBoardOf, lessonRequestOf, lessonStage, lessonTraceOf, patternIn, pickLesson, lessonSpotOf, startRun, type LessonItem } from "./lessonPlan.ts";

const quiz = (k: string, r: "ok" | "miss" | "again", t = 100): LogEvent => ({ k, src: "quiz", r, t });
const talk = (k: string, t = 200): LogEvent => ({ k, src: "call", r: "used", t });

test("기록이 없으면 지금 단계의 새 틀을 파일 순서로 셋, 보여 주기부터", () => {
  const frames = allFramesFor("en");
  const plan = pickLesson({ frames, events: [], start: 1, spot: null });
  assert.equal(plan.stage, 1);
  assert.deepEqual(
    plan.items.map((item) => [item.key, item.start, item.why]),
    frames.filter((f) => f.stage === 1).slice(0, 3).map((f) => [`f|${f.id}`, "show", "new"]),
  );
  assert.ok(plan.items.every((item) => item.words.length > 0 && item.words.length <= 3));
});

test("순서: 멈춘 자리 → 앎인데 말로 안 씀(끌어내기부터) → 다시 볼 것 → 새 틀", () => {
  const frames = allFramesFor("ja");
  const one = frames.filter((f) => f.stage === 1);
  const [a, b, c, d] = one;
  const events = [quiz(`f|${b.id}`, "ok"), quiz(`f|${c.id}`, "ok"), quiz(`f|${c.id}`, "again", 150), talk(`f|${d.id}`), quiz(`f|${d.id}`, "ok")];
  const plan = pickLesson({ frames, events, start: 1, spot: { key: `f|${a.id}`, step: "move" } });
  assert.deepEqual(
    plan.items.map((item) => [item.key, item.start, item.why]),
    [
      [`f|${a.id}`, "move", "carry"],
      [`f|${b.id}`, "draw", "apply"],
      [`f|${c.id}`, "show", "hard"],
    ],
  );
});

test("이미 대화에서 쓴 틀은 앎이어도 다시 고르지 않는다", () => {
  const frames = allFramesFor("es");
  const first = frames.find((f) => f.stage === 1)!;
  const plan = pickLesson({ frames, events: [quiz(`f|${first.id}`, "ok"), talk(`f|${first.id}`)], start: 1, spot: null });
  assert.ok(!plan.items.some((item) => item.key === `f|${first.id}`));
});

test("단계 오르기: 그 단계 틀을 모두 대화에서 썼으면 다음 단계", () => {
  const frames = allFramesFor("ko");
  const talked = new Map(frames.filter((f) => f.stage === 1).map((f) => [`f|${f.id}`, 1]));
  assert.equal(lessonStage(frames, talked, 1), 2);
  talked.delete(`f|${frames.find((f) => f.stage === 1)!.id}`);
  assert.equal(lessonStage(frames, talked, 1), 1);
  assert.equal(lessonStage(frames, new Map(), 9), 5);
});

test("틀이 말에 나왔나 — 띄어쓰기 없는 글자(ja)·영어 아닌 라틴(es)·한국어", () => {
  const ja = allFramesFor("ja").find((f) => f.pattern === "___から来ました。")!;
  assert.equal(patternIn(ja.pattern, "わたしは韓国から来ました"), true);
  assert.equal(patternIn(ja.pattern, "韓国です"), false);
  const es = allFramesFor("es").find((f) => f.stage === 1)!;
  assert.equal(patternIn(es.pattern, es.examples[0].text), true);
  assert.equal(patternIn(es.pattern, ""), false);
  const ko = allFramesFor("ko").find((f) => f.stage === 1)!;
  assert.equal(patternIn(ko.pattern, ko.examples[0].text), true);
});

const items: LessonItem[] = [
  { key: "f|a", start: "show", why: "new", words: [] },
  { key: "f|b", start: "draw", why: "apply", words: [] },
];

test("흐름: 보여 주기 → 끌어내기 → 옮겨 쓰기 → 다음 거 할까요 → 좋다면 다음 소재", () => {
  let run = startRun(items)!;
  assert.equal(run.step, "show");
  run = advanceRun(run, { spoke: true, used: false, move: false })!;
  assert.equal(run.step, "draw");
  run = advanceRun(run, { spoke: true, used: false, move: false })!;
  assert.equal(run.step, "draw", "틀이 안 나오면 그대로 — 튜터가 되받아 줄 뿐");
  run = advanceRun(run, { spoke: true, used: true, move: false })!;
  assert.equal(run.step, "move");
  run = advanceRun(run, { spoke: true, used: true, move: false })!;
  assert.deepEqual([run.step, run.asked], ["ask", false]);
  run = advanceRun(run, { spoke: true, used: false, move: false })!;
  assert.deepEqual([run.step, run.asked], ["ask", true], "한 번만 묻는다");
  run = advanceRun(run, { spoke: true, used: false, move: true })!;
  assert.deepEqual([run.at, run.step], [1, "draw"]);
});

test("보여 주기에서 이미 쓰면 끌어내기를 건너뜀, 마지막 소재가 끝나면 null", () => {
  let run = startRun([items[0]])!;
  run = advanceRun(run, { spoke: true, used: true, move: false })!;
  assert.equal(run.step, "move");
  assert.equal(advanceRun(run, { spoke: true, used: true, move: false }), null);
});

test("말이 없으면 그대로, 다른 걸 하자면 어느 단계에서나 다음 소재", () => {
  const run = startRun(items)!;
  assert.equal(advanceRun(run, { spoke: false, used: false, move: false }), run);
  assert.equal(advanceRun(run, { spoke: true, used: false, move: true })!.at, 1);
});

test("멈춘 자리: 지금 소재·단계, 물어본 뒤면 다음 소재 처음", () => {
  const run = startRun(items)!;
  assert.deepEqual(lessonSpotOf(run), { key: "f|a", step: "show" });
  assert.deepEqual(lessonSpotOf({ ...run, step: "ask" }), { key: "f|b", step: "draw" });
  assert.equal(lessonSpotOf(null), null);
});

test("칠판 카드는 보여 주기 단계에서만 틀 한 줄, ⏭는 다음 소재가 있을 때만(th·es)", () => {
  const frames = allFramesFor("th");
  const plan = pickLesson({ frames, events: [], start: 1, spot: null });
  let run = startRun(plan.items)!;
  const first = frames.find((f) => `f|${f.id}` === plan.items[0].key)!;
  assert.deepEqual(lessonBoardOf(frames, run), { pattern: first.pattern, canSkip: true });
  run = advanceRun(run, { spoke: true, used: false, move: false })!;
  assert.equal(lessonBoardOf(frames, run)?.pattern, "", "끌어내기부터는 답이 되므로 숨김");
  const last = { ...run, at: plan.items.length - 1, step: "show" as const };
  assert.equal(lessonBoardOf(frames, last)?.canSkip, false);
  assert.equal(lessonBoardOf(frames, null), null);
  const es = allFramesFor("es");
  const esRun = startRun(pickLesson({ frames: es, events: [], start: 1, spot: null }).items)!;
  assert.equal(lessonRequestOf(es, esRun, "skip")?.skip, true);
  assert.equal(lessonRequestOf(es, esRun, "open")?.open, true);
  assert.equal(lessonRequestOf(es, esRun)?.skip, undefined);
});

const call = (id: string, startedAt: number, covered: string[], extra: Record<string, unknown> = {}) =>
  ({ id, language: "ja", mode: "lesson" as const, startedAt, finishedAt: startedAt + 60, lesson: { covered }, ...extra });

test("숙제 리뷰: 가장 최근 끝난 수업 하나 — 틀린 틀 → 안 풂 → 다 맞힘", () => {
  const calls = [call("a", 100, ["f|x", "f|y"]), call("b", 50, ["f|z"])];
  assert.deepEqual(lastHomework(calls, [{ callId: "a", quiz: { ok: 1, of: 2, at: 1, frames: { "f|x": "ok", "f|y": "miss" } } }], "ja"), { key: "f|y", how: "missed" });
  assert.deepEqual(lastHomework(calls, [{ callId: "a" }], "ja"), { key: "f|x", how: "undone" });
  assert.deepEqual(lastHomework(calls, [{ callId: "a", quiz: { ok: 2, of: 2, at: 1, frames: { "f|y": "ok" } } }], "ja"), { key: "f|y", how: "right" });
  assert.equal(lastHomework(calls, [], "ja"), null, "숙제(장면)가 안 생긴 통화");
  assert.equal(lastHomework([call("c", 200, [])], [{ callId: "c" }], "ja"), null, "다룬 틀 없음");
  assert.equal(lastHomework([call("d", 300, ["f|x"], { finishedAt: undefined })], [{ callId: "d" }], "ja"), null, "끝나지 않은 통화");
  assert.equal(lastHomework(calls, [{ callId: "a" }], "es"), null, "다른 학습 언어");
});

test("숙제 리뷰는 맨 앞 — 틀림·안 풂은 끌어내기부터, 다 맞힘은 옮겨 쓰기부터(ko·es)", () => {
  for (const language of ["ko", "es"]) {
    const frames = allFramesFor(language);
    const [a, b] = frames.filter((f) => f.stage === 1);
    const missed = pickLesson({ frames, events: [], start: 1, spot: { key: `f|${b.id}`, step: "draw" }, review: { key: `f|${a.id}`, how: "missed" } });
    assert.deepEqual(missed.items.slice(0, 2).map((i) => [i.key, i.start, i.why, i.review]), [[`f|${a.id}`, "draw", "review", "missed"], [`f|${b.id}`, "draw", "carry", undefined]]);
    const right = pickLesson({ frames, events: [], start: 1, spot: null, review: { key: `f|${a.id}`, how: "right" } });
    assert.equal(right.items[0].start, "move");
    const run = startRun(missed.items)!;
    assert.equal(lessonRequestOf(frames, run, "open")?.review, "missed", "첫 마디에만");
    assert.equal(lessonRequestOf(frames, run)?.review, undefined);
  }
});

test("통화 기록: 다룬 틀·다음 틀", () => {
  const items: LessonItem[] = ["f|a", "f|b", "f|c"].map((key) => ({ key, start: "show", why: "new", words: [] }));
  const run = { items, at: 1, step: "show" as const, asked: false };
  assert.deepEqual(lessonTraceOf(run, ["f|a"], items), { covered: ["f|a"], next: "f|b" });
  assert.deepEqual(lessonTraceOf(run, ["f|a", "f|b"], items), { covered: ["f|a", "f|b"], next: "f|c" });
  assert.deepEqual(lessonTraceOf(null, ["f|a", "f|b", "f|c"], items), { covered: ["f|a", "f|b", "f|c"] });
  assert.equal(lessonTraceOf(run, [], items), null);
});

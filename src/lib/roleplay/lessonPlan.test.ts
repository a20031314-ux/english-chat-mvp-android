import assert from "node:assert/strict";
import test from "node:test";
import { allFramesFor } from "../curriculum/frames.ts";
import type { LogEvent } from "../curriculum/logLedger.ts";
import { advanceRun, lessonStage, patternIn, pickLesson, lessonSpotOf, startRun, type LessonItem } from "./lessonPlan.ts";

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

import assert from "node:assert/strict";
import test from "node:test";
import type { CallNote } from "./callNotes.ts";
import { factAsMine, homeworkOf, lastMemoOf } from "./tutorDesk.ts";

const note = (id: string, at: number, extra: Partial<CallNote> = {}): CallNote => ({ id, at, secs: 60, title: "", fixed: 0, hints: 0, redone: 0, ...extra });

test("숙제는 그 통화의 튜터 줄에만, 통화 기록이 지워졌으면 아무 데도", () => {
  const homework = { kind: "replay" as const, callId: "c1", at: 5 };
  const notes = [note("c1", 1, { gender: "f" })];
  assert.equal(homeworkOf(homework, notes, ["c1"], "f", "m"), homework);
  assert.equal(homeworkOf(homework, notes, ["c1"], "m", "m"), null);
  assert.equal(homeworkOf(homework, notes, [], "f", "m"), null);
  // 튜터가 안 적힌 카드는 지금 고른 튜터 것
  assert.equal(homeworkOf(homework, [note("c1", 1)], ["c1"], "m", "m"), homework);
});

test("튜터 메모는 그 튜터의 가장 최근 것, 빈 메모는 건너뜀", () => {
  const notes = [note("a", 1, { gender: "m", summary: "옛 메모" }), note("b", 3, { gender: "m", summary: "  " }), note("c", 2, { gender: "f", summary: "Emma" }), note("d", 2, { summary: "고른 튜터" })];
  assert.equal(lastMemoOf(notes, "m", "m")?.id, "d");
  assert.equal(lastMemoOf(notes, "f", "m")?.id, "c");
  assert.equal(lastMemoOf([], "f", "m"), null);
});

test("기억하는 나는 내 말로 — 맨 앞 주어만 바꿈", () => {
  assert.equal(factAsMine("They work at a design company."), "I work at a design company.");
  assert.equal(factAsMine("They are moving in March."), "I am moving in March.");
  assert.equal(factAsMine("Their sister lives in Busan."), "My sister lives in Busan.");
  assert.equal(factAsMine("They're learning to cook."), "I'm learning to cook.");
  assert.equal(factAsMine("The learner is a nurse."), "I am a nurse.");
  assert.equal(factAsMine("The learner's cat is called Mochi."), "My cat is called Mochi.");
  assert.equal(factAsMine("Has two cats."), "Has two cats.");
});

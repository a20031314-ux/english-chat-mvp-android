/**
 * 고정 수업 검사(2026-11-02 사용자 "stagebank 같은 고정 학습공간은 구체화해서 만들어두면", "만들어줘").
 * 저장소에 넣어 두는 문장구조 수업(fixedLessons/<학습>.<앱>.json)이 지켜야 하는 것 — RULES 11 "의미 있는 학습인가":
 *  ① 답이 새지 않나(퀴즈 앞뒤 글에 정답이 없음) ② 오답 보기가 정답과 다르고 겹치지 않음
 *  ③ 그 단계 낱말 범위(너무 이른 낱말은 경고) ④ 대화 내 줄은 그 틀을 담고, 예문을 베끼지 않음
 * 그리고 칸이 다 차 있나: 뜻·조각 대응(조각 ↔ 하는 일 ↔ 앱 언어)·순서·흔한 실수(이유 포함) 2개 이상·퀴즈 3·대화 3.
 */
import type { Frame } from "../frames.ts";

export type FixedQuiz =
  | { kind: "type"; before: string; after: string; answer: string; cue: string }
  | { kind: "choose"; before: string; after: string; options: string[]; answer: number; cue: string }
  | { kind: "fix"; wrong: string; bad: string; right: string; cue: string };

export type FixedLesson = {
  id: string;
  pattern: string;
  meaning: string;
  sample: { text: string; gloss: string };
  map: { piece: string; role: string; ui: string }[];
  order: string;
  slot: string;
  reply?: string;
  mistakes: { wrong: string; right: string; why: string }[];
  quiz: FixedQuiz[];
  turns: { them: string; themGloss: string; me: string; meGloss: string }[];
};

export type FixedLessonFile = { version: number; language: string; ui: string; lessons: FixedLesson[] };

export type CheckIssue = { id: string; level: "error" | "warn"; what: string };

const has = (text: string, piece: string) => text.toLowerCase().includes(piece.toLowerCase());

export function checkLesson(lesson: FixedLesson, frame: Frame | undefined, tooEarly?: (text: string) => string[]): CheckIssue[] {
  const out: CheckIssue[] = [];
  const err = (what: string) => out.push({ id: lesson.id, level: "error", what });
  const warn = (what: string) => out.push({ id: lesson.id, level: "warn", what });
  if (!frame) {
    err("저장소 틀(frames)에 없는 id");
    return out;
  }
  if (lesson.pattern !== frame.pattern) err(`틀 모양이 다름: ${lesson.pattern} ≠ ${frame.pattern}`);
  for (const [name, value] of [["뜻", lesson.meaning], ["순서", lesson.order], ["자리", lesson.slot], ["대표 예문 뜻", lesson.sample?.gloss]] as const) {
    if (!value?.trim()) err(`${name} 칸이 비었음`);
  }
  // 조각 대응: 두 줄 이상, 칸마다 하는 일·앱 언어, 조각은 대표 예문에 실제로 있어야(a / an처럼 고르는 조각은 하나만 있어도).
  if (lesson.map.length < 2) err("조각 대응이 두 줄 안 됨");
  for (const row of lesson.map) {
    if (!row.role.trim() || !row.ui.trim()) err(`조각 "${row.piece}"의 하는 일·앱 언어 칸이 비었음`);
    const choices = row.piece.split("/").map((one) => one.trim()).filter(Boolean);
    if (!choices.some((one) => has(lesson.sample.text, one))) err(`조각 "${row.piece}"이 대표 예문에 없음`);
  }
  if (!frame.core.some((core) => has(lesson.sample.text, core))) err("대표 예문에 틀이 없음");
  // 흔한 실수: 두 개 이상, 틀린 꼴 ≠ 바른 꼴, 이유 한 줄.
  if (lesson.mistakes.length < 2) err("흔한 실수가 두 개 안 됨");
  for (const one of lesson.mistakes) {
    if (one.wrong.trim() === one.right.trim()) err(`흔한 실수의 틀린 꼴과 바른 꼴이 같음: ${one.wrong}`);
    if (!one.why.trim()) err(`흔한 실수에 이유가 없음: ${one.wrong}`);
  }
  // 퀴즈 세 문제: 빈칸 쓰기 · 고르기 · 틀린 곳 고치기.
  const kinds = lesson.quiz.map((q) => q.kind).join(",");
  if (kinds !== "type,choose,fix") err(`퀴즈 모양이 type,choose,fix가 아님: ${kinds}`);
  for (const q of lesson.quiz) {
    if (!q.cue.trim()) err(`퀴즈 뜻(cue)이 비었음 (${q.kind})`);
    if (q.kind === "type") {
      if (!q.answer.trim()) err("빈칸 쓰기 정답이 비었음");
      if (has(q.before + " " + q.after, q.answer)) err(`빈칸 쓰기 정답이 문제 글에 보임: ${q.answer}`);
    } else if (q.kind === "choose") {
      const right = q.options[q.answer];
      if (right === undefined) err("고르기 정답 번호가 보기 밖");
      if (new Set(q.options.map((one) => one.toLowerCase())).size !== q.options.length) err("고르기 보기가 겹침");
      if (q.options.length < 3) err("고르기 보기가 셋 안 됨");
      if (right && has(q.before + " " + q.after, right)) err(`고르기 정답이 문제 글에 보임: ${right}`);
    } else {
      if (!has(q.wrong, q.bad)) err(`고치기 문장에 틀린 곳이 없음: ${q.bad}`);
      if (q.bad.trim() === q.right.trim()) err("고치기 틀린 곳과 바른 꼴이 같음");
      // 설명의 흔한 실수를 그대로 내면 베끼기(RULES 11①) — 다른 문장으로.
      const same = (one: string) => one.toLowerCase().replace(/[\s.!?。！？]+$/u, "").trim();
      if (lesson.mistakes.some((one) => same(one.wrong) === same(q.wrong))) err(`고치기 문장이 흔한 실수 예와 같음: ${q.wrong}`);
    }
  }
  // 대화 세 번: 내 줄은 틀을 담고, 예문을 그대로 베끼지 않음. 상대 줄이 틀을 써 버리면 경고(따라 말하기가 됨).
  if (lesson.turns.length !== 3) err(`대화가 세 번이 아님: ${lesson.turns.length}`);
  const examples = new Set(frame.examples.map((one) => one.text.toLowerCase()));
  for (const turn of lesson.turns) {
    if (!turn.them.trim() || !turn.themGloss.trim() || !turn.meGloss.trim()) err(`대화 칸이 비었음: ${turn.me}`);
    if (!frame.core.some((core) => has(turn.me, core))) err(`내 줄에 틀이 없음: ${turn.me}`);
    if (examples.has(turn.me.toLowerCase())) err(`내 줄이 예문을 베낌: ${turn.me}`);
    if (frame.core.some((core) => has(turn.them, core))) warn(`상대 줄에 틀이 그대로 있음(따라 하기 쉬움): ${turn.them}`);
    if (tooEarly) {
      const early = [...tooEarly(turn.them), ...tooEarly(turn.me)];
      if (early.length) warn(`이 단계에 이른 단어: ${[...new Set(early)].join(", ")}`);
    }
  }
  if (tooEarly) {
    const early = lesson.quiz.flatMap((q) => tooEarly(q.kind === "fix" ? q.wrong : `${q.before} ${q.after}`));
    if (early.length) warn(`퀴즈에 이 단계에 이른 단어: ${[...new Set(early)].join(", ")}`);
  }
  return out;
}

/** 파일 전체: 그 단계 틀이 하나도 빠지지 않았나 + 수업마다 검사. */
export function checkFile(file: FixedLessonFile, frames: readonly Frame[], stage: number, tooEarly?: (text: string) => string[]): CheckIssue[] {
  const byId = new Map(frames.map((one) => [one.id, one]));
  const issues = file.lessons.flatMap((lesson) => checkLesson(lesson, byId.get(lesson.id), tooEarly));
  const done = new Set(file.lessons.map((one) => one.id));
  for (const frame of frames.filter((one) => one.stage === stage)) {
    if (!done.has(frame.id)) issues.push({ id: frame.id, level: "error", what: "이 단계 틀인데 고정 수업이 없음" });
  }
  return issues;
}

/**
 * 문법 한 장(2026-11-03 사용자 "문법 수업 퀴즈 고치고 문법 설명 넣어줘"): Stagebank 문법 칸마다 미리 만들어 검사한 고정 설명 —
 * 규칙 · 꼴이 바뀌는 표(원래 꼴 → 바뀐 꼴 · 한 줄) · 예외 · 언제 쓰나 · 흔한 실수(까닭) · 퀴즈 셋 · 대화 셋(내 줄의 그 문법 조각).
 * 문장구조 고정 수업(check.ts)과 같은 검사 규칙(RULES 11): 답이 새지 않고, 오답이 정답과 다르며, 설명 문장을 퀴즈가 베끼지 않는다.
 * 순수 모듈 — 서버(server/grammarLesson.ts)·화면·테스트가 같이 쓴다.
 */
import type { CheckIssue, FixedQuiz } from "./check.ts";

export type GrammarLesson = {
  /** "g|2:0". */
  key: string;
  /** 문법 칸 이름(앱 언어). */
  name: string;
  /** 규칙 한두 줄(앱 언어). */
  rule: string;
  /** 꼴이 바뀌는 표: 원래 꼴 → 바뀐 꼴(학습 언어) · 한 줄(앱 언어). 2~6줄. */
  forms: { from: string; to: string; note: string }[];
  /** 예외·주의 한 줄(없으면 빈 글). */
  exceptions: string;
  /** 언제 쓰나(앱 언어). */
  usage: string;
  mistakes: { wrong: string; right: string; why: string }[];
  quiz: FixedQuiz[];
  /** piece = 내 줄에서 그 문법을 보여 주는 낱말(그대로 든 것) — 대화 단계 빈칸. */
  turns: { them: string; themGloss: string; me: string; meGloss: string; piece: string }[];
};

const has = (text: string, piece: string) => text.toLowerCase().includes(piece.toLowerCase());
const plain = (text: string) => text.toLowerCase().replace(/[\p{P}\s]+/gu, "");

/** 퀴즈 세 문제 검사(문장구조 수업과 같은 규칙). */
export function checkQuizSet(quiz: readonly FixedQuiz[], err: (what: string) => void): void {
  const kinds = quiz.map((q) => q.kind).join(",");
  if (kinds !== "type,choose,fix") err(`퀴즈 모양이 type,choose,fix가 아님: ${kinds}`);
  for (const q of quiz) {
    if (!q.cue?.trim()) err(`퀴즈 뜻(cue)이 비었음 (${q.kind})`);
    if (q.kind === "type") {
      if (!q.answer?.trim()) err("빈칸 쓰기 정답이 비었음");
      else if (has(`${q.before} ${q.after}`, q.answer)) err(`빈칸 쓰기 정답이 문제 글에 보임: ${q.answer}`);
    } else if (q.kind === "choose") {
      const right = q.options?.[q.answer];
      if (right === undefined) err("고르기 정답 번호가 보기 밖");
      if (new Set((q.options ?? []).map((one) => one.toLowerCase())).size !== (q.options ?? []).length) err("고르기 보기가 겹침");
      if ((q.options ?? []).length < 3) err("고르기 보기가 셋 안 됨");
      if (right && has(`${q.before} ${q.after}`, right)) err(`고르기 정답이 문제 글에 보임: ${right}`);
    } else {
      if (!q.wrong || !q.bad || !has(q.wrong, q.bad)) err(`고치기 문장에 틀린 곳이 없음: ${q.bad}`);
      if (q.bad?.trim() === q.right?.trim()) err("고치기 틀린 곳과 바른 꼴이 같음");
    }
  }
}

export function checkGrammarLesson(lesson: GrammarLesson): CheckIssue[] {
  const out: CheckIssue[] = [];
  const err = (what: string) => out.push({ id: lesson.key, level: "error", what });
  for (const [name, value] of [["이름", lesson.name], ["규칙", lesson.rule], ["쓰임", lesson.usage]] as const) {
    if (!value?.trim()) err(`${name} 칸이 비었음`);
  }
  if (!Array.isArray(lesson.forms) || lesson.forms.length < 2 || lesson.forms.length > 6) err("꼴 표가 2~6줄이 아님");
  for (const row of lesson.forms ?? []) if (!row.from?.trim() || !row.to?.trim() || !row.note?.trim()) err("꼴 표 칸이 비었음");
  if (!Array.isArray(lesson.mistakes) || lesson.mistakes.length < 2) err("흔한 실수가 두 개 안 됨");
  for (const one of lesson.mistakes ?? []) {
    if (plain(one.wrong) === plain(one.right)) err(`흔한 실수의 틀린 꼴과 바른 꼴이 같음: ${one.wrong}`);
    if (!one.why?.trim()) err(`흔한 실수에 이유가 없음: ${one.wrong}`);
  }
  checkQuizSet(lesson.quiz ?? [], err);
  // 설명에 나온 문장을 퀴즈·대화가 그대로 베끼지 않게.
  const shown = new Set([...(lesson.mistakes ?? []).flatMap((one) => [plain(one.wrong), plain(one.right)])]);
  for (const q of lesson.quiz ?? []) {
    const text = q.kind === "fix" ? q.wrong : `${q.before}${q.kind === "type" ? q.answer : (q.options?.[q.answer] ?? "")}${q.after}`;
    if (text && shown.has(plain(text))) err(`퀴즈 문장이 흔한 실수 예와 같음: ${text}`);
  }
  if (!Array.isArray(lesson.turns) || lesson.turns.length !== 3) err(`대화가 세 번이 아님: ${lesson.turns?.length ?? 0}`);
  const quizTexts = new Set((lesson.quiz ?? []).map((q) => plain(q.kind === "fix" ? q.wrong : `${q.before}${q.after}`)));
  for (const turn of lesson.turns ?? []) {
    if (!turn.them?.trim() || !turn.themGloss?.trim() || !turn.me?.trim() || !turn.meGloss?.trim()) err(`대화 칸이 비었음: ${turn.me}`);
    if (!turn.piece?.trim() || !turn.me?.includes(turn.piece)) err(`대화 내 줄에 문법 조각이 그대로 없음: ${turn.piece} / ${turn.me}`);
    else if (turn.piece.length >= turn.me.length * 0.8) err(`문법 조각이 줄 전체에 가까움: ${turn.piece}`);
    if (shown.has(plain(turn.me ?? ""))) err(`대화 내 줄이 흔한 실수 예와 같음: ${turn.me}`);
    if (quizTexts.has(plain(turn.me ?? ""))) err(`대화 내 줄이 퀴즈 문장과 같음: ${turn.me}`);
  }
  return out;
}

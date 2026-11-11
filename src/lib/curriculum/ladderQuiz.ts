/**
 * 사다리 칸 → 문제(퀴즈 다시 짜기 4단계, ladder.ts). 순수.
 *   문법(넣어 둔 문제 PreparedItem — turnFresh로 고른 문장): 1 고르기 · 2 빈칸 쓰기(뜻 먼저) · 3 틀린 곳(spot-errors) · 4 문장 전체 쓰기
 *   표현(카드): 1 뜻 고르기(cardQuiz hide) · 2 빈칸 쓰기(cardQuiz show) · 4 문장 전체 쓰기 — 3은 표현 틀린 곳 데이터가 없어 건너뜀
 */
import { cardQuiz, cardSourceOf, type QuizQuestion } from "./quiz.ts";
import type { ScriptGloss } from "./stageScripts.ts";
import { chooseFromPrepared, type PreparedItem } from "./preparedQuiz.ts";
import { spotCells, type SpotItem } from "./spotErrors.ts";
import { askRung, type Rung } from "./ladder.ts";

/** 바른 줄: 틀린 칸을 칸 위치로 되돌림 — 칸을 줄에서 차례로 찾아 그 자리만(같은 글자가 앞에 있어도, 문장부호·띄어쓰기는 그대로). */
export function fixedLine(line: string, cells: readonly string[], at: number, wrong: string, right: string): string {
  let cursor = 0;
  for (let i = 0; i < cells.length; i += 1) {
    const found = line.indexOf(cells[i]!, cursor);
    if (found < 0) return line;
    if (i === at) {
      const cell = cells[i]!;
      return line.slice(0, found) + cell.replace(wrong, right) + line.slice(found + cell.length);
    }
    cursor = found + cells[i]!.length;
  }
  return line;
}

/** 틀린 곳 문항(한 문장) → 퀴즈 spot 문제. */
export function spotQuestion(item: SpotItem, language: string, key: string): QuizQuestion | null {
  const err = item.errors[0];
  const line = item.lines[0];
  if (!err || !line || item.lines.length !== 1) return null;
  const words = spotCells(line, language);
  const cell = words[err.at];
  if (!cell) return null;
  const right = fixedLine(line, words, err.at, err.wrong, err.right);
  if (right === line) return null;
  return {
    kind: "spot",
    text: line,
    right,
    words,
    bad: [err.at],
    want: err.right,
    gloss: { en: item.gloss.en, ko: item.gloss.ko },
    note: "",
    from: key,
    ...(item.lead ? { lead: item.lead } : {}),
  };
}

function wholeOf(text: string, gloss: ScriptGloss, key: string): QuizQuestion {
  return { kind: "type", text, before: "", after: "", answer: text, gloss, from: key, whole: true, glossFirst: true };
}

/** 문법 칸 하나 → 낼 칸과 문제. spot = 그 칸의 틀린 곳 문항(최근에 안 낸 것 하나, 없으면 null). 끝났으면 null. */
export function grammarAsk(item: PreparedItem, current: number, spot: SpotItem | null, language: string): { rung: Rung; question: QuizQuestion } | null {
  const spotQ = spot ? spotQuestion(spot, language, item.key) : null;
  const rung = askRung(current, (one) => one !== 3 || Boolean(spotQ));
  if (!rung) return null;
  let question: QuizQuestion | null = null;
  if (rung === 1) question = chooseFromPrepared(item);
  if (rung === 2) {
    const near = item.options.filter((option) => option !== item.answer);
    question = { kind: "type", text: item.line, before: item.before, after: item.after, answer: item.answer, gloss: { en: "", raw: item.gloss }, from: item.key, near, glossFirst: true };
  }
  if (rung === 3) question = spotQ;
  if (rung === 4) question = wholeOf(item.line, { en: "", raw: item.gloss }, item.key);
  return question ? { rung, question } : null;
}

/** 표현 카드 하나 → 낼 칸과 문제(3은 건너뜀). */
export function expressionAsk(language: string, key: string, current: number, seed: string): { rung: Rung; question: QuizQuestion } | null {
  const rung = askRung(current, (one) => one !== 3);
  if (!rung) return null;
  if (rung === 1 || rung === 2) {
    const question = cardQuiz(language, key, rung === 1 ? "hide" : "show", seed);
    return question ? { rung, question } : null;
  }
  const source = cardSourceOf(language, key, seed);
  return source ? { rung, question: wholeOf(source.text, source.gloss, key) } : null;
}
